import React, { useState } from 'react';
import { Clock, Info } from 'lucide-react';

export default function HeatmapGrid({ heatmapMatrix }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  if (!heatmapMatrix || heatmapMatrix.length === 0) return null;

  // Find global min and max for color scaling
  let minVal = Infinity;
  let maxVal = -Infinity;

  heatmapMatrix.forEach((row) => {
    row.hours.forEach((val) => {
      if (val < minVal) minVal = val;
      if (val > maxVal) maxVal = val;
    });
  });

  const getCellColor = (val) => {
    const ratio = (val - minVal) / (maxVal - minVal);
    // Custom gradient from deep indigo -> violet -> vibrant emerald/cyan -> bright amber/white
    if (ratio < 0.15) {
      return `rgba(30, 41, 59, ${0.4 + ratio * 2})`;
    } else if (ratio < 0.45) {
      return `rgba(99, 102, 241, ${0.4 + (ratio - 0.15) * 1.5})`;
    } else if (ratio < 0.75) {
      return `rgba(16, 185, 129, ${0.6 + (ratio - 0.45) * 1.2})`;
    } else {
      return `rgba(245, 158, 11, ${0.75 + (ratio - 0.75) * 1.0})`;
    }
  };

  const formatHour = (h) => {
    if (h === 0) return '12 AM';
    if (h === 12) return '12 PM';
    return h > 12 ? `${h - 12} PM` : `${h} AM`;
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <h3 className="card-title">
            <Clock size={18} style={{ color: 'var(--brand-cyan)' }} />
            7-Day × 24-Hour Order Intensity Heatmap
          </h3>
          <p className="card-subtitle">
            Visualizing ordering volume distribution across every hour of the week (Instacart Mining Sample)
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
          <span>Low Volume</span>
          <div style={{
            width: '100px',
            height: '10px',
            borderRadius: '6px',
            background: 'linear-gradient(to right, rgba(30, 41, 59, 0.6), rgba(99, 102, 241, 0.8), rgba(16, 185, 129, 0.9), #F59E0B)'
          }}></div>
          <span>Peak Volume</span>
        </div>
      </div>

      <div className="heatmap-wrapper">
        <table className="heatmap-table">
          <thead>
            <tr>
              <th className="heatmap-day-label" style={{ width: '90px' }}></th>
              {Array.from({ length: 24 }).map((_, h) => (
                <th key={h} className="heatmap-hour-label" style={{ width: '3.8%' }}>
                  {h % 3 === 0 ? formatHour(h).replace(' ', '') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmapMatrix.map((row) => (
              <tr key={row.day}>
                <td className="heatmap-day-label">
                  <span style={{ 
                    color: row.day === 'Saturday' || row.day === 'Sunday' ? 'var(--brand-emerald)' : 'var(--text-secondary)',
                    fontWeight: row.day === 'Saturday' || row.day === 'Sunday' ? 700 : 500
                  }}>
                    {row.day}
                  </span>
                </td>
                {row.hours.map((val, h) => {
                  const isHovered = hoveredCell && hoveredCell.day === row.day && hoveredCell.hour === h;
                  const isPeak = val > maxVal * 0.92;
                  return (
                    <td
                      key={h}
                      className="heatmap-cell"
                      style={{
                        backgroundColor: getCellColor(val),
                        position: 'relative'
                      }}
                      onMouseEnter={() => setHoveredCell({ day: row.day, hour: h, val })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {isPeak && (
                        <div style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: '#FFFFFF',
                          boxShadow: '0 0 4px #FFFFFF'
                        }}></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hover Info Tooltip Banner */}
      <div style={{
        marginTop: '12px',
        padding: '10px 16px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12.5px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={15} style={{ color: 'var(--brand-cyan)' }} />
          {hoveredCell ? (
            <span>
              <strong>{hoveredCell.day}</strong> at <strong>{formatHour(hoveredCell.hour)}</strong>: approximately{' '}
              <strong style={{ color: 'var(--brand-emerald)', fontFamily: 'var(--font-mono)' }}>
                {hoveredCell.val.toLocaleString()}
              </strong>{' '}
              orders processed
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>
              Hover over any grid square to inspect exact hourly order volumes and temporal intensity.
            </span>
          )}
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Weekend volume peaks between <strong style={{ color: 'var(--brand-amber)' }}>10:00 AM – 3:00 PM</strong>
        </div>
      </div>
    </div>
  );
}
