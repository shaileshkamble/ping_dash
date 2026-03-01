// const express = require("express");
// const cors = require("cors");
// const ping = require("ping");

// const app = express();
// app.use(cors());

// app.get("/ping", async (req, res) => {
//     const host = req.query.host;

//     if (!host) {
//         return res.status(400).json({ error: "Host required" });
//     }

//     try {
//         const response = await ping.promise.probe(host);

//         res.json({
            // latency: parseFloat(response.time) || 0,
            // packetLoss: parseFloat(response.packetLoss) || 0,
//             alive: response.alive ? 1 : 0
//             rtt: parseFloat(response.time) || 0,
//             minRtt: parseFloat(response.min) || 0,
//             maxRtt: parseFloat(response.max) || 0,
//             avgRtt: parseFloat(response.avg) || 0,
//         });

//     } catch (err) {
//         res.status(500).json({ error: "Ping failed" });
//     }
// });

// app.listen(5000, () => console.log("Server running on port 5000"));


const express = require("express");
const cors = require("cors");
const ping = require("ping");

const app = express();
app.use(cors());

app.get("/ping", async (req, res) => {
    const host = req.query.host;

    if (!host) {
        return res.status(400).json({ error: "Host required" });
    }

    try {
        const response = await ping.promise.probe(host, {
            timeout: 2,
            min_reply: 3   // send multiple packets for better stats
        });

        res.json({
            latency: parseFloat(response.time) || 0,
            packetLoss: parseFloat(response.packetLoss) || 0,
            rtt: parseFloat(response.time) || 0,
            minRtt: parseFloat(response.min) || 0,
            maxRtt: parseFloat(response.max) || 0,
            avgRtt: parseFloat(response.avg) || 0,
            packetLoss: parseFloat(response.packetLoss) || 0,
            alive: response.alive ? 1 : 0
        });

    } catch (err) {
        res.status(500).json({ error: "Ping failed" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));