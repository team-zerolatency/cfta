import express from "express";
import cors from "cors";
import "dotenv/config";
import { traceRouter } from "./routes/trace.js";
import { exportRouter } from "./routes/export.js";
import { registryRouter } from "./routes/registry.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "cfta-api" });
});

app.use("/trace", traceRouter);
app.use("/registry", registryRouter);
app.use("/export", exportRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`CFTA API running on http://localhost:${PORT}`);
});