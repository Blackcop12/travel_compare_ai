const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required." });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true }
    ).select("-password");

    return res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { item } = req.body;
    if (!item?.name || !item?.platform || typeof item?.price !== "number") {
      return res.status(400).json({ message: "Valid item payload is required." });
    }

    const user = await User.findById(req.user._id);
    user.wishlist.push({
      name: item.name,
      platform: item.platform,
      price: item.price,
      rating: item.rating || 0,
      deliveryTime: item.deliveryTime || 0,
      orderUrl: item.orderUrl || "#",
    });
    await user.save();

    return res.status(201).json({ message: "Added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter((entry) => entry._id.toString() !== req.params.itemId);
    await user.save();

    return res.status(200).json({ message: "Removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
