import { useState } from "react";
import { Calendar, Download, FileSpreadsheet, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Money from "../components/Money";
import { Loading } from "../components/States";

export default function ReportsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await api.get("/reports/yearly", { params: { year } });
      setReport(r.data.report);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to generate report.",
      );
    } finally {
      setLoading(false);
    }
  };

  const csv = () => {
    if (!report || !report.transactions) return;
    const rows = [
      ["Date", "Description", "Type", "Category", "Amount"],
      ...report.transactions.map((x) => [
        new Date(x.date).toISOString().slice(0, 10),
        x.description,
        x.type,
        x.category,
        x.amount,
      ]),
    ];
    const blob = new Blob(
      [
        rows
          .map((r) =>
            r.map((x) => `"${String(x).replaceAll('"', '""')}"`).join(","),
          )
          .join("\n"),
      ],
      { type: "text/csv" },
    );
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: `finance-report-${year}.csv`,
    });
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const pdf = () => {
    if (!report) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("FinSight AI — Annual Financial Statement", 14, 18);
    doc.setFontSize(11);
    doc.text(`Reporting Period: Fiscal Year ${year}`, 14, 26);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

    let y = 46;
    doc.setFontSize(13);
    doc.text("Executive Summary", 14, y);
    y += 8;

    doc.setFontSize(10);
    [
      ["Total Inflow (Income)", report.summary.income],
      ["Total Outflow (Expenses)", report.summary.expenses],
      ["Net Capital Saved", report.summary.savings],
    ].forEach(([label, value]) => {
      doc.text(`${label}: INR ${Number(value).toFixed(2)}`, 14, y);
      y += 7;
    });

    y += 8;
    doc.setFontSize(13);
    doc.text("Category Breakdown", 14, y);
    y += 8;

    doc.setFontSize(10);
    report.categories.forEach((x) => {
      if (y > 275) {
        doc.addPage();
        y = 18;
      }
      doc.text(`${x.category}: INR ${Number(x.amount).toFixed(2)}`, 16, y);
      y += 7;
    });

    doc.save(`finance-report-${year}.pdf`);
  };

  return (
    <>
      <PageHeader
        title="Financial Statements & Reports"
        description="Comprehensive fiscal year accounting reports with CSV and PDF export capability."
      />

      {/* Year Selection Filter Bar */}
      <div className="filters" style={{ maxWidth: "480px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
          <Calendar size={18} style={{ color: "var(--ink-muted)" }} />
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Fiscal Year:</span>
          <input
            type="number"
            value={year}
            min="2000"
            max="2100"
            onChange={(e) => setYear(e.target.value)}
            style={{ width: "100px" }}
          />
        </div>

        <button
          className="button button-primary"
          onClick={load}
          disabled={loading}
          type="button"
        >
          {loading ? "Generating…" : "Generate Statement"}
        </button>
      </div>

      {error && <div className="form-error" style={{ marginBottom: "16px" }}>{error}</div>}

      {loading && <Loading label="Compiling financial report data…" />}

      {report && (
        <section className="card report">
          <div className="action-row">
            <div>
              <h2 style={{ fontSize: "1.35rem", margin: "0 0 4px" }}>
                Fiscal Statement: {year}
              </h2>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--ink-muted)" }}>
                Audited transaction totals across all accounts.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="button button-secondary"
                onClick={csv}
                type="button"
                title="Download CSV Spreadsheet"
              >
                <FileSpreadsheet size={16} />
                <span>Export CSV</span>
              </button>
              <button
                className="button button-secondary"
                onClick={pdf}
                type="button"
                title="Download PDF Document"
              >
                <FileText size={16} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              margin: "24px 0",
            }}
          >
            <div className="card" style={{ padding: "18px 20px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ink-muted)", textTransform: "uppercase" }}>
                Total Income
              </span>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--income)", marginTop: "4px" }}>
                +<Money value={report.summary.income} />
              </div>
            </div>

            <div className="card" style={{ padding: "18px 20px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ink-muted)", textTransform: "uppercase" }}>
                Total Expenses
              </span>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--ink)", marginTop: "4px" }}>
                −<Money value={report.summary.expenses} />
              </div>
            </div>

            <div className="card" style={{ padding: "18px 20px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ink-muted)", textTransform: "uppercase" }}>
                Net Retained Capital
              </span>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: report.summary.savings >= 0 ? "var(--brand)" : "var(--expense)",
                  marginTop: "4px",
                }}
              >
                <Money value={report.summary.savings} />
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: "1.1rem", margin: "24px 0 14px" }}>
            Expense Breakdown by Category
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {report.categories.map((x) => (
              <div
                key={x.category}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  backgroundColor: "var(--surface-subtle)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                }}
              >
                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{x.category}</span>
                <b style={{ fontSize: "0.95rem" }}>
                  <Money value={x.amount} />
                </b>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
