import fs from "fs";

const FILE_PATH = "./database/scans.json";

export function getHistory(req, res) {

    try {

        if (!fs.existsSync(FILE_PATH)) {

            return res.json([]);

        }

        const scans = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));

        // Newest first
        scans.reverse();

        // Return latest 5
        res.json(scans.slice(0, 5));

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            error: "Unable to load history."

        });

    }

}