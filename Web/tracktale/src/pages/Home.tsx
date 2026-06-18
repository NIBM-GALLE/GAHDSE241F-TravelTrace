// src/pages/Home.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import colomboImg from '../assets/colombo.jpg';
import ellaImg from '../assets/ella.jpg';
import sigiriyaImg from '../assets/sigiriya.jpg';
import ambuluvavaImg from '../assets/ambuluvava.jpg';
import ninearchImg from '../assets/ninearch.jpg';

const heroSlides = [
  {
    image: colomboImg,
    title: 'Colombo',
    subtitle: 'The Vibrant Capital',
    desc: 'Where heritage meets modern skylines along the Indian Ocean coast.',
  },
  {
    image: ellaImg,
    title: 'Ella',
    subtitle: 'The Hill Country Gem',
    desc: 'Mist-covered peaks, tea plantations, and breathtaking valley views.',
  },
  {
    image: sigiriyaImg,
    title: 'Sigiriya',
    subtitle: 'The Lion Rock Fortress',
    desc: 'Ancient citadel rising 200m above jungle — a UNESCO World Heritage treasure.',
  },
  {
    image: ambuluvavaImg,
    title: 'Ambuluwawa',
    subtitle: 'The Sky Tower',
    desc: 'A unique spiral tower amid cloud forest offering views across four provinces.',
  },
  {
    image: ninearchImg,
    title: 'Nine Arch Bridge',
    subtitle: 'Colonial Marvel',
    desc: 'An iconic railway viaduct through lush jungle, built entirely without steel.',
  },
];

const stats = [
  { value: '2,400+', label: 'Trails Tracked' },
  { value: '8,900+', label: 'Adventurers' },
  { value: '125+', label: 'Destinations' },
  { value: '4.9★', label: 'App Rating' },
];

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: 'Live GPS Tracking',
    desc: 'Track your journey in real time. Your route is recorded automatically as you move — even in remote areas with limited signal.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
    title: 'Waypoint Photos',
    desc: 'Pin photos at exact locations along your trail. Upload images directly to Cloudinary and attach them to your waypoints.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
    title: 'Interactive Maps',
    desc: 'View your entire trail on an interactive OpenStreetMap. See the route polyline, waypoint pins, and GPS point density at a glance.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Community Explore',
    desc: 'Browse trails shared by fellow Sri Lankan travellers. Find inspiration for your next adventure and discover hidden gems.',
  },
];

