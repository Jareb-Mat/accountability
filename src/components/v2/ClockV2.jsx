import React, { useState, useEffect } from 'react';

function getParts() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return { hm: `${h}:${m}`, s };
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
    </span>
  );
}
