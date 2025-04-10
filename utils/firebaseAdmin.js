import admin from "firebase-admin";

// Decode base64 Firebase Admin credentials
const privateKeyBase64 = process.env.FIREBASE_ADMIN_KEY;

if (!privateKeyBase64) {
  throw new Error("❌ FIREBASE_ADMIN_KEY environment variable not set.");
}

const serviceAccount = JSON.parse(
  Buffer.from(privateKeyBase64, "base64").toString("utf8")
);

// Initialize once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export db directly
const db = admin.firestore();
export default db;
