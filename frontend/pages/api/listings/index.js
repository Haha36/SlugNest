export default async function handler(req, res) {
  const DJANGO_API_URL = process.env.DJANGO_API_URL || "https://slugnest.org";

  try {
    switch (req.method) {
      case "GET":
        const getResponse = await fetch(`${DJANGO_API_URL}/api/listings/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!getResponse.ok) {
          throw new Error(`Django API responded with status: ${getResponse.status}`);
        }

        const listings = await getResponse.json();
        res.status(200).json(listings);
        break;

      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Listings API Route Error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
