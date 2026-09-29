"""Streamlit entry point for the dashboard."""

from pathlib import Path
import runpy


runpy.run_path(str(Path(__file__).with_name("app_final.py")))
