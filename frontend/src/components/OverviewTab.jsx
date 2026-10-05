import React from 'react';
import { 
  Users, 
  ShoppingBag, 
  Layers, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Cpu,
  GitFork
} from 'lucide-react';

export default function OverviewTab({ overviewData, onNavigateTab }) {
  if (!overviewData) return null;

  const { summary, segments_overview, orders_by_day } = overviewData;

  const metrics = [
    {
      label: 'Total Customers',
      value: summary.total_customers.toLocaleString(),
      sub: 'Unique customer user IDs',
      icon: Users,
      color: '#3B82F6'
    },
    {
      label: 'Total Orders',
      value: (summary.total_orders).toLocaleString(),
      sub: 'Completed transactions',
      icon: ShoppingBag,
      color: '#10B981'
    },
    {
      label: 'Avg Products / Order',
      value: summary.avg_basket_size,
      sub: 'Average basket size',
      icon: Layers,
      color: '#8B5CF6'
    },
    {
      label: 'Avg Reorder Rate',
      value: `${(summary.avg_reorder_rate * 100).toFixed(1)}%`,
      sub: 'Repeat purchase ratio',
      icon: RotateCcw,
      color: '#F59E0B'
    },
    {
      label: 'Association Rules',
      value: summary.total_rules,
      sub: 'FP-Growth discovered rules',
      icon: Sparkles,
      color: '#EC4899'
    },
  ];

  return (
    <div>
      {/* 1. Top 5 Key Metric Cards */}
      <div className="metrics-grid">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="metric-card" style={{ '--card-color': m.color }}>
              <div className="metric-header">
                <span className="metric-label">{m.label}</span>
                <div className="metric-icon-wrap">
                  <Icon size={18} />
                </div>
              </div>
              <div className="metric-value">{m.value}</div>
              <div className="metric-sub">{m.sub}</div>
            </div>
          );
        })}
      </div>

      {/* 2. Welcome & Project Summary Banner */}
      <div className="card">
        <h3 className="card-title">
          <Sparkles size={18} style={{ color: '#3B82F6' }} />
          Project Overview: Big Data Mining for Customer Intelligence in Online Grocery Shopping
        </h3>
        <p className="card-subtitle">
          Data Mining Techniques (DMT) Dashboard for Customer Segmentation, Product Analytics, Purchasing Behavior, and Market Basket Recommendations
        </p>

        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
          This project analyzes the <strong>Instacart Online Grocery Shopping Dataset</strong> containing over <strong>3.2 million orders</strong> from <strong>206,209 customers</strong>. Using unsupervised machine learning (<strong>K-Means Clustering</strong>) and frequent pattern mining (<strong>FP-Growth Algorithm & Association Rules</strong>), we segment shoppers into distinct behavioral cohorts and generate real-time product recommendations.
        </p>

        {/* 3 Core Algorithms Quick Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Users size={16} /> 1. K-Means Clustering (k=5)
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
              Segments 206,209 customers into 5 actionable groups based on order count, basket size, reorder rate, and order interval.
            </p>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <GitFork size={16} /> 2. FP-Growth Mining
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
              Discovers frequent item combinations from a 1,000,000 order sample with a minimum support threshold of 0.5%.
            </p>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Sparkles size={16} /> 3. Association Rules
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
              Generates high-lift cross-sell recommendations with Lift ≥ 1.2x and Confidence ≥ 10%.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Customer Segments Overview Card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 className="card-title" style={{ margin: 0 }}>
              <Users size={18} style={{ color: '#10B981' }} />
              Customer Segments Breakdown
            </h3>
            <p className="card-subtitle" style={{ margin: 0 }}>
              Distribution of 206,209 customers across 5 clusters
            </p>
          </div>
          <button className="btn btn-outline" onClick={() => onNavigateTab('segments')}>
            View Detailed Segments →
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(segments_overview).map(([name, seg]) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  {name}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {seg.count.toLocaleString()} customers ({seg.share_pct}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${seg.share_pct}%`, height: '100%', background: seg.color, borderRadius: '4px' }}></div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {seg.strategy}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
