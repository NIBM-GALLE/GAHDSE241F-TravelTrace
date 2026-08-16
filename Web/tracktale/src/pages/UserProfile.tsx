// src/pages/UserProfile.tsx
// ──────────────────────────────────────────────────────────────
// Logged-in user profile page.
// Shows user account details and all recorded trails created by the user.
// ──────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { fetchUserTrails, fetchUserDetails, type Trail, type FullUser } from '../api/trailsApi';
import AuthModal from '../components/AuthModal';

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  COMPLETED: { bg: 'bg-cyan-400/10', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  ONGOING: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  PLANNED: { bg: 'bg-violet-400/10', text: 'text-violet-400', dot: 'bg-violet-400' },
};

function avatarInitials(name: string) {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

export default function UserProfile() {
  const { user, logout, updateProfile } = useUserAuth();
  const navigate = useNavigate();

  const [fullUser, setFullUser] = useState<FullUser | null>(null);
  const [userTrails, setUserTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Edit Profile modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    profileImageUrl: '',
  });

  const loadData = () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([
      fetchUserDetails(user.id).catch(() => null),
      fetchUserTrails(user.id).catch(() => [])
    ]).then(([details, trails]) => {
      if (details) {
        setFullUser(details);
        setFormData({
          username: details.username || '',
          email: details.email || '',
          phoneNumber: details.phoneNumber || '',
          address: details.address || '',
          password: '',
          profileImageUrl: details.profileImageUrl || '',
        });
      }
      setUserTrails(trails);
    }).catch(err => {
      setError(err.message || 'Failed to load profile.');
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleOpenEditModal = () => {
    if (fullUser) {
      setFormData({
        username: fullUser.username || user?.username || '',
        email: fullUser.email || user?.email || '',
        phoneNumber: fullUser.phoneNumber || '',
        address: fullUser.address || '',
        password: '',
        profileImageUrl: fullUser.profileImageUrl || '',
      });
    }
    setEditError(null);
    setEditSuccess(null);
    setEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setEditError(null);
    setEditSuccess(null);

    const payload: {
      username: string;
      email: string;
      phoneNumber: string;
      address: string;
      profileImageUrl: string;
      password?: string;
    } = {
      username: formData.username,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      profileImageUrl: formData.profileImageUrl,
    };

    if (formData.password.trim().length > 0) {
      payload.password = formData.password.trim();
    }

    const res = await updateProfile(payload);
    setSaving(false);

    if (res.ok) {
      setEditSuccess('Profile updated successfully!');
      setTimeout(() => {
        setEditModalOpen(false);
        setEditSuccess(null);
        loadData();
      }, 1000);
    } else {
      setEditError(res.message);
    }
  };

  // Unauthenticated view
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-xl">
          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">User Profile</h1>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          Please sign in to view your profile details and your recorded trails.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm rounded-xl hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/20"
        >
          Sign In / Create Account
        </button>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  const completedCount = userTrails.filter(t => t.status === 'COMPLETED').length;
  const ongoingCount = userTrails.filter(t => t.status === 'ONGOING').length;
  const plannedCount = userTrails.filter(t => t.status === 'PLANNED').length;

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Profile Card Header */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            {/* User Avatar + Info */}
            <div className="flex items-center gap-5">
              <div className="relative">
                {fullUser?.profileImageUrl ? (
                  <img
                    src={fullUser.profileImageUrl}
                    alt={user.username}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xl shadow-emerald-500/10"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/15 border-2 border-white/10">
                    <span className="text-white text-2xl font-extrabold">{avatarInitials(user.username)}</span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                  <svg className="w-3 h-3 text-slate-950" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{user.username}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                    {fullUser?.status || 'Active'} Traveler
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1">{user.email}</p>

                {/* Additional user metadata */}
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 flex-wrap">
                  {fullUser?.phoneNumber && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{fullUser.phoneNumber}</span>
                    </div>
                  )}
                  {fullUser?.address && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>{fullUser.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Profile & Logout buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenEditModal}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all shadow-sm flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 border border-slate-700 bg-slate-800/60 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-500 font-medium">Total Trails</p>
              <p className="text-2xl font-bold text-white mt-1">{userTrails.length}</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <p className="text-xs text-cyan-400 font-medium">Completed</p>
              <p className="text-2xl font-bold text-white mt-1">{completedCount}</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <p className="text-xs text-emerald-400 font-medium">Ongoing</p>
              <p className="text-2xl font-bold text-white mt-1">{ongoingCount}</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <p className="text-xs text-violet-400 font-medium">Planned</p>
              <p className="text-2xl font-bold text-white mt-1">{plannedCount}</p>
            </div>
          </div>
        </div>

        {/* My Trails Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">My Recorded Trails</h2>
              <p className="text-slate-400 text-xs mt-1">GPS itineraries & journeys recorded under your account</p>
            </div>
            <span className="text-xs text-slate-500 font-medium">{userTrails.length} Trails Total</span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && userTrails.length === 0 && (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No Recorded Trails Yet</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                Record your GPS travel routes, pin waypoint photos, and publish your journeys using the **TravelTrace Mobile App**.
              </p>
            </div>
          )}

          {/* User Trails Grid */}
          {!loading && !error && userTrails.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userTrails.map(trail => {
                const sc = STATUS_COLORS[trail.status] || STATUS_COLORS.PLANNED;
                return (
                  <Link
                    key={trail.id}
                    to={`/trail/${trail.id}`}
                    className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col"
                  >
                    {/* Header preview */}
                    <div className="relative h-44 bg-slate-800 flex items-center justify-center p-4">
                      {/* Status badge */}
                      <div className="absolute top-3 left-3">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${sc.bg}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></div>
                          <span className={`text-xs font-bold ${sc.text}`}>{trail.status}</span>
                        </div>
                      </div>

                      {/* Approved & Published Badge */}
                      <div className="absolute top-3 right-3">
                        {trail.published && trail.approved ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            🟢 Live on Web
                          </span>
                        ) : trail.published ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
                            🟡 Pending Review
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-slate-700/60 text-slate-400 text-[10px] font-bold">
                            ⚪ Draft
                          </span>
                        )}
                      </div>

                      <div className="text-center">
                        <svg className="w-10 h-10 text-slate-600 mx-auto mb-2 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <p className="text-slate-400 text-xs font-semibold">{trail.waypoints.length} Waypoint Pins</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-white font-bold text-base mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {trail.title}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
                        {trail.description || 'No description provided.'}
                      </p>

                      <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-3 mt-auto text-slate-400">
                        <span>{trail.location || 'Sri Lanka'}</span>
                        <span className="text-emerald-400 font-semibold">{trail.duration || '—'}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </h3>
            <p className="text-slate-400 text-xs mb-6">Update your account information and preferences</p>

            {editError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {editError}
              </div>
            )}

            {editSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {editSuccess}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Username *</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. 0771234567"
                  value={formData.phoneNumber}
                  onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="e.g. Galle, Sri Lanka"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Profile Photo URL</label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/..."
                  value={formData.profileImageUrl}
                  onChange={e => setFormData({ ...formData, profileImageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password (optional)</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep unchanged"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
