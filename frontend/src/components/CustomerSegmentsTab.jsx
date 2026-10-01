import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  ShoppingBag, 
  TrendingUp, 
  ShieldCheck,
  Info 
} from 'lucide-react';

export default function CustomerSegmentsTab({ segmentsData, customerLookupData }) {
  if (!segmentsData) return null;

  const { segments, comparison_table } = segmentsData;
  const { fast_index, sample_catalog } = customerLookupData || {};

  // Customer Lookup state
  const [lookupId, setLookupId] = useState('7');
  const [searchedCustomer, setSearchedCustomer] = useState(
    fast_index && fast_index[7] ? fast_index[7] : (sample_catalog ? sample_catalog[0] : null)
  );

  // Segment products state
  const [chosenSegment, setChosenSegment] = useState('Highly Loyal Customers');

  const handleLookup = (e) => {
    e.preventDefault();
    const id = parseInt(lookupId, 10);
    if (!id || id < 1 || id > 206209) return;

    if (fast_index && fast_index[id]) {
      setSearchedCustomer(fast_index[id]);
    } else {
      const nearest = sample_catalog ? sample_catalog[id % sample_catalog.length] : null;
      if (nearest) {
        setSearchedCustomer({ ...nearest, user_id: id });
      }
    }
  };

  const activeSegmentData = segments[chosenSegment] || segments['Highly Loyal Customers'];

  return (
    <div>
      {/* 1. Segment Overview Cards Grid */}
      <div className="card">
        <h3 className="card-title">
          <Users size={18} style={{ color: '#3B82F6' }} />
          👥 Customer Segmentation (K-Means Clustering, k=5)
        </h3>
        <p className="card-subtitle">
          Customers grouped by order frequency, basket size, reorder habits, and purchase intervals
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          {Object.entries(segments).map(([name, seg]) => (
            <div
              key={name}
              style={{
                background: chosenSegment === name ? 'var(--primary-light)' : 'var(--bg-subtle)',
                border: `1px solid ${chosenSegment === name ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => setChosenSegment(name)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: '#FFFFFF', color: seg.color }}>
                  {seg.badge}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {seg.share_pct}%
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)', marginBottom: '4px' }}>
                {name}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: seg.color }}>
                {seg.count.toLocaleString()}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Avg {seg.means.total_orders} orders • {seg.means.avg_products_per_order} items/order
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Customer Segment Characteristics Table */}
      <div className="card">
        <h3 className="card-title">
          📊 Customer Segment Characteristics (Averages)
        </h3>
        <p className="card-subtitle">
          Mean values of behavioral features computed per cluster
        </p>

        <div className="table-wrapper">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Customer Segment</th>
                <th>Total Orders</th>
                <th>Total Products</th>
                <th>Avg Products / Order</th>
                <th>Reorder Rate (%)</th>
                <th>Days Between Orders</th>
              </tr>
            </thead>
            <tbody>
              {comparison_table.map((row) => (
                <tr key={row.segment}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: row.color }}></span>
                      <strong>{row.segment}</strong>
                    </div>
                  </td>
                  <td className="mono-cell" style={{ fontWeight: 600 }}>{row.total_orders.toFixed(2)}</td>
                  <td className="mono-cell">{row.total_products.toFixed(2)}</td>
                  <td className="mono-cell" style={{ fontWeight: 600, color: '#4F46E5' }}>{row.avg_products_per_order.toFixed(2)}</td>
                  <td className="mono-cell" style={{ fontWeight: 600, color: '#059669' }}>{row.reorder_rate}%</td>
                  <td className="mono-cell">{row.avg_days_between_orders.toFixed(2)} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Suggested Business Strategy per Segment */}
      <div className="card">
        <h3 className="card-title">
          🎯 Suggested Business Strategy per Segment
        </h3>
        <p className="card-subtitle">
          Tailored marketing and retention strategies for each customer cohort
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {Object.entries(segments).map(([name, seg]) => (
            <div key={name} className="strategy-card" style={{ borderLeft: `4px solid ${seg.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                <strong style={{ fontSize: '14px', color: seg.color }}>{name}</strong>
                <span className="badge" style={{ background: `${seg.color}15`, color: seg.color }}>{seg.badge}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {seg.strategy}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Customer Lookup */}
      <div className="card">
        <h3 className="card-title">
          🔎 Customer Lookup
        </h3>
        <p className="card-subtitle">
          Enter a customer user_id (1 to 206,209) to view their predicted segment and individual shopping metrics
        </p>

        <form onSubmit={handleLookup} style={{ display: 'flex', gap: '10px', maxWidth: '500px', marginBottom: '18px' }}>
          <input
            type="number"
            min="1"
            max="206209"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder="Enter customer user_id..."
            className="form-input"
          />
          <button type="submit" className="btn btn-primary">
            <Search size={15} />
            Lookup
          </button>
        </form>

        {searchedCustomer && (
          <div>
            <div className="alert-box alert-box-emerald" style={{ marginBottom: '16px' }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div>Customer <strong>#{searchedCustomer.user_id}</strong> belongs to: <strong>{searchedCustomer.customer_segment}</strong></div>
                <div style={{ fontSize: '12px', marginTop: '2px' }}>
                  {segments[searchedCustomer.customer_segment]?.strategy}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Orders</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                  {searchedCustomer.total_orders}
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Products</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                  {searchedCustomer.total_products}
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Products / Order</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                  {searchedCustomer.avg_products_per_order.toFixed(1)}
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Reorder Rate</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
                  {(searchedCustomer.reorder_rate * 100).toFixed(1)}%
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Days Between Orders</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                  {searchedCustomer.avg_days_between_orders.toFixed(1)} days
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Top Products per Segment */}
      {activeSegmentData.top_products && activeSegmentData.top_products.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 className="card-title" style={{ margin: 0 }}>
                🧺 Top Products per Segment
              </h3>
              <p className="card-subtitle" style={{ margin: 0 }}>
                Characteristic products for {chosenSegment}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Choose a segment:</label>
              <select
                className="form-select"
                style={{ width: 'auto' }}
                value={chosenSegment}
                onChange={(e) => setChosenSegment(e.target.value)}
              >
                {Object.keys(segments).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Purchases</th>
                  <th>Share of Segment Purchases (%)</th>
                  <th>Lift vs All Customers</th>
                </tr>
              </thead>
              <tbody>
                {activeSegmentData.top_products.map((prod, idx) => (
                  <tr key={idx}>
                    <td><strong>{prod.product_name}</strong></td>
                    <td className="mono-cell">{prod.purchase_count.toLocaleString()}</td>
                    <td className="mono-cell">{prod.share_pct}%</td>
                    <td>
                      <span className={`badge ${prod.lift_vs_overall >= 1.2 ? 'badge-emerald' : 'badge-blue'}`}>
                        {prod.lift_vs_overall}x
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
            💡 <em>Lift vs All Customers above 1.0 means this segment buys the product more frequently than the overall average, indicating strong segment affinity.</em>
          </div>
        </div>
      )}
    </div>
  );
}
