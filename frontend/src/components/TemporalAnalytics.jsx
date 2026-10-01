import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  TrendingUp, 
  Sun, 
  Moon, 
  Coffee, 
  ShoppingBag, 
  Zap,
  Info 
} from 'lucide-react';

export default function TemporalAnalytics({ overviewData }) {
  const { orders_by_day, orders_by_hour, summary } = overviewData || {};
  const [hoveredHour, setHoveredHour] = useState(null);

  const maxDayOrders = Math.max(...(orders_by_day || []).map((d) => d.orders));
  const maxHourOrders = Math.max(...(orders_by_hour || []).map((h) => h.orders));

  const formatHour = (h) => {
    if (h === 0) return '12 AM';
    if (h === 12) return '12 PM';
    return h > 12 ? `${h - 12} PM` : `${h} AM`;
  };

  const personas = [
    {
      title: 'Morning Stock-Up Rush',
      hours: '8:00 AM – 11:00 AM',
      icon: Coffee,
      color: '#F59E0B',
      pct: '32.4% of Daily Volume',
      desc: 'High concentration of fresh produce and breakfast pantry items. Highest cart completion velocity.'
    },
    {
      title: 'Midday Sustained Window',
      hours: '12:00 PM – 4:00 PM',
      icon: Sun,
      color: '#10B981',
      pct: '38.8% of Daily Volume',
      desc: 'Consistent replenishment orders during workday breaks. Strong affinity for prepared meals & organic snacks.'
    },
    {
      title: 'Evening Dinner Shoppers',
      hours: '5:00 PM – 8:00 PM',
      icon: ShoppingBag,
      color: '#3B82F6',
      pct: '19.2% of Daily Volume',
      desc: 'Last-minute dinner ingredients and convenience quick-orders. Slightly smaller basket sizes but fast checkout.'
    },
    {
      title: 'Late Night Essentials',
      hours: '9:00 PM – 4:00 AM',
      icon: Moon,
      color: '#8B5CF6',
      pct: '9.6% of Daily Volume',
      desc: 'Next-day scheduled orders and night-owl snack purchases. Lowest hourly order rates (Trough at 3 AM).'
    },
  ];

  return (
    <div className="fade-in">
      {/* 1. Peak Metric Callout Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--brand-amber)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Peak Ordering Window</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-amber)', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                {summary.peak_hour}:00 AM
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {summary.peak_hour_orders.toLocaleString()} orders processed
              </span>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sun size={20} />
            </div>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--brand-emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Highest Volume Day</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-emerald)', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                {summary.peak_day}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {summary.peak_day_orders.toLocaleString()} weekend orders
              </span>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--brand-cyan)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Lowest Ordering Hour</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#94A3B8', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                {summary.lowest_hour}:00 AM
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {summary.lowest_hour_orders.toLocaleString()} baseline orders
              </span>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.05)', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Moon size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Charts Grid: Day of Week & 24h Hourly Curve */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Day of Week Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <h3 className="card-title">
                <Calendar size={18} style={{ color: 'var(--brand-emerald)' }} />
                Orders by Day of Week
              </h3>
              <p className="card-subtitle">
                Weekend surge accounts for 34.7% of total weekly volume
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            {orders_by_day?.map((d) => {
              const isWeekend = d.day === 'Saturday' || d.day === 'Sunday';
              const pct = (d.orders / maxDayOrders) * 100;
              return (
                <div key={d.day} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                    <span style={{ fontWeight: isWeekend ? 700 : 500, color: isWeekend ? '#FFFFFF' : 'var(--text-secondary)' }}>
                      {d.day} {isWeekend && '🔥 Weekend'}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: isWeekend ? 'var(--brand-emerald)' : 'var(--text-primary)' }}>
                      {d.orders.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: isWeekend
                        ? 'linear-gradient(to right, #10B981, #059669)'
                        : 'linear-gradient(to right, #3B82F6, #6366F1)',
                      borderRadius: '5px',
                      transition: 'width 0.6s ease'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <Info size={13} style={{ flexShrink: 0 }} />
            <span>Dataset convention: Day 0 = Saturday, Day 1 = Sunday based on weekend order velocity pattern analysis.</span>
          </div>
        </div>

        {/* 24-Hour Wave Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <h3 className="card-title">
                <Clock size={18} style={{ color: 'var(--brand-cyan)' }} />
                24-Hour Diurnal Order Curve
              </h3>
              <p className="card-subtitle">
                Hourly transaction wave highlighting peak midday traffic
              </p>
            </div>
          </div>

          {/* SVG Area Wave Chart */}
          <div style={{ width: '100%', height: '220px', position: 'relative', marginTop: '10px' }}>
            <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="hourGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Path */}
              {orders_by_hour && (
                <>
                  <path
                    d={`M 0 160 ${orders_by_hour
                      .map((h, idx) => {
                        const x = (idx / 23) * 500;
                        const y = 160 - (h.orders / maxHourOrders) * 140;
                        return `L ${x} ${y}`;
                      })
                      .join(' ')} L 500 160 Z`}
                    fill="url(#hourGradient)"
                  />
                  <path
                    d={`M 0 ${160 - (orders_by_hour[0].orders / maxHourOrders) * 140} ${orders_by_hour
                      .map((h, idx) => {
                        const x = (idx / 23) * 500;
                        const y = 160 - (h.orders / maxHourOrders) * 140;
                        return `L ${x} ${y}`;
                      })
                      .join(' ')}`}
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="3"
                  />

                  {/* Points */}
                  {orders_by_hour.map((h, idx) => {
                    const x = (idx / 23) * 500;
                    const y = 160 - (h.orders / maxHourOrders) * 140;
                    const isPeak = h.hour === summary.peak_hour;
                    const isHovered = hoveredHour?.hour === h.hour;
                    return (
                      <circle
                        key={h.hour}
                        cx={x}
                        cy={y}
                        r={isPeak ? 5.5 : isHovered ? 5 : 2.5}
                        fill={isPeak ? '#F59E0B' : '#FFFFFF'}
                        stroke="#06B6D4"
                        strokeWidth="1.5"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredHour(h)}
                      />
                    );
                  })}
                </>
              )}
            </svg>
          </div>

          {/* Hourly Tooltip Info */}
          <div style={{
            marginTop: '12px',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            {hoveredHour ? (
              <span>
                Hour <strong>{formatHour(hoveredHour.hour)}</strong>: <strong style={{ color: 'var(--brand-cyan)' }}>{hoveredHour.orders.toLocaleString()}</strong> orders
              </span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>Hover points along the wave to view hourly volume</span>
            )}
            <span style={{ color: 'var(--brand-amber)' }}>Peak: 10:00 AM (271,885 orders)</span>
          </div>
        </div>
      </div>

      {/* 3. Shopping Personas Grid */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <h3 className="card-title">
              <Zap size={18} style={{ color: 'var(--brand-amber)' }} />
              Diurnal Shopping Personas & Operational Windows
            </h3>
            <p className="card-subtitle">
              Strategic segmentation based on time-of-day basket composition and replenishment urgency
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {personas.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: `1px solid ${p.color}33`,
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: `${p.color}22`,
                    color: p.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={16} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: p.color }}>
                    {p.pct}
                  </span>
                </div>

                <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#FFFFFF' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--brand-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {p.hours}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
