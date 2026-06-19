// src/components/Footer.tsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <span className="text-white font-bold text-xl">Travel<span className="text-emerald-400">Trace</span></span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Discover and share the beauty of Sri Lanka. Track your adventures, find hidden gems, and inspire fellow travellers across the island paradise.
            </p>
            <div className="flex gap-3 mt-4">
              {['facebook', 'twitter', 'instagram'].map(s => (
                <a key={s} href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-400 flex items-center justify-center transition-colors">
                  <span className="text-xs font-bold uppercase">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Navigation</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/explore', 'Explore Trails'], ['/about', 'About Us'], ['/support', 'Support']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-emerald-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Explore Sri Lanka</h4>
            <ul className="space-y-2 text-sm">
              {['Sigiriya Trails', 'Ella Hikes', 'Colombo City Walks', 'Coastal Routes', 'Wildlife Paths'].map(item => (
                <li key={item}>
                  <Link to="/explore" className="hover:text-emerald-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2024 TravelTrace. Built for Sri Lanka's explorers.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
