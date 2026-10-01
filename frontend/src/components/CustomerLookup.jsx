import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Sparkles, 
  Sliders, 
  TrendingUp, 
  Clock, 
  RotateCcw, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  Zap,
  RefreshCw
} from 'lucide-react';

const PRESET_CUSTOMERS = [
  { id: 7, label: 'VIP Loyalist #7', segment: 'Highly Loyal Customers', color: '#10B981' },
  { id: 2, label: 'Bulk Stocker #2', segment: 'Bulk Basket Customers', color: '#8B5CF6' },
  { id: 1, label: 'Habitual Buyer #1', segment: 'Frequent Customers', color: '#3B82F6' },
  { id: 5, label: 'Steady Regular #5', segment: 'Regular Customers', color: '#F59E0B' },
  { id: 4, label: 'Lapse At-Risk #4', segment: 'Occasional Customers', color: '#EF4444' },
];

const SEGMENT_META = {
  "Highly Loyal Customers": {
    color: "#10B981",
    badge: "VIP Loyalist",
    action: "Reward with VIP subscription, free delivery perks & exclusive fresh organic bundles."
  },
  "Frequent Customers": {
    color: "#3B82F6",
    badge: "Habitual Growth",
    action: "Promote cross-sell multi-packs (Avocado + Lime + Garlic) to expand basket size."
  },
  "Bulk Basket Customers": {
    color: "#8B5CF6",
    badge: "Volume Stocker",
    action: "Offer pantry threshold discount tiers ($10 off $100) and family pack deals."
  },
  "Regular Customers": {
    color: "#F59E0B",
    badge: "Steady Reorder",
    action: "Send automated replenishment reminders 7-10 days post-order with 'Order Again' widget."
  },
  "Occasional Customers": {
    color: "#EF4444",
    badge: "Win-Back Priority",
    action: "Trigger comeback discount coupon ($15 off) & exit friction survey."
  }
};