const destinations = [
  { name: 'Sigiriya', type: 'Ancient Heritage', trails: 48, color: 'from-amber-500 to-orange-600' },
  { name: 'Ella', type: 'Hill Country', trails: 73, color: 'from-emerald-500 to-green-600' },
  { name: 'Mirissa', type: 'Coastal & Ocean', trails: 35, color: 'from-blue-500 to-cyan-600' },
  { name: 'Kandy', type: 'Cultural Capital', trails: 62, color: 'from-violet-500 to-purple-600' },
  { name: 'Yala', type: 'Wildlife Safari', trails: 29, color: 'from-yellow-500 to-amber-600' },
  { name: 'Colombo', type: 'City Exploration', trails: 91, color: 'from-rose-500 to-pink-600' },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-white">

      {/* ── HERO SECTION ────────────────────────────────── */}
      <section className="relative min-h-screen flex overflow-hidden pt-16">
        {/* Left content */}
        <div className="relative z-10 flex flex-col justify-center px-6 sm:px-12 lg:px-20 w-full lg:w-1/2 py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Real-time Trail Tracking
          </div>
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight text-white mb-5">
            Track Every{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Adventure
            </span>{' '}
            Across Sri Lanka
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-lg mb-8">
            TravelTrace turns your mobile phone into a smart trail companion. Record GPS routes, pin waypoint photos, and share your Sri Lankan adventures with the world.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/explore"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/30 text-sm"
            >
              Explore Trails →
            </Link>
            <a
              href="#how-it-works"
              className="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl hover:bg-slate-700 transition-all text-sm"
            >
              How It Works
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            {stats.map(s => (
              <div key={s.label} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                <p className="text-emerald-400 font-extrabold text-xl">{s.value}</p>
                <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right image stack — vertical scrolling carousel */}
        <div className="hidden lg:flex absolute right-0 top-0 bottom-0 w-1/2 items-center justify-center overflow-hidden">
          {/* Gradient overlay on left edge */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>

          <div className="flex flex-col gap-4 px-6 py-8 w-full">
            {/* Vertical scroll strip */}
            <div className="relative h-screen flex flex-col gap-4 overflow-hidden">
              {/* animated strip */}
              <div
                className="flex flex-col gap-4 transition-transform duration-700 ease-in-out"
                style={{ transform: `translateY(-${activeSlide * (100 / heroSlides.length)}%)`, height: `${heroSlides.length * 100}%` }}
              >
                {[...heroSlides, ...heroSlides].map((slide, i) => (
                  <div
                    key={i}
                    className="relative rounded-2xl overflow-hidden flex-shrink-0 group cursor-pointer"
                    style={{ height: 'calc(20vh + 20px)', minHeight: 160 }}
                    onClick={() => setActiveSlide(i % heroSlides.length)}
                  >
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="text-white font-bold text-sm">{slide.title}</p>
                      <p className="text-slate-300 text-xs">{slide.subtitle}</p>
                    </div>
                    {i % heroSlides.length === activeSlide && (
                      <div className="absolute inset-0 ring-2 ring-emerald-400 rounded-2xl"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`w-1.5 rounded-full transition-all duration-300 ${i === activeSlide ? 'h-6 bg-emerald-400' : 'h-1.5 bg-slate-600 hover:bg-slate-400'}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile: single hero image */}
        <div className="absolute inset-0 lg:hidden">
          <img src={heroSlides[activeSlide].image} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950"></div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Simple & Powerful</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-3">How TravelTrace Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              From planning to exploration to sharing — TravelTrace handles your entire journey lifecycle on mobile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/40 hover:bg-slate-800 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <span className="text-xs font-bold text-slate-500 mb-1 block">0{i + 1}</span>
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP FEATURE SECTION ───────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Live GPS Trails</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
                A Map That Tells Your Story
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                The best way to share your Sri Lankan adventure is through an interactive map. TravelTrace shows visitors exactly where you went, what you saw, and the moments that mattered.
              </p>
              <ul className="space-y-3">
                {[
                  'Where you started and finished',
                  'Every GPS point along your route',
                  'Waypoints with photos and notes',
                  'Trip status: Planned, Ongoing, or Completed',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-400 transition-colors text-sm"
              >
                View Live Trails
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Map mock-up */}
            <div className="relative">
              <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                {/* Mock map header */}
                <div className="flex items-center justify-between bg-slate-900 px-4 py-3 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="text-slate-400 text-xs ml-2">Colombo → Sigiriya • 187km</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-emerald-400 text-xs font-bold">COMPLETED</span>
                  </div>
                </div>

                {/* Mock map visual */}
                <div className="relative h-64 bg-gradient-to-br from-slate-700 to-slate-800">
                  {/* grid lines */}
                  <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="absolute border-slate-400" style={{ top: `${i * 12.5}%`, left: 0, right: 0, height: 1, borderTopWidth: 1 }}></div>
                    ))}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="absolute border-slate-400" style={{ left: `${i * 12.5}%`, top: 0, bottom: 0, width: 1, borderLeftWidth: 1 }}></div>
                    ))}
                  </div>

                  {/* SVG route */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 256" preserveAspectRatio="none">
                    <polyline
                      points="40,200 80,170 130,150 180,130 230,110 280,90 340,70"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray="6 3"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Waypoint pins */}
                  {[
                    { x: '10%', y: '78%', label: 'Colombo', active: false },
                    { x: '45%', y: '51%', label: 'Dambulla', active: true },
                    { x: '85%', y: '27%', label: 'Sigiriya', active: false },
                  ].map(pin => (
                    <div key={pin.label} className="absolute" style={{ left: pin.x, top: pin.y, transform: 'translate(-50%,-50%)' }}>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg ${pin.active ? 'bg-emerald-400 border-white scale-110' : 'bg-violet-500 border-white'}`}>
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                      </div>
                      <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold ${pin.active ? 'text-emerald-400' : 'text-white'}`}>
                        {pin.label}
                      </div>
                    </div>
                  ))}

                  {/* Floating waypoint card */}
                  <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur rounded-xl p-3 border border-slate-700 w-40">
                    <p className="text-xs font-bold text-violet-400 mb-1">📍 Dambulla Cave</p>
                    <p className="text-xs text-slate-300 leading-tight">UNESCO site — stunning Buddhist cave murals</p>
                    <div className="mt-2 w-full h-12 bg-slate-700 rounded-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-r from-amber-900/40 to-yellow-700/30 flex items-center justify-center">
                        <span className="text-xs text-amber-400">📸 3 photos</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock stats bar */}
                <div className="grid grid-cols-3 divide-x divide-slate-700 bg-slate-900">
                  {[['3', 'Waypoints'], ['187km', 'Distance'], ['3 days', 'Duration']].map(([v, l]) => (
                    <div key={l} className="p-3 text-center">
                      <p className="text-emerald-400 font-bold text-sm">{v}</p>
                      <p className="text-slate-500 text-xs">{l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl p-3 shadow-xl shadow-emerald-500/30">
                <p className="text-white font-extrabold text-lg">🗺️</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS SECTION ─────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Destinations</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-3">
              Discover the Island Pearl
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              From ancient kingdoms to pristine beaches — Sri Lanka packs a world of adventures into one breathtaking island.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {destinations.map(dest => (
              <Link
                key={dest.name}
                to="/explore"
                className="relative group rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${dest.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                <div className="relative p-6">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${dest.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg">{dest.name}</h3>
                  <p className="text-slate-400 text-xs mt-1">{dest.type}</p>
                  <p className="text-emerald-400 text-xs font-semibold mt-3">{dest.trails} active trails →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHONE MOCKUP / APP SECTION ────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Phone mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone outer */}
                <div className="w-64 h-[520px] bg-slate-900 rounded-[3rem] border-4 border-slate-700 shadow-2xl shadow-slate-900 relative overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-800 rounded-full z-10"></div>

                  {/* Screen: app UI */}
                  <div className="h-full bg-slate-950 pt-10 pb-14 overflow-hidden">
                    {/* App header */}
                    <div className="bg-slate-950 px-4 py-3">
                      <p className="text-white font-extrabold text-base">TravelTrace</p>
                      <p className="text-slate-400 text-xs">3 trails · Chaminda</p>
                    </div>
                    {/* Filter chips */}
                    <div className="flex gap-2 px-3 mt-2">
                      {['All', 'Ongoing', 'Completed'].map((chip, i) => (
                        <span key={chip} className={`px-2.5 py-1 rounded-full text-xs font-bold ${i === 0 ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          {chip}
                        </span>
                      ))}
                    </div>
                    {/* Mock trip cards */}
                    <div className="px-3 mt-3 space-y-2">
                      {[
                        { title: 'Sigiriya Rock Climb', status: 'COMPLETED', color: 'text-cyan-400 bg-cyan-400/10', pins: 3, pts: 1200 },
                        { title: 'Ella Hill Walk', status: 'COMPLETED', color: 'text-cyan-400 bg-cyan-400/10', pins: 4, pts: 840 },
                        { title: 'Colombo Coast Walk', status: 'PLANNED', color: 'text-violet-400 bg-violet-400/10', pins: 0, pts: 0 },
                      ].map(card => (
                        <div key={card.title} className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className={`w-2 h-2 rounded-full ${card.status === 'COMPLETED' ? 'bg-cyan-400' : 'bg-violet-400'}`}></div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${card.color}`}>{card.status}</span>
                          </div>
                          <p className="text-white text-xs font-bold">{card.title}</p>
                          <div className="flex gap-2 mt-1.5">
                            <span className="text-cyan-400 text-xs">📍 {card.pins} pins</span>
                            <span className="text-violet-400 text-xs">〰 {card.pts} pts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom nav bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-14 bg-slate-900 border-t border-slate-700 flex items-center justify-around px-4">
                    {[
                      { icon: '🏠', label: 'Home', active: true },
                      { icon: '➕', label: 'New', active: false },
                      { icon: '👤', label: 'Account', active: false },
                    ].map(item => (
                      <div key={item.label} className={`flex flex-col items-center gap-0.5 ${item.active ? 'text-cyan-400' : 'text-slate-500'}`}>
                        <span className="text-base">{item.icon}</span>
                        <span className="text-xs font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Glow */}
                <div className="absolute -inset-8 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10"></div>
              </div>
            </div>

            {/* Text */}
            <div>
              <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Mobile App</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
                Works Beautifully on Your Phone
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                TravelTrace is designed mobile-first. The entire experience — from registering, creating a trip, starting GPS tracking, to viewing your history — lives in a sleek mobile app.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '🔐', title: 'Secure Accounts', desc: 'Register with name, email, phone & address. Login protected.' },
                  { icon: '📡', title: 'Live Tracking', desc: 'Real-time GPS with 10m distance filter — battery efficient.' },
                  { icon: '📸', title: 'Cloud Photos', desc: 'Waypoint images stored on Cloudinary CDN, loaded instantly.' },
                  { icon: '🗓️', title: 'Trail History', desc: 'View all Planned, Ongoing, and Completed trails in one place.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-3">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-slate-400 text-xs mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ─────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border-y border-emerald-500/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Trace Your Adventure?
          </h2>
          <p className="text-slate-400 mb-8 text-sm">
            Join thousands of travellers already mapping the beauty of Sri Lanka. Every trail tells a story — what's yours?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/explore"
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/30 text-sm"
            >
              Explore Community Trails
            </Link>
            <Link
              to="/about"
              className="px-8 py-3.5 bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl hover:bg-slate-700 transition-all text-sm"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
