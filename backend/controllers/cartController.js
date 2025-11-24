import userModel from "../models/userModel.js";

/* =====================================================
   ADD TO CART
===================================================== */
const addToCart = async (req, res) => {
  console.log("\n📦 addToCart() CALLED");
  console.log("➡️ Request body:", req.body);
  console.log("➡️ Authenticated user:", req.user);

  try {
    const userId = req.user?.id;
    const itemId = req.body.itemId;

    if (!userId) {
      console.log("❌ ERROR: No userId found in token.");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!itemId) {
      console.log("❌ ERROR: No itemId found in request body.");
      return res.status(400).json({ success: false, message: "itemId missing" });
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      console.log("❌ ERROR: User not found:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    // Increment / add item
    cartData[itemId] = (cartData[itemId] || 0) + 1;

    console.log("🛒 Updated Cart Data:", cartData);

    await userModel.findByIdAndUpdate(userId, { cartData });

    return res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.log("💥 INTERNAL ERROR addToCart:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =====================================================
   REMOVE FROM CART
===================================================== */
const removeFromCart = async (req, res) => {
  console.log("\n🗑️ removeFromCart() CALLED");
  console.log("➡️ Request body:", req.body);
  console.log("➡️ Authenticated user:", req.user);

  try {
    const userId = req.user?.id;
    const itemId = req.body.itemId;

    if (!userId) {
      console.log("❌ ERROR: No userId found in token.");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!itemId) {
      console.log("❌ ERROR: No itemId found in request body.");
      return res.status(400).json({ success: false, message: "itemId missing" });
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      console.log("❌ ERROR: User not found:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) delete cartData[itemId]; // remove empty entries
    }

    console.log("🛒 Updated Cart Data:", cartData);

    await userModel.findByIdAndUpdate(userId, { cartData });

    return res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.log("💥 INTERNAL ERROR removeFromCart:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =====================================================
   GET CART
===================================================== */
const getCart = async (req, res) => {
  console.log("\n📥 getCart() CALLED");
  console.log("➡️ Authenticated user:", req.user);

  try {
    const userId = req.user?.id;

    if (!userId) {
      console.log("❌ ERROR: No userId found in token.");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      console.log("❌ ERROR: User not found:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};
    console.log("🛒 CART FETCHED:", cartData);

    return res.json({ success: true, cartData });
  } catch (error) {
    console.log("💥 INTERNAL ERROR getCart:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addToCart, removeFromCart, getCart };
