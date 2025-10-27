import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.post("/api/traffic", async (req, res) => {
  const { shortUrl } = req.body;
  if (!shortUrl) return res.status(400).json({ error: "No URL provided" });

  try {
    const u = new URL(shortUrl);
    const domain = u.hostname;
    const slashtag = u.pathname.replace("/", "");

    const resp = await fetch(
      `https://api.rebrandly.com/v1/links?domain.fullName=${domain}&slashtag=${slashtag}`,
      {
        headers: {
          apikey: process.env.60f1cd2c4e18415d8d0792bf54f20ca2,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await resp.json();

    if (!data.length) return res.status(404).json({ error: "Link not found" });

    const link = data[0];
    res.json({
      shortUrl: link.shortUrl,
      destination: link.destination,
      clicks: link.clicks,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Server running on port", PORT));
