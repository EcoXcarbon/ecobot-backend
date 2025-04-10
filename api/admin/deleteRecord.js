import db from "@/utils/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { password, id } = req.body;

  if (!password || !id) {
    return res.status(400).json({ success: false, message: "Missing password or ID" });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Invalid password" });
  }

  try {
    const ref = db.collection("bonus_claims").doc(id);
    const doc = await ref.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    await ref.delete();

    return res.status(200).json({ success: true, message: "Record deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
