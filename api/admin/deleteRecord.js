import db from "../../utils/firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { password, id } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Invalid password" });
  }

  if (!id) {
    return res.status(400).json({ success: false, message: "Missing document ID" });
  }

  try {
    await db
      .collection("bonus_claims")
      .doc("treeSubmissions")
      .collection("treeSubmissions")
      .doc(id)
      .delete();

    return res.status(200).json({ success: true, message: `Deleted document ${id}` });
  } catch (error) {
    console.error("🔥 Deletion error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}
