import React from 'react';
import { 
  GitFork, 
  Database, 
  Cpu, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck,
  FileCode,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function DataMiningPipeline() {
  const steps = [
    {
      num: '01',
      title: 'Data Ingestion & Cleaning',
      badge: 'Big Data Pipeline',
      icon: Database,
      color: '#3B82F6',
      tech: 'Pandas / NumPy',
      desc: 'Ingesting 3.2M+ transaction records and 206,209 customer profiles from the Instacart relational tables. Handled missing prior order days and cleansed outliers.'
    },
    {
      num: '02',
      title: 'Customer Feature Engineering',
      badge: 'Aggregations',
      icon: Layers,
      color: '#6366F1',
      tech: '5 Feature Dimensions',
      desc: 'Derived 5 core behavioral metrics per user: Total Orders, Total Products, Avg Products/Order (Basket), Reorder Rate (0-1), and Days Between Orders (0-30).'
    },
    {
      num: '03',
      title: 'K-Means Clustering (k=5)',
      badge: 'Unsupervised ML',
      icon: Cpu,
      color: '#10B981',
      tech: 'Scikit-Learn K-Means',
      desc: 'Applied standardized StandardScaler feature scaling and evaluated cluster inertia using the Elbow Method (k=5 optimal). Segmented base into 5 distinct behavioral cohorts.'
    },
    {
      num: '04',
      title: 'FP-Growth Pattern Mining',
      badge: 'Frequent Itemsets',
      icon: GitFork,
      color: '#8B5CF6',
      tech: 'MLxtend FP-Growth',
      desc: 'Extracted frequent co-purchased itemsets on a 1,000,000 order sample with minimum support threshold of 0.5% across top 150 products (excluding ubiquitous single items).'
    },
    {
      num: '05',
      title: 'Association Rule Induction',
      badge: 'Rule Induction',
      icon: Sparkles,
      color: '#F59E0B',
      tech: 'Lift ≥ 1.2 | Conf ≥ 10%',
      desc: 'Computed 45 robust association rules. Filtered by Lift ≥ 1.2x and Confidence ≥ 10%. Evaluated with Zhang’s Metric, Leverage, Conviction, and Jaccard similarity.'
    },
    {
      num: '06',
      title: 'Real-Time Recommender Engine',
      badge: 'Operationalization',
      icon: ShieldCheck,
      color: '#EC4899',
      tech: 'Client-Side AI Engine',
      desc: 'Operationalized segmentation and association rules for live customer lookup, What-If customer simulator, and real-time cross-sell basket recommendation.'
    }
  ];

  return (
    <div className="fade-in">
      {/* 1. Header Banner */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title-group">
            <h3 className="card-title">
              <GitFork size={18} style={{ color: 'var(--brand-primary)' }} />
              Data Mining Techniques (DMT) Pipeline Architecture
            </h3>
            <p className="card-subtitle">
              Comprehensive overview of the algorithms, preprocessing, and evaluation metrics used in this project
            </p>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          This project demonstrates the application of unsupervised machine learning (<strong>K-Means Clustering</strong>) and pattern mining (<strong>FP-Growth Algorithm & Association Rules</strong>) on big e-commerce grocery data to extract actionable customer intelligence and automated cross-sell recommendations.
        </p>
      </div>

      {/* 2. Visual Pipeline Steps Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.num} className="pipeline-step-card">
              <span className="pipeline-step-num">Step {step.num}</span>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', marginBottom: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: `${step.color}22`,
                  color: step.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={18} />
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-secondary)'
                }}>
                  {step.tech}
                </span>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                {step.title}
              </h4>

              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* 3. Technical Parameters & Model Specifications */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* K-Means Specs */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <h4 className="card-title" style={{ fontSize: '15px' }}>
                <Cpu size={16} style={{ color: 'var(--brand-emerald)' }} />
                K-Means Clustering Specification
              </h4>
            </div>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Target Clusters (k):</span>
              <strong style={{ color: '#FFFFFF' }}>5 Clusters</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Input Dimensions:</span>
              <strong style={{ color: '#FFFFFF' }}>5 Standardized Features</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Clustered Customers:</span>
              <strong style={{ color: '#FFFFFF' }}>206,209 Profiles</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Cluster Validation:</span>
              <strong style={{ color: 'var(--brand-emerald)' }}>Elbow Inertia Curve</strong>
            </li>
          </ul>
        </div>

        {/* FP-Growth Specs */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <h4 className="card-title" style={{ fontSize: '15px' }}>
                <Sparkles size={16} style={{ color: 'var(--brand-amber)' }} />
                FP-Growth & Rules Specification
              </h4>
            </div>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sample Size:</span>
              <strong style={{ color: '#FFFFFF' }}>1,000,000 Orders</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Minimum Support Threshold:</span>
              <strong style={{ color: '#FFFFFF' }}>0.5% (5,000 orders)</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Minimum Lift Threshold:</span>
              <strong style={{ color: '#FFFFFF' }}>≥ 1.20x</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Rules Mined:</span>
              <strong style={{ color: 'var(--brand-amber)' }}>45 Association Rules</strong>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. Limitations & Assumptions Transparency Panel */}
      <div className="card" style={{ borderLeft: '4px solid var(--brand-rose)' }}>
        <div className="card-header">
          <div className="card-title-group">
            <h4 className="card-title" style={{ color: '#FCA5A5' }}>
              <AlertTriangle size={17} style={{ color: 'var(--brand-rose)' }} />
              Methodological Assumptions & Analytical Limitations
            </h4>
            <p className="card-subtitle">
              Important analytical boundaries to keep in mind when interpreting the dashboard
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
            <strong style={{ color: '#FFFFFF' }}>Day-of-Week Mapping:</strong> The raw Instacart dataset numbers days 0–6 without documentation. Conventionally, 0 is mapped to Saturday and 1 to Sunday based on weekend order velocity surges.
          </div>

          <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
            <strong style={{ color: '#FFFFFF' }}>Bananas Excluded from Rule Antecedents:</strong> Bananas appear in ~33% of all orders and would mathematically saturate every association rule without providing actionable cross-sell differentiation.
          </div>

          <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
            <strong style={{ color: '#FFFFFF' }}>30-Day Inter-Order Cap:</strong> In the source data, `days_since_prior_order` is capped at 30 days, causing customers with long intervals to bunch at 30.0.
          </div>
        </div>
      </div>
    </div>
  );
}
