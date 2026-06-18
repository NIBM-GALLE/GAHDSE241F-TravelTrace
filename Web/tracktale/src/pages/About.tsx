// src/pages/About.tsx
export default function About() {
  const team = [
    { initials: 'CS', name: 'Chaminda Silva', role: 'Full Stack Developer', desc: 'Built the Spring Boot backend, MySQL schema, and REST APIs. Passionate about clean architecture.' },
    { initials: 'PJ', name: 'Priya Jayawardena', role: 'Flutter Developer', desc: 'Crafted the mobile app UI/UX, GPS tracking logic, and Cloudinary image integration.' },
    { initials: 'NP', name: 'Nuwan Perera', role: 'UI/UX Designer', desc: 'Designed the TravelTrace brand identity, user flows, and the overall visual design system.' },
  ];

  const timeline = [
    { year: '2024 Q1', title: 'Project Inception', desc: 'Identified the gap — Sri Lanka travellers had no dedicated trail tracking app.' },
    { year: '2024 Q2', title: 'MVP Development', desc: 'Built the Spring Boot backend, Flutter mobile app, and core GPS tracking feature.' },
    { year: '2024 Q3', title: 'Cloudinary Integration', desc: 'Added secure photo uploads via Cloudinary — waypoints now support rich media.' },
    { year: '2024 Q4', title: 'Web Launch', desc: 'Launched the React web platform — explore community trails with interactive maps.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-16 text-white">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">About TravelTrace</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 mb-5 leading-tight">
            Built for Sri Lanka's{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Explorers
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
            TravelTrace was born from a simple idea: every journey across Sri Lanka's breathtaking landscapes deserves to be remembered, shared, and celebrated. We built the tools to make that effortless.
          </p>
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

      {/* Tech Stack */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Technology</span>
            <h2 className="text-3xl font-extrabold mt-2 mb-3">Built with Modern Technology</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              TravelTrace uses a robust, scalable stack chosen for performance, security, and developer experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '☕', name: 'Spring Boot', type: 'Backend API', color: 'from-orange-500 to-amber-600', desc: 'REST APIs, JPA entities, auto-created MySQL tables' },
              { icon: '📱', name: 'Flutter', type: 'Mobile App', color: 'from-blue-500 to-cyan-500', desc: 'Cross-platform Android app with GPS & maps' },
              { icon: '🐬', name: 'MySQL', type: 'Database', color: 'from-blue-600 to-blue-700', desc: 'Persistent trail, waypoint, and user data storage' },
              { icon: '☁️', name: 'Cloudinary', type: 'Media Storage', color: 'from-blue-400 to-sky-500', desc: 'Secure CDN for waypoint photo uploads & delivery' },
              { icon: '⚛️', name: 'React', type: 'Web Frontend', color: 'from-cyan-500 to-sky-500', desc: 'Component-based SPA with React Router' },
              { icon: '🍃', name: 'Leaflet.js', type: 'Interactive Maps', color: 'from-emerald-500 to-green-600', desc: 'OpenStreetMap integration with route polylines' },
              { icon: '🗺️', name: 'OpenStreetMap', type: 'Map Tiles', color: 'from-slate-500 to-slate-600', desc: 'Free, open-source mapping tiles worldwide' },
              { icon: '⚡', name: 'Vite + TS', type: 'Build System', color: 'from-violet-500 to-purple-600', desc: 'Lightning-fast development with full TypeScript' },
            ].map(tech => (
              <div key={tech.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center text-xl mb-3`}>
                  {tech.icon}
                </div>
                <p className="text-white font-bold text-sm">{tech.name}</p>
                <p className="text-slate-500 text-xs mb-1">{tech.type}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Journey</span>
            <h2 className="text-3xl font-extrabold mt-2">Project Timeline</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-800"></div>
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="relative flex gap-6">
                  <div className="w-16 flex-shrink-0 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-emerald-400 border-4 border-slate-950 z-10 mt-1.5"></div>
                  </div>
                  <div className="pb-4">
                    <span className="text-emerald-400 text-xs font-bold">{item.year}</span>
                    <h3 className="text-white font-bold mt-0.5 mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
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
