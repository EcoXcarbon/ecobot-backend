import admin from "../../utils/firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { password, recordId } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ success: false, message: "Unauthorized" });

  const db = admin.firestore();
  try {
    await db.collection("carbon-submissions").doc(recordId).delete();
    res.status(200).json({ success: true, message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Deletion failed", error: err.message });
  }
}
