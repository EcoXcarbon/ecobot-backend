import db from "../../utils/firebaseAdmin.js"; // ✅ fixed import path

export default async function handler(req, res) {
  console.log("📩 Delete request received");

  if (req.method !== "POST") {
    console.log("❌ Method not allowed");
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { password, id } = req.body;
  console.log("🔐 Password received:", password ? "✅" : "❌", "ID:", id);

  if (password !== process.env.ADMIN_PASSWORD) {
    console.log("❌ Invalid password");
    return res.status(401).json({ success: false, message: "Invalid password" });
  }

  if (!id) {
    console.log("❌ Missing ID");
    return res.status(400).json({ success: false, message: "Missing document ID" });
  }

  try {
    console.log(`🚀 Attempting delete: bonus_claims/treeSubmissions/treeSubmissions/${id}`);
    await db
      .collection("bonus_claims")
      .doc("treeSubmissions")
      .collection("treeSubmissions")
      .doc(id)
      .delete();

    console.log("✅ Deletion complete");
    return res.status(200).json({ success: true, message: `Deleted ${id}` });
  } catch (error) {
    console.error("🔥 Delete error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}
