import React, { useState, useEffect } from 'react';

function GHPagesBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isGHPages =
      window.location.hostname.endsWith('github.io') ||
      window.location.hostname.endsWith('githubusercontent.com');
    const dismissed = sessionStorage.getItem('ghpages-banner-dismissed');
    if (isGHPages && !dismissed) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('ghpages-banner-dismissed', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '20px',
        padding: '44px 40px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        color: '#fff',
        boxShadow: '0 32px 64px rgba(0, 0, 0, 0.6)',
      }}>
        <div style={{ fontSize: '52px', marginBottom: '18px', lineHeight: 1 }}>🚀</div>
        <h2 style={{ marginBottom: '10px', fontWeight: 700, fontSize: '22px', letterSpacing: '-0.3px' }}>
          GitHub Pages Preview
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, marginBottom: '10px', fontSize: '15px' }}>
          This app is hosted as a <strong style={{ color: '#fff' }}>portfolio showcase</strong>.
          Smart contracts run on a local Hardhat network — live blockchain interaction isn't available here.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontSize: '13px', marginBottom: '32px' }}>
          You can explore the full UI and connect MetaMask, but transactions and on-chain reads
          require the local Hardhat node running on your own machine.
        </p>
        <button
          onClick={dismiss}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            padding: '13px 32px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            letterSpacing: '0.2px',
            transition: 'opacity 0.15s',
          }}
          onMouseOver={e => e.target.style.opacity = '0.88'}
          onMouseOut={e => e.target.style.opacity = '1'}
        >
          Explore the Demo →
        </button>
      </div>
    </div>
  );
}

export default GHPagesBanner;
