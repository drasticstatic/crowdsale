import React, { useState, useEffect } from 'react';

const REPO_URLS = {
  dao:            'https://github.com/drasticstatic/dao',
  crowdsale:      'https://github.com/drasticstatic/crowdsale',
  amm:            'https://github.com/drasticstatic/amm',
  'nft_dappu-punks': 'https://github.com/drasticstatic/nft_dappu-punks',
};

function detectRepo() {
  const path = window.location.pathname; // e.g. /dao/
  const match = path.match(/^\/([^/]+)/);
  return match ? match[1] : null;
}

const bounceKeyframes = `
@keyframes ghBannerBounce {
  0%, 100% { transform: translateY(0); }
  40%       { transform: translateY(-10px); }
  60%       { transform: translateY(-5px); }
}
@keyframes ghBannerGlow {
  0%, 100% { box-shadow: 0 0 10px rgba(102,126,234,0.5), 0 0 20px rgba(118,75,162,0.3); }
  50%       { box-shadow: 0 0 22px rgba(102,126,234,0.9), 0 0 44px rgba(118,75,162,0.6); }
}
`;

function GHPagesBanner() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const isGHPages =
      window.location.hostname.endsWith('github.io') ||
      window.location.hostname.endsWith('githubusercontent.com');
    if (isGHPages) setVisible(true);
  }, []);

  if (!visible) return null;

  const repoKey = detectRepo();
  const repoUrl = REPO_URLS[repoKey] || 'https://github.com/drasticstatic';

  return (
    <>
      <style>{bounceKeyframes}</style>
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
          padding: '44px 40px 32px',
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center',
          color: '#fff',
          boxShadow: '0 32px 64px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}>

          {/* Bouncing construction emoji */}
          <div style={{
            fontSize: '52px',
            lineHeight: 1,
            marginBottom: '18px',
            display: 'inline-block',
            animation: 'ghBannerBounce 1.8s ease-in-out infinite',
          }}>
            🚧
          </div>

          <h2 style={{ marginBottom: '10px', fontWeight: 700, fontSize: '22px', letterSpacing: '-0.3px' }}>
            GitHub Pages Preview
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, marginBottom: '10px', fontSize: '15px' }}>
            This app is hosted as a <strong style={{ color: '#fff' }}>portfolio showcase</strong>.
            Smart contracts run on a local Hardhat network — live blockchain interaction isn't available here.
          </p>

          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontSize: '13px', marginBottom: '16px' }}>
            You can explore the full UI and connect MetaMask, but transactions and on-chain reads
            require the local Hardhat node running on your own machine.
          </p>

          {/* Safari warning */}
          <p style={{
            color: 'rgba(255, 210, 100, 0.9)',
            lineHeight: 1.6,
            fontSize: '13px',
            marginBottom: '28px',
            background: 'rgba(255,200,100,0.08)',
            borderRadius: '8px',
            padding: '10px 14px',
          }}>
            ⚠️ <strong style={{ color: 'rgba(255,225,130,1)' }}>Safari is not Web3-compatible.</strong>{' '}
            Use <strong style={{ color: '#fff' }}>Chrome</strong>,{' '}
            <strong style={{ color: '#fff' }}>Firefox</strong>, or{' '}
            <strong style={{ color: '#fff' }}>Brave</strong> with MetaMask for wallet connectivity.
          </p>

          {/* CTA button with glow pulse */}
          <button
            onClick={() => setVisible(false)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
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
              animation: hovered ? 'none' : 'ghBannerGlow 2s ease-in-out infinite',
              transform: hovered ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform 0.15s ease',
            }}
          >
            Explore the Demo →
          </button>

          {/* Repo link footer */}
          <p style={{ marginTop: '18px', marginBottom: 0, fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}
              onMouseOver={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
              onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
            >
              View source on GitHub →
            </a>
          </p>

        </div>
      </div>
    </>
  );
}

export default GHPagesBanner;
