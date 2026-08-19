import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "Express API is running 🚀" });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ healthy: true, timestamp: new Date().toISOString() });
});

app.get("/api/hello/:name", (req: Request, res: Response) => {
  res.json({ message: `Hello, ${req.params.name}!` });
});

app.listen(PORT, () => {
  console.log(`API ready at http://localhost:${PORT}`);
});