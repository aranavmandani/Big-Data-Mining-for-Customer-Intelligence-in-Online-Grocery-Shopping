# DMT E-Commerce Customer Intelligence

Interactive Streamlit dashboard for customer segmentation, product analysis,
shopping behaviour, and association-rule recommendations.

## Run locally

```bash
git clone https://github.com/aranavmandani/DMT-E-Commerce-Customer-Intelligence.git
cd DMT-E-Commerce-Customer-Intelligence
python3 -m pip install -r requirements.txt
python3 -m streamlit run app/app.py
```

The compact, precomputed files required by the dashboard are included in
`processed_data/`, so running the app does not require downloading the raw
Instacart dataset.

## Recreate the analysis

The notebook in `notebooks/` is provided for reproducing the analysis. It
requires the raw dataset files, which are intentionally excluded from GitHub
because of their size.
