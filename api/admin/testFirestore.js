import admin from "../../utils/firebaseAdmin.js";

export default async function handler(req, res) {
  try {
    const db = admin.firestore();
    const snapshot = await db.collection("submissions").limit(1).get();

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("🔥 Firestore test failed:", err);
    return res.status(500).json({ success: false, message: "Firestore access failed" });
  }
}
