import React, { useState, useEffect } from 'react';

function getParts() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return { hm: `${hour12}:${String(m).padStart(2, '0')}`, s: String(s).padStart(2, '0'), period };
}

export default function ClockV2() {
  const [parts, setParts] = useState(getParts());

  useEffect(() => {
    const interval = setInterval(() => setParts(getParts()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="tabular-nums" style={{ fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
      <span style={{ fontSize: '24px', color: 'var(--text-primary)', fontWeight: 500 }}>
        {parts.hm}
      </span>
      <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginLeft: '2px' }}>
        :{parts.s}
      </span>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
        {parts.period.toLowerCase()}
      </span>
    </span>
  );
}
