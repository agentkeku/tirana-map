import { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from './components/MapView';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

const CATEGORY_COLORS = {
  Coffee:     '#C8583A',
  Restaurant: '#3B6D11',
  Bar:        '#185FA5',
  Nightlife:  '#993556',
  Shopping:   '#8B7355',
  'Day Trip': '#2D5A3D',
};

const CATEGORIES = ['Coffee', 'Restaurant', 'Bar', 'Nightlife', 'Shopping', 'Day Trip'];

export default function App() {
  const [spots, setSpots] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/map`).then((res) => setSpots(res.data.spots ?? []));
  }, []);

  const sampleSpots = spots.filter((s) => !s.locked);
  const lockedCount = spots.filter((s) => s.locked).length;

  async function handleEmailSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/sample-request`, { email, firstName: 'Guest' });
      setSubmitted(true);
    } catch {
      setSubmitted(true); // show success anyway — email may just not be configured yet
    } finally {
      setSubmitting(false);
    }
  }

  function handleBuy() {
    alert('Stripe checkout coming soon!');
  }

  function scrollToUnlock() {
    document.getElementById('unlock')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">
          <div className="nav-logo-mark">
            <svg viewBox="0 0 16 16"><path d="M8 2C5.24 2 3 4.24 3 7c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/></svg>
          </div>
          Tirana Insider
        </a>
        <button className="nav-cta" onClick={scrollToUnlock}>Get full access — €4</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grain" />
        <div className="hero-content">
          <div className="hero-badge">
            <div className="hero-badge-line" />
            Curated by locals
          </div>
          <h1>Skip the tourist traps.<br />Find <em>the real</em><br />Tirana.</h1>
          <p className="hero-sub">
            Hand-picked restaurants, bars, hidden gems and day trips — from people who actually live here.
            Not TripAdvisor. Not Google. Your host.
          </p>
          {submitted ? (
            <p className="hero-success">✓ Check your inbox — the preview is on its way.</p>
          ) : (
            <form className="hero-form" onSubmit={handleEmailSubmit}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'See free preview'}
              </button>
            </form>
          )}
          <p className="hero-note">
            10 spots free.{' '}
            <a href="#unlock" onClick={(e) => { e.preventDefault(); scrollToUnlock(); }}>
              Unlock all 37 for €4 →
            </a>
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-num">37</div>
            <div className="stat-label">Curated spots</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">6</div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">€4</div>
            <div className="stat-label">One-time</div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="map-section">
        <div className="section-label">The map</div>
        <h2 className="section-title">Everything in one place, on your phone.</h2>
        <div className="map-frame">
          <MapView
            spots={spots}
            activeFilter={activeFilter}
            selectedSpot={null}
            onSelectSpot={() => {}}
          />
        </div>
        <div className="map-categories">
          <div
            className={`cat${activeFilter === null ? ' active' : ''}`}
            onClick={() => setActiveFilter(null)}
          >
            All spots
          </div>
          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              className={`cat${activeFilter === cat ? ' active' : ''}`}
              onClick={() => setActiveFilter(activeFilter === cat ? null : cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </section>

      {/* SPOTS PREVIEW */}
      <section className="spots-section">
        <div className="section-label">Preview</div>
        <h2 className="section-title">A taste of what's inside.</h2>
        <div className="spots-grid">
          {sampleSpots.slice(0, 3).map((spot) => (
            <div className="spot-card" key={spot.id}>
              <div className="spot-meta">
                <span className="spot-cat-dot" style={{ background: CATEGORY_COLORS[spot.category] }} />
                {spot.category}
              </div>
              <h3>{spot.name}</h3>
              <p>{spot.description}</p>
              {spot.localTip && <div className="spot-tip">{spot.localTip}</div>}
            </div>
          ))}

          {/* Locked teaser card */}
          <div className="spot-card" style={{ position: 'relative' }}>
            <div className="spot-locked">
              <div className="spot-meta">
                <span className="spot-cat-dot" style={{ background: '#185FA5' }} />
                Bar
              </div>
              <h3>Radio Bar</h3>
              <p>Hidden rooftop bar tucked above Blloku. Best sunset view in the city, strong cocktails, and a crowd that actually lives here.</p>
              <div className="spot-tip">No sign, no Google listing. You need the exact address.</div>
            </div>
            <div className="lock-overlay">
              <button className="lock-pill" onClick={scrollToUnlock}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                Unlock {lockedCount} more spots
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PAYWALL */}
      <section className="paywall-section" id="unlock">
        <div className="paywall-bg" />
        <div className="paywall-inner">
          <div className="section-label">Get access</div>
          <h2 className="paywall-title">The full map.<br /><em>One small price.</em></h2>
          <p className="paywall-sub">
            Everything your host would tell a close friend visiting Tirana. 37 spots,
            honest notes, and zero tourist traps.
          </p>
          <div className="paywall-includes">
            {[
              '37 hand-picked spots across the city',
              'Honest local notes on every single one',
              'Works in Google Maps — save offline',
              'Updated regularly as the city evolves',
            ].map((item) => (
              <div className="include-row" key={item}>
                <div className="include-check">
                  <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>
                </div>
                {item}
              </div>
            ))}
          </div>
          <div className="paywall-cta">
            <div className="price-tag"><span>€</span>4</div>
            <button className="btn-buy" onClick={handleBuy}>Unlock the full map →</button>
          </div>
          <p className="paywall-note">One-time payment. Instant access. No subscription.</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="section-label">How it works</div>
        <h2 className="section-title">Three steps to knowing Tirana like a local.</h2>
        <div className="steps-grid">
          {[
            { num: '01', title: 'Pay once', body: 'A single €4 payment. No subscription, no account needed. Instant access after checkout.' },
            { num: '02', title: 'Open on your phone', body: 'The map opens directly in Google Maps. Save it offline before you head out — no data needed.' },
            { num: '03', title: 'Explore honestly', body: 'Every spot comes with a local note. No paid placements. No tourist traps. Just honest picks.' },
            { num: '04', title: 'Keep it forever', body: 'The map stays in your Google account. Come back next year — it\'ll be there, updated with new gems.' },
          ].map((step) => (
            <div className="step" key={step.num}>
              <div className="step-num">{step.num}</div>
              <h4>{step.title}</h4>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">Tirana Insider</div>
        <div className="footer-host">
          <div className="host-avatar">TI</div>
          Made with care by your Airbnb host
        </div>
        <div className="footer-copy">© 2026 Tirana Insider</div>
      </footer>
    </>
  );
}
