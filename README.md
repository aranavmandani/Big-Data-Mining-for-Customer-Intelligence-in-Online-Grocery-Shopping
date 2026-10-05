# 🛒 Big Data Mining for Customer Intelligence in Online Grocery Shopping

A Data Mining Techniques (DMT) project for **Customer Segmentation (K-Means)**, **Market Basket Analysis (FP-Growth)**, **Diurnal Purchasing Behavior**, and **Cross-Sell Product Recommendations** on 3.2M+ Instacart transactions and 206,209 customer profiles.

---

## 🌟 How to Run the Project Locally

Your friend can easily run this project on their computer (Windows, Mac, or Linux) using either the **Modern Frontend Web Dashboard** or the **Python App**.

---

### Option 1: Run the Modern Frontend Dashboard (Recommended ⭐)

> **Prerequisite:** Make sure [Node.js](https://nodejs.org/) (version 18 or newer) is installed.

```bash
# 1. Clone the repository
git clone https://github.com/aranavmandani/DMT-E-Commerce-Customer-Intelligence.git

# 2. Enter the project folder
cd DMT-E-Commerce-Customer-Intelligence

# 3. Navigate into the frontend directory
cd frontend

# 4. Install dependencies
npm install

# 5. Start the live dashboard
npm run dev
```

🌐 Open your browser and go to: **`http://localhost:5173/`**

---

### Option 2: Run the Python / Streamlit App

> **Prerequisite:** Make sure [Python 3.9+](https://www.python.org/) is installed.

```bash
# 1. Clone the repository (if not already done)
git clone https://github.com/aranavmandani/DMT-E-Commerce-Customer-Intelligence.git
cd DMT-E-Commerce-Customer-Intelligence

# 2. Install required Python packages
python3 -m pip install -r requirements.txt

# 3. Start the Streamlit application
python3 -m streamlit run app/app.py
```

🌐 Open your browser and go to: **`http://localhost:8501/`**

---

## 📁 Project Structure

```text
DMT-E-Commerce-Customer-Intelligence/
├── frontend/                  # 🌟 Modern clean light-background React + Vite Dashboard
│   ├── src/
│   │   ├── components/        # Dashboard tabs (Overview, Segments, Basket, Recs, Peaks, Pipeline)
│   │   ├── data/              # Precomputed dataset JSONs
│   │   ├── App.jsx            # Main dashboard component
│   │   └── index.css          # Clean design system styles
│   ├── package.json           # Frontend dependencies
│   └── README.md              # Frontend documentation
│
├── app/                       # Python Streamlit application
│   └── app.py
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
├── requirements.txt           # Python dependencies
└── README.md                  # Project overview & running instructions
```

---

## 🔬 Data Mining Techniques Implemented
1. **K-Means Clustering ($k=5$)**: Segments 206,209 customer profiles into 5 behavioral cohorts (*Highly Loyal*, *Frequent*, *Bulk Basket*, *Regular*, and *Occasional*).
2. **FP-Growth Algorithm**: Mined frequent itemsets from a 1,000,000 order sample with a minimum support threshold of $0.5\%$.
3. **Association Rule Generation**: 45 cross-sell association rules evaluated with Support, Confidence, and Lift ($\ge 1.2\times$).
