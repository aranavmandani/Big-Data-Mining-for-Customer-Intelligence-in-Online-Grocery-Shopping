import React, { useState } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Check, 
  TrendingUp, 
  Zap, 
  ShieldCheck,
  RefreshCw,
  Sliders
} from 'lucide-react';

export default function BasketBuilderRecommender({ 
  rulesData, 
  productsData, 
  initialBasket = [], 
  onUpdateBasket 
}) {
  const { recommendations_by_product, available_antecedents } = rulesData || {};
  const { top_products } = productsData || {};

  const [basket, setBasket] = useState(
    initialBasket.length > 0 ? initialBasket : ['Organic Strawberries', 'Organic Hass Avocado']
  );
  const [selectedProduct, setSelectedProduct] = useState(available_antecedents ? available_antecedents[0] : 'Organic Strawberries');
  const [minLift, setMinLift] = useState(1.2);
  const [maxResults, setMaxResults] = useState(5);

  const addItemToBasket = (item) => {
    if (!basket.includes(item)) {
      const newBasket = [...basket, item];
      setBasket(newBasket);
      if (onUpdateBasket) onUpdateBasket(newBasket);
    }
  };

  const removeItemFromBasket = (item) => {
    const newBasket = basket.filter((i) => i !== item);
    setBasket(newBasket);
    if (onUpdateBasket) onUpdateBasket(newBasket);
  };

  const clearBasket = () => {
    setBasket([]);
    if (onUpdateBasket) onUpdateBasket([]);
  };

  // Compute live basket recommendations across all items currently in the cart
  const basketRecommendationsMap = {};
  basket.forEach((cartItem) => {
    const rules = recommendations_by_product?.[cartItem] || [];
    rules.forEach((r) => {
      if (!basket.includes(r.product)) {
        if (!basketRecommendationsMap[r.product] || basketRecommendationsMap[r.product].lift < r.lift) {
          basketRecommendationsMap[r.product] = {
            ...r,
            triggeredBy: cartItem
          };
        }
      }
    });
  });

  const liveBasketRecommendations = Object.values(basketRecommendationsMap).sort(
    (a, b) => b.lift - a.lift
  );

  // Single product direct lookup recommendations
  const singleProductRecs = (recommendations_by_product?.[selectedProduct] || [])
    .filter((r) => r.lift >= minLift)
    .slice(0, maxResults);

  return (
    <div className="fade-in">
      {/* 1. Interactive Basket Simulator Header */}
      <div className="card" style={{ marginBottom: '24px' }}>
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
                FP-GROWTH ENGINE
              </span>
              <h3 className="card-title" style={{ margin: 0 }}>
                <Sparkles size={18} style={{ color: 'var(--brand-emerald)' }} />
                Real-Time Shopping Basket Cross-Sell Sandbox
              </h3>
            </div>
            <p className="card-subtitle" style={{ marginTop: '4px' }}>
              Add items to your virtual grocery cart to trigger instant AI cross-sell recommendations powered by association mining
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={clearBasket}>
              <Trash2 size={13} />
              Clear Cart
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Left is Basket & Catalog, Right is Live AI Recommendations */}
        <div className="basket-grid" style={{ marginTop: '12px' }}>
          {/* Left Column: Virtual Cart + Quick Add */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Active Cart */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShoppingBag size={15} style={{ color: 'var(--brand-cyan)' }} />
                  Current Basket ({basket.length} items)
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {basket.filter(i => i.includes('Organic')).length} Organic items
                </span>
              </div>

              {basket.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {basket.map((item) => (
                    <span
                      key={item}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.4)',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: '#FFFFFF'
                      }}
                    >
                      <span>{item}</span>
                      <button
                        onClick={() => removeItemFromBasket(item)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94A3B8',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Remove item"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                  Your cart is empty. Click any product below to begin mining recommendations!
                </div>
              )}
            </div>

            {/* Quick Add Product Chips */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Quick Add Popular Grocery Staples:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {available_antecedents?.slice(0, 10).map((prodName) => {
                  const isInCart = basket.includes(prodName);
                  return (
                    <button
                      key={prodName}
                      className={`product-item-chip ${isInCart ? 'selected' : ''}`}
                      onClick={() => (isInCart ? removeItemFromBasket(prodName) : addItemToBasket(prodName))}
                    >
                      {isInCart ? <Check size={13} style={{ color: 'var(--brand-emerald)' }} /> : <Plus size={13} />}
                      <span>{prodName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time Association Recommendations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-emerald)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={15} />
                Live Cross-Sell Recommendations ({liveBasketRecommendations.length})
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Sorted by Lift multiplier
              </span>
            </div>

            {liveBasketRecommendations.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {liveBasketRecommendations.slice(0, 5).map((rec) => (
                  <div key={rec.product} className="recommendation-card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '13.5px', color: '#FFFFFF' }}>{rec.product}</strong>
                        <span style={{
                          fontSize: '11px',
                          padding: '2px 7px',
                          borderRadius: '10px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#34D399',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)'
                        }}>
                          {rec.lift}x Lift
                        </span>
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        Triggered by: <strong style={{ color: 'var(--brand-cyan)' }}>{rec.triggeredBy}</strong> • Confidence: <strong>{rec.confidence_pct}%</strong>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => addItemToBasket(rec.product)}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      <Plus size={13} />
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '32px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '12.5px'
              }}>
                Add items to your cart to trigger co-purchase association suggestions.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Direct Single-Product Association Explorer */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <h3 className="card-title">
              <Sliders size={18} style={{ color: 'var(--brand-primary)' }} />
              Direct Single-Product Association Explorer
            </h3>
            <p className="card-subtitle">
              Inspect all association rules tied to a specific root item
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '18px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Select Root Product (Antecedent):
            </label>
            <select
              className="input-control select-control"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {available_antecedents?.map((prod) => (
                <option key={prod} value={prod}>
                  {prod}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Minimum Lift Threshold:</span>
              <strong style={{ color: 'var(--brand-amber)', fontFamily: 'var(--font-mono)' }}>{minLift.toFixed(2)}x</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.05"
              value={minLift}
              onChange={(e) => setMinLift(parseFloat(e.target.value))}
              className="range-slider"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Max Recommendations:</span>
              <strong style={{ color: 'var(--brand-cyan)', fontFamily: 'var(--font-mono)' }}>{maxResults}</strong>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={maxResults}
              onChange={(e) => setMaxResults(parseInt(e.target.value, 10))}
              className="range-slider"
            />
          </div>
        </div>

        {/* Results Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Recommended Product</th>
                <th>Lift Multiplier</th>
                <th>Confidence (%)</th>
                <th>Support (%)</th>
                <th>Leverage</th>
                <th>Jaccard Similarity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {singleProductRecs.length > 0 ? (
                singleProductRecs.map((rec, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: rec.product.includes('Organic') ? '#10B981' : '#3B82F6'
                        }}></span>
                        <strong style={{ color: '#FFFFFF' }}>{rec.product}</strong>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '10px',
                        background: 'rgba(245, 158, 11, 0.15)',
                        color: '#F59E0B',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {rec.lift.toFixed(2)}x
                      </span>
                    </td>
                    <td className="table-mono" style={{ color: 'var(--brand-emerald)', fontWeight: 600 }}>
                      {rec.confidence_pct}%
                    </td>
                    <td className="table-mono" style={{ color: 'var(--text-secondary)' }}>
                      {rec.support_pct}%
                    </td>
                    <td className="table-mono" style={{ color: 'var(--text-muted)' }}>
                      {rec.leverage.toFixed(4)}
                    </td>
                    <td className="table-mono" style={{ color: 'var(--text-muted)' }}>
                      {rec.jaccard.toFixed(3)}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '3px 8px', fontSize: '11px' }}
                        onClick={() => addItemToBasket(rec.product)}
                      >
                        Add to Cart
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No association rules for <strong>{selectedProduct}</strong> meet a lift threshold of {minLift.toFixed(2)}x.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
