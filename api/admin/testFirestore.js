import admin from "../../utils/firebaseAdmin.js";

export default async function handler(req, res) {
  try {
    console.log("✅ Firestore test started");

    const db = admin.firestore();
    console.log("📦 Firestore instance loaded");

    const snapshot = await db.collection("submissions").limit(1).get();
    console.log("📥 Query executed");

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("✅ Data retrieved:", data);

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ Firestore test failed:", err);
    return res.status(500).json({ success: false, message: "Firestore test failed", error: err.message });
  }
}
