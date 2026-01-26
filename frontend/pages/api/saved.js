// Next.js API route for saved listings operations
// This is like theproxy/middleware between frontend and Django backend

export default async function handler(req, res) {
  const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000";
  const accessToken = req.headers.authorization?.replace("Bearer ", "");

  if (!accessToken) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    switch (req.method) {
      case "GET":
        // Get all saved listings for the user
        const getResponse = await fetch(`${DJANGO_API_URL}/api/saved/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!getResponse.ok) {
          if (getResponse.status === 401) {
            return res.status(401).json({ error: "Unauthorized" });
          }
          throw new Error(`Django API responded with status: ${getResponse.status}`);
        }

        const savedListings = await getResponse.json();
        res.status(200).json(savedListings);
        break;

      case "POST":
        // Save a listing
        const { house_id } = req.body;
        if (!house_id) {
          return res.status(400).json({ error: "house_id is required" });
        }

        const postResponse = await fetch(`${DJANGO_API_URL}/api/saved/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ house_id }),
        });

        if (!postResponse.ok) {
          if (postResponse.status === 401) {
            return res.status(401).json({ error: "Unauthorized" });
          }
          const errorData = await postResponse.text();
          throw new Error(`Django API error: ${errorData}`);
        }

        const savedListing = await postResponse.json();
        res.status(201).json(savedListing);
        break;

      case "DELETE":
        // Unsave a listing
        let deleteHouseId;
        try {
          if (req.body) {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            deleteHouseId = body.house_id;
          }
        } catch (e) {
        }
        deleteHouseId = deleteHouseId || req.query.house_id;
        
        if (!deleteHouseId) {
          return res.status(400).json({ error: "house_id is required" });
        }

        const deleteResponse = await fetch(`${DJANGO_API_URL}/api/saved/${deleteHouseId}/`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!deleteResponse.ok) {
          if (deleteResponse.status === 401) {
            return res.status(401).json({ error: "Unauthorized" });
          }
          throw new Error(`Django API error: ${deleteResponse.status}`);
        }

        res.status(200).json({ message: "Listing unsaved successfully" });
        break;

      default:
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Route Error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

