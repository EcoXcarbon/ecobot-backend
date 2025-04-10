// /utils/firebaseAdmin.js
import admin from "firebase-admin";

const privateKeyBase64 = process.env.FIREBASE_ADMIN_KEY;

if (!privateKeyBase64) {
  throw new Error("❌ FIREBASE_ADMIN_KEY environment variable not set.");
}

const serviceAccount = JSON.parse(
  Buffer.from(privateKeyBase64, "base64").toString("utf8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default db;
