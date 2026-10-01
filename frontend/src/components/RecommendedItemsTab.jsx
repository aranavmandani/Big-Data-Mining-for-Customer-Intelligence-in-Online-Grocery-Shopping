import React, { useState } from 'react';
import { 
  Sparkles, 
  Sliders, 
  Info, 
  ArrowRight,
  CheckCircle2 
} from 'lucide-react';

export default function RecommendedItemsTab({ rulesData }) {
  const { recommendations_by_product, available_antecedents, rules } = rulesData || {};

  const [selectedProduct, setSelectedProduct] = useState(
    available_antecedents && available_antecedents.length > 0
      ? available_antecedents[0]
      : 'Organic Strawberries'
  );
  const [minLift, setMinLift] = useState(1.2);
  const [maxResults, setMaxResults] = useState(5);

  // Find all matches for selected product
  const allProductMatches = rules ? rules.filter((r) => r.antecedent === selectedProduct) : [];
  const recommendations = allProductMatches
    .filter((r) => r.lift >= minLift)
    .sort((a, b) => b.lift - a.lift || b.confidence - a.confidence)
    .slice(0, maxResults);

  return (
    <div>
      <div className="card">
        <h3 className="card-title">
          <Sparkles size={18} style={{ color: '#3B82F6' }} />
          🤖 Product Recommendation (Based on Selected Item)
        </h3>
        <p className="card-subtitle">
          Select a product to find related items using association rules discovered by FP-Growth
        </p>

        {/* Form Controls Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', background: 'var(--bg-subtle)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <div>
            <label className="form-label">Select a product:</label>
            <select
              className="form-select"
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>Minimum lift:</label>
              <strong style={{ color: '#F59E0B', fontFamily: 'var(--font-mono)' }}>{minLift.toFixed(2)}x</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.05"
              value={minLift}
              onChange={(e) => setMinLift(parseFloat(e.target.value))}
              className="form-slider"
            />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Higher lift represents a stronger co-purchase affinity
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>Max recommendations:</label>
              <strong style={{ color: '#3B82F6', fontFamily: 'var(--font-mono)' }}>{maxResults}</strong>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={maxResults}
              onChange={(e) => setMaxResults(parseInt(e.target.value, 10))}
              className="form-slider"
            />
          </div>
        </div>

        {/* Results Section */}
        {recommendations.length > 0 ? (
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
              Recommended products for: <span style={{ color: '#3B82F6' }}>{selectedProduct}</span>
            </h4>

            <div className="table-wrapper">
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Recommended Product</th>
                    <th>Support (%)</th>
                    <th>Confidence (%)</th>
                    <th>Lift</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendations.map((rec) => (
                    <tr key={rec.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="badge badge-emerald">Recommended</span>
                          <strong>{rec.consequent}</strong>
                        </div>
                      </td>
                      <td className="mono-cell">{(rec.support * 100).toFixed(2)}%</td>
                      <td className="mono-cell" style={{ fontWeight: 600, color: '#059669' }}>
                        {(rec.confidence * 100).toFixed(2)}%
                      </td>
                      <td>
                        <span className="badge badge-amber" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '12px' }}>
                          {rec.lift.toFixed(2)}x
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : allProductMatches.length > 0 ? (
          <div className="alert-box alert-box-amber">
            <Info size={18} style={{ flexShrink: 0 }} />
            <div>
              {allProductMatches.length} rule(s) exist for <strong>{selectedProduct}</strong>, but none reach a minimum lift of {minLift.toFixed(2)}. Lower the minimum lift slider to see them.
            </div>
          </div>
        ) : (
          <div className="alert-box">
            <Info size={18} style={{ flexShrink: 0 }} />
            <div>
              No association rules available for this product in the mined dataset.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
