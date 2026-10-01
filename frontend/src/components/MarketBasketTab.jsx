import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Search, 
  ArrowRight, 
  Filter, 
  Info 
} from 'lucide-react';

export default function MarketBasketTab({ productsData, rulesData }) {
  const { top_products } = productsData || {};
  const { rules } = rulesData || {};

  const [searchProduct, setSearchProduct] = useState('');
  const [minLift, setMinLift] = useState(1.2);
  const [showTopProducts, setShowTopProducts] = useState(true);

  const filteredRules = (rules || []).filter((r) => {
    const matchesLift = r.lift >= minLift;
    const matchesSearch =
      searchProduct === '' ||
      r.antecedent.toLowerCase().includes(searchProduct.toLowerCase()) ||
      r.consequent.toLowerCase().includes(searchProduct.toLowerCase());
    return matchesLift && matchesSearch;
  });

  return (
    <div>
      {/* 1. Top 20 Most Purchased Products */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 className="card-title" style={{ margin: 0 }}>
              🛍️ Top 20 Most Purchased Products
            </h3>
            <p className="card-subtitle" style={{ margin: 0 }}>
              Highest volume grocery items across 3.2M+ Instacart transactions
            </p>
          </div>
          <button 
            className="btn btn-outline" 
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => setShowTopProducts(!showTopProducts)}
          >
            {showTopProducts ? 'Hide Products Table' : 'Show Products Table'}
          </button>
        </div>

        {showTopProducts && (
          <div className="table-wrapper">
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Product Name</th>
                  <th>Total Purchases</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {top_products?.map((prod) => (
                  <tr key={prod.rank}>
                    <td className="mono-cell" style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
                      #{prod.rank}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{prod.icon}</span>
                        <strong>{prod.product_name}</strong>
                      </div>
                    </td>
                    <td className="mono-cell" style={{ fontWeight: 700, color: '#3B82F6' }}>
                      {prod.purchase_count.toLocaleString()}
                    </td>
                    <td>
                      {prod.is_organic ? (
                        <span className="badge badge-emerald">Organic</span>
                      ) : (
                        <span className="badge badge-blue">Standard</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Association Rules (FP-Growth) */}
      <div className="card">
        <h3 className="card-title">
          <Sparkles size={18} style={{ color: '#F59E0B' }} />
          🧺 Market Basket Association Rules (FP-Growth)
        </h3>
        <p className="card-subtitle">
          Discovered item co-purchase patterns mined with a minimum support of 0.5% and lift ≥ 1.2
        </p>

        {/* Filter Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '18px', background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div>
            <label className="form-label">Search by Product Name:</label>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="e.g. Avocado, Spinach, Garlic..."
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '32px' }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>Minimum Lift Threshold:</label>
              <strong style={{ color: '#F59E0B', fontFamily: 'var(--font-mono)' }}>{minLift.toFixed(2)}x</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.5"
              step="0.05"
              value={minLift}
              onChange={(e) => setMinLift(parseFloat(e.target.value))}
              className="form-slider"
            />
          </div>
        </div>

        {/* Rules Table */}
        <div className="table-wrapper">
          <table className="clean-table">
            <thead>
              <tr>
                <th>If Customer Buys (Antecedent)</th>
                <th></th>
                <th>Then Also Buys (Consequent)</th>
                <th>Lift</th>
                <th>Confidence (%)</th>
                <th>Support (%)</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.length > 0 ? (
                filteredRules.map((rule) => (
                  <tr key={rule.id}>
                    <td><strong>{rule.antecedent}</strong></td>
                    <td style={{ textAlign: 'center', color: '#3B82F6' }}>
                      <ArrowRight size={15} />
                    </td>
                    <td><strong>{rule.consequent}</strong></td>
                    <td>
                      <span className="badge badge-amber" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {rule.lift.toFixed(2)}x
                      </span>
                    </td>
                    <td className="mono-cell" style={{ fontWeight: 600, color: '#059669' }}>
                      {(rule.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="mono-cell" style={{ color: 'var(--text-secondary)' }}>
                      {(rule.support * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No rules match your active filters. Try lowering the minimum lift.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Metric Explanations Box */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <strong style={{ fontSize: '13px', color: '#F59E0B' }}>📈 Lift</strong>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            How much more likely the items are bought together compared to chance. <strong>Lift &gt; 1.0</strong> indicates a strong positive association.
          </p>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <strong style={{ fontSize: '13px', color: '#10B981' }}>🎯 Confidence</strong>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            The percentage of baskets containing product A that also contain product B.
          </p>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <strong style={{ fontSize: '13px', color: '#3B82F6' }}>📊 Support</strong>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            The proportion of all total transactions that contain both products.
          </p>
        </div>
      </div>
    </div>
  );
}
