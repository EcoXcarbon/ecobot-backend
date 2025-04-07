// api/admin/filterRecords.js
import db from "../../utils/firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { password, filter } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Invalid password" });
  }

  try {
    const snapshot = await db.collection("submissions").get();

    let results = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      let match = true;
      if (filter && typeof filter === "object") {
        for (let key of Object.keys(filter)) {
          if (data[key] !== filter[key]) {
            match = false;
            break;
          }
        }
      }

      if (match) {
        results.push({ id: doc.id, ...data });
      }
    });

    return res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("❌ Error filtering records:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
