# 🛒 Big Data Mining for Customer Intelligence in Online Grocery Shopping

A Data Mining Techniques (DMT) project for **Customer Segmentation (K-Means)**, **Market Basket Analysis (FP-Growth)**, **Diurnal Purchasing Behavior**, and **Cross-Sell Product Recommendations** on 3.2M+ Instacart transactions and 206,209 customer profiles.

---

## 🚀 Live Demo & Deployment to Vercel

### Deploying the Frontend Dashboard to Vercel:
1. Import the repository in [Vercel](https://vercel.com/new).
2. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (or leave default `/` as `vercel.json` handles the build automatically)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Click **Deploy**. Vercel will automatically build and deploy the React dashboard!

---

## 🌟 How to Run Locally

### Option 1: Run the Modern Frontend Dashboard (Recommended ⭐)

> **Prerequisite:** Make sure [Node.js](https://nodejs.org/) (version 18 or newer) is installed.

```bash
# 1. Clone the repository
git clone https://github.com/aranavmandani/Big-Data-Mining-for-Customer-Intelligence-in-Online-Grocery-Shopping.git

# 2. Enter the project directory
cd Big-Data-Mining-for-Customer-Intelligence-in-Online-Grocery-Shopping

# 3. Navigate into the frontend directory
cd frontend

# 4. Install dependencies
npm install

# 5. Start the live dashboard
npm run dev
```

🌐 Open your browser and go to: **`http://localhost:5173/`**

---

### Option 2: Run the Python / Streamlit Backend App

> **Prerequisite:** Make sure [Python 3.9+](https://www.python.org/) is installed.

```bash
# 1. Clone the repository (if not already done)
git clone https://github.com/aranavmandani/Big-Data-Mining-for-Customer-Intelligence-in-Online-Grocery-Shopping.git
cd Big-Data-Mining-for-Customer-Intelligence-in-Online-Grocery-Shopping

# 2. Install required Python packages
python3 -m pip install -r requirements.txt

# 3. Start the Streamlit backend application
python3 -m streamlit run backend/app.py
```

🌐 Open your browser and go to: **`http://localhost:8501/`**

---

## 📁 Project Folder Structure

```text
Big-Data-Mining-for-Customer-Intelligence-in-Online-Grocery-Shopping/
├── frontend/                  # 🌟 React + Vite Modern Frontend Dashboard (Vercel Deployment)
│   ├── src/
│   │   ├── components/        # Dashboard tabs (Overview, Segments, Basket, Recs, Peaks, Pipeline)
│   │   ├── data/              # Precomputed self-contained dataset JSONs
│   │   ├── App.jsx            # Main dashboard component
│   │   └── index.css          # Clean design system styles
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── vercel.json            # Vercel SPA routing configuration
│   └── README.md              # Frontend documentation
│
├── backend/                   # 🐍 Python Streamlit Backend Application
│   ├── app.py                 # Streamlit dashboard application
│   └── requirements.txt       # Python backend dependencies
│
├── processed_data/            # Compact precomputed data files (CSVs)
│   ├── customer_segments.csv  # 206,209 customer profiles with cluster labels
│   ├── top_products.csv       # Top 20 bestsellers
│   ├── association_rules.csv  # FP-Growth mined association rules
│   ├── orders_by_day.csv      # Order counts by day of week
│   ├── orders_by_hour.csv     # Order counts by hour of day
│   └── segment_top_products.csv # Top products per segment
│
├── notebooks/                 # Jupyter Notebooks for data preparation and model training
│   ├── 01_data_preprocessing.ipynb
│   └── 02_analysis_and_algorithms.ipynb
│
├── vercel.json                # Root Vercel deployment configuration
├── .vercelignore              # Ignore backend/python/data for fast Vercel builds
├── requirements.txt           # Root Python dependencies
└── README.md                  # Project overview & running instructions
```

---

## 🔬 Data Mining Techniques Implemented
1. **K-Means Clustering ($k=5$)**: Segments 206,209 customer profiles into 5 behavioral cohorts (*Highly Loyal*, *Frequent*, *Bulk Basket*, *Regular*, and *Occasional*).
2. **FP-Growth Algorithm**: Mined frequent itemsets from a 1,000,000 order sample with a minimum support threshold of $0.5\%$.
3. **Association Rule Generation**: 45 cross-sell association rules evaluated with Support, Confidence, and Lift ($\ge 1.2\times$).
