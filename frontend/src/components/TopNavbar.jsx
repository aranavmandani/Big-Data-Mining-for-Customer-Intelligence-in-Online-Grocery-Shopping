import React from 'react';
import { 
  Sparkles, 
  Search, 
  FileDown, 
  Moon, 
  Sun, 
  Activity, 
  Layers,
  HelpCircle 
} from 'lucide-react';

export default function TopNavbar({ 
  activeTab, 
  theme, 
  setTheme, 
  onOpenReport, 
  onQuickSearch, 
  onOpenPipeline 
}) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return { tag: 'Executive Overview', title: 'Data Mining & Customer Intelligence Cockpit' };
      case 'segmentation':
        return { tag: 'Behavioral Clustering', title: 'K-Means Customer Segmentation & Strategy Playbook' };
      case 'lookup':
        return { tag: 'Predictive Sandbox', title: 'Customer 360° Profile & Live Segment Simulator' };
      case 'market-basket':
        return { tag: 'Pattern Mining', title: 'Market Basket Analysis & FP-Growth Rules Explorer' };
      case 'recommender':
        return { tag: 'Recommender Engine', title: 'Interactive Basket Builder & Cross-Sell Engine' };
      case 'temporal':
        return { tag: 'Temporal Dynamics', title: 'Peak Ordering Windows & Day-of-Week Patterns' };
      case 'pipeline':
        return { tag: 'Methodology', title: 'Data Mining Architecture & Model Evaluation' };
      default:
        return { tag: 'Dashboard', title: 'Big Data Mining for Customer Intelligence in Online Grocery Shopping' };
    }
  };

  const current = getTabTitle();

  return (
    <header className="top-navbar">
      {/* Left Title Area */}
      <div className="navbar-left">
        <span className="page-title-badge">{current.tag}</span>
        <h1 className="page-title" style={{ fontSize: '17px', margin: 0 }}>
          {current.title}
        </h1>
      </div>

      {/* Right Controls Area */}
      <div className="navbar-right">
        {/* Active Model Status Indicator */}
        <div className="status-pill" title="K-Means (k=5) & FP-Growth Association Models Active">
          <span className="status-dot"></span>
          <span>Mining Models Active</span>
        </div>

        {/* Quick Search Shortcut */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onQuickSearch}
          title="Search Customer ID (1 - 206,209)"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Search size={14} style={{ color: 'var(--brand-cyan)' }} />
          <span>Lookup Customer</span>
          <kbd style={{ 
            fontSize: '10px', 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '2px 5px', 
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)'
          }}>#ID</kbd>
        </button>

        {/* Executive Report Modal Trigger */}
        <button 
          className="btn btn-primary btn-sm"
          onClick={onOpenReport}
        >
          <FileDown size={14} />
          <span>Export Report</span>
        </button>

        {/* Theme Switcher */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Light / Dark Mode"
          style={{ padding: '8px' }}
        >
          {theme === 'dark' ? <Sun size={17} style={{ color: '#F59E0B' }} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
}
