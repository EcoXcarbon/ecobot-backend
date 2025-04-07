export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { password } = req.body;

  if (!password) return res.status(400).json({ success: false, message: "Password required" });

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (password === ADMIN_PASSWORD) {
    return res.status(200).json({ success: true, message: "Admin authenticated" });
  } else {
    return res.status(401).json({ success: false, message: "Invalid password" });
  }
}
