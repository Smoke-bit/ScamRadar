import express from "express";

import { verifyEntity } from "../controllers/verifyController.js";

const router = express.Router();

router.post("/", verifyEntity);

export default router;