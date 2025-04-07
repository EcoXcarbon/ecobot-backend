import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(fs.readFileSync("serviceAccount.json"));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://YOUR_PROJECT.firebaseio.com"
});

const db = admin.firestore();

export async function saveUser(userId, data) {
  const ref = db.collection("users").doc(String(userId));
  const current = (await ref.get()).data() || {};
  await ref.set({ ...current, ...data }, { merge: true });
}

export async function loadUser(userId) {
  const ref = db.collection("users").doc(String(userId));
  const doc = await ref.get();
  return doc.exists ? doc.data() : null;
}