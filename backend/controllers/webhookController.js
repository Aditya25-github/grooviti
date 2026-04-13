import bookingModel from "../models/bookingsModel.js";

/**
 * POST /api/webhooks/brevo
 * Brevo sends a JSON payload (or array of payloads) for each email event.
 *
 * Payload fields we use:
 *   event         — "sent" | "delivered" | "opened" | "click" | "soft_bounce" | "hard_bounce" etc.
 *   email         — recipient email address
 *   link          — (click only) the URL that was clicked
 *   X-Mailin-custom — stringified JSON we embed at send time: { "orderId": "order_xxx" }
 */
export const handleBrevoWebhook = async (req, res) => {
  // Always respond 200 immediately so Brevo doesn't retry
  res.status(200).send("OK");

  try {
    const events = Array.isArray(req.body) ? req.body : [req.body];

    for (const event of events) {
      const statusEvent = event.event;
      if (!statusEvent) continue;

      const recipientEmail = event.email || null;

      // ── 1. Try to get orderId from X-Mailin-custom header ──────────────────
      let orderId = null;
      if (event["X-Mailin-custom"]) {
        try {
          const custom = JSON.parse(event["X-Mailin-custom"]);
          orderId = custom.orderId || null;
        } catch {
          // malformed JSON — ignore, will fall back to email
        }
      }

      // ── 2. Build the update payload based on event type ────────────────────
      const updatePayload = {};

      console.log(`[Brevo Webhook] Processing event: "${statusEvent}" for ${recipientEmail}`);

      switch (statusEvent) {
        case "request":
        case "sent":
          updatePayload.emailSent = true;
          break;

        case "delivered":
          updatePayload.emailSent = true;
          updatePayload.emailDelivered = true;
          break;

        case "opened":
        case "unique_opened":
          updatePayload.emailSent = true;
          updatePayload.emailDelivered = true;
          updatePayload.emailOpened = true;
          break;

        case "click": {
          updatePayload.emailSent = true;
          updatePayload.emailDelivered = true;
          updatePayload.emailOpened = true;
          // Only mark whatsappClicked if the clicked link is the WhatsApp group
          const clickedUrl = event.link || "";
          if (clickedUrl.toLowerCase().includes("whatsapp")) {
            updatePayload.whatsappClicked = true;
          }
          break;
        }

        default:
          // soft_bounce, hard_bounce, spam, unsubscribe — nothing to set on tracking flags
          console.log(`[Brevo Webhook] Ignored event: "${statusEvent}" for ${recipientEmail || orderId || "unknown"}`);
          continue;
      }

      if (Object.keys(updatePayload).length === 0) continue;

      // ── 3. Update DB — prefer orderId match, fall back to email ────────────
      let result = { modifiedCount: 0 };

      if (orderId) {
        result = await bookingModel.updateOne(
          { orderId },
          { $set: updatePayload }
        );
        console.log(
          `[Brevo Webhook] ✅ "${statusEvent}" → orderId:${orderId} | modified:${result.modifiedCount}`
        );
      }

      // If orderId lookup didn't find anything, try by email (updates ALL bookings for that email)
      if (result.modifiedCount === 0 && recipientEmail) {
        result = await bookingModel.updateMany(
          { "address.email": recipientEmail },
          { $set: updatePayload }
        );
        console.log(
          `[Brevo Webhook] ✅ "${statusEvent}" → email:${recipientEmail} | modified:${result.modifiedCount}`
        );
      }

      if (result.modifiedCount === 0) {
        console.warn(
          `[Brevo Webhook] ⚠️  No booking matched — event:"${statusEvent}", orderId:${orderId}, email:${recipientEmail}`
        );
      }
    }
  } catch (error) {
    console.error("[Brevo Webhook] ❌ Error processing webhook:", error.message);
  }
};
