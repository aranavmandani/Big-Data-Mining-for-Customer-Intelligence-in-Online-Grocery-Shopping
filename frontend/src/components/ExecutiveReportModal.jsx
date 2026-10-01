import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  Sparkles, 
  CheckCircle2,
  Database,
  Users
} from 'lucide-react';

export default function ExecutiveReportModal({ 
  isOpen, 
  onClose, 
  overviewData, 
  segmentsData, 
  rulesData 
}) {
  if (!isOpen) return null;

  const { summary, segments_overview } = overviewData || {};
  const { comparison_table } = segmentsData || {};
  const { rules } = rulesData || {};

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!comparison_table) return;
    const headers = ["Segment", "Customers", "Share_Pct", "Avg_Orders", "Avg_Basket", "Reorder_Rate_Pct", "Days_Between_Orders", "Tier", "Churn_Risk"];
    const rows = comparison_table.map((r) => [
      `"${r.segment}"`,
      r.customers,
      r.share_pct,
      r.total_orders,
      r.avg_products_per_order,
      r.reorder_rate,
      r.avg_days_between_orders,
      `"${r.tier}"`,
      `"${r.churn_risk}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "DMT_Customer_Intelligence_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF'
            }}>
              <FileText size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Executive Intelligence Briefing
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0 }}>
                Data Mining Techniques (DMT) Comprehensive Summary Report
              </p>
            </div>
          </div>

          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Executive Overview Box */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--brand-cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>
              <Sparkles size={14} /> Executive Summary
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
              Analysis of <strong>206,209 customer profiles</strong> and <strong>3,214,874 orders</strong> utilizing unsupervised K-Means clustering (k=5) and FP-Growth association rules mining (Lift ≥ 1.2x). Identifies distinct customer lifetime value tiers and high-yield cross-sell affinity pairs.
            </p>
          </div>

          {/* Core Metrics Table */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
              1. Customer Segment Behavioral Benchmark (k=5)
            </h4>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Segment</th>
                    <th>Customers</th>
                    <th>Share</th>
                    <th>Avg Orders</th>
                    <th>Avg Basket</th>
                    <th>Reorder %</th>
                    <th>Interval</th>
                    <th>Churn Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison_table?.map((r) => (
                    <tr key={r.segment}>
                      <td><strong style={{ color: '#FFF' }}>{r.segment}</strong></td>
                      <td className="table-mono">{r.customers.toLocaleString()}</td>
                      <td className="table-mono">{r.share_pct}%</td>
                      <td className="table-mono">{r.total_orders.toFixed(1)}</td>
                      <td className="table-mono">{r.avg_products_per_order.toFixed(1)}</td>
                      <td className="table-mono">{r.reorder_rate}%</td>
                      <td className="table-mono">{r.avg_days_between_orders.toFixed(1)}d</td>
                      <td><span style={{ color: r.color, fontWeight: 600 }}>{r.churn_risk}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Association Rules */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
              2. Top Discovered Cross-Sell Associations (FP-Growth)
            </h4>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Antecedent</th>
                    <th>Consequent</th>
                    <th>Lift</th>
                    <th>Confidence</th>
                    <th>Support</th>
                  </tr>
                </thead>
                <tbody>
                  {rules?.slice(0, 6).map((r) => (
                    <tr key={r.id}>
                      <td><strong style={{ color: '#FFF' }}>{r.antecedent}</strong></td>
                      <td><strong style={{ color: '#FFF' }}>{r.consequent}</strong></td>
                      <td><strong style={{ color: 'var(--brand-amber)' }}>{r.lift.toFixed(2)}x</strong></td>
                      <td className="table-mono">{(r.confidence * 100).toFixed(1)}%</td>
                      <td className="table-mono">{(r.support * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategic Marketing Recommendations */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
              3. Strategic Marketing Actions
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--brand-emerald)', fontSize: '12.5px' }}>VIP Loyalty Retention:</strong>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Protect 31.8% Highly Loyal shoppers with express delivery perks and early organic access.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--brand-violet)', fontSize: '12.5px' }}>Bulk Stocker Capture:</strong>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Capture large baskets (23.4 items) via $10 off $100+ order thresholds and wholesale family packs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <Download size={14} />
            Export CSV
          </button>
          <button className="btn btn-primary btn-sm" onClick={handlePrint}>
            <Printer size={14} />
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}
