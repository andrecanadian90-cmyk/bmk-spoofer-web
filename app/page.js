'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const countersRef = useRef(false);

  useEffect(() => {
    // Counter animation
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.count);
      const isFloat = target % 1 !== 0;
      const duration = 2000;
      const start = performance.now();
      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = isFloat ? (eased * target).toFixed(1) : Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.dataset.count && !countersRef.current) {
            animateCounter(entry.target);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    document.querySelectorAll('[data-count]').forEach(el => {
      const cObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cObserver.unobserve(e.target); } });
      }, { threshold: 0.5 });
      cObserver.observe(el);
    });

    // FAQ
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        document.querySelectorAll('.faq-item').forEach(i => { if (i !== item) i.classList.remove('open'); });
        item.classList.toggle('open');
      });
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: '⚡', title: 'Bulk Spoof Engine', desc: 'Input LUA table or raw IDs and spoof hundreds of items. Batch processing with parallel execution.', tags: ['LUA Support', 'Raw IDs', 'Parallel'] },
    { icon: '📋', title: 'Real-Time Logs', desc: 'Live execution logs with timestamps, status indicators, file sizes, and searchable history.' },
    { icon: '☁️', title: 'Auto Upload', desc: 'Direct upload to Roblox Open Cloud API. Spoofed assets deploy instantly to your account.' },
    { icon: '📊', title: 'Deployment Summary', desc: 'Track total attempts, success rates, failed items, and timestamps in a clean dashboard.' },
    { icon: '✅', title: '99.3% Success Rate', desc: 'Industry-leading spoof accuracy. Failed attempts auto-retry with exponential backoff.' },
    { icon: '📈', title: 'Progress Tracking', desc: 'Visual progress bars, time-elapsed counters, and per-item status monitoring.' },
  ];

  const bypasses = [
    { title: 'Asset ID Bypass', desc: 'Bypass asset restrictions by remapping IDs.', list: ['UGC Items', 'Animations', 'Meshes', 'Audio'] },
    { title: 'HWID Spoof', desc: 'Hardware ID spoofing to bypass device bans.', list: ['Device Fingerprint', 'MAC Address', 'Disk Serial', 'BIOS UUID'] },
    { title: 'Rate Limit Bypass', desc: 'Smart throttling with auto rate limit detection.', list: ['Auto Throttle', 'Queue Mgmt', 'Retry Logic', 'Cooldown'] },
    { title: 'Open Cloud API', desc: 'Direct Roblox Open Cloud integration.', list: ['Bulk Upload', 'Version Control', 'Auto Deploy', 'Webhooks'] },
    { title: 'Anti-Detection', desc: 'Multi-layer evasion with encrypted payloads.', list: ['Encrypted', 'Timing Random', 'Session Rotate', 'Proxy'] },
    { title: 'Multi-Account', desc: 'Manage multiple Roblox accounts simultaneously.', list: ['Switching', 'Shared Pool', 'Unified Logs', 'Batch Ops'] },
  ];

  const faqs = [
    { q: 'What is BMK Spoofer?', a: 'BMK Spoofer is an advanced asset spoofing tool that allows you to bypass restrictions and refake banned or disabled assets. It supports bulk operations, auto-upload to Roblox Open Cloud, and real-time logs.' },
    { q: 'How does the bypass feature work?', a: 'The bypass engine remaps asset IDs, generates new references, and uses advanced techniques to circumvent restrictions. Works with UGC, animations, meshes, audio, and more.' },
    { q: 'Is it safe to use?', a: 'BMK Spoofer uses encrypted payloads, randomized timing, and session fingerprint rotation to minimize detection. The anti-detection module is continuously updated.' },
    { q: 'What formats are supported?', a: 'LUA table format: { "Name", 12345 } or raw asset IDs, one per line. Both formats are parsed and queued for bulk processing.' },
    { q: 'Can I use multiple accounts?', a: 'Pro supports 3 accounts, Enterprise supports unlimited. Switch accounts, share asset pools, and view unified logs.' },
    { q: 'How do I get support?', a: 'Starter: email support. Pro: priority Discord. Enterprise: 24/7 dedicated support with under 1 hour response time.' },
  ];

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <style jsx>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .feature-card:hover { transform: translateY(-4px); border-color: rgba(57,255,20,0.2); box-shadow: 0 0 30px rgba(57,255,20,0.08); }
        .bypass-card:hover { transform: translateY(-4px); border-color: rgba(57,255,20,0.2); box-shadow: 0 0 30px rgba(57,255,20,0.08); }
        .pricing-card:hover { transform: translateY(-4px); }
        .faq-item .faq-a { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
        .faq-item.open .faq-a { max-height: 300px; }
        .faq-item.open .faq-toggle { transform: rotate(45deg); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.6s ease-out both; }
        .fade-up-d1 { animation-delay: 0.1s; }
        .fade-up-d2 { animation-delay: 0.2s; }
        .fade-up-d3 { animation-delay: 0.3s; }
        .fade-up-d4 { animation-delay: 0.4s; }
      `}</style>

      {/* Glow effects */}
      <div style={{ position: 'fixed', width: 600, height: 600, background: 'rgba(57,255,20,0.06)', borderRadius: '50%', filter: 'blur(120px)', top: -200, left: -100, pointerEvents: 'none', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', width: 500, height: 500, background: 'rgba(0,229,255,0.04)', borderRadius: '50%', filter: 'blur(120px)', bottom: -150, right: -100, pointerEvents: 'none', zIndex: 0 }}></div>

      {/* HERO */}
      <section style={{ padding: '160px 0 100px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'var(--accent-dim)', border: '1px solid rgba(57,255,20,0.2)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', display: 'inline-block' }}></span>
              v3.2 — Latest Update
            </div>
            <h1 className="fade-up fade-up-d1" style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 20 }}>
              BMK<br /><span className="text-accent" style={{ textShadow: '0 0 40px rgba(57,255,20,0.3)' }}>Spoofer</span>
            </h1>
            <p className="fade-up fade-up-d2" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 480, marginBottom: 32 }}>
              Bypass and Refake any banned or disabled devices in any services. Bulk spoof assets, auto-upload to Roblox Open Cloud, real-time execution logs.
            </p>
            <div className="fade-up fade-up-d3" style={{ display: 'flex', gap: 40, marginBottom: 40 }}>
              <div><div data-count="15420" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>0</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Users</div></div>
              <div><div data-count="99.3" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>0</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Success Rate %</div></div>
              <div><div data-count="2847" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>0</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Spoofed Today</div></div>
            </div>
            <div className="fade-up fade-up-d4" style={{ display: 'flex', gap: 16 }}>
              <Link href="/register" className="btn btn-primary btn-lg">⭐ Get Started</Link>
              <Link href="#features" className="btn btn-outline btn-lg">▶ Learn More</Link>
            </div>
          </div>
          <div className="fade-up fade-up-d3">
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 0 30px rgba(57,255,20,0.08), 0 20px 60px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(20,20,20,0.9)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }}></span>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }}></span>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }}></span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>BMK Spoofer — Dashboard</span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>BMK Spoofer</span>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.65rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--warning)' }}>● 250 COINS</span>
                    <span style={{ color: 'var(--accent)' }}>● CONNECTED</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
                  {[['273', 'Total'], ['271', 'Success'], ['0', 'Failed']].map(([v, l], i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 8, background: 'rgba(25,25,25,0.6)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-mono)', color: i === 1 ? 'var(--accent)' : i === 2 ? 'var(--fail)' : 'var(--text-primary)' }}>{v}</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{l}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {['Sonic Pose → 6.92 KB', 'Jojo Pose → 7.83 KB', 'Clean Kicks → 56.81 KB', 'Cannonball → 288.78 KB'].map((msg, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 4, background: 'rgba(25,25,25,0.4)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>14:42:56</span>
                      <span style={{ color: 'var(--accent)', fontWeight: 700 }}>SUCCESS</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="section-tag">Features</span>
            <h2 className="section-title">Powerful Spoofing <span className="text-accent">Engine</span></h2>
            <p className="section-desc">Everything you need to bypass restrictions and manage assets at scale.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card reveal" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 32, transition: 'var(--transition)', cursor: 'default', transitionDelay: `${i * 0.08}s` }}>
                <div style={{ width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', background: 'var(--accent-dim)', fontSize: '1.4rem', marginBottom: 20 }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
                {f.tags && <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>{f.tags.map(t => <span key={t} style={{ padding: '4px 12px', borderRadius: 100, background: 'rgba(57,255,20,0.08)', border: '1px solid rgba(57,255,20,0.15)', fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent)' }}>{t}</span>)}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BYPASS */}
      <section id="bypass" style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="section-tag">Bypass</span>
            <h2 className="section-title">Bypass <span className="text-accent">Capabilities</span></h2>
            <p className="section-desc">Advanced bypass engine across multiple platforms.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {bypasses.map((b, i) => (
              <div key={i} className="bypass-card reveal" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 28, transition: 'var(--transition)', transitionDelay: `${i * 0.08}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', background: 'var(--accent-dim)', color: 'var(--accent)' }}>⚡</div>
                  <span className="badge badge-success">Active</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10 }}>{b.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{b.desc}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {b.list.map(l => <li key={l} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>▸ {l}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="section-tag">Pricing</span>
            <h2 className="section-title">Choose Your <span className="text-accent">Plan</span></h2>
            <p className="section-desc">Flexible plans with bypass features and auto-updates.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, alignItems: 'start' }}>
            {[
              { tier: 'Starter', price: '9.99', features: ['50 Spoofs/day', 'Basic Bypass', 'Single Account', 'Execution Logs', 'Email Support'], disabled: ['HWID Spoof', 'Open Cloud API', 'Priority Support'] },
              { tier: 'Pro', price: '24.99', featured: true, features: ['Unlimited Spoofs', 'Advanced Bypass', '3 Accounts', 'Real-Time Logs', 'HWID Spoof', 'Open Cloud API', 'Auto Upload'], disabled: ['Priority Support'] },
              { tier: 'Enterprise', price: '49.99', features: ['Unlimited Spoofs', 'Full Bypass Suite', 'Unlimited Accounts', 'Advanced Analytics', 'HWID Spoof', 'Open Cloud API', 'Auto Upload + ZIP', '24/7 Priority Support'], disabled: [] },
            ].map((plan, i) => (
              <div key={i} className="pricing-card reveal" style={{
                background: 'var(--bg-card)', border: `1px solid ${plan.featured ? 'rgba(57,255,20,0.3)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-xl)', padding: 36, transition: 'var(--transition)', position: 'relative',
                transform: plan.featured ? 'scale(1.03)' : 'none',
                boxShadow: plan.featured ? '0 0 30px rgba(57,255,20,0.08)' : 'none',
                transitionDelay: `${i * 0.1}s`,
              }}>
                {plan.featured && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', padding: '4px 20px', background: 'var(--accent)', color: '#000', fontSize: '0.7rem', fontWeight: 700, borderRadius: 100 }}>Most Popular</div>}
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{plan.tier}</div>
                <div style={{ marginBottom: 28, display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>$</span>
                  <span style={{ fontSize: '3.2rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>{plan.price}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/mo</span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {plan.features.map(f => <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: 'var(--text-secondary)' }}><span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span> {f}</li>)}
                  {plan.disabled.map(f => <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: 'var(--text-muted)', opacity: 0.5 }}><span style={{ color: 'var(--fail)', fontWeight: 700 }}>✕</span> {f}</li>)}
                </ul>
                <Link href="/register" className={`btn ${plan.featured ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', padding: 14, textAlign: 'center' }}>Get {plan.tier}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="section-tag">FAQ</span>
            <h2 className="section-title">Frequently Asked <span className="text-accent">Questions</span></h2>
          </div>
          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item reveal" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', transition: 'var(--transition)', transitionDelay: `${i * 0.05}s` }}>
                <button className="faq-q" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'none', border: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                  <span>{faq.q}</span>
                  <span className="faq-toggle" style={{ fontSize: '1.4rem', fontWeight: 300, color: 'var(--accent)', transition: 'transform 0.3s ease', flexShrink: 0 }}>+</span>
                </button>
                <div className="faq-a"><p style={{ padding: '0 24px 20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{faq.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '60px 0 30px', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12 }}>BMK<span className="text-accent">Spoofer</span></div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: 300 }}>Bypass and Refake any banned or disabled devices in any services.</p>
            </div>
            {[
              { title: 'Product', links: [['Features', '#features'], ['Dashboard', '/dashboard'], ['Bypass', '#bypass'], ['Pricing', '#pricing']] },
              { title: 'Support', links: [['Discord', '#'], ['Docs', '#'], ['FAQ', '#faq'], ['Contact', '#']] },
              { title: 'Legal', links: [['Terms', '#'], ['Privacy', '#'], ['Refund', '#']] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 16 }}>{col.title}</h4>
                {col.links.map(([label, href]) => <Link key={label} href={href} style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: 10 }}>{label}</Link>)}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid var(--border-subtle)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>© 2026 BMK Spoofer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
