import React from 'react';
import { 
  GitFork, 
  Database, 
  Cpu, 
  Sparkles, 
  Layers, 
  AlertTriangle, 
  CheckCircle2,
  FileCode,
  ArrowRight
} from 'lucide-react';

export default function PipelineTab() {
  const steps = [
    {
      step: 'Step 1',
      title: 'Raw Data Ingestion & Preprocessing',
      tech: 'Pandas & NumPy',
      desc: 'Ingested raw relational tables (orders, order_products__prior, products) comprising over 3.2M orders and 206,209 unique customer profiles. Handled initial order missing values.'
    },
    {
      step: 'Step 2',
      title: 'Customer Feature Engineering',
      tech: '5 Core Features',
      desc: 'Aggregated raw transaction logs at the user level to build 5 behavioral dimensions: total_orders, total_products, avg_products_per_order, reorder_rate, and avg_days_between_orders.'
    },
    {
      step: 'Step 3',
      title: 'K-Means Customer Segmentation',
      tech: 'Scikit-Learn (k=5)',
      desc: 'Applied StandardScaler feature normalization and evaluated cluster inertia using the Elbow Method. Clustered 206,209 customers into 5 distinct behavioral segments.'
    },
    {
      step: 'Step 4',
      title: 'FP-Growth Frequent Pattern Mining',
      tech: 'MLxtend FP-Growth',
      desc: 'Mined frequent grocery co-purchase itemsets on a random sample of 1,000,000 orders with a minimum support threshold of 0.5% (5,000 co-occurrences).'
    },
    {
      step: 'Step 5',
      title: 'Association Rule Generation',
      tech: 'Association Rules (Lift ≥ 1.2)',
      desc: 'Generated 45 high-affinity association rules with confidence ≥ 10% and lift ≥ 1.2x. Evaluated with support, confidence, lift, and leverage.'
    },
    {
      step: 'Step 6',
      title: 'Customer Intelligence & Decision Support',
      tech: 'Real-Time Recommender',
      desc: 'Operationalized customer lookup, segment characteristics, and product-to-product cross-selling recommendations for business decision making.'
    },
  ];

  return (
    <div>
      {/* 1. Header */}
      <div className="card">
        <h3 className="card-title">
          <GitFork size={18} style={{ color: '#3B82F6' }} />
          🔄 Complete Data Mining Pipeline
        </h3>
        <p className="card-subtitle">
          End-to-end data mining architecture: from raw Instacart big data to actionable customer segmentation and recommendations
        </p>

        {/* Visual Pipeline Grid */}
        <div className="pipeline-grid">
          {steps.map((s, idx) => (
            <div key={idx} className="pipeline-card">
              <span className="pipeline-step-badge">{s.step}</span>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                {s.title}
              </h4>
              <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#3B82F6', marginBottom: '8px' }}>
                Technology: {s.tech}
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Data Mining Techniques Summary */}
      <div className="card">
        <h3 className="card-title">
          📊 Data Mining Techniques Used
        </h3>
        <p className="card-subtitle">
          Core algorithmic pillars utilized in the project
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'var(--bg-subtle)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <strong style={{ fontSize: '14px', color: '#10B981', display: 'block', marginBottom: '6px' }}>
              1. K-Means (Clustering)
            </strong>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Used to segment customers based on their purchasing behavior (order count, basket size, reorder rate, and order interval).
            </p>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <strong style={{ fontSize: '14px', color: '#3B82F6', display: 'block', marginBottom: '6px' }}>
              2. FP-Growth (Pattern Mining)
            </strong>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Used to discover frequently purchased product combinations without candidate generation overhead.
            </p>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <strong style={{ fontSize: '14px', color: '#F59E0B', display: 'block', marginBottom: '6px' }}>
              3. Association Rules (Recommender)
            </strong>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Used to generate cross-sell product recommendations using support, confidence, and lift metrics.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Limitations of this Analysis */}
      <div className="card" style={{ borderLeft: '4px solid #F59E0B' }}>
        <h3 className="card-title" style={{ color: '#92400E' }}>
          <AlertTriangle size={18} style={{ color: '#F59E0B' }} />
          ⚠️ Limitations & Assumptions of this Analysis
        </h3>
        <p className="card-subtitle">
          Key analytical boundaries and dataset constraints
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>•</span>
            <div><strong>Day-of-week labels are an assumption:</strong> The dataset does not document the mapping from numbers (0–6) to days. 0 is treated as Saturday and 1 as Sunday based on weekend order-volume patterns.</div>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>•</span>
            <div><strong>Association rules use popular products:</strong> Filtered to the 150 most purchased products (bananas excluded because they appear in ~33% of orders and would dominate every rule), mined on a sample of 1,000,000 orders with minimum support of 0.5%, lift ≥ 1.2, and confidence ≥ 10%.</div>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>•</span>
            <div><strong><code>days_since_prior_order</code> is capped at 30 days</strong> in the source Instacart data, which affects the inter-order interval feature for lapsed users.</div>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>•</span>
            <div><strong>Segments come from K-Means with k = 5:</strong> Cluster labels were assigned after inspecting each cluster's average behavior.</div>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>•</span>
            <div><strong>No time-based validation</strong> was performed for recommendations.</div>
          </li>
        </ul>
      </div>
    </div>
  );
}
