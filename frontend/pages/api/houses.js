
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000";

  try {
    switch (req.method) {
      case "GET":
        // Get all houses or a specific house
        const getResponse = await fetch(`${DJANGO_API_URL}/api/listings/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!getResponse.ok) {
          throw new Error(
            `Django API responded with status: ${getResponse.status}`
          );
        }

        const houses = await getResponse.json();
        res.status(200).json(houses);
        break;

      case "POST":
        // Create a new house
        const postResponse = await fetch(`${DJANGO_API_URL}/api/listings/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req.body),
        });

        if (!postResponse.ok) {
          const errorData = await postResponse.text();
          throw new Error(`Django API error: ${errorData}`);
        }

        const newHouse = await postResponse.json();
        res.status(201).json(newHouse);
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Route Error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      details: "Check that your Django server is running on the expected port",
    });
  }
}
