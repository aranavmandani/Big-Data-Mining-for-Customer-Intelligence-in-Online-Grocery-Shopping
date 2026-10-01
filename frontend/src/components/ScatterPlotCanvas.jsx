import React, { useRef, useEffect, useState } from 'react';
import { ScatterChart, Filter, Info, Eye } from 'lucide-react';

const FEATURE_OPTIONS = [
  { id: 'orders_vs_basket', label: 'Total Orders vs Avg Basket Size', x: 'orders', y: 'avg_basket', xLabel: 'Total Orders', yLabel: 'Avg Products / Order' },
  { id: 'reorder_vs_days', label: 'Reorder Rate vs Days Between Orders', x: 'reorder_rate', y: 'days_gap', xLabel: 'Reorder Rate (0 to 1)', yLabel: 'Avg Days Between Orders' },
  { id: 'orders_vs_reorder', label: 'Total Orders vs Reorder Rate', x: 'orders', y: 'reorder_rate', xLabel: 'Total Orders', yLabel: 'Reorder Rate (0 to 1)' },
  { id: 'products_vs_days', label: 'Total Products vs Days Between Orders', x: 'products', y: 'days_gap', xLabel: 'Total Products Purchased', yLabel: 'Avg Days Between Orders' },
];

const SEGMENT_COLORS = {
  "Highly Loyal Customers": "#10B981",
  "Frequent Customers": "#3B82F6",
  "Bulk Basket Customers": "#8B5CF6",
  "Regular Customers": "#F59E0B",
  "Occasional Customers": "#EF4444"
};

