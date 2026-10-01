import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Search, 
  Filter, 
  HelpCircle, 
  ArrowRight, 
  TrendingUp, 
  Layers, 
  Check, 
  ExternalLink,
  Table,
  Network
} from 'lucide-react';
import NetworkGraphCanvas from './NetworkGraphCanvas';

export default function MarketBasketExplorer({ 
  productsData, 
  rulesData, 
  onSelectProductForBasket 
}) {
  const [activeView, setActiveView] = useState('rules'); // 'rules' | 'network' | 'top_products'
  const [minLift, setMinLift] = useState(1.2);
  const [minConfidence, setMinConfidence] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { top_products } = productsData || {};
  const { rules, network_graph } = rulesData || {};

  // Filter Rules
  const filteredRules = (rules || []).filter((r) => {
    const matchesLift = r.lift >= minLift;
    const matchesConf = (r.confidence * 100) >= minConfidence;
    const matchesSearch =
      searchQuery === '' ||
      r.antecedent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.consequent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLift && matchesConf && matchesSearch;
  });

  return (
    <div className="fade-in">
      {/* Module Navigation Sub-Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${activeView === 'rules' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setActiveView('rules')}
          >
            <Table size={14} />
            Association Rules Table ({filteredRules.length})
          </button>
          <button
            className={`btn ${activeView === 'network' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setActiveView('network')}
          >
            <Network size={14} />
            Co-Purchase Network Topology
          </button>
          <button
            className={`btn ${activeView === 'top_products' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setActiveView('top_products')}
          >
            <ShoppingBag size={14} />
            Top 20 Bestselling Products
          </button>
        </div>

        {/* Mining Threshold Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
          <span>Dataset: <strong>1,000,000 Order Sample</strong></span>
          <span>•</span>
          <span>Algorithm: <strong style={{ color: 'var(--brand-primary)' }}>FP-Growth Tree</strong></span>
        </div>
      </div>

      {/* VIEW 1: RULES TABLE & CONTROLS */}
      {activeView === 'rules' && (
        <>
          {/* Filter Toolbar */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', alignItems: 'center' }}>
              {/* Product Search */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Filter by Product Name:
                </label>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search Avocado, Lemon, Spinach..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-control"
                    style={{ paddingLeft: '34px', fontSize: '12.5px' }}
                  />
                </div>
              </div>

              {/* Lift Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Minimum Lift Threshold:</span>
                  <strong style={{ color: 'var(--brand-amber)', fontFamily: 'var(--font-mono)' }}>{minLift.toFixed(2)}x</strong>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.05"
                  value={minLift}
                  onChange={(e) => setMinLift(parseFloat(e.target.value))}
                  className="range-slider"
                />
              </div>

              {/* Confidence Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Minimum Confidence (%):</span>
                  <strong style={{ color: 'var(--brand-emerald)', fontFamily: 'var(--font-mono)' }}>{minConfidence}%</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="35"
                  step="1"
                  value={minConfidence}
                  onChange={(e) => setMinConfidence(parseInt(e.target.value, 10))}
                  className="range-slider"
                />
              </div>
            </div>
          </div>

          {/* Rules Data Table */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <div className="card-title-group">
                <h3 className="card-title">
                  <Sparkles size={18} style={{ color: 'var(--brand-amber)' }} />
                  Discovered Association Rules (FP-Growth Model)
                </h3>
                <p className="card-subtitle">
                  Sorted by Lift multiplier (co-purchase strength over random chance)
                </p>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>If Customer Buys (Antecedent)</th>
                    <th></th>
                    <th>Then Also Recommends (Consequent)</th>
                    <th>Lift Multiplier</th>
                    <th>Confidence (%)</th>
                    <th>Support (%)</th>
                    <th>Zhang's Metric</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRules.length > 0 ? (
                    filteredRules.map((rule) => {
                      const liftScore = rule.lift;
                      const liftBadgeColor = liftScore > 3.5 ? '#10B981' : liftScore > 2.0 ? '#3B82F6' : '#F59E0B';
                      return (
                        <tr key={rule.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: rule.antecedent.includes('Organic') ? '#10B981' : '#3B82F6'
                              }}></span>
                              <strong style={{ color: '#FFFFFF' }}>{rule.antecedent}</strong>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center', color: 'var(--brand-cyan)' }}>
                            <ArrowRight size={15} />
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: rule.consequent.includes('Organic') ? '#10B981' : '#3B82F6'
                              }}></span>
                              <strong style={{ color: '#FFFFFF' }}>{rule.consequent}</strong>
                            </div>
                          </td>
                          <td>
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: '10px',
                              background: `${liftBadgeColor}22`,
                              color: liftBadgeColor,
                              fontWeight: 700,
                              fontFamily: 'var(--font-mono)'
                            }}>
                              {rule.lift.toFixed(2)}x
                            </span>
                          </td>
                          <td className="table-mono" style={{ color: 'var(--brand-emerald)', fontWeight: 600 }}>
                            {(rule.confidence * 100).toFixed(1)}%
                          </td>
                          <td className="table-mono" style={{ color: 'var(--text-secondary)' }}>
                            {(rule.support * 100).toFixed(2)}%
                          </td>
                          <td className="table-mono" style={{ color: 'var(--text-muted)' }}>
                            {rule.zhangs_metric.toFixed(3)}
                          </td>
                          <td>
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '3px 8px', fontSize: '11px' }}
                              onClick={() => onSelectProductForBasket && onSelectProductForBasket(rule.antecedent)}
                              title="Test this item in live Basket Builder"
                            >
                              Add to Basket
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                        No association rules match your active filters. Try lowering the Minimum Lift slider.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* VIEW 2: NETWORK TOPOLOGY */}
      {activeView === 'network' && (
        <div style={{ marginBottom: '24px' }}>
          <NetworkGraphCanvas
            graphData={network_graph}
            minLift={minLift}
            onSelectProduct={(prod) => {
              if (onSelectProductForBasket) onSelectProductForBasket(prod);
            }}
          />
        </div>
      )}

      {/* VIEW 3: TOP 20 PRODUCTS LEADERBOARD */}
      {activeView === 'top_products' && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <div className="card-title-group">
              <h3 className="card-title">
                <ShoppingBag size={18} style={{ color: 'var(--brand-emerald)' }} />
                Top 20 Most Purchased Products Leaderboard
              </h3>
              <p className="card-subtitle">
                Most frequent grocery items across 3.2M+ Instacart customer transactions
              </p>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Product Name</th>
                  <th>Category / Badge</th>
                  <th>Total Purchases</th>
                  <th>Share of All Orders (%)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {top_products?.map((prod) => (
                  <tr key={prod.rank}>
                    <td className="table-mono" style={{ fontWeight: 700, color: prod.rank <= 3 ? 'var(--brand-amber)' : 'var(--text-muted)' }}>
                      #{prod.rank}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>{prod.icon}</span>
                        <strong style={{ color: '#FFFFFF' }}>{prod.product_name}</strong>
                      </div>
                    </td>
                    <td>
                      {prod.is_organic ? (
                        <span style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#34D399',
                          fontWeight: 600
                        }}>
                          🌱 Certified Organic
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          background: 'rgba(59, 130, 246, 0.15)',
                          color: '#60A5FA',
                          fontWeight: 600
                        }}>
                          📦 Conventional
                        </span>
                      )}
                    </td>
                    <td className="table-mono" style={{ fontWeight: 700, color: 'var(--brand-cyan)' }}>
                      {prod.purchase_count.toLocaleString()}
                    </td>
                    <td className="table-mono">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                          <div style={{ width: `${Math.min(100, prod.share_pct * 6)}%`, height: '100%', background: 'var(--brand-primary)', borderRadius: '3px' }}></div>
                        </div>
                        <span>{prod.share_pct}%</span>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '3px 8px', fontSize: '11px' }}
                        onClick={() => onSelectProductForBasket && onSelectProductForBasket(prod.product_name)}
                      >
                        Add to Basket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Data Mining Educational Metric Explainer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--brand-amber)', marginBottom: '4px' }}>
            📈 Lift Metric (Confidence / Support(B))
          </div>
          <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
            Measures how much more likely item B is purchased when item A is in the cart, compared to item B's normal rate. <strong>Lift &gt; 1.0</strong> indicates positive affinity.
          </p>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--brand-emerald)', marginBottom: '4px' }}>
            🎯 Confidence (Support(A ∪ B) / Support(A))
          </div>
          <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
            The conditional probability that a basket containing item A will also contain item B. Used for ranking direct upsell widgets.
          </p>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--brand-cyan)', marginBottom: '4px' }}>
            📊 Support (Freq(A ∪ B) / Total Orders)
          </div>
          <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
            The percentage of all shopping transactions that contain both items simultaneously. Ensures rules apply to popular combinations.
          </p>
        </div>
      </div>
    </div>
  );
}
