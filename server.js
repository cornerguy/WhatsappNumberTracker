const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/collect", async (req, res) => {

    const ip =
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress;

    let geo = {};

    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        geo = response.data;
    } catch {}

    const log = {
        ip,
        isp: geo.isp,
        country: geo.country,
        region: geo.regionName,
        city: geo.city,
        lat: geo.lat,
        lon: geo.lon,
        client: req.body
    };

    console.log("Visitor diagnostics:");
    console.log(JSON.stringify(log, null, 2));

    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});