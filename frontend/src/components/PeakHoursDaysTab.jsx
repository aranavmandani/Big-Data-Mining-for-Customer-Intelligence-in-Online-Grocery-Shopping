import React from 'react';
import { 
  Clock, 
  Calendar, 
  Sun, 
  Moon, 
  TrendingUp, 
  Info 
} from 'lucide-react';

export default function PeakHoursDaysTab({ overviewData }) {
  const { orders_by_day, orders_by_hour, summary } = overviewData || {};

  const maxDayOrders = Math.max(...(orders_by_day || []).map((d) => d.orders));
  const maxHourOrders = Math.max(...(orders_by_hour || []).map((h) => h.orders));

  const formatHour = (h) => {
    if (h === 0) return '12 AM';
    if (h === 12) return '12 PM';
    return h > 12 ? `${h - 12} PM` : `${h} AM`;
  };

  return (
    <div>
      {/* 1. Peak & Lowest Hour Metric Callouts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Peak Ordering Hour</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#F59E0B', marginTop: '2px' }}>
                {summary.peak_hour}:00 AM
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {summary.peak_hour_orders.toLocaleString()} orders
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--amber-light)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sun size={22} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #3B82F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Lowest Ordering Hour</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#3B82F6', marginTop: '2px' }}>
                {summary.lowest_hour}:00 AM
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {summary.lowest_hour_orders.toLocaleString()} orders
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Moon size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Orders by Day of Week */}
      <div className="card">
        <h3 className="card-title">
          <Calendar size={18} style={{ color: '#10B981' }} />
          📅 Orders by Day of Week
        </h3>
        <p className="card-subtitle">
          Weekly transaction distribution showing weekend concentration
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
          {orders_by_day?.map((d) => {
            const isWeekend = d.day === 'Saturday' || d.day === 'Sunday';
            const pct = (d.orders / maxDayOrders) * 100;
            return (
              <div key={d.day} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ fontWeight: isWeekend ? 700 : 500, color: isWeekend ? '#0F172A' : 'var(--text-secondary)' }}>
                    {d.day} {isWeekend && '⭐'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: isWeekend ? '#10B981' : 'var(--text-main)' }}>
                    {d.orders.toLocaleString()} orders
                  </span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'var(--bg-subtle)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: isWeekend ? '#10B981' : '#3B82F6',
                    borderRadius: '5px'
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={14} style={{ flexShrink: 0 }} />
          <span><em>Assumption:</em> The dataset does not officially document which number maps to which day. Here 0 is treated as Saturday and 1 as Sunday based on weekend order-volume patterns.</span>
        </div>
      </div>

      {/* 3. Orders by Hour of Day */}
      <div className="card">
        <h3 className="card-title">
          <Clock size={18} style={{ color: '#3B82F6' }} />
          ⏰ Orders by Hour of Day (24-Hour Curve)
        </h3>
        <p className="card-subtitle">
          Hourly ordering volume from midnight (0:00) to 23:00
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '14px' }}>
          {orders_by_hour?.map((h) => {
            const isPeak = h.hour === summary.peak_hour;
            const pct = (h.orders / maxHourOrders) * 100;
            return (
              <div key={h.hour} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 100px', alignItems: 'center', gap: '12px', fontSize: '12.5px' }}>
                <span style={{ fontWeight: isPeak ? 700 : 500, color: isPeak ? '#F59E0B' : 'var(--text-secondary)' }}>
                  {formatHour(h.hour)}
                </span>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: isPeak ? '#F59E0B' : '#3B82F6',
                    borderRadius: '4px'
                  }}></div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, textAlign: 'right', color: isPeak ? '#F59E0B' : 'var(--text-main)' }}>
                  {h.orders.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
