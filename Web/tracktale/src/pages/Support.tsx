// src/pages/Support.tsx
import { useState } from 'react';

const faqs = [
  {
    q: 'How do I create a new trail on TravelTrace?',
    a: 'Open the TravelTrace mobile app and tap the "+ New Trip" button in the bottom navigation bar. You\'ll need to be logged in. Enter a title and optional description, then tap Create. From there, open the trail and tap "Track" to start recording your GPS route in real time.',
  },
  {
    q: 'How does GPS tracking work?',
    a: 'TravelTrace uses your phone\'s GPS receiver to record your location every time you move more than 10 metres. This "distance filter" saves battery while still capturing an accurate route. The coordinates are sent to the backend in real time and drawn on the map as a polyline.',
  },
  {
    q: 'How do I add photos to waypoints?',
    a: 'While your trail is open on the Map screen, tap the 📍 FAB to add a waypoint. Fill in the name and note, then tap the photo picker to choose an image from your gallery or take a new one. The image is uploaded to Cloudinary and the URL is saved to your waypoint automatically.',
  },
  {
    q: 'Can I edit a trail after completing it?',
    a: 'Yes. Open any trail from your Home screen and tap the map icon. You can always add new waypoints to any trail regardless of status. Route coordinates are recorded during live tracking only.',
  },
  {
    q: 'Is my data private?',
    a: 'Trails are currently accessible via the community Explore page. We plan to add privacy controls (private/public trails) in a future update. Your password is never stored in plain text and is never returned by the API.',
  },
  {
    q: 'The map is not loading. What should I do?',
    a: 'The map uses OpenStreetMap tiles which require an active internet connection. Check your WiFi or mobile data. If tiles still don\'t load, try restarting the app. On the web, make sure your browser allows third-party content from openstreetmap.org.',
  },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-16 text-white">
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Help Centre</span>
          <h1 className="text-4xl font-extrabold mt-3 mb-4">How Can We Help You?</h1>
          <p className="text-slate-400">
            Find answers to common questions or get in touch with our team. We're here to make your TravelTrace experience seamless.
          </p>
        </div>
      </section>

      {/* Quick links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: '📱', title: 'Mobile App', desc: 'Using the Flutter app' },
            { emoji: '🗺️', title: 'GPS Tracking', desc: 'Recording your trails' },
            { emoji: '📸', title: 'Photos & Media', desc: 'Waypoint image uploads' },
            { emoji: '👤', title: 'Account & Login', desc: 'Registration and auth' },
          ].map(item => (
            <button
              key={item.title}
              onClick={() => {
                const el = document.getElementById('faq');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left hover:border-emerald-500/40 hover:bg-slate-800/50 transition-all group"
            >
              <span className="text-3xl mb-3 block">{item.emoji}</span>
              <p className="text-white font-semibold text-sm">{item.title}</p>
              <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
              <span className="text-emerald-400 text-xs mt-2 block group-hover:underline">View FAQs →</span>
            </button>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900/40">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">FAQ</span>
            <h2 className="text-2xl font-extrabold mt-2">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                  openFaq === i ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800 bg-slate-900'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                >
                  <span className="font-semibold text-sm text-white">{faq.q}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${openFaq === i ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <svg className={`w-3 h-3 transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Contact</span>
            <h2 className="text-2xl font-extrabold mt-2">Still Need Help?</h2>
            <p className="text-slate-400 text-sm mt-2">Send us a message and we'll get back to you within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Message Sent! 🎉</h3>
              <p className="text-slate-400 text-sm">We've received your message and will reply to <span className="text-emerald-400">{form.email}</span> within 24 hours.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="mt-6 px-5 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Your Name</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Chaminda Silva"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Subject</label>
                <select
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="">Select a topic...</option>
                  <option>GPS Tracking Issue</option>
                  <option>Photo Upload Problem</option>
                  <option>Account / Login Help</option>
                  <option>Map Not Loading</option>
                  <option>Feature Request</option>
                  <option>Bug Report</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Describe your issue or question in detail..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/20 text-sm"
              >
                Send Message →
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Contact info */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { emoji: '📧', title: 'Email Support', value: 'support@traveltrace.lk', sub: 'We reply within 24 hours' },
            { emoji: '💬', title: 'Community Discord', value: 'discord.gg/traveltrace', sub: 'Chat with the community' },
            { emoji: '📍', title: 'Based In', value: 'Colombo, Sri Lanka 🇱🇰', sub: 'Serving island-wide explorers' },
          ].map(item => (
            <div key={item.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <span className="text-3xl mb-3 block">{item.emoji}</span>
              <p className="text-white font-semibold">{item.title}</p>
              <p className="text-emerald-400 text-sm mt-1">{item.value}</p>
              <p className="text-slate-500 text-xs mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