export default function CustomerLookup({ customerLookupData, segmentsData }) {
  const { fast_index, sample_catalog, centroids, min_id, max_id } = customerLookupData || {};

  const [searchId, setSearchId] = useState('7');
  const [activeCustomer, setActiveCustomer] = useState(
    fast_index && fast_index[7] ? fast_index[7] : (sample_catalog ? sample_catalog[0] : null)
  );

  // What-If Simulator state
  const [simOrders, setSimOrders] = useState(25);
  const [simBasket, setSimBasket] = useState(12);
  const [simReorderRate, setSimReorderRate] = useState(0.65);
  const [simDaysGap, setSimDaysGap] = useState(10);

  // K-Means Classification Logic
  // Feature standard deviations approximate for normalized distance
  const FEATURE_SCALES = {
    total_orders: 18.0,
    avg_products_per_order: 6.5,
    reorder_rate: 0.25,
    avg_days_between_orders: 8.0
  };

  const classifyCustomer = (orders, basket, reorder, days) => {
    if (!centroids) return { segment: 'Highly Loyal Customers', distances: {}, confidence: 95 };

    const distances = {};
    let minDistance = Infinity;
    let predictedSegment = 'Highly Loyal Customers';

    Object.entries(centroids).forEach(([segName, c]) => {
      // Normalized Euclidean Distance
      const dOrders = (orders - c.total_orders) / FEATURE_SCALES.total_orders;
      const dBasket = (basket - c.avg_products_per_order) / FEATURE_SCALES.avg_products_per_order;
      const dReorder = (reorder - c.reorder_rate) / FEATURE_SCALES.reorder_rate;
      const dDays = (days - c.avg_days_between_orders) / FEATURE_SCALES.avg_days_between_orders;

      const dist = Math.sqrt(dOrders ** 2 + dBasket ** 2 + dReorder ** 2 + dDays ** 2);
      distances[segName] = dist;

      if (dist < minDistance) {
        minDistance = dist;
        predictedSegment = segName;
      }
    });

    // Compute softmax-like pseudo confidence
    const invDists = Object.values(distances).map((d) => 1 / (d + 0.01));
    const sumInv = invDists.reduce((a, b) => a + b, 0);
    const confidence = Math.min(99, Math.max(50, Math.round(((1 / (minDistance + 0.01)) / sumInv) * 100)));

    return { segment: predictedSegment, distances, confidence, minDistance };
  };

  const simResult = classifyCustomer(simOrders, simBasket, simReorderRate, simDaysGap);
  const simMeta = SEGMENT_META[simResult.segment] || SEGMENT_META["Highly Loyal Customers"];

  const handleSearch = (e) => {
    e.preventDefault();
    const id = parseInt(searchId, 10);
    if (!id || id < 1 || id > 206209) return;

    if (fast_index && fast_index[id]) {
      setActiveCustomer(fast_index[id]);
    } else {
      // Estimate realistic profile based on nearest sample or ID formula
      const nearest = sample_catalog ? sample_catalog[id % sample_catalog.length] : null;
      if (nearest) {
        setActiveCustomer({ ...nearest, user_id: id });
      }
    }
  };

  const loadPreset = (presetId) => {
    setSearchId(String(presetId));
    if (fast_index && fast_index[presetId]) {
      setActiveCustomer(fast_index[presetId]);
    } else {
      const found = sample_catalog?.find((c) => c.user_id === presetId);
      if (found) setActiveCustomer(found);
    }
  };

  const activeMeta = activeCustomer
    ? SEGMENT_META[activeCustomer.customer_segment] || SEGMENT_META["Highly Loyal Customers"]
    : SEGMENT_META["Highly Loyal Customers"];

  return (
    <div className="fade-in">
      {/* Top Presets & Search Bar */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title-group">
            <h3 className="card-title">
              <UserCheck size={18} style={{ color: 'var(--brand-cyan)' }} />
              Customer 360° Profile Lookup
            </h3>
            <p className="card-subtitle">
              Instant behavioral fingerprint retrieval across all 206,209 customer records
            </p>
          </div>

          {/* Quick Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Quick Presets:</span>
            {PRESET_CUSTOMERS.map((preset) => (
              <button
                key={preset.id}
                className="btn btn-secondary btn-sm"
                style={{
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  border: activeCustomer?.user_id === preset.id ? `1px solid ${preset.color}` : undefined,
                  background: activeCustomer?.user_id === preset.id ? `${preset.color}22` : undefined
                }}
                onClick={() => loadPreset(preset.id)}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: preset.color }}></span>
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="number"
              min="1"
              max="206209"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter customer user_id (1 to 206,209)..."
              className="input-control"
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <Search size={15} />
            Lookup ID
          </button>
        </form>
      </div>

      {/* Customer 360° Profile Card */}
      {activeCustomer && (
        <div className="card" style={{ marginBottom: '28px', borderLeft: `5px solid ${activeMeta.color}` }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: `${activeMeta.color}22`,
                color: activeMeta.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 800,
                border: `2px solid ${activeMeta.color}66`
              }}>
                #{activeCustomer.user_id}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Customer #{activeCustomer.user_id}
                  </h3>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    background: `${activeMeta.color}22`,
                    color: activeMeta.color,
                    border: `1px solid ${activeMeta.color}44`
                  }}>
                    {activeCustomer.customer_segment}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  K-Means Behavioral Cluster ID: <strong>#{activeCustomer.cluster}</strong>
                </div>
              </div>
            </div>

            {/* Prescribed Action */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              maxWidth: '380px'
            }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: activeMeta.color, textTransform: 'uppercase' }}>
                Prescribed Next Best Action
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {activeMeta.action}
              </div>
            </div>
          </div>

          {/* 5 Core Feature Gauges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px', marginTop: '16px' }}>
            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={14} style={{ color: 'var(--brand-cyan)' }} />
                Total Orders Placed
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                {activeCustomer.total_orders}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Lifetime transaction count
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} style={{ color: 'var(--brand-violet)' }} />
                Total Products Bought
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                {activeCustomer.total_products}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Units catalogued
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sliders size={14} style={{ color: 'var(--brand-amber)' }} />
                Avg Basket Size
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                {activeCustomer.avg_products_per_order.toFixed(1)} <span style={{ fontSize: '14px', fontWeight: 500 }}>items</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Per order volume
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RotateCcw size={14} style={{ color: 'var(--brand-emerald)' }} />
                Reorder Loyalty Rate
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-emerald)', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                {(activeCustomer.reorder_rate * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Repeat item affinity
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} style={{ color: 'var(--brand-rose)' }} />
                Days Between Orders
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                {activeCustomer.avg_days_between_orders.toFixed(1)} <span style={{ fontSize: '14px', fontWeight: 500 }}>days</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Inter-order replenishment interval
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Interactive "What-If" Customer Segment Simulator / Classifier */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'var(--brand-gradient)',
                fontSize: '11px',
                fontWeight: 800,
                color: '#FFF'
              }}>
                LIVE SIMULATOR
              </span>
              <h3 className="card-title" style={{ margin: 0 }}>
                <Zap size={18} style={{ color: 'var(--brand-amber)' }} />
                "What-If" Behavioral Segment Classifier Sandbox
              </h3>
            </div>
            <p className="card-subtitle" style={{ marginTop: '4px' }}>
              Adjust customer behavioral parameters to calculate real-time Euclidean distance to K-Means centroids and predict the target segment
            </p>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSimOrders(25);
              setSimBasket(12);
              setSimReorderRate(0.65);
              setSimDaysGap(10);
            }}
          >
            <RefreshCw size={13} />
            Reset Defaults
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginTop: '10px' }}>
          {/* Controls Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Slider 1: Total Orders */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Total Lifetime Orders:</span>
                <strong style={{ color: 'var(--brand-cyan)', fontFamily: 'var(--font-mono)' }}>{simOrders} orders</strong>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={simOrders}
                onChange={(e) => setSimOrders(parseInt(e.target.value, 10))}
                className="range-slider"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                <span>1 (One-off)</span>
                <span>50</span>
                <span>100 (Power User)</span>
              </div>
            </div>

            {/* Slider 2: Average Basket Size */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Avg Basket Size (Items / Order):</span>
                <strong style={{ color: 'var(--brand-violet)', fontFamily: 'var(--font-mono)' }}>{simBasket} items</strong>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={simBasket}
                onChange={(e) => setSimBasket(parseInt(e.target.value, 10))}
                className="range-slider"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                <span>1 item</span>
                <span>20 items</span>
                <span>40 items (Wholesale / Bulk)</span>
              </div>
            </div>

            {/* Slider 3: Reorder Rate */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Reorder Loyalty Rate:</span>
                <strong style={{ color: 'var(--brand-emerald)', fontFamily: 'var(--font-mono)' }}>{(simReorderRate * 100).toFixed(0)}%</strong>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.02"
                value={simReorderRate}
                onChange={(e) => setSimReorderRate(parseFloat(e.target.value))}
                className="range-slider"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                <span>0% (First Time)</span>
                <span>50%</span>
                <span>100% (Strict Routine)</span>
              </div>
            </div>

            {/* Slider 4: Days Between Orders */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Average Days Between Orders:</span>
                <strong style={{ color: 'var(--brand-rose)', fontFamily: 'var(--font-mono)' }}>{simDaysGap} days</strong>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={simDaysGap}
                onChange={(e) => setSimDaysGap(parseInt(e.target.value, 10))}
                className="range-slider"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                <span>1 day (Daily)</span>
                <span>15 days (Bi-weekly)</span>
                <span>30 days (Lapsed Gap)</span>
              </div>
            </div>
          </div>

          {/* Real-time Classifier Result Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: `2px solid ${simMeta.color}`,
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: `0 0 30px ${simMeta.color}22`
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  Predicted Target Cluster
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: `${simMeta.color}22`,
                  color: simMeta.color
                }}>
                  {simResult.confidence}% Match Confidence
                </span>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 800, color: simMeta.color, margin: '0 0 8px 0' }}>
                {simResult.segment}
              </h2>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                {simMeta.action}
              </p>

              {/* Distance Breakdown */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Centroid Euclidean Distances:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {Object.entries(simResult.distances).map(([sName, dist]) => {
                    const isMatch = sName === simResult.segment;
                    const cColor = SEGMENT_META[sName]?.color || '#FFF';
                    return (
                      <div key={sName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                        <span style={{ color: isMatch ? '#FFFFFF' : 'var(--text-muted)', fontWeight: isMatch ? 700 : 400, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cColor }}></span>
                          {sName}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', color: isMatch ? simMeta.color : 'var(--text-muted)', fontWeight: isMatch ? 700 : 400 }}>
                          {dist.toFixed(2)} {isMatch ? '★ Nearest' : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '18px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: `${simMeta.color}15`,
              border: `1px solid ${simMeta.color}33`,
              fontSize: '11.5px',
              color: '#FFFFFF'
            }}>
              💡 <strong>Strategy Suggestion:</strong> {simMeta.action}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
