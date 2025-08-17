// BookVenue.jsx (key bits)
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";

export default function BookVenue() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);

  const turfId = params.get("turfId");
  const slotId = params.get("slotId");
  const date = params.get("date");
  const sport = params.get("sport");
  const [customerName, setCustomerName] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      setErr("");
      const res = await axios.post(`${url}/api/slots/${slotId}/book`, {
        customerName,
        source: "web",
      });
      if (res.data?.success) {
        alert("Booking confirmed!");
        navigate(`/confirmation?slotId=${slotId}`);
      } else {
        setErr(res.data?.message || "Booking failed");
      }
    } catch (e) {
      setErr(
        e?.response?.data?.message === "Slot no longer available"
          ? "Sorry, that slot was just taken. Please pick another."
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!turfId || !slotId || !date) {
    return <p>Missing booking details. Please start over.</p>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Confirm your booking</h2>
      <p><b>Sport:</b> {sport}</p>
      <p><b>Date:</b> {date}</p>
      <p><b>Slot ID:</b> {slotId}</p>

      <label>
        Your name:
        <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      </label>

      {err && <p style={{ color: "tomato" }}>{err}</p>}

      <button disabled={submitting} onClick={handleConfirm}>
        {submitting ? "Booking…" : "Confirm Booking"}
      </button>
    </div>
  );
}
