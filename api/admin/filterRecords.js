import admin from "../../utils/firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { password, filters } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ success: false, message: "Unauthorized" });

  const db = admin.firestore();
  let query = db.collection("carbon-submissions");

  if (filters.userId) query = query.where("userId", "==", filters.userId);
  if (filters.assetType) query = query.where("type", "==", filters.assetType);
  if (filters.verified !== undefined) query = query.where("verified", "==", filters.verified);

  try {
    const snapshot = await query.get();
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, records: results });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching records", error: err.message });
  }
}
