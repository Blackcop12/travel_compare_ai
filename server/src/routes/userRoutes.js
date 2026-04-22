const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getProfile, updateProfile, addToWishlist, removeFromWishlist } = require("../controllers/userController");

const router = express.Router();

router.use(authMiddleware);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/wishlist", addToWishlist);
router.delete("/wishlist/:itemId", removeFromWishlist);

module.exports = router;
