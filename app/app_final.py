import os

import altair as alt
import pandas as pd
import streamlit as st


# ============================================================
# PAGE CONFIGURATION
# ============================================================

st.set_page_config(
    page_title="E-Commerce Customer Intelligence",
    page_icon="🛒",
    layout="wide"
)


# ============================================================
# CONSTANTS
# ============================================================

# NOTE: Instacart does not officially document which number maps to which day.
# We use the most common convention from public analyses of this dataset
# (0 = Saturday, 1 = Sunday), based on weekend order-volume patterns.
# Treat this mapping as an assumption, not a confirmed fact.
DAY_NAMES = {
    0: "Saturday",
    1: "Sunday",
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
    6: "Friday",
}

DAY_ORDER = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday",
]

SEGMENT_STRATEGIES = {
    "Highly Loyal Customers": (
        "Very frequent shoppers with the highest reorder rate. "
        "Protect them with loyalty rewards, early access and subscriptions."
    ),
    "Frequent Customers": (
        "Regular, habit-driven shoppers. "
        "Encourage larger baskets with cross-sell offers and bundles."
    ),
    "Bulk Basket Customers": (
        "Fewer orders but very large baskets. "
        "Offer bulk discounts, free-delivery thresholds and stock-up promotions."
    ),
    "Regular Customers": (
        "Moderate activity with low reorder rate. "
        "Nudge them to reorder using reminders and personalised recommendations."
    ),
    "Occasional Customers": (
        "Low activity and the longest gap between orders. "
        "Run win-back campaigns and first-order-again discounts."
    ),
}

SEGMENT_FEATURES = [
    "total_orders",
    "total_products",
    "avg_products_per_order",
    "reorder_rate",
    "avg_days_between_orders",
]


# ============================================================
# FILE PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_DIR = os.path.dirname(os.path.abspath(__file__))


def find_file(*relative_parts):
    """Look for a file in the project root first, then next to the app."""
    for root in (BASE_DIR, APP_DIR):
        path = os.path.join(root, *relative_parts)
        if os.path.exists(path):
            return path
    return os.path.join(BASE_DIR, *relative_parts)


customer_file = find_file("processed_data", "customer_segments.csv")
products_file = find_file("processed_data", "top_products.csv")
rules_file = find_file("processed_data", "association_rules.csv")
orders_by_day_file = find_file("processed_data", "orders_by_day.csv")
orders_by_hour_file = find_file("processed_data", "orders_by_hour.csv")


# ============================================================
# LOAD DATA (cached so the app stays fast on every interaction)
# ============================================================

@st.cache_data(show_spinner="Loading data...")
def load_csv(path):
    return pd.read_csv(path)


missing = [
    p for p in (
        customer_file, products_file, rules_file,
        orders_by_day_file, orders_by_hour_file,
    )
    if not os.path.exists(p)
]

if missing:
    st.error(
        "Required data files were not found:\n\n"
        + "\n".join(f"- `{p}`" for p in missing)
        + "\n\nRun the notebook first so it creates the `processed_data` folder."
    )
    st.stop()


customer_segments = load_csv(customer_file)
top_products = load_csv(products_file)
rules = load_csv(rules_file)
orders_by_day = load_csv(orders_by_day_file)
orders_by_hour = load_csv(orders_by_hour_file)


# ============================================================
# TITLE
# ============================================================

st.title("🛒 E-Commerce Customer Intelligence")

st.write(
    "Data Mining Dashboard for Customer Segmentation, "
    "Product Analysis, Purchasing Behavior and Recommendations"
)


# ============================================================
# DASHBOARD METRICS
# ============================================================

total_customers = customer_segments["user_id"].nunique()
total_orders = customer_segments["total_orders"].sum()
avg_basket = customer_segments["avg_products_per_order"].mean()
avg_reorder = customer_segments["reorder_rate"].mean()
total_rules = len(rules)

col1, col2, col3, col4, col5 = st.columns(5)

col1.metric("Total Customers", f"{total_customers:,}")
col2.metric("Total Orders", f"{total_orders:,.0f}")
col3.metric("Avg Products / Order", f"{avg_basket:.1f}")
col4.metric("Avg Reorder Rate", f"{avg_reorder * 100:.1f}%")
col5.metric("Association Rules", total_rules)


