import admin from "../../utils/firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { password, userId, amount } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ success: false, message: "Unauthorized" });

  const db = admin.firestore();
  try {
    const userRef = db.collection("user-balances").doc(userId);
    await userRef.set({ ecoBalance: admin.firestore.FieldValue.increment(amount) }, { merge: true });
    res.status(200).json({ success: true, message: `${amount} ECO transferred to ${userId}` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Transfer failed", error: err.message });
  }
}
