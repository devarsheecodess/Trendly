const express = require("express");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Function to Extract Public ID Correctly
function extractPublicId(cloudinaryUrl) {
  try {
    const urlObj = new URL(cloudinaryUrl);
    const pathname = urlObj.pathname;
    const parts = pathname.split("/");

    // ✅ Extract only the last part (without extension)
    const lastPart = parts[parts.length - 1];
    const publicId = lastPart.split(".")[0]; // Remove file extension

    return publicId; // ✅ Return only the public ID
  } catch (error) {
    throw new Error("Invalid Cloudinary URL");
  }
}

// ✅ DELETE Cloudinary Asset Route
router.delete("/delete", async (req, res) => {
  const { cloudinaryUrl } = req.body;

  if (!cloudinaryUrl) {
    return res.status(400).json({ error: "Cloudinary URL is required" });
  }

  try {
    const publicId = extractPublicId(cloudinaryUrl);
    console.log("🔍 Corrected Public ID:", publicId);

    // Detect resource type
    const resourceType = cloudinaryUrl.includes("/video/upload/")
      ? "video"
      : "image";

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result.result === "ok") {
      return res.json({
        success: true,
        message: `✅ ${resourceType} deleted successfully!`,
      });
    } else {
      return res
        .status(400)
        .json({
          error: `❌ Failed to delete ${resourceType}. Check public ID.`,
        });
    }
  } catch (error) {
    console.error("❌ Deletion Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