# ============================================================
# CUSTOMER SEGMENTATION
# ============================================================

st.header("👥 Customer Segmentation")

segment_counts = (
    customer_segments["customer_segment"]
    .value_counts()
    .rename_axis("Segment")
    .reset_index(name="Customers")
)

segment_chart = (
    alt.Chart(segment_counts)
    .mark_bar()
    .encode(
        x=alt.X("Segment:N", sort="-y", title=None,
                axis=alt.Axis(labelAngle=-20)),
        y=alt.Y("Customers:Q", title="Number of Customers"),
        tooltip=["Segment", alt.Tooltip("Customers:Q", format=",")],
    )
)

st.altair_chart(segment_chart, use_container_width=True)


st.subheader("Customer Segment Characteristics")

segment_summary = (
    customer_segments
    .groupby("customer_segment")[SEGMENT_FEATURES]
    .mean()
    .round(2)
    .sort_values("total_orders", ascending=False)
)

st.dataframe(segment_summary, width="stretch")


st.subheader("Suggested Business Strategy per Segment")

strategy_table = pd.DataFrame({
    "Segment": segment_summary.index,
    "Suggested Strategy": [
        SEGMENT_STRATEGIES.get(s, "No strategy defined for this segment.")
        for s in segment_summary.index
    ],
})

st.dataframe(strategy_table, width="stretch", hide_index=True)


# ------------------------------------------------------------
# Customer lookup
# ------------------------------------------------------------

st.subheader("🔎 Customer Lookup")

lookup_id = st.number_input(
    "Enter a customer user_id:",
    min_value=int(customer_segments["user_id"].min()),
    max_value=int(customer_segments["user_id"].max()),
    value=int(customer_segments["user_id"].min()),
    step=1,
)

customer_row = customer_segments[customer_segments["user_id"] == lookup_id]

if customer_row.empty:
    st.info("No customer found with this user_id.")
else:
    row = customer_row.iloc[0]
    segment_name = row["customer_segment"]

    st.success(f"Customer {lookup_id} belongs to: **{segment_name}**")
    st.caption(SEGMENT_STRATEGIES.get(segment_name, ""))

    c1, c2, c3, c4, c5 = st.columns(5)
    c1.metric("Total Orders", f"{row['total_orders']:.0f}")
    c2.metric("Total Products", f"{row['total_products']:.0f}")
    c3.metric("Products / Order", f"{row['avg_products_per_order']:.1f}")
    c4.metric("Reorder Rate", f"{row['reorder_rate'] * 100:.1f}%")
    c5.metric("Days Between Orders", f"{row['avg_days_between_orders']:.1f}")


# ============================================================
# TOP PRODUCTS
# ============================================================

st.header("🛍️ Top 20 Most Purchased Products")

products_chart = (
    alt.Chart(top_products)
    .mark_bar()
    .encode(
        y=alt.Y("product_name:N", sort="-x", title=None),
        x=alt.X("purchase_count:Q", title="Number of Purchases"),
        tooltip=[
            alt.Tooltip("product_name:N", title="Product"),
            alt.Tooltip("purchase_count:Q", title="Purchases", format=","),
        ],
    )
)

st.altair_chart(products_chart, use_container_width=True)

st.subheader("Product Purchase Statistics")

st.dataframe(top_products, width="stretch", hide_index=True)


# ============================================================
# ORDERS BY DAY OF WEEK AND HOUR
# ============================================================

st.header("📅 Orders by Day of Week")

day_chart = (
        alt.Chart(orders_by_day)
        .mark_bar()
        .encode(
            x=alt.X("day:N", sort=DAY_ORDER, title=None),
            y=alt.Y("orders:Q"),
            tooltip=["day:N", alt.Tooltip("orders:Q", format=",")],
        )
    )

st.altair_chart(day_chart, use_container_width=True)

st.caption(
    "Assumption: the dataset does not document which number is which day. "
    "Here 0 is treated as Saturday and 1 as Sunday, based on "
    "weekend order-volume patterns."
)

st.header("⏰ Orders by Hour of Day")

