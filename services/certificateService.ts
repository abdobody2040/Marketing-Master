
import jsPDF from "jspdf";
import { UserProfile } from "../types";

export const generateCertificate = (user: UserProfile) => {
  // Create landscape PDF (A4)
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // --- 1. Background Elements (Blue Geometrics) ---
  
  // Colors based on the image
  const darkBlue = "#1e3a8a"; // Blue-900ish
  const brightBlue = "#3b82f6"; // Blue-500ish
  const lightBlue = "#60a5fa"; // Blue-400ish

  // Top Right Geometric Shapes
  doc.setFillColor(brightBlue);
  doc.triangle(width, 0, width - 80, 0, width, 80, "F");
  
  doc.setFillColor(lightBlue); // Lighter accent
  doc.triangle(width, 0, width - 40, 0, width, 40, "F");

  // Bottom Left Geometric Shapes
  doc.setFillColor(brightBlue);
  doc.triangle(0, height, 0, height - 80, 80, height, "F");

  doc.setFillColor(darkBlue); // Darker accent
  doc.triangle(0, height, 0, height - 100, 50, height, "F");

  // --- 2. Gold Rosette Badge (Top Left) ---
  
  const badgeX = 35;
  const badgeY = 35;
  
  // Ribbons tails
  doc.setFillColor(255, 193, 7); // Amber-500
  // Left Tail
  doc.triangle(badgeX - 10, badgeY, badgeX - 15, badgeY + 40, badgeX, badgeY + 30, "F");
  doc.triangle(badgeX - 15, badgeY + 40, badgeX - 5, badgeY + 40, badgeX - 10, badgeY + 30, "F"); // Cutout
  
  // Right Tail
  doc.triangle(badgeX + 10, badgeY, badgeX + 15, badgeY + 40, badgeX, badgeY + 30, "F");
  doc.triangle(badgeX + 15, badgeY + 40, badgeX + 5, badgeY + 40, badgeX + 10, badgeY + 30, "F"); // Cutout

  // Rosette Circle (Outer Ruffle)
  doc.setFillColor(255, 179, 0); // Amber-600
  doc.circle(badgeX, badgeY, 18, "F");
  
  // Inner Circle (Bright Gold)
  doc.setFillColor(255, 213, 79); // Amber-300
  doc.circle(badgeX, badgeY, 14, "F");
  
  // Ring
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1);
  doc.circle(badgeX, badgeY, 12, "S");


  // --- 3. Text Content ---

  // Main Title
  doc.setFont("times", "normal");
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.setFontSize(42);
  doc.text("CERTIFICATE", width / 2, 40, { align: "center" });
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.text("OF MASTERY", width / 2, 52, { align: "center" });

  // Presented To Label
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.setFont("helvetica", "bold");
  doc.text("THIS CERTIFICATE IS PRESENTED TO", width / 2, 70, { align: "center" });

  // Student Name (Script Simulation)
  // Since jsPDF default fonts don't have a script font, we use Italic Times as the best standard fallback
  // or a user would need to import a custom .ttf file. We will style it heavily to look elegant.
  doc.setFont("times", "italic");
  doc.setFontSize(48);
  doc.setTextColor(30, 58, 138); // Dark Blue text
  doc.text(user.name, width / 2, 95, { align: "center" });

  // Underline for Name
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.5);
  doc.line(width / 2 - 60, 100, width / 2 + 60, 100);

  // Body Text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85); // Slate-700
  const bodyText = "Has successfully demonstrated exceptional proficiency in all domains of the MarketMaster RPG curriculum, including Strategy, Branding, Analytics, and Pharmaceutical Marketing.";
  const splitBody = doc.splitTextToSize(bodyText, 160);
  doc.text(splitBody, width / 2, 115, { align: "center" });

  // --- 4. Footer & Signature ---

  const footerY = 160;

  // Date (Left)
  const dateStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(dateStr, 60, footerY, { align: "center" });
  doc.setDrawColor(15, 23, 42);
  doc.line(40, footerY + 2, 80, footerY + 2);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("DATE", 60, footerY + 7, { align: "center" });

  // Signature (Right)
  // Drawing a dummy signature "Path" to simulate handwriting
  doc.setDrawColor(30, 58, 138); // Blue pen
  doc.setLineWidth(1);
  
  // Simulating a signature with lines/curves
  const sigX = width - 60;
  doc.lines([
      [5, -5], [5, 5], [5, -10], [10, 5], [5, -2], [10, 0]
  ], sigX - 15, footerY - 5, [1,1]);
  
  // Or just using text in italic for the signature if curves are too messy
  doc.setFont("times", "italic");
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138);
  doc.text("Grandmaster", sigX, footerY - 2, { align: "center" });

  // Signature Line
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(width - 80, footerY + 2, width - 40, footerY + 2);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("SIGNATURE", sigX, footerY + 7, { align: "center" });

  // Save
  doc.save(`MarketMaster_Certificate_${user.name.replace(/\s+/g, '_')}.pdf`);
};
