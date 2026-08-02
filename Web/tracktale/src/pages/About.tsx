// src/pages/About.tsx
export default function About() {
  const team = [
    { initials: 'CS', name: 'Chaminda Silva', role: 'Full Stack Developer', desc: 'Built the Spring Boot backend, MySQL schema, and REST APIs. Passionate about clean architecture.' },
    { initials: 'PJ', name: 'Priya Jayawardena', role: 'Flutter Developer', desc: 'Crafted the mobile app UI/UX, GPS tracking logic, and Cloudinary image integration.' },
    { initials: 'NP', name: 'Nuwan Perera', role: 'UI/UX Designer', desc: 'Designed the TravelTrace brand identity, user flows, and the overall visual design system.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-16 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover opacity-35"
            src="/about.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-slate-950/70" />
        </div>

        <div className="relative max-w-7xl mx-auto grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">About TravelTrace</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 mb-5 leading-tight">
              Built for Sri Lanka's{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Explorers
              </span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-2xl lg:max-w-xl">
              TravelTrace was born from a simple idea: every journey across Sri Lanka's breathtaking landscapes deserves to be remembered, shared, and celebrated. We built the tools to make that effortless.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-400/20 bg-slate-900/50 p-3 shadow-2xl shadow-emerald-500/10 backdrop-blur-sm">
            <div className="overflow-hidden rounded-2xl border border-slate-800">
              <video
                className="h-[260px] w-full object-cover sm:h-[320px]"
                src="/about.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            {
              emoji: '🗺️',
              title: 'Our Mission',
              desc: 'To make trail tracking accessible to every Sri Lankan traveller — from weekend hikers in Ella to coastal explorers in the South. We believe every journey has a story worth preserving.',
              gradient: 'from-emerald-500/10 to-cyan-500/10',
              border: 'border-emerald-500/20',
            },
            {
              emoji: '🌿',
              title: 'Our Vision',
              desc: 'A future where the entire map of Sri Lanka is woven with community-shared travel trails — a living atlas of adventures, recommendations, and hidden gems discovered by real travellers.',
              gradient: 'from-violet-500/10 to-purple-500/10',
              border: 'border-violet-500/20',
            },
            {
              emoji: '🤝',
              title: 'Our Values',
              desc: 'Community first. We build for the travellers who brave early mornings at Horton Plains, who climb Sigiriya at sunrise, and who share the magic of Sri Lanka\'s beauty with the world.',
              gradient: 'from-amber-500/10 to-orange-500/10',
              border: 'border-amber-500/20',
            },
          ].map(card => (
            <div key={card.title} className={`rounded-2xl p-8 bg-gradient-to-br ${card.gradient} border ${card.border}`}>
              <span className="text-4xl mb-4 block">{card.emoji}</span>
              <h2 className="text-xl font-bold mb-3">{card.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why TravelTrace / Key Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Why TravelTrace</span>
            <h2 className="text-3xl font-extrabold mt-2 mb-3">Empowering Every Journey</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Designed specifically for Sri Lanka's unique topography, TravelTrace helps you turn every hike, road trip, and coastal walk into a lasting visual legacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '📍',
                title: 'Real-time GPS Tracking',
                desc: 'Record your precise movement coordinates continuously, capturing every turn from Ella Rock to Horton Plains.',
                border: 'border-emerald-500/20',
              },
              {
                icon: '📸',
                title: 'Photo Waypoints',
                desc: 'Pin high-resolution geotagged photos to specific points on your map to relive your favorite moments.',
                border: 'border-cyan-500/20',
              },
              {
                icon: '🛡️',
                title: 'Verified Trail Content',
                desc: 'Enjoy peace of mind with admin-moderated trail approvals ensuring accurate, safe, and authentic recommendations.',
                border: 'border-violet-500/20',
              },
              {
                icon: '🌐',
                title: 'Community Explorer',
                desc: 'Discover hidden gems and uncharted paths curated and shared by travel enthusiasts across the island.',
                border: 'border-amber-500/20',
              },
            ].map(feature => (
              <div
                key={feature.title}
                className={`bg-slate-900 border ${feature.border} rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-bold text-base mb-2 group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trail Showcase Section (Replaces Timeline) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Trail Showcase</span>
            <h2 className="text-3xl font-extrabold mt-2">Discover Sri Lanka Step by Step</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm mt-2">
              From high-altitude hill country treks to tranquil coastal routes, see how TravelTrace maps real adventures into interactive visual guides.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Showcase Image & Map Card (7 cols) */}
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-slate-700/60 group shadow-2xl">
              <div className="relative h-[320px] sm:h-[380px] bg-slate-800 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80"
                  alt="Sri Lanka Hike Trail Showcase"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Overlaid Route Polyline Simulation */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 380" preserveAspectRatio="none">
                  <path
                    d="M 50 300 Q 150 180, 260 220 T 450 120 T 550 80"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="8 4"
                    className="opacity-90"
                  />
                  <circle cx="50" cy="300" r="8" fill="#34d399" stroke="white" strokeWidth="2" />
                  <circle cx="260" cy="220" r="8" fill="#6ee7f7" stroke="white" strokeWidth="2" />
                  <circle cx="450" cy="120" r="8" fill="#a78bfa" stroke="white" strokeWidth="2" />
                  <circle cx="550" cy="80" r="10" fill="#f43f5e" stroke="white" strokeWidth="3" />
                </svg>

                {/* Top Overlay Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-slate-900/80 backdrop-blur border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE GPS ROUTE
                  </span>
                  <span className="px-3 py-1 bg-slate-900/80 backdrop-blur border border-slate-700 text-slate-300 text-xs font-medium rounded-full">
                    Uva Province
                  </span>
                </div>

                {/* Bottom Overlay Summary */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-base">Ella Rock Summit & Nine Arch Trail</h4>
                    <p className="text-slate-400 text-xs mt-0.5">Recorded by Priya • 4 Waypoints • 5.2 km</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30">
                    APPROVED
                  </span>
                </div>
              </div>
            </div>

            {/* Description Details (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest">Interactive Waypoints</span>
                <h3 className="text-2xl font-bold text-white mt-1 mb-3">
                  Capture Every Stop Point & Memory
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Every recorded trail automatically captures route polyline paths, stop durations, and location-stamped waypoint photos. Travelers can explore each stop point with custom notes and high-resolution photos.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold">Live GPS Mapping</h4>
                    <p className="text-slate-400 text-xs mt-0.5">Automated route tracking rendered on interactive open-source maps.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold">Rich Waypoint Galleries</h4>
                    <p className="text-slate-400 text-xs mt-0.5">Pin photos of scenic views, waterfalls, and cultural landmarks directly to the trail.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold">Community Moderation</h4>
                    <p className="text-slate-400 text-xs mt-0.5">Only admin-approved, verified trails are published live for public discovery.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Team</span>
            <h2 className="text-3xl font-extrabold mt-2">The People Behind TravelTrace</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {team.map(member => (
              <div key={member.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-extrabold">{member.initials}</span>
                </div>
                <h3 className="text-white font-bold">{member.name}</h3>
                <p className="text-emerald-400 text-xs font-semibold mt-1 mb-3">{member.role}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
