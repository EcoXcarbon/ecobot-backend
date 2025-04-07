// firebaseScoringEngine.js

import admin from "firebase-admin";
import fs from "fs";

// Read and parse serviceAccount.json manually to avoid JSON import issues
const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccount.json", "utf8"));

// Initialize Firebase app only if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const db = admin.firestore();
const scoresRef = db.collection("userScores");

// Update user score by delta
export async function updateScore(userId, delta) {
  const userDoc = scoresRef.doc(userId);
  const doc = await userDoc.get();

  const currentScore = doc.exists ? doc.data().score || 0 : 0;
  const newScore = currentScore + delta;

  await userDoc.set({ score: newScore }, { merge: true });
  return newScore;
}

// Get user score
export async function getUserScore(userId) {
  const doc = await scoresRef.doc(userId).get();
  return doc.exists ? doc.data().score || 0 : 0;
}
