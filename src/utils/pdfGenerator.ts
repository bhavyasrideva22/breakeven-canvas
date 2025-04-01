
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { RunwayData } from "@/types/calculator";
import { formatCurrency, formatDate } from "./formatters";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateRunwayPdf = (data: RunwayData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add header and branding
  doc.setFillColor(36, 94, 79); // primary color
  doc.rect(0, 0, pageWidth, 30, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Startup Runway Analysis", pageWidth / 2, 20, { align: "center" });
  
  // Add date
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${currentDate}`, pageWidth - 20, 40, { align: "right" });
  
  // Add input summary
  doc.setFontSize(16);
  doc.setTextColor(36, 94, 79);
  doc.text("Input Parameters", 20, 55);
  
  doc.autoTable({
    startY: 60,
    head: [["Parameter", "Value"]],
    body: [
      ["Total Available Cash", formatCurrency(data.totalCash)],
      ["Monthly Burn Rate", formatCurrency(data.monthlyBurn)],
      ["Additional Funding", formatCurrency(data.additionalFunding)],
      ["Monthly Growth Rate", `${data.growthRate}%`],
      ["Monthly Revenue", formatCurrency(data.monthlyRevenue)],
    ],
    headStyles: { fillColor: [36, 94, 79] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });
  
  // Add results
  doc.setFontSize(16);
  doc.setTextColor(36, 94, 79);
  doc.text("Runway Analysis Results", 20, doc.lastAutoTable.finalY + 20);
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 25,
    head: [["Metric", "Value"]],
    body: [
      ["Runway Duration", `${data.runwayMonths} months`],
      ["Estimated End Date", formatDate(data.runwayDate)],
    ],
    headStyles: { fillColor: [36, 94, 79] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });
  
  // Add monthly projections table
  doc.addPage();
  doc.setFillColor(36, 94, 79);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("Monthly Cash Projection", pageWidth / 2, 20, { align: "center" });
  
  const tableRows = data.projectedData.map(month => [
    `Month ${month.month + 1}`,
    formatDate(month.date),
    formatCurrency(month.revenue),
    formatCurrency(month.burn),
    formatCurrency(month.remaining)
  ]);
  
  doc.autoTable({
    startY: 40,
    head: [["Month", "Date", "Revenue", "Burn", "Remaining Cash"]],
    body: tableRows,
    headStyles: { fillColor: [36, 94, 79] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });
  
  // Add footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFillColor(36, 94, 79);
  doc.rect(0, footerY - 5, pageWidth, 15, "F");
  
  doc.setFontSize(10);
  doc.setTextColor(255);
  doc.text("© Financial Runway Calculator | www.runway-calculator.com", pageWidth / 2, footerY, { align: "center" });
  
  return doc;
};

export const downloadRunwayPdf = (data: RunwayData) => {
  const doc = generateRunwayPdf(data);
  doc.save("runway-analysis.pdf");
};
