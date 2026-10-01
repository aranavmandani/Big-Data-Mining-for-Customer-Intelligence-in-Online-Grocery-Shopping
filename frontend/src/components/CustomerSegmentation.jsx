import React, { useState } from 'react';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Crown, 
  Boxes, 
  ShoppingBag, 
  UserX, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Filter,
  BarChart3
} from 'lucide-react';
import ScatterPlotCanvas from './ScatterPlotCanvas';

export default function CustomerSegmentation({ 
  segmentsData, 
  selectedSegment, 
  setSelectedSegment, 
  onNavigateTab 
}) {
  if (!segmentsData) return null;

  const { segments, comparison_table, scatter_sample } = segmentsData;
  const activeSegKey = selectedSegment || 'Highly Loyal Customers';
  const activeSeg = segments[activeSegKey] || segments['Highly Loyal Customers'];

  const getSegmentIcon = (name) => {
    switch (name) {
      case 'Highly Loyal Customers': return Crown;
      case 'Frequent Customers': return TrendingUp;
      case 'Bulk Basket Customers': return Boxes;
      case 'Regular Customers': return ShoppingBag;
      case 'Occasional Customers': return UserX;
      default: return Users;
    }
  };

  return (
    <div className="fade-in">
      {/* 1. 5-Segment Selection Cards */}
      <div className="segment-cards-grid">
        {Object.entries(segments).map(([name, seg]) => {
          const Icon = getSegmentIcon(name);
          const isSelected = activeSegKey === name;
          return (
            <div
              key={name}
              className={`segment-card ${isSelected ? 'active' : ''}`}
              style={{ '--card-accent': seg.color }}
              onClick={() => setSelectedSegment(name)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-sm)',
                  background: `${seg.color}22`,
                  color: seg.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={18} />
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: seg.color,
                  padding: '3px 8px',
                  borderRadius: '12px',
                  background: `${seg.color}15`,
                  border: `1px solid ${seg.color}33`
                }}>
                  {seg.badge}
                </span>
              </div>

              <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                {name}
              </h4>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '10px' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-main)' }}>
                  {seg.count.toLocaleString()}
                </span>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  ({seg.share_pct}% base)
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <div>Orders: <strong style={{ color: '#FFF' }}>{seg.means.total_orders}</strong></div>
                <div>Basket: <strong style={{ color: '#FFF' }}>{seg.means.avg_products_per_order}</strong></div>
                <div>Reorder: <strong style={{ color: '#FFF' }}>{(seg.means.reorder_rate * 100).toFixed(0)}%</strong></div>
                <div>Gap: <strong style={{ color: '#FFF' }}>{seg.means.avg_days_between_orders}d</strong></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Deep Active Segment Profile Spotlight */}
      <div className="card" style={{ marginBottom: '24px', borderLeft: `4px solid ${activeSeg.color}` }}>
        <div className="card-header">
          <div className="card-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                background: `${activeSeg.color}22`,
                color: activeSeg.color,
                border: `1px solid ${activeSeg.color}44`
              }}>
                Cluster #{activeSeg.cluster_id} Focus
              </span>
              <h3 className="card-title" style={{ color: '#FFFFFF', margin: 0 }}>
                {activeSeg.name} Profile & Strategic Value
              </h3>
            </div>
            <p className="card-subtitle" style={{ marginTop: '4px' }}>
              {activeSeg.persona_summary}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Churn Probability</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: activeSeg.color }}>
                {activeSeg.churn_risk}
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Playbook Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px', marginTop: '10px' }}>
          {/* Business Strategy */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🎯 Recommended Marketing Strategy
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
              {activeSeg.strategy}
            </p>
          </div>

          {/* Actionable Playbook Tactics */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-emerald)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⚡ Actionable Growth Levers
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {activeSeg.key_tactics.map((tactic, idx) => (
                <li key={idx} style={{ fontSize: '12.5px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle2 size={15} style={{ color: activeSeg.color, flexShrink: 0, marginTop: '2px' }} />
                  <span>{tactic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top Product Affinities for this Segment */}
        {activeSeg.top_products && activeSeg.top_products.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={15} style={{ color: 'var(--brand-amber)' }} />
              Top Characteristic Products for {activeSeg.name} (High Lift vs Overall Baseline)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {activeSeg.top_products.slice(0, 5).map((prod, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '12.5px', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {prod.product_name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>Purchases: <strong style={{ color: '#FFF' }}>{prod.purchase_count.toLocaleString()}</strong></span>
                    <span>
                      Lift: <strong style={{ color: prod.lift_vs_overall > 1 ? 'var(--brand-emerald)' : 'var(--text-muted)' }}>
                        {prod.lift_vs_overall}x
                      </strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. 2D Interactive Cluster Scatter Plot */}
      <div style={{ marginBottom: '24px' }}>
        <ScatterPlotCanvas 
          scatterData={scatter_sample} 
          selectedSegment={activeSegKey}
          onSelectSegment={setSelectedSegment}
        />
      </div>

      {/* 4. Complete Segment Behavioral Comparison Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <h3 className="card-title">
              <BarChart3 size={18} style={{ color: 'var(--brand-cyan)' }} />
              Comprehensive K-Means Cluster Characteristics Table
            </h3>
            <p className="card-subtitle">
              Mathematical feature means computed across all 206,209 customer profiles
            </p>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Segment</th>
                <th>Population</th>
                <th>Share (%)</th>
                <th>Avg Total Orders</th>
                <th>Avg Total Products</th>
                <th>Avg Basket Size</th>
                <th>Reorder Rate</th>
                <th>Days Between Orders</th>
                <th>Strategic Tier</th>
              </tr>
            </thead>
            <tbody>
              {comparison_table.map((row) => (
                <tr 
                  key={row.segment}
                  style={{
                    background: activeSegKey === row.segment ? 'rgba(99, 102, 241, 0.1)' : undefined,
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedSegment(row.segment)}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: row.color }}></span>
                      <strong style={{ color: '#FFFFFF' }}>{row.segment}</strong>
                    </div>
                  </td>
                  <td className="table-mono">{row.customers.toLocaleString()}</td>
                  <td className="table-mono">{row.share_pct}%</td>
                  <td className="table-mono" style={{ color: 'var(--brand-cyan)' }}>{row.total_orders.toFixed(1)}</td>
                  <td className="table-mono">{row.total_products.toFixed(1)}</td>
                  <td className="table-mono" style={{ color: 'var(--brand-amber)' }}>{row.avg_products_per_order.toFixed(1)} items</td>
                  <td className="table-mono" style={{ color: 'var(--brand-emerald)' }}>{row.reorder_rate}%</td>
                  <td className="table-mono">{row.avg_days_between_orders.toFixed(1)} days</td>
                  <td>
                    <span style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '10px',
                      background: `${row.color}18`,
                      color: row.color,
                      fontWeight: 600
                    }}>
                      {row.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
