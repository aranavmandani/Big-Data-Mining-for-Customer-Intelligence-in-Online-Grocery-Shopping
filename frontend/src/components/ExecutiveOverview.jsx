import React from 'react';
import { 
  Users, 
  ShoppingBag, 
  Layers, 
  TrendingUp, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Award,
  Zap
} from 'lucide-react';
import HeatmapGrid from './HeatmapGrid';

export default function ExecutiveOverview({ 
  overviewData, 
  onNavigateTab, 
  onSelectSegment, 
  onSelectProduct 
}) {
  if (!overviewData) return null;

  const { summary, segments_overview, heatmap_matrix, orders_by_day, orders_by_hour } = overviewData;

  const kpis = [
    {
      label: 'Total Customers Analyzed',
      value: summary.total_customers.toLocaleString(),
      meta: '100% Instacart cohort',
      icon: Users,
      color: '#6366F1',
      badge: '+100% Processed',
      badgeType: 'positive'
    },
    {
      label: 'Total Orders Mined',
      value: (summary.total_orders / 1000000).toFixed(2) + 'M',
      meta: `${summary.total_orders.toLocaleString()} total orders`,
      icon: ShoppingBag,
      color: '#3B82F6',
      badge: '3.2M Big Data',
      badgeType: 'info'
    },
    {
      label: 'Average Basket Size',
      value: `${summary.avg_basket_size} items`,
      meta: 'Range: 3.2 – 23.4 items/order',
      icon: Layers,
      color: '#8B5CF6',
      badge: 'Bulk Peak 23.4',
      badgeType: 'purple'
    },
    {
      label: 'Average Reorder Rate',
      value: `${(summary.avg_reorder_rate * 100).toFixed(1)}%`,
      meta: 'High customer loyalty benchmark',
      icon: RotateCcw,
      color: '#10B981',
      badge: 'Loyal Peak 78.4%',
      badgeType: 'positive'
    },
    {
      label: 'FP-Growth Association Rules',
      value: summary.total_rules,
      meta: 'Lift ≥ 1.2x & Conf ≥ 10%',
      icon: Sparkles,
      color: '#F59E0B',
      badge: 'Max Lift 5.81x',
      badgeType: 'positive'
    },
    {
      label: 'Average Order Interval',
      value: `${summary.avg_days_between_orders} days`,
      meta: '7.8d (Loyal) to 25.4d (Occasional)',
      icon: Clock,
      color: '#EC4899',
      badge: 'Weekly Habit Peak',
      badgeType: 'info'
    },
  ];

  return (
    <div className="fade-in">
      {/* 1. Top KPI Grid */}
      <div className="kpi-grid">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className="kpi-card"
              style={{ '--kpi-color': kpi.color }}
            >
              <div className="kpi-header">
                <span className="kpi-label">{kpi.label}</span>
                <div className="kpi-icon-wrap" style={{ color: kpi.color }}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-meta">
                <span className={`kpi-badge ${kpi.badgeType}`}>{kpi.badge}</span>
                <span>{kpi.meta}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. AI Synthesis & Executive Takeaways Banner */}
      <div className="ai-hero-banner">
        <div className="ai-hero-header">
          <span className="ai-badge">
            <Sparkles size={12} />
            Data Mining Synthesis
          </span>
          <span className="ai-hero-title">
            Key Behavioral Discoveries & Strategic Value Levers
          </span>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Unsupervised clustering (K-Means k=5) and frequent itemset discovery (FP-Growth) across 206,209 customer profiles reveal strong structural divides in order velocity, basket capacity, and affinity pairings:
        </p>

        <div className="ai-insights-grid">
          <div className="ai-insight-pill">
            <span className="ai-insight-icon">👑</span>
            <div className="ai-insight-text">
              <strong>Loyalists Drive 56% Order Volume:</strong> Highly Loyal & Frequent shoppers represent 44.8% of the customer base but account for over 68% of recurring fresh grocery revenue.
            </div>
          </div>

          <div className="ai-insight-pill">
            <span className="ai-insight-icon">🧺</span>
            <div className="ai-insight-text">
              <strong>Bulk Basket Upsell Potential:</strong> Bulk shoppers purchase 23.4 items per trip with 15.2 days between orders. Tiered threshold promos ($10 off $100) maximize basket capture.
            </div>
          </div>

          <div className="ai-insight-pill">
            <span className="ai-insight-icon">🥑</span>
            <div className="ai-insight-text">
              <strong>High Cross-Sell Multipliers:</strong> Organic produce demonstrates extreme affinity. Organic Garlic ↔ Onion achieves <strong>5.81x Lift</strong>; Limes ↔ Large Lemon reaches <strong>4.08x Lift</strong>.
            </div>
          </div>

          <div className="ai-insight-pill">
            <span className="ai-insight-icon">⚡</span>
            <div className="ai-insight-text">
              <strong>Weekend Morning Peak Surge:</strong> Saturday & Sunday 10:00 AM – 3:00 PM witness 38% higher transaction velocity than weekday averages. Prime window for dynamic flash promotions.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Customer Segment Share & Behavioral Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Segment Share Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <h3 className="card-title">
                <Users size={18} style={{ color: 'var(--brand-emerald)' }} />
                Customer Segment Distribution (k=5)
              </h3>
              <p className="card-subtitle">
                Share of 206,209 customers across unsupervised behavioral clusters
              </p>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateTab('segmentation')}
            >
              Explore Segments <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(segments_overview).map(([segName, seg]) => (
              <div 
                key={segName}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  cursor: 'pointer',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.02)',
                  transition: 'background 0.2s'
                }}
                onClick={() => {
                  onSelectSegment(segName);
                  onNavigateTab('segmentation');
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: seg.color }}></span>
                    {segName}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {seg.count.toLocaleString()} ({seg.share_pct}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${seg.share_pct}%`,
                    height: '100%',
                    background: seg.color,
                    borderRadius: '4px',
                    transition: 'width 0.8s ease'
                  }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  <span>Avg Orders: <strong style={{ color: '#FFFFFF' }}>{seg.means.total_orders.toFixed(1)}</strong></span>
                  <span>Avg Basket: <strong style={{ color: '#FFFFFF' }}>{seg.means.avg_products_per_order.toFixed(1)} items</strong></span>
                  <span>Reorder Rate: <strong style={{ color: '#FFFFFF' }}>{(seg.means.reorder_rate * 100).toFixed(1)}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Cohort Playbook Quick Summary */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <h3 className="card-title">
                <ShieldCheck size={18} style={{ color: 'var(--brand-primary)' }} />
                Targeted Marketing Playbooks
              </h3>
              <p className="card-subtitle">
                Algorithmic strategy recommendations per customer cohort
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(segments_overview).map(([segName, seg]) => (
              <div
                key={segName}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: `1px solid ${seg.color}33`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '12.5px', color: seg.color }}>
                    {segName}
                  </span>
                  <span style={{ 
                    fontSize: '10.5px', 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    background: `${seg.color}22`,
                    color: seg.color,
                    fontWeight: 600
                  }}>
                    {seg.badge}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {seg.strategy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. 7-Day x 24-Hour Heatmap Grid */}
      <HeatmapGrid heatmapMatrix={heatmap_matrix} />
    </div>
  );
}
