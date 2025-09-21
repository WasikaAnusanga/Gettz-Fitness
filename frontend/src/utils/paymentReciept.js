// utils/generateReceiptPDF.js
import jsPDF from "jspdf";
import GymLogo from "../assets/GymLogo.jpg"; // adjust path to where your logo is

export function generateReceiptPDF(data, userName) {
  const customerName = userName;
  const plan = data.planName;
  const transactionId = "#TA_"+data.payment_id;
  const transactionDate = data.createdAt.split("T")[0];
  const total = data.amount;
  // 🔒 Fixed values
  const business = "Gettz Fitness";
  const address = "48 Udyana Mawatha, Matara";
  
    const red = [220, 38, 38];
    const gray = [75, 85, 99];
    const black = [0, 0, 0];

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    const marginX = 40;
    const marginY = 56;
    const leftX = marginX;
    let y = marginY;

    // Logo
    try {
      doc.addImage(GymLogo, "JPEG", leftX, y, 54, 54);
    } catch (err) {
      console.warn("Logo not added:", err);
    }

    // Business name
    doc.setTextColor(...red);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(business, leftX + 70, y + 20);

    // Address
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Address: ${address}`, leftX + 70, y + 40);

    // Divider
    y += 70;
    doc.setDrawColor(...red);
    doc.line(marginX, y, W - marginX, y);

    // Title
    y += 28;
    const pageWidth = doc.internal.pageSize.getWidth();
doc.setTextColor(...black);
doc.setFont("helvetica", "bold");
doc.setFontSize(16);

// center align
doc.text("Payment Receipt (Summary)", pageWidth / 2, y, { align: "center" });


    // Rows
    y += 40;
    const rowGap = 22;

    const row = (label, value, bold = false) => {
      doc.setFontSize(11);
      doc.setTextColor(...gray);
      doc.setFont("helvetica", "normal");
      doc.text(label, leftX, y);

      doc.setTextColor(...black);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.text(String(value ?? "-"), leftX + 150, y);

      y += rowGap;
    };

    row("Customer Name", customerName);
    row("Plan Name", plan);
    row("Transaction ID", transactionId);
    row("Transaction Date", transactionDate);
    row(
      "Total",
      new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
      }).format(total),
      true
    );

    // Footer
    y += 20;
    doc.setDrawColor(...red);
    doc.line(marginX, y, W - marginX, y);

    y += 18;
    doc.setTextColor(...gray);
    doc.setFontSize(10);
    doc.text(
      "Thank you. For support: support@gettzfitness.lk | +94  77 780 4602",
      marginX,
      y
    );

    doc.save("payment_receipt.pdf");
}