hour_chart = (
        alt.Chart(orders_by_hour)
        .mark_line(point=True)
        .encode(
            x=alt.X("hour:O", title="Hour of Day"),
            y=alt.Y("orders:Q"),
            tooltip=["hour:O", alt.Tooltip("orders:Q", format=",")],
        )
    )

st.altair_chart(hour_chart, use_container_width=True)

peak_row = orders_by_hour.loc[orders_by_hour["orders"].idxmax()]
lowest_row = orders_by_hour.loc[orders_by_hour["orders"].idxmin()]

col1, col2 = st.columns(2)

col1.metric(
    "Peak Ordering Hour",
    f"{peak_row['hour']}:00",
    f"{peak_row['orders']:,} orders",
)

col2.metric(
    "Lowest Ordering Hour",
    f"{lowest_row['hour']}:00",
    f"{lowest_row['orders']:,} orders",
)


# ============================================================
# PRODUCT RECOMMENDATION
# ============================================================

st.header("🤖 Product Recommendation")

st.write(
    "Select a product to find related products "
    "using association rules discovered by FP-Growth."
)

available_products = sorted(rules["antecedents"].dropna().unique())

col_a, col_b, col_c = st.columns([2, 1, 1])

with col_a:
    selected_product = st.selectbox("Select a product:", available_products)

with col_b:
    min_lift = st.slider(
        "Minimum lift",
        min_value=1.0,
        max_value=2.5,
        value=1.2,
        step=0.05,
        help="Lift above 1 means the products are bought together more "
             "often than by chance. Higher is a stronger association.",
    )

with col_c:
    max_results = st.slider("Max recommendations", 1, 10, 5)


all_matches = rules[rules["antecedents"] == selected_product]

recommendations = (
    all_matches[all_matches["lift"] >= min_lift]
    .sort_values(["lift", "confidence"], ascending=False)
    .head(max_results)
)

if len(recommendations) > 0:

    st.subheader(f"Recommended products for {selected_product}")

    recommendation_display = recommendations[
        ["consequents", "support", "confidence", "lift"]
    ].copy()

    recommendation_display["support"] = (
        recommendation_display["support"] * 100
    ).round(2)

    recommendation_display["confidence"] = (
        recommendation_display["confidence"] * 100
    ).round(2)

    recommendation_display["lift"] = recommendation_display["lift"].round(2)

    recommendation_display = recommendation_display.rename(
        columns={
            "consequents": "Recommended Product",
            "support": "Support (%)",
            "confidence": "Confidence (%)",
            "lift": "Lift",
        }
    )

    st.dataframe(recommendation_display, width="stretch", hide_index=True)

elif len(all_matches) > 0:

    st.info(
        f"{len(all_matches)} rule(s) exist for this product, but none reach a "
        f"lift of {min_lift:.2f}. Lower the minimum lift to see them."
    )

else:

    st.info("No recommendations available for this product.")


# ============================================================
# PROJECT INFORMATION
# ============================================================

st.header("📊 Data Mining Techniques Used")

col1, col2, col3 = st.columns(3)

with col1:
    st.subheader("K-Means")
    st.write(
        "Used to segment customers based on "
        "their purchasing behavior."
    )

with col2:
    st.subheader("FP-Growth")
    st.write(
        "Used to discover frequently purchased "
        "product combinations."
    )

with col3:
    st.subheader("Association Rules")
    st.write(
        "Used to generate product recommendations "
        "using support, confidence and lift."
    )


# ============================================================
# LIMITATIONS
# ============================================================

with st.expander("⚠️ Limitations of this analysis"):
    st.markdown(
        """
- **Day-of-week labels are an assumption.** The dataset does not document
  the mapping from numbers to days.
- **Association rules use only the 100 most purchased products** with a
  minimum support of 1%, so recommendations are limited to popular items
  and are dominated by bananas.
- **`days_since_prior_order` is capped at 30 days** in the source data,
  which affects the "days between orders" feature.
- **Segments come from K-Means with k = 5.** Cluster names were assigned
  manually after inspecting each cluster's average behavior.
- **No time-based validation** was performed for the recommendations.
        """
    )


# ============================================================
# FOOTER
# ============================================================

st.divider()

st.caption("E-Commerce Big Data Mining for Customer Intelligence")
