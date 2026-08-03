// src/pages/AdminPanel/pages/ManageTrails.tsx
// ──────────────────────────────────────────────────────────────
// Full-featured admin dashboard with sidebar navigation,
// stats cards, trails table with search/filter/approve/delete,
// row click detail modal, and EmailJS notification integration.
// ──────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo } from 'react';
import { fetchAllTrails, deleteTrail, approveTrail, type Trail } from '../../../api/adminApi';
import emailjs from '@emailjs/browser';
import '../../../admin.css';

// ── Status colors ────────────────────────────────────────────
const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  COMPLETED: { bg: 'bg-cyan-400/10', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  ONGOING: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  PLANNED: { bg: 'bg-violet-400/10', text: 'text-violet-400', dot: 'bg-violet-400' },
};

// ── Delete Confirmation Modal ────────────────────────────────
function DeleteModal({
  trail,
  onConfirm,
  onCancel,
  deleting,
}: {
  trail: Trail;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div
        className="admin-modal-panel bg-slate-900 border border-slate-700/50 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h3 className="text-white font-bold text-lg text-center mb-2">Delete Trail?</h3>
        <p className="text-slate-400 text-sm text-center mb-1">
          You are about to permanently delete:
        </p>
        <p className="text-white font-semibold text-center text-sm mb-6 bg-slate-800/50 rounded-lg py-2 px-3">
          "{trail.title}"
        </p>
        <p className="text-slate-500 text-xs text-center mb-6">
          This action cannot be undone. The trail and all its data will be removed from the system.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-sm font-bold hover:bg-rose-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Deleting…
              </>
            ) : (
              'Delete Trail'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Trail Detail Popup Modal ─────────────────────────────────
function TrailDetailModal({
  trail,
  onClose,
  onApprove,
  onDelete,
  approving,
}: {
  trail: Trail;
  onClose: () => void;
  onApprove: (t: Trail) => void;
  onDelete: (t: Trail) => void;
  approving: boolean;
}) {
  const sc = STATUS_STYLES[trail.status] ?? STATUS_STYLES.PLANNED;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-panel bg-slate-900 border border-slate-700/60 rounded-2xl max-w-2xl w-full mx-4 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-mono text-sm">#{trail.id}</span>
            <h2 className="text-white font-bold text-lg truncate max-w-md">{trail.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 admin-scroll">
          {/* Creator & Review Status Card */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                {trail.userAvatar}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{trail.username}</p>
                <p className="text-slate-400 text-xs">{trail.userEmail || 'No email registered'}</p>
              </div>
            </div>

            {/* Approval Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${sc.bg}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                <span className={`text-xs font-bold ${sc.text}`}>{trail.status}</span>
              </div>

              {trail.approved ? (
                <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1">
                  ✓ APPROVED
                </span>
              ) : trail.published ? (
                <span className="px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-full flex items-center gap-1">
                  ⏳ PENDING REVIEW
                </span>
              ) : (
                <span className="px-3 py-1 bg-slate-800 text-slate-400 text-xs font-medium rounded-full">
                  DRAFT
                </span>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-3">
              <p className="text-slate-500 text-xs font-medium uppercase">Province</p>
              <p className="text-white text-sm font-semibold mt-1">{trail.location || '—'}</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-3">
              <p className="text-slate-500 text-xs font-medium uppercase">Duration</p>
              <p className="text-white text-sm font-semibold mt-1">{trail.duration || '—'}</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-3">
              <p className="text-slate-500 text-xs font-medium uppercase">Route Points</p>
              <p className="text-emerald-400 text-sm font-semibold mt-1">{trail.routeCoordinates.length} GPS pts</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Description</h4>
            <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-4 text-slate-300 text-sm leading-relaxed">
              {trail.description || 'No description provided for this trail.'}
            </div>
          </div>

          {/* Tags */}
          {trail.tags.length > 0 && (
            <div>
              <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Tags</h4>
              <div className="flex gap-2 flex-wrap">
                {trail.tags.map(t => (
                  <span key={t} className="px-2.5 py-1 bg-slate-800 border border-slate-700/60 text-cyan-400 text-xs font-medium rounded-lg">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Waypoints & Photos */}
          <div>
            <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Waypoints & Pin Photos ({trail.waypoints.length})
            </h4>
            {trail.waypoints.length === 0 ? (
              <p className="text-slate-500 text-xs italic">No waypoints added to this trail.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trail.waypoints.map((wp, idx) => (
                  <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-bold">📍 {wp.name}</span>
                      <span className="text-slate-500 text-[10px]">{wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}</span>
                    </div>
                    {wp.note && <p className="text-slate-400 text-xs">{wp.note}</p>}
                    {wp.imageUrl && (
                      <div className="relative h-28 rounded-lg overflow-hidden border border-slate-700/50 mt-1">
                        <img src={wp.imageUrl} alt={wp.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3">
          <button
            onClick={() => { onClose(); onDelete(trail); }}
            className="px-4 py-2 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold hover:bg-rose-500/30 transition-all flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Delete Trail
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium hover:bg-slate-700 transition-colors"
            >
              Close
            </button>

            {!trail.approved && (
              <button
                onClick={() => onApprove(trail)}
                disabled={approving}
                className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                {approving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Approving…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Approve Trail
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stats Card ───────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  gradient,
  delay,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  delay: string;
}) {
  return (
    <div className={`admin-fade-in ${delay} bg-slate-900/60 backdrop-blur border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600/60 transition-all duration-300 group`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
        <span className="text-3xl font-extrabold text-white group-hover:scale-105 transition-transform">
          {value}
        </span>
      </div>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────
export default function ManageTrails() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState<Trail | null>(null);
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Load trails
  useEffect(() => {
    loadTrails();
  }, []);

  const loadTrails = () => {
    setLoading(true);
    setError(null);
    fetchAllTrails()
      .then(setTrails)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Stats
  const stats = useMemo(() => ({
    total: trails.length,
    completed: trails.filter(t => t.status === 'COMPLETED').length,
    pending: trails.filter(t => t.published && !t.approved).length,
    approved: trails.filter(t => t.approved).length,
  }), [trails]);

  // Filtered
  const filtered = useMemo(() => trails.filter(t => {
    let matchStatus = true;
    if (statusFilter === 'PENDING') matchStatus = t.published && !t.approved;
    else if (statusFilter === 'APPROVED') matchStatus = t.approved;
    else if (statusFilter !== 'All') matchStatus = t.status === statusFilter;

    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      t.title.toLowerCase().includes(q) ||
      t.username.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.id.includes(q);
    return matchStatus && matchSearch;
  }), [trails, statusFilter, search]);

  // Approve handler + EmailJS sending
  const handleApprove = async (trail: Trail) => {
    setApprovingId(trail.id);
    try {
      await approveTrail(trail.id);

      // Update local state
      setTrails(prev =>
        prev.map(t => (t.id === trail.id ? { ...t, approved: true } : t))
      );
      if (selectedTrail?.id === trail.id) {
        setSelectedTrail(prev => prev ? { ...prev, approved: true } : null);
      }

      // EmailJS sending
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      const recipientEmail = trail.userEmail || 'user@example.com';
      const recipientName = trail.username || 'Traveler';

      if (serviceId && templateId && publicKey) {
        try {
          const dateStr = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          await emailjs.send(
            serviceId,
            templateId,
            {
              // Support all common variable naming conventions in EmailJS templates
              user_name: recipientName,
              name: recipientName,
              to_name: recipientName,

              user_email: recipientEmail,
              email: recipientEmail,
              to_email: recipientEmail,

              trail_title: trail.title,
              title: trail.title,

              approval_date: dateStr,
              date: dateStr,
              time: dateStr,

              explore_url: `${window.location.origin}/explore`,
              message: `Thank you for sharing your travel experience with TravelTrace! Your trail "${trail.title}" has been successfully approved and published on TravelTrace.`,
            },
            publicKey
          );
          showToast(`"${trail.title}" approved! Email sent to ${recipientEmail}`);
        } catch (emailErr: any) {
          console.error('EmailJS error:', emailErr);
          const detail = emailErr?.text || emailErr?.message || 'Check EmailJS keys & template setting';
          showToast(`"${trail.title}" approved! (EmailJS: ${detail})`);
        }
      } else {
        showToast(`"${trail.title}" approved! (Warning: VITE_EMAILJS_* env variables missing in .env)`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Approval failed';
      showToast(`Error: ${msg}`);
    } finally {
      setApprovingId(null);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTrail(deleteTarget.id);
      setTrails(prev => prev.filter(t => t.id !== deleteTarget.id));
      if (selectedTrail?.id === deleteTarget.id) setSelectedTrail(null);
      showToast(`"${deleteTarget.title}" deleted successfully`);
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      showToast(`Error: ${msg}`);
    } finally {
      setDeleting(false);
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Trails"
          value={stats.total}
          delay="admin-stagger-1"
          gradient="bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/25"
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
          }
        />
        <StatCard
          label="Approved Live"
          value={stats.approved}
          delay="admin-stagger-2"
          gradient="bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/25"
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Pending Review"
          value={stats.pending}
          delay="admin-stagger-3"
          gradient="bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/25"
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          delay="admin-stagger-4"
          gradient="bg-gradient-to-br from-cyan-500 to-blue-500 shadow-cyan-500/25"
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          }
        />
      </div>

      {/* ── Trails management section ── */}
      <div className="bg-slate-900/60 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden admin-fade-in">
        {/* Section header */}
        <div className="px-5 lg:px-6 py-5 border-b border-slate-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-white font-bold text-lg">All Trails Management</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                {filtered.length} of {trails.length} trails shown • Click any row to view full details
              </p>
            </div>

            {/* Search + filter */}
            <div className="flex gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search trails..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-slate-800/70 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors w-48"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '14px', paddingRight: '28px' }}
              >
                <option value="All">All Status</option>
                <option value="PENDING">⏳ Pending Review</option>
                <option value="APPROVED">✓ Approved Live</option>
                <option value="COMPLETED">Completed</option>
                <option value="ONGOING">Ongoing</option>
                <option value="PLANNED">Planned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-6 py-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-rose-400 font-semibold text-sm">Failed to load trails</p>
            <p className="text-slate-500 text-xs mt-1">{error}</p>
            <button onClick={loadTrails} className="mt-3 px-4 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700 transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && !error && (
          <div className="px-6 py-12 text-center">
            <svg className="w-8 h-8 text-emerald-400 mx-auto animate-spin mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-slate-400 text-sm">Loading trails…</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <p className="text-slate-400 font-semibold text-sm">
              {trails.length === 0 ? 'No trails in the system' : 'No trails match your filters'}
            </p>
            <p className="text-slate-600 text-xs mt-1">
              {trails.length === 0 ? 'Trails will appear here once users create them.' : 'Try adjusting your search or filter.'}
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto admin-scroll">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800/60">
                  <th className="px-5 lg:px-6 py-3.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">ID</th>
                  <th className="px-3 py-3.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">Trail</th>
                  <th className="px-3 py-3.5 text-slate-400 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">User</th>
                  <th className="px-3 py-3.5 text-slate-400 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Province</th>
                  <th className="px-3 py-3.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">Review Status</th>
                  <th className="px-3 py-3.5 text-slate-400 text-xs font-semibold uppercase tracking-wider hidden xl:table-cell">Tags</th>
                  <th className="px-5 lg:px-6 py-3.5 text-slate-400 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(trail => {
                  const sc = STATUS_STYLES[trail.status] ?? STATUS_STYLES.PLANNED;
                  const isApproving = approvingId === trail.id;

                  return (
                    <tr
                      key={trail.id}
                      onClick={() => setSelectedTrail(trail)}
                      className="border-b border-slate-800/40 hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      {/* ID */}
                      <td className="px-5 lg:px-6 py-3.5">
                        <span className="text-slate-500 text-xs font-mono">#{trail.id}</span>
                      </td>

                      {/* Title */}
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {trail.routeCoordinates.length > 1 ? (
                              <svg viewBox="0 0 36 36" className="w-full h-full p-1">
                                {(() => {
                                  const pts = trail.routeCoordinates;
                                  const lats = pts.map(c => c[0]);
                                  const lngs = pts.map(c => c[1]);
                                  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
                                  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
                                  const spanLat = Math.max(maxLat - minLat, 0.001);
                                  const spanLng = Math.max(maxLng - minLng, 0.001);
                                  const points = pts.map(([lat, lng]) =>
                                    `${((lng - minLng) / spanLng) * 28 + 4},${28 - ((lat - minLat) / spanLat) * 24 + 4}`
                                  ).join(' ');
                                  return <polyline points={points} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.8" />;
                                })()}
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-sm font-semibold truncate max-w-[180px] lg:max-w-[260px] group-hover:text-emerald-400 transition-colors">
                              {trail.title}
                            </p>
                            <p className="text-slate-500 text-xs truncate max-w-[180px] lg:max-w-[260px]">
                              {trail.description || 'No description'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* User */}
                      <td className="px-3 py-3.5 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[9px] font-bold">{trail.userAvatar}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-slate-300 text-xs truncate max-w-[110px]">{trail.username}</p>
                            {trail.userEmail && (
                              <p className="text-slate-500 text-[10px] truncate max-w-[110px]">{trail.userEmail}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Province */}
                      <td className="px-3 py-3.5 hidden lg:table-cell">
                        <span className="text-slate-400 text-xs">{trail.location || '—'}</span>
                      </td>

                      {/* Review Status */}
                      <td className="px-3 py-3.5">
                        {trail.approved ? (
                          <span className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-full inline-flex items-center gap-1">
                            ✓ APPROVED
                          </span>
                        ) : trail.published ? (
                          <span className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded-full inline-flex items-center gap-1">
                            ⏳ PENDING
                          </span>
                        ) : (
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${sc.bg}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            <span className={`text-[10px] font-bold uppercase ${sc.text}`}>{trail.status}</span>
                          </div>
                        )}
                      </td>

                      {/* Tags */}
                      <td className="px-3 py-3.5 hidden xl:table-cell">
                        <div className="flex gap-1 flex-wrap">
                          {trail.tags.length > 0
                            ? trail.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="bg-slate-800/60 text-slate-400 text-[10px] px-2 py-0.5 rounded-md">
                                {tag}
                              </span>
                            ))
                            : <span className="text-slate-600 text-xs">—</span>
                          }
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 lg:px-6 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve Button */}
                          {!trail.approved && (
                            <button
                              onClick={() => handleApprove(trail)}
                              disabled={isApproving}
                              className="px-2.5 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                              title="Approve & publish trail"
                            >
                              {isApproving ? (
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                              Approve
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteTarget(trail)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                            title="Delete trail"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selectedTrail && (
        <TrailDetailModal
          trail={selectedTrail}
          onClose={() => setSelectedTrail(null)}
          onApprove={handleApprove}
          onDelete={trail => { setSelectedTrail(null); setDeleteTarget(trail); }}
          approving={approvingId === selectedTrail.id}
        />
      )}

      {/* ── Delete modal ── */}
      {deleteTarget && (
        <DeleteModal
          trail={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => { if (!deleting) setDeleteTarget(null); }}
          deleting={deleting}
        />
      )}

      {/* ── Toast notification ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[110] admin-fade-in">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-xl ${toast.startsWith('Error')
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
            {toast.startsWith('Error') ? (
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className="text-sm font-medium">{toast}</p>
          </div>
        </div>
      )}
    </div>
  );
}
