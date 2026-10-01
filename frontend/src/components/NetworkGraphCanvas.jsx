import React, { useRef, useEffect, useState } from 'react';
import { Network, ZoomIn, ZoomOut, RotateCcw, Filter, Sparkles } from 'lucide-react';

export default function NetworkGraphCanvas({ graphData, onSelectProduct, minLift = 1.2 }) {
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [liftFilter, setLiftFilter] = useState(minLift);

  // Filter links by lift
  const activeLinks = (graphData?.links || []).filter((l) => l.lift >= liftFilter);
  const connectedNodeIds = new Set();
  activeLinks.forEach((l) => {
    connectedNodeIds.add(l.source);
    connectedNodeIds.add(l.target);
  });

  const activeNodes = (graphData?.nodes || []).filter((n) => connectedNodeIds.has(n.id));

  // Build physics / positions
  const [nodePositions, setNodePositions] = useState({});

  useEffect(() => {
    if (!activeNodes.length) return;

    const width = 800;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 190;

    const positions = {};
    const total = activeNodes.length;

    activeNodes.forEach((node, i) => {
      // distribute along circle with subtle jitter for organic feel
      const angle = (i / total) * 2 * Math.PI;
      const r = radius + ((i % 3) - 1) * 35;
      positions[node.id] = {
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
        vx: 0,
        vy: 0,
        radius: 12 + Math.min(16, (node.degree || 1) * 2),
        color: node.is_organic ? '#10B981' : '#3B82F6',
        ...node
      };
    });

    setNodePositions(positions);
  }, [graphData, liftFilter]);

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw background subtle grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const currentHovered = hoveredNode || selectedNode;

    // 1. Draw Links
    activeLinks.forEach((link) => {
      const srcPos = nodePositions[link.source];
      const tgtPos = nodePositions[link.target];
      if (!srcPos || !tgtPos) return;

      const isConnectedToHover =
        currentHovered && (link.source === currentHovered.id || link.target === currentHovered.id);

      ctx.beginPath();
      ctx.moveTo(srcPos.x, srcPos.y);
      ctx.lineTo(tgtPos.x, tgtPos.y);

      if (isConnectedToHover) {
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = Math.min(6, Math.max(2, (link.lift - 1) * 1.5));
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 10;
      } else {
        const alpha = currentHovered ? 0.1 : 0.35;
        ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
        ctx.lineWidth = Math.min(3, Math.max(1, (link.lift - 1) * 0.8));
        ctx.shadowBlur = 0;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // 2. Draw Nodes
    Object.values(nodePositions).forEach((pos) => {
      const isHovered = currentHovered && currentHovered.id === pos.id;
      const isNeighbor =
        currentHovered &&
        activeLinks.some(
          (l) =>
            (l.source === currentHovered.id && l.target === pos.id) ||
            (l.target === currentHovered.id && l.source === pos.id)
        );

      // Outer glow
      if (isHovered || isNeighbor) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.radius + 6, 0, 2 * Math.PI);
        ctx.fillStyle = isHovered ? 'rgba(245, 158, 11, 0.3)' : 'rgba(99, 102, 241, 0.25)';
        ctx.fill();
      }

      // Main Node Circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.radius, 0, 2 * Math.PI);
      const grad = ctx.createRadialGradient(
        pos.x - 3,
        pos.y - 3,
        2,
        pos.x,
        pos.y,
        pos.radius
      );
      grad.addColorStop(0, pos.is_organic ? '#34D399' : '#60A5FA');
      grad.addColorStop(1, pos.is_organic ? '#059669' : '#2563EB');

      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = isHovered ? 2.5 : 1;
      ctx.stroke();

      // Node Label
      ctx.fillStyle = isHovered || isNeighbor ? '#FFFFFF' : '#94A3B8';
      ctx.font = isHovered
        ? 'bold 12px "Plus Jakarta Sans", sans-serif'
        : '10.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const shortName = pos.name.replace('Organic ', 'Org. ');
      ctx.fillText(shortName, pos.x, pos.y + pos.radius + 5);
    });
  }, [nodePositions, activeLinks, hoveredNode, selectedNode]);

  // Handle Mouse Move over Canvas
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = ((e.clientY - rect.top) * (canvas.height / rect.height));

    let found = null;
    for (const pos of Object.values(nodePositions)) {
      const dx = x - pos.x;
      const dy = y - pos.y;
      if (Math.sqrt(dx * dx + dy * dy) <= pos.radius + 4) {
        found = pos;
        break;
      }
    }
    setHoveredNode(found);
  };

  const handleClick = () => {
    if (hoveredNode) {
      setSelectedNode(hoveredNode);
      if (onSelectProduct) {
        onSelectProduct(hoveredNode.name);
      }
    } else {
      setSelectedNode(null);
    }
  };

  return (
    <div className="card" style={{ position: 'relative' }}>
      <div className="card-header">
        <div className="card-title-group">
          <h3 className="card-title">
            <Network size={18} style={{ color: 'var(--brand-primary)' }} />
            Association Rules Network Topology (FP-Growth)
          </h3>
          <p className="card-subtitle">
            Co-purchase network graph where edges represent association rules weighted by Lift & Confidence
          </p>
        </div>

        {/* Lift Threshold Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <span>Min Lift:</span>
            <strong style={{ color: 'var(--brand-amber)', fontFamily: 'var(--font-mono)' }}>
              {liftFilter.toFixed(1)}x
            </strong>
            <input
              type="range"
              min="1.0"
              max="4.5"
              step="0.1"
              value={liftFilter}
              onChange={(e) => setLiftFilter(parseFloat(e.target.value))}
              style={{ width: '90px', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
              Organic
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }}></span>
              Standard
            </span>
          </div>
        </div>
      </div>

      {/* Canvas Canvas Container */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'rgba(9, 13, 22, 0.8)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <canvas
          ref={canvasRef}
          width={820}
          height={500}
          style={{ width: '100%', maxWidth: '820px', height: 'auto', display: 'block', cursor: hoveredNode ? 'pointer' : 'default' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredNode(null)}
          onClick={handleClick}
        />

        {/* Floating Node Inspector */}
        {hoveredNode && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            fontSize: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            pointerEvents: 'none'
          }}>
            <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '13px' }}>
              {hoveredNode.name}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Degree: <strong style={{ color: 'var(--brand-cyan)' }}>{hoveredNode.degree} connected rules</strong>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Max Rule Lift: <strong style={{ color: 'var(--brand-amber)' }}>{hoveredNode.max_lift}x</strong>
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--brand-emerald)', marginTop: '2px' }}>
              Click node to load recommendations in Recommender tab
            </div>
          </div>
        )}
      </div>

      {/* Network Insights Footer */}
      <div style={{
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11.5px',
        color: 'var(--text-muted)'
      }}>
        <div>
          Showing <strong>{activeNodes.length}</strong> active product nodes and <strong>{activeLinks.length}</strong> association edges (FP-Growth support ≥ 0.5%)
        </div>
        <div style={{ color: 'var(--brand-cyan)' }}>
          Strongest Association: <strong>Limes ↔ Large Lemon (Lift 4.08x)</strong> & <strong>Garlic ↔ Onion (Lift 5.81x)</strong>
        </div>
      </div>
    </div>
  );
}
