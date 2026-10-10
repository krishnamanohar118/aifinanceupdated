import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  PieChart,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { jsPDF } from "jspdf";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Money from "../components/Money";
import { EmptyState, Loading } from "../components/States";
import { formatDate } from "../utils/finance";

export default function ReportsPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const quickYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

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
      download: `fintech-annual-report-${year}.csv`,
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

    doc.save(`fintech-annual-report-${year}.pdf`);
  };

  const income = Number(report?.summary?.income) || 0;
  const expenses = Number(report?.summary?.expenses) || 0;
  const savings = Number(report?.summary?.savings) || 0;
  const annualSavingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Audited Financial Statements"
        description="Comprehensive fiscal year accounting statements, ledger summaries, and data exports."
      />

      {/* Year Selection Filter Bar */}
      <div className="card year-selector-bar">
        <div className="year-selector-left">
          <div className="fiscal-year-tag">
            <Calendar size={16} />
            <span>Fiscal Year:</span>
          </div>

          <div className="quick-years-cluster">
            {quickYears.map((yr) => (
              <button
                key={yr}
                type="button"
                className={`quick-year-btn ${Number(year) === yr ? "active" : ""}`}
                onClick={() => setYear(yr)}
              >
                {yr}
              </button>
            ))}
          </div>

          <div className="custom-year-input-wrap">
            <input
              type="number"
              value={year}
              min="2000"
              max="2100"
              onChange={(e) => setYear(e.target.value)}
              className="year-input-field"
              title="Enter custom fiscal year"
            />
          </div>
        </div>

        <button
          className="button button-primary generate-statement-btn"
          onClick={load}
          disabled={loading}
          type="button"
        >
          <Sparkles size={16} />
          <span>{loading ? "Compiling Statement…" : "Generate Statement"}</span>
        </button>
      </div>

      {error && <div className="form-error" style={{ marginBottom: "20px" }}>{error}</div>}

      {loading && <Loading label={`Compiling fiscal telemetry for year ${year}…`} />}

      {!loading && !report && (
        <div className="card report-empty-prompt">
          <div className="empty-report-icon-box">
            <FileText size={32} />
          </div>
          <h3>Select Fiscal Year and Generate Statement</h3>
          <p>
            FinSight AI will consolidate all recorded transactions, calculate annual inflow,
            spending distribution, and retained capital for fiscal year {year}.
          </p>
          <button
            type="button"
            className="button button-primary"
            onClick={load}
            style={{ marginTop: "12px" }}
          >
            Generate {year} Statement
          </button>
        </div>
      )}

      {!loading && report && (
        <section className="card report-overview-container">
          {/* Executive Summary Header */}
          <div className="report-header-banner">
            <div className="report-header-left">
              <div className="report-title-line">
                <h2>Fiscal Statement: {year}</h2>
                <span className="audited-badge">
                  <ShieldCheck size={14} /> Audited Summary
                </span>
              </div>
              <p className="report-subtitle">
                Consolidated balance sheet and category disbursements across all tracked accounts.
              </p>
            </div>

            <div className="report-export-actions">
              <button
                className="button button-secondary export-btn"
                onClick={csv}
                type="button"
                title="Download CSV Spreadsheet"
              >
                <FileSpreadsheet size={16} />
                <span>Export CSV</span>
              </button>
              <button
                className="button button-secondary export-btn"
                onClick={pdf}
                type="button"
                title="Download PDF Document"
              >
                <FileText size={16} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Year Summary KPIs */}
          <div className="report-kpi-grid">
            <div className="card report-kpi-card">
              <div className="report-kpi-header">
                <span className="report-kpi-label">Total Inflow</span>
                <div className="kpi-mini-icon income">
                  <ArrowDownLeft size={14} />
                </div>
              </div>
              <div className="report-kpi-val income">
                +<Money value={income} />
              </div>
              <span className="report-kpi-sub">Total annualized income</span>
            </div>

            <div className="card report-kpi-card">
              <div className="report-kpi-header">
                <span className="report-kpi-label">Total Outflow</span>
                <div className="kpi-mini-icon expense">
                  <ArrowUpRight size={14} />
                </div>
              </div>
              <div className="report-kpi-val expense">
                −<Money value={expenses} />
              </div>
              <span className="report-kpi-sub">Total annualized expenses</span>
            </div>

            <div className="card report-kpi-card">
              <div className="report-kpi-header">
                <span className="report-kpi-label">Retained Capital</span>
                <div className="kpi-mini-icon brand">
                  <TrendingUp size={14} />
                </div>
              </div>
              <div
                className={`report-kpi-val ${
                  savings >= 0 ? "brand" : "expense"
                }`}
              >
                <Money value={savings} />
              </div>
              <span className="report-kpi-sub">Net retained savings balance</span>
            </div>

            <div className="card report-kpi-card">
              <div className="report-kpi-header">
                <span className="report-kpi-label">Annual Savings Rate</span>
                <div className="kpi-mini-icon brand">
                  <Sparkles size={14} />
                </div>
              </div>
              <div
                className={`report-kpi-val ${
                  annualSavingsRate >= 20 ? "income" : annualSavingsRate > 0 ? "brand" : "zero"
                }`}
              >
                {annualSavingsRate}%
              </div>
              <span className="report-kpi-sub">
                {annualSavingsRate >= 20 ? "Target benchmark achieved" : "Below 20% capital rate"}
              </span>
            </div>
          </div>

          {/* Category Breakdown Section */}
          <div className="report-breakdown-section">
            <div className="section-title-strip">
              <PieChart size={18} />
              <h3>Disbursement Breakdown by Category</h3>
            </div>

            {report.categories && report.categories.length > 0 ? (
              <div className="report-category-list">
                {report.categories.map((x) => {
                  const catAmount = Number(x.amount) || 0;
                  const catPercent = expenses > 0 ? ((catAmount / expenses) * 100).toFixed(1) : 0;

                  return (
                    <div key={x.category} className="report-category-row">
                      <div className="report-category-info">
                        <span className="report-category-name">{x.category}</span>
                        <span className="report-category-pct">{catPercent}% of total expenses</span>
                      </div>

                      <div className="report-category-progress">
                        <div className="progress progress-report">
                          <i
                            className="progress-fill"
                            style={{
                              width: `${Math.min(100, catPercent)}%`,
                              background: "var(--brand)",
                            }}
                          />
                        </div>
                      </div>

                      <div className="report-category-amount">
                        <Money value={catAmount} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState message="No category spending recorded for this fiscal year." />
            )}
          </div>

          {/* Transactions Preview Table */}
          {report.transactions && report.transactions.length > 0 && (
            <div className="report-transactions-section">
              <div className="section-title-strip">
                <ReceiptText size={18} />
                <h3>Audited Transactions Ledger Preview ({report.transactions.length} entries)</h3>
              </div>

              <div className="table-container">
                <table className="dense-financial-table">
                  <thead>
                    <tr>
                      <th style={{ width: "110px" }}>Date</th>
                      <th>Description</th>
                      <th style={{ width: "130px" }}>Category</th>
                      <th style={{ width: "100px" }}>Flow</th>
                      <th style={{ width: "130px", textAlign: "right" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.transactions.slice(0, 15).map((t, idx) => {
                      const isIncome = t.type === "Income";
                      return (
                        <tr key={t._id || idx} className="table-row">
                          <td className="table-date-cell">{formatDate(t.date)}</td>
                          <td className="table-desc-cell">
                            <span className="desc-text">{t.description}</span>
                          </td>
                          <td>
                            <span className="category-pill-tag">{t.category}</span>
                          </td>
                          <td>
                            <span className={`flow-badge ${isIncome ? "income" : "expense"}`}>
                              {isIncome ? "Inflow" : "Outflow"}
                            </span>
                          </td>
                          <td className="table-amount-cell">
                            <span className={`tabular-amount ${isIncome ? "income" : "expense"}`}>
                              {isIncome ? "+" : "−"}
                              <Money value={t.amount} />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {report.transactions.length > 15 && (
                <p className="ledger-preview-note">
                  Showing first 15 of {report.transactions.length} records. Download CSV or PDF for full ledger.
                </p>
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
}
