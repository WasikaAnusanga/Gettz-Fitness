// src/components/ReceiptPDF.jsx
import { useState } from "react";
import jsPDF from "jspdf";
import GymLogo from "../../../assets/GymLogo.jpg";

/** ---- tiny helpers ---- */
const LKR = (v) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(
    Number(v || 0)
  );
const today = () => new Date().toISOString().slice(0, 10);

export default function ReceiptPDF() {
  const [form] = useState({
    business: "Gettz Fitness",
    address: "Matara",
    customerName: "Ruwin Gajadeera",
    plan: "Elite Monthly",
    transactionId: "TXN-2025-0912",
    transactionDate: today(),
    total: 4999.0,
  });

  /** --------- PDF: Minimal 5-field report ---------- */
  const genPDF = () => {
    const red = [220, 38, 38];
    const gray = [75, 85, 99];
    const black = [0, 0, 0];
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const W = doc.internal.pageSize.getWidth();
    const marginX = 40;
    const marginY = 56;
    const leftX = marginX;
    let y = marginY;

    // Header / brand (use JPEG since file is .jpg)
    doc.addImage(GymLogo, "JPEG", leftX, y, 54, 54);

    // Business title
    doc.setTextColor(...red);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(form.business, leftX + 70, y + 20);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Address: ${form.address}`, leftX + 70, y + 40);

    // Divider
    y += 70;
    doc.setDrawColor(...red);
    doc.setLineWidth(1);
    doc.line(marginX, y, W - marginX, y);

    // Title
    y += 28;
    doc.setTextColor(...black);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Payment Receipt (Summary)", leftX, y);

    // The 5 rows only
    y += 24;
    const rowGap = 22;

    const row = (label, value, bold = false) => {
      doc.setFontSize(11);
      doc.setTextColor(...gray);
      doc.setFont("helvetica", "normal");
      doc.text(label, leftX, y);

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.text(String(value ?? "-"), leftX + 150, y);

      y += rowGap;
    };

    row("Customer Name", form.customerName);
    row("Plan Name", form.plan);
    row("Transaction ID", form.transactionId);
    row("Transaction Date", form.transactionDate);
    row("Total", LKR(form.total), true);

    // Footer line
    y += 8;
    doc.setDrawColor(...red);
    doc.setLineWidth(1);
    doc.line(marginX, y, W - marginX, y);

    // Footer text (optional)
    y += 18;
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Thank you. For support: support@gettzfitness.lk | +94 77 000 0000",
      marginX,
      y
    );

    doc.save("payment_receipt.pdf");
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="flex items-center gap-3">
          {/* You can swap this placeholder for an actual <img src={GymLogo} /> if you like */}
          <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center text-white text-xs font-bold">
            LOGO
          </div>
          <div>
            <h2 className="text-xl font-semibold text-red-600">
              {form.business}
            </h2>
            <p className="text-sm text-slate-500">Address: {form.address}</p>
          </div>
        </div>

        <div className="my-4 h-px bg-red-600/80" />

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Customer Name" value={form.customerName} />
          <Field label="Plan Name" value={form.plan} />
          <Field label="Transaction ID" value={form.transactionId} />
          <Field label="Transaction Date" value={form.transactionDate} />
          <Field label="Total" value={LKR(form.total)} />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={genPDF}
            className="rounded-xl bg-red-600 px-4 py-2 text-white font-medium shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Download Receipt (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="text-sm font-medium text-slate-800">{value}</div>
    </div>
  );
}
