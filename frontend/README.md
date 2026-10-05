# 🛒 Big Data Mining for Customer Intelligence in Online Grocery Shopping | Modern Frontend Dashboard

A modern, high-performance Data Mining & Customer Intelligence frontend dashboard for **Big Data Mining for Customer Intelligence in Online Grocery Shopping** built with **React**, **Vite**, **Lucide Icons**, and custom **HTML5 Canvas / CSS3 Design System**.

---

## 🚀 Quick Start

### 1. Navigate to the frontend directory
```bash
cd frontend
```

### 2. Install dependencies (if not already installed)
```bash
npm install
```

### 3. Start the live development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

### 4. Build for production (Optional)
```bash
npm run build
npm run preview
```

---

## ✨ Key Modules & Features

### 🌟 1. Executive Overview & KPI Cockpit
- **Real-Time KPIs**: Total Customers (206,209), Total Orders (3.21M+), Average Basket Size (10.1 items), Reorder Loyalty Rate (58.9%), Mined Association Rules (45), and Average Order Interval (15.4 days).
- **AI Data Mining Synthesis**: Key behavioral discoveries and revenue lever takeaways.
- **Customer Cohort Distribution**: Interactive segment distribution bars with population breakdown and averages.
- **7-Day × 24-Hour Shopping Intensity Heatmap**: Interactive heatmap grid with cell hover tooltips showing hourly order density.

### 👥 2. Customer Segmentation & K-Means Intelligence (k=5)
- **5 Behavioral Cohorts**: *Highly Loyal Customers*, *Frequent Customers*, *Bulk Basket Customers*, *Regular Customers*, and *Occasional Customers*.
- **Interactive 2D Cluster Scatter Plot**: Canvas-based interactive scatter plot with dynamic axis selection (*Orders vs Basket Size*, *Reorder Rate vs Days Gap*, etc.), cluster filter toggles, and individual customer tooltips.
- **Deep Segment Profile Spotlight**: Churn probability risk, strategic positioning, and actionable growth playbooks.
- **Segment Top Product Affinities**: Characteristic products per segment with *Lift vs Overall Baseline* scores.
- **Comprehensive K-Means Characteristics Table**: Full mathematical feature comparison across all clusters.

### 🔍 3. Customer 360° Profile & Live Segment Simulator
- **Instant Customer Lookup**: Search any customer by `user_id` (1 to 206,209) to retrieve their behavioral fingerprint and prescribed next best action.
- **1-Click Customer Presets**: Quick shortcuts for VIP Loyalists, High Volume Bulk Stockers, Habitual Buyers, Steady Regulars, and Lapse At-Risk profiles.
- **"What-If" Behavioral Simulator**: Interactive sliders for *Total Orders*, *Avg Basket Size*, *Reorder Rate*, and *Days Between Orders*. Computes normalized Euclidean distance to K-Means centroids in real-time and predicts the target segment with confidence scores!

### 🛍️ 4. Market Basket Analysis & FP-Growth Rules Explorer
- **Discovered Association Rules**: Interactive filterable data grid with tunable sliders for *Minimum Lift* (1.0x to 5.0x), *Minimum Confidence* (10% to 35%), and product search.
- **Interactive Co-Purchase Network Topology**: Canvas-based network graph visualizing product nodes and association rule edges with physics layout, node hover glow, and connection paths.
- **Top 20 Bestselling Products Leaderboard**: Ranking, purchase volume, catalog share %, and certified organic badges.
- **Data Mining Metric Explainers**: Clear definitions for Support, Confidence, Lift, Zhang's Metric, Leverage, and Conviction.

### 🤖 5. Smart Basket Builder & Real-Time Cross-Sell Engine
- **Virtual Shopping Cart**: Click-to-add grocery items to an interactive basket.
- **Live Cross-Sell Engine**: Automatically analyzes items in the cart and surfaces top recommended additions ranked by association rule Lift and Confidence with explanations.
- **Direct Single-Product Association Explorer**: Select any root product to explore its downstream association affinities.

### ⏰ 6. Temporal Trends & Diurnal Peak Analysis
- **Orders by Day of Week**: Weekend surge analysis highlighting 34.7% volume concentration.
- **24-Hour Diurnal Order Wave**: SVG wave chart showcasing peak transaction window at 10:00 AM (271k+ orders) and the late-night trough at 3:00 AM.
- **Diurnal Shopping Personas**: Morning Stock-Up Rush, Midday Sustained, Evening Dinner Shoppers, and Late Night Essentials.

### 🔬 7. Data Mining Pipeline & Methodology Inspector
- **End-to-End Visual Architecture**: Flowchart from raw 32M+ Instacart data to K-Means clustering (k=5), FP-Growth frequent itemsets (support ≥ 0.5%), and rule induction.
- **Hyperparameter Specifications**: Model configurations, scaling methods, and validation techniques.
- **Analytical Limitations & Assumptions**: Documentation on day numbering assumptions, 30-day interval capping, and banana exclusion rationale.

### 📄 8. Executive Briefing & Export Suite
- **Print / PDF Generator**: Clean printable summary report format.
- **CSV Data Export**: One-click export of customer segment benchmarks and model metrics.
