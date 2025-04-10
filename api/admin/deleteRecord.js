// /api/admin/deleteRecord.js
import db from "@/utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { password, id } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!id) {
    return res.status(400).json({ error: "Missing ID" });
  }

  try {
    const nestedPath = db.doc(`bonus_claims/treeSubmissions/${id}`);
    const flatPath = db.doc(`treeSubmissions/${id}`);

    await nestedPath.delete();
    await flatPath.delete();

    return res.status(200).json({ success: true, message: `Deleted document ${id}` });
  } catch (error) {
    console.error("❌ Deletion failed:", error);
    return res.status(500).json({ error: "Failed to delete record" });
  }
}
