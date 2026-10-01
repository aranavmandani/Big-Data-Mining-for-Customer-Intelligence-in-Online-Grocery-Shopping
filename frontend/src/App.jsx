import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Sparkles, 
  Clock, 
  GitFork,
  Database
} from 'lucide-react';

// Tabs
import OverviewTab from './components/OverviewTab';
import CustomerSegmentsTab from './components/CustomerSegmentsTab';
import MarketBasketTab from './components/MarketBasketTab';
import RecommendedItemsTab from './components/RecommendedItemsTab';
import PeakHoursDaysTab from './components/PeakHoursDaysTab';
import PipelineTab from './components/PipelineTab';

// Data
import overviewData from './data/overview.json';
import segmentsData from './data/segments.json';
import productsData from './data/products.json';
import rulesData from './data/rules.json';
import customerLookupData from './data/customers.json';

const TABS = [
  { id: 'overview', label: '📊 Overview', icon: LayoutDashboard },
  { id: 'segments', label: '👥 Customer Segments', icon: Users },
  { id: 'market-basket', label: '🧺 Market Basket (Rules)', icon: ShoppingBag },
  { id: 'recommendations', label: '🤖 Recommended Items', icon: Sparkles },
  { id: 'peak-hours', label: '⏰ Peak Hours & Days', icon: Clock },
  { id: 'pipeline', label: '🔄 Data Mining Pipeline', icon: GitFork },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="dashboard-app">
      {/* 1. Clean Top Header */}
      <header className="dashboard-header">
        <div className="header-brand">
          <div className="header-icon">
            🛒
          </div>
          <div>
            <h1 className="header-title">
              E-Commerce Customer Intelligence
            </h1>
            <p className="header-subtitle">
              Data Mining Dashboard for Customer Segmentation, Product Analysis, Purchasing Behavior and Recommendations
            </p>
          </div>
        </div>

        <div className="dataset-pill">
          <Database size={15} style={{ color: '#3B82F6' }} />
          <span>Instacart Big Data Mining • <strong>206k Customers</strong> • <strong>3.2M Orders</strong></span>
        </div>
      </header>

      {/* 2. Clean Horizontal Navigation Tabs */}
      <nav className="nav-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 3. Main Content Router */}
      <main>
        {activeTab === 'overview' && (
          <OverviewTab 
            overviewData={overviewData} 
            onNavigateTab={setActiveTab} 
          />
        )}

        {activeTab === 'segments' && (
          <CustomerSegmentsTab 
            segmentsData={segmentsData} 
            customerLookupData={customerLookupData} 
          />
        )}

        {activeTab === 'market-basket' && (
          <MarketBasketTab 
            productsData={productsData} 
            rulesData={rulesData} 
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendedItemsTab 
            rulesData={rulesData} 
          />
        )}

        {activeTab === 'peak-hours' && (
          <PeakHoursDaysTab 
            overviewData={overviewData} 
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineTab />
        )}
      </main>

      {/* 4. Clean Footer */}
      <footer style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '12.5px', color: 'var(--text-muted)' }}>
        E-Commerce Big Data Mining for Customer Intelligence • Data Mining Techniques Subject Project
      </footer>
    </div>
  );
}
