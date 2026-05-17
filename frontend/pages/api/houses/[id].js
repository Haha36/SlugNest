export default async function handler(req, res) {
  const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000";
  const { id } = req.query;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (req.method === "PATCH") {
      const response = await fetch(`${DJANGO_API_URL}/api/listings/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        const error = await response.text();
        return res.status(response.status).json({ error });
      }

      return res.status(200).json(await response.json());
    }

    if (req.method === "DELETE") {
      const response = await fetch(`${DJANGO_API_URL}/api/listings/${id}/`, {
        method: "DELETE",
        headers: { Authorization: authHeader },
      });

      if (!response.ok) {
        const error = await response.text();
        return res.status(response.status).json({ error });
      }

      return res.status(204).end();
    }

    res.setHeader("Allow", ["PATCH", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