export default function ScatterPlotCanvas({ scatterData, selectedSegment, onSelectSegment }) {
  const canvasRef = useRef(null);
  const [activeFeature, setActiveFeature] = useState(FEATURE_OPTIONS[0]);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [visibleClusters, setVisibleClusters] = useState({
    "Highly Loyal Customers": true,
    "Frequent Customers": true,
    "Bulk Basket Customers": true,
    "Regular Customers": true,
    "Occasional Customers": true
  });

  const toggleCluster = (seg) => {
    setVisibleClusters((prev) => ({ ...prev, [seg]: !prev[seg] }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !scatterData || scatterData.length === 0) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 30, right: 30, bottom: 45, left: 60 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Determine min/max for active axes
    const xKey = activeFeature.x;
    const yKey = activeFeature.y;

    const filteredData = scatterData.filter((p) => visibleClusters[p.segment]);

    let minX = 0;
    let maxX = Math.max(...scatterData.map((d) => d[xKey])) * 1.05;
    let minY = 0;
    let maxY = Math.max(...scatterData.map((d) => d[yKey])) * 1.08;

    if (xKey === 'reorder_rate') maxX = 1.05;

    // Coordinate mapping functions
    const mapX = (val) => padding.left + (val / maxX) * plotWidth;
    const mapY = (val) => height - padding.bottom - (val / maxY) * plotHeight;

    // 1. Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const numYTicks = 5;
    for (let i = 0; i <= numYTicks; i++) {
      const yVal = (maxY / numYTicks) * i;
      const yPos = mapY(yVal);
      ctx.beginPath();
      ctx.moveTo(padding.left, yPos);
      ctx.lineTo(width - padding.right, yPos);
      ctx.stroke();

      // Y Axis Label
      ctx.fillStyle = '#64748B';
      ctx.font = '10.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(yVal.toFixed(xKey === 'reorder_rate' && yKey === 'reorder_rate' ? 2 : 1), padding.left - 10, yPos + 3);
    }

    const numXTicks = 6;
    for (let i = 0; i <= numXTicks; i++) {
      const xVal = (maxX / numXTicks) * i;
      const xPos = mapX(xVal);
      ctx.beginPath();
      ctx.moveTo(xPos, padding.top);
      ctx.lineTo(xPos, height - padding.bottom);
      ctx.stroke();

      // X Axis Label
      ctx.fillStyle = '#64748B';
      ctx.font = '10.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(xVal.toFixed(xKey === 'reorder_rate' ? 2 : 0), xPos, height - padding.bottom + 18);
    }

    // Axis Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(activeFeature.xLabel, padding.left + plotWidth / 2, height - 10);

    ctx.save();
    ctx.translate(16, padding.top + plotHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(activeFeature.yLabel, 0, 0);
    ctx.restore();

    // 2. Draw Data Points
    filteredData.forEach((point) => {
      const px = mapX(point[xKey]);
      const py = mapY(point[yKey]);
      const color = SEGMENT_COLORS[point.segment] || '#6366F1';
      const isHovered = hoveredPoint && hoveredPoint.id === point.id;
      const isSelected = selectedSegment && point.segment === selectedSegment;

      ctx.beginPath();
      ctx.arc(px, py, isHovered ? 6.5 : isSelected ? 4.5 : 3, 0, 2 * Math.PI);

      if (isHovered) {
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
      } else {
        ctx.fillStyle = color;
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = selectedSegment ? (point.segment === selectedSegment ? 0.95 : 0.2) : 0.7;
      ctx.fill();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
    });

  }, [scatterData, activeFeature, visibleClusters, hoveredPoint, selectedSegment]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !scatterData) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = ((e.clientY - rect.top) * (canvas.height / rect.height));

    const padding = { top: 30, right: 30, bottom: 45, left: 60 };
    const plotWidth = canvas.width - padding.left - padding.right;
    const plotHeight = canvas.height - padding.top - padding.bottom;

    const xKey = activeFeature.x;
    const yKey = activeFeature.y;
    let maxX = Math.max(...scatterData.map((d) => d[xKey])) * 1.05;
    let maxY = Math.max(...scatterData.map((d) => d[yKey])) * 1.08;
    if (xKey === 'reorder_rate') maxX = 1.05;

    const mapX = (val) => padding.left + (val / maxX) * plotWidth;
    const mapY = (val) => canvas.height - padding.bottom - (val / maxY) * plotHeight;

    let nearest = null;
    let minDist = 15;

    scatterData.forEach((point) => {
      if (!visibleClusters[point.segment]) return;
      const px = mapX(point[xKey]);
      const py = mapY(point[yKey]);
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist < minDist) {
        minDist = dist;
        nearest = point;
      }
    });

    setHoveredPoint(nearest);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <h3 className="card-title">
            <ScatterChart size={18} style={{ color: 'var(--brand-primary)' }} />
            2D K-Means Behavioral Cluster Projection
          </h3>
          <p className="card-subtitle">
            Stratified sample of customer clusters projected onto behavioral dimensions (k=5)
          </p>
        </div>

        {/* Dimension Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Axes:</span>
          <select
            className="input-control select-control"
            style={{ padding: '6px 28px 6px 12px', fontSize: '12px', width: 'auto' }}
            value={activeFeature.id}
            onChange={(e) => {
              const f = FEATURE_OPTIONS.find((opt) => opt.id === e.target.value);
              if (f) setActiveFeature(f);
            }}
          >
            {FEATURE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cluster Legend Filter Toggles */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
        {Object.keys(SEGMENT_COLORS).map((seg) => {
          const isVisible = visibleClusters[seg];
          const isSelected = selectedSegment === seg;
          return (
            <button
              key={seg}
              onClick={() => toggleCluster(seg)}
              className="btn btn-sm"
              style={{
                background: isVisible ? 'rgba(30, 41, 59, 0.7)' : 'rgba(15, 23, 42, 0.4)',
                border: `1px solid ${isVisible ? SEGMENT_COLORS[seg] : 'var(--border-subtle)'}`,
                color: isVisible ? '#FFFFFF' : 'var(--text-muted)',
                padding: '4px 10px',
                fontSize: '11.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                opacity: isVisible ? 1 : 0.5
              }}
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: SEGMENT_COLORS[seg]
              }}></span>
              <span>{seg}</span>
            </button>
          );
        })}
      </div>

      {/* Canvas Plot */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'rgba(9, 13, 22, 0.85)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={420}
          style={{ width: '100%', maxWidth: '800px', height: 'auto', display: 'block', cursor: hoveredPoint ? 'pointer' : 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
        />

        {/* Hover Tooltip Popup */}
        {hoveredPoint && (
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${SEGMENT_COLORS[hoveredPoint.segment]}`,
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            fontSize: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            minWidth: '200px',
            pointerEvents: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
              <strong style={{ color: '#FFFFFF' }}>User #{hoveredPoint.id}</strong>
              <span style={{ color: SEGMENT_COLORS[hoveredPoint.segment], fontWeight: 700, fontSize: '11px' }}>
                {hoveredPoint.segment}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Total Orders:</span>
              <strong style={{ color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>{hoveredPoint.orders}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Avg Basket Size:</span>
              <strong style={{ color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>{hoveredPoint.avg_basket} items</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Reorder Rate:</span>
              <strong style={{ color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>{(hoveredPoint.reorder_rate * 100).toFixed(1)}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Days Between Orders:</span>
              <strong style={{ color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>{hoveredPoint.days_gap} days</strong>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
        <span>Sample: 1,500 clustered customers plotted across 5 behavior clusters</span>
        <span>Notice distinct cluster separation along basket size & order frequency axes</span>
      </div>
    </div>
  );
}
