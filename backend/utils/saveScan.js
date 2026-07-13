import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../database/scans.json");

export function saveScan(scanData) {
    try {
        let scans = [];

        if (fs.existsSync(dbPath)) {
            const fileData = fs.readFileSync(dbPath, "utf8");

            if (fileData.trim() !== "") {
                scans = JSON.parse(fileData);
            }
        }

        scans.push(scanData);

        fs.writeFileSync(dbPath, JSON.stringify(scans, null, 2));
    } catch (error) {
        console.error("Error saving scan:", error);
    }
}