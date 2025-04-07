import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Decode the base64-encoded Firebase admin JSON from Vercel environment variable
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_ADMIN_KEY, "base64").toString("utf8")
);

// Initialize Firebase Admin SDK once
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

// Export Firestore for use in admin routes
const admin = {
  firestore: getFirestore,
};

export default admin;
