export default async function handler(req, res) {
  const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000";
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const response = await fetch(`${DJANGO_API_URL}/api/listings/?mine=true`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      throw new Error(`Django API responded with status: ${response.status}`);
    }

    const listings = await response.json();
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
