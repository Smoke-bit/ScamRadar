import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import verifyRoutes from "./routes/verify.js";

dotenv.config();
console.log("VT KEY:", process.env.VIRUSTOTAL_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/verify", verifyRoutes);

app.get("/", (req, res) => {

    res.json({

        status: "ScamRadar Backend Running 🚀"

    });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on port ${PORT}`);

});