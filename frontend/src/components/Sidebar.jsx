import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  ShoppingBag, 
  Sparkles, 
  Clock, 
  GitFork, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard, badge: 'KPIs' },
  { id: 'segmentation', label: 'Customer Segments', icon: Users, badge: 'k=5' },
  { id: 'lookup', label: 'Customer 360 & Simulator', icon: UserCheck, badge: 'Live' },
  { id: 'market-basket', label: 'Market Basket (FP-Growth)', icon: ShoppingBag, badge: '45 Rules' },
  { id: 'recommender', label: 'Basket Builder & Cross-Sell', icon: Sparkles, badge: 'AI' },
  { id: 'temporal', label: 'Peak Hour & Day Trends', icon: Clock, badge: '24h' },
  { id: 'pipeline', label: 'Data Mining Pipeline', icon: GitFork, badge: 'Methods' },
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, onOpenReport }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          🛒
        </div>
        {!collapsed && (
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-title">Big Data Mining</span>
            <span className="sidebar-brand-subtitle">Customer Intelligence (Grocery)</span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">
          {!collapsed ? 'Intelligence Modules' : '•••'}
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} />
              {!collapsed && (
                <>
                  <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </>
              )}
            </button>
          );
        })}

        <div className="nav-section-label" style={{ marginTop: '12px' }}>
          {!collapsed ? 'Reporting & Export' : '•••'}
        </div>

        <button
          className="nav-item"
          onClick={onOpenReport}
          title={collapsed ? 'Executive Briefing' : undefined}
        >
          <FileText size={18} />
          {!collapsed && (
            <>
              <span style={{ flex: 1, textAlign: 'left' }}>Executive Briefing</span>
              <span className="nav-badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818CF8' }}>PDF / CSV</span>
            </>
          )}
        </button>
      </nav>

      {/* Footer Dataset Info */}
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="dataset-badge-card">
            <div className="dataset-badge-title">
              <Database size={13} style={{ color: '#06B6D4' }} />
              Instacart Big Data
            </div>
            <div className="dataset-badge-stat">206,209 Customers</div>
            <div className="dataset-badge-stat">3,214,874 Orders</div>
          </div>
        )}

        <button 
          className="btn btn-ghost btn-sm"
          style={{ width: '100%', justifyContent: collapsed ? 'center' : 'space-between' }}
          onClick={() => setCollapsed(!collapsed)}
        >
          {!collapsed && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Collapse Menu</span>}
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
