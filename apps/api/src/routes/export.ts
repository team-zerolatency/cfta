import { Router } from "express";
import { buildReportData } from "../lib/reportData.js";
import { generateReportPdf } from "../lib/pdf.js";
import type { TraceResult } from "../types/trace.js";

export const exportRouter: Router = Router();

exportRouter.post("/", async (req, res) => {
  const trace = req.body as TraceResult;

  if (!trace || !Array.isArray(trace.nodes) || !Array.isArray(trace.edges)) {
    return res.status(400).json({ error: "A valid trace result (nodes + edges) is required" });
  }

  try {
    const report = buildReportData(trace);
    const pdfBuffer = await generateReportPdf(report);

    const filename = `cfta-report-${report.startAddress.slice(0, 10)}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Failed to generate PDF report:", err);
    res.status(500).json({ error: "Failed to generate PDF report" });
  }
});