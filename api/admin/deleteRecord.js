// /api/admin/deleteRecord.js
import db from "@/utils/firebaseAdmin";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    const { password, id } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!id) {
      return res.status(400).json({ success: false, message: "Missing ID" });
    }

    const docRef = db.collection("bonus_claims").doc("treeSubmissions").collection("treeSubmissions").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    await docRef.delete();
    return res.status(200).json({ success: true, message: `Deleted document ${id}` });
  } catch (error) {
    console.error("Delete Record Error:", error.message);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
}
