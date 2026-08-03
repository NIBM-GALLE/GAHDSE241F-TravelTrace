import { useState, useEffect, useRef } from 'react';
import {
  Users, Search, Filter, Trash2, ShieldOff, ShieldCheck,
  ChevronDown, Loader2, AlertTriangle, Map, CheckCircle2,
  Clock, MoreHorizontal, X, RefreshCw
} from 'lucide-react';
import {
  fetchAllUsers, deleteUser, updateUserStatus, type AdminUser
} from '../../../api/adminApi';

// ── Styles ──────────────────────────────────────────────────
const styles = {
  badge: (color: string, bg: string, border: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    color,
    backgroundColor: bg,
    border: `1px solid ${border}`,
  }),
  dot: (color: string) => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: color,
    flexShrink: 0,
  }),
};

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'suspend' | 'activate';
    user: AdminUser;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ── Fetch users ────────────────────────────────────────────
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Action handlers ────────────────────────────────────────
  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      if (confirmAction.type === 'delete') {
        await deleteUser(confirmAction.user.id);
      } else {
        const newStatus = confirmAction.type === 'suspend' ? 'SUSPENDED' : 'ACTIVE';
        await updateUserStatus(confirmAction.user.id, newStatus);
      }
      await loadUsers();
      setConfirmAction(null);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Filter & Search ────────────────────────────────────────
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phoneNumber ?? '').includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ── Stats ──────────────────────────────────────────────────
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'ACTIVE').length;
  const suspendedUsers = users.filter(u => u.status === 'SUSPENDED').length;
  const totalTrails = users.reduce((sum, u) => sum + u.totalTrips, 0);

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <p style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            System Administration
          </p>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', margin: 0 }}>User Management</h2>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px', maxWidth: '600px' }}>
            Manage platform users, monitor trail activity, and control account access across your travel network.
          </p>
        </div>

        <button
          onClick={loadUsers}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px',
            fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Users', value: totalUsers, color: '#3b82f6', icon: Users },
          { label: 'Active', value: activeUsers, color: '#22c55e', icon: ShieldCheck },
          { label: 'Suspended', value: suspendedUsers, color: '#ef4444', icon: ShieldOff },
          { label: 'Total Trails', value: totalTrails, color: '#8b5cf6', icon: Map },
        ].map((stat) => (
          <div key={stat.label} style={{
            backgroundColor: '#fff', padding: '20px', borderRadius: '16px',
            border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                {stat.label}
              </p>
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                backgroundColor: stat.color + '12', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <stat.icon size={16} color={stat.color} />
              </div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: 0, lineHeight: 1 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div style={{
        backgroundColor: '#fff', padding: '16px', borderRadius: '16px',
        border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap',
        gap: '12px', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '440px' }}>
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', paddingLeft: '42px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px',
              backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px',
              fontSize: '13px', outline: 'none', color: '#334155', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          {(['ALL', 'ACTIVE', 'SUSPENDED'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px',
                borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s', border: '1px solid',
                backgroundColor: statusFilter === status ? (
                  status === 'ACTIVE' ? '#f0fdf4' : status === 'SUSPENDED' ? '#fef2f2' : '#eff6ff'
                ) : '#f8fafc',
                color: statusFilter === status ? (
                  status === 'ACTIVE' ? '#16a34a' : status === 'SUSPENDED' ? '#dc2626' : '#2563eb'
                ) : '#64748b',
                borderColor: statusFilter === status ? (
                  status === 'ACTIVE' ? '#bbf7d0' : status === 'SUSPENDED' ? '#fecaca' : '#bfdbfe'
                ) : '#e2e8f0',
              }}
            >
              <Filter size={14} />
              {status === 'ALL' ? 'All Users' : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Loading / Error states */}
      {loading && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '60px', backgroundColor: '#fff', borderRadius: '16px',
          border: '1px solid #e2e8f0',
        }}>
          <Loader2 size={32} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          <span style={{ marginLeft: '12px', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Loading users...</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '20px',
          backgroundColor: '#fef2f2', borderRadius: '16px', border: '1px solid #fecaca',
        }}>
          <AlertTriangle size={20} color="#ef4444" />
          <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: 500 }}>{error}</span>
          <button
            onClick={loadUsers}
            style={{
              marginLeft: 'auto', padding: '8px 16px', backgroundColor: '#fff',
              border: '1px solid #fecaca', borderRadius: '10px', fontSize: '12px',
              fontWeight: 600, color: '#dc2626', cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* User Table */}
      {!loading && !error && (
        <div style={{
          backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['User', 'Contact', 'Address', 'Trails', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '14px 20px', fontSize: '11px', fontWeight: 700,
                      color: '#94a3b8', textTransform: 'uppercase' as const,
                      letterSpacing: '0.05em', textAlign: h === 'Actions' ? 'right' as const : 'left' as const,
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                      {searchTerm || statusFilter !== 'ALL' ? 'No users match your filters.' : 'No users found.'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#f8fafc'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'; }}
                    >
                      {/* User */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ position: 'relative', flexShrink: 0 }}>
                            {user.profileImageUrl ? (
                              <img
                                src={user.profileImageUrl}
                                alt={user.username}
                                style={{
                                  width: '42px', height: '42px', borderRadius: '50%',
                                  objectFit: 'cover', border: '2px solid #e2e8f0',
                                }}
                              />
                            ) : (
                              <div style={{
                                width: '42px', height: '42px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: '14px', fontWeight: 700,
                              }}>
                                {getInitials(user.username)}
                              </div>
                            )}
                            {user.status === 'ACTIVE' && (
                              <div style={{
                                position: 'absolute', bottom: '0', right: '0',
                                width: '12px', height: '12px', backgroundColor: '#22c55e',
                                borderRadius: '50%', border: '2px solid #fff',
                              }} />
                            )}
                          </div>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                              {user.username}
                            </p>
                            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '16px 20px' }}>
                        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>{user.email}</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0 0' }}>
                          {user.phoneNumber || '—'}
                        </p>
                      </td>

                      {/* Address */}
                      <td style={{ padding: '16px 20px' }}>
                        <p style={{ fontSize: '13px', color: '#475569', margin: 0, maxWidth: '180px' }}>
                          {user.address || '—'}
                        </p>
                      </td>

                      {/* Trails */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Total">
                            <Map size={14} color="#3b82f6" />
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                              {user.totalTrips}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <span title="Ongoing" style={{
                              ...styles.badge('#16a34a', '#f0fdf4', '#bbf7d0'),
                              padding: '2px 8px', fontSize: '11px',
                            }}>
                              <Clock size={10} /> {user.ongoingTrips}
                            </span>
                            <span title="Completed" style={{
                              ...styles.badge('#2563eb', '#eff6ff', '#bfdbfe'),
                              padding: '2px 8px', fontSize: '11px',
                            }}>
                              <CheckCircle2 size={10} /> {user.completedTrips}
                            </span>
                            <span title="Planned" style={{
                              ...styles.badge('#7c3aed', '#f5f3ff', '#ddd6fe'),
                              padding: '2px 8px', fontSize: '11px',
                            }}>
                              <ChevronDown size={10} /> {user.plannedTrips}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 20px' }}>
                        {user.status === 'ACTIVE' ? (
                          <span style={styles.badge('#16a34a', '#f0fdf4', '#bbf7d0')}>
                            <span style={styles.dot('#22c55e')} />
                            Active
                          </span>
                        ) : (
                          <span style={styles.badge('#dc2626', '#fef2f2', '#fecaca')}>
                            <span style={styles.dot('#ef4444')} />
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right', position: 'relative' }}>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                          style={{
                            padding: '8px', borderRadius: '8px', backgroundColor: 'transparent',
                            border: '1px solid transparent', cursor: 'pointer', color: '#94a3b8',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.color = '#475569';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.color = '#94a3b8';
                          }}
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {/* Dropdown menu */}
                        {openMenuId === user.id && (
                          <div
                            ref={menuRef}
                            style={{
                              position: 'absolute', right: '20px', top: '48px', zIndex: 50,
                              backgroundColor: '#fff', borderRadius: '12px',
                              border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                              minWidth: '180px', overflow: 'hidden',
                              animation: 'fadeIn 0.15s ease-out',
                            }}
                          >
                            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>

                            {user.status === 'ACTIVE' ? (
                              <button
                                onClick={() => {
                                  setConfirmAction({ type: 'suspend', user });
                                  setOpenMenuId(null);
                                }}
                                style={{
                                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                                  padding: '12px 16px', backgroundColor: 'transparent', border: 'none',
                                  cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#d97706',
                                  transition: 'background-color 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fffbeb'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                              >
                                <ShieldOff size={16} />
                                Suspend User
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setConfirmAction({ type: 'activate', user });
                                  setOpenMenuId(null);
                                }}
                                style={{
                                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                                  padding: '12px 16px', backgroundColor: 'transparent', border: 'none',
                                  cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#16a34a',
                                  transition: 'background-color 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f0fdf4'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                              >
                                <ShieldCheck size={16} />
                                Reactivate User
                              </button>
                            )}

                            <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

                            <button
                              onClick={() => {
                                setConfirmAction({ type: 'delete', user });
                                setOpenMenuId(null);
                              }}
                              style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '12px 16px', backgroundColor: 'transparent', border: 'none',
                                cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#dc2626',
                                transition: 'background-color 0.15s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                              <Trash2 size={16} />
                              Delete User
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{
            padding: '14px 20px', borderTop: '1px solid #f1f5f9',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.5)',
            backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 100,
          }}
          onClick={() => !actionLoading && setConfirmAction(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff', borderRadius: '20px', padding: '28px',
              maxWidth: '420px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            {/* Icon */}
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px auto',
              backgroundColor: confirmAction.type === 'delete' ? '#fef2f2'
                : confirmAction.type === 'suspend' ? '#fffbeb' : '#f0fdf4',
            }}>
              {confirmAction.type === 'delete' ? (
                <Trash2 size={24} color="#ef4444" />
              ) : confirmAction.type === 'suspend' ? (
                <ShieldOff size={24} color="#d97706" />
              ) : (
                <ShieldCheck size={24} color="#16a34a" />
              )}
            </div>

            {/* Title */}
            <h3 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: '0 0 8px 0' }}>
              {confirmAction.type === 'delete' ? 'Delete User'
                : confirmAction.type === 'suspend' ? 'Suspend User' : 'Reactivate User'}
            </h3>

            {/* Description */}
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', margin: '0 0 24px 0', lineHeight: '1.6' }}>
              {confirmAction.type === 'delete' ? (
                <>
                  Are you sure you want to permanently delete <strong>{confirmAction.user.username}</strong>?
                  This will also delete all <strong>{confirmAction.user.totalTrips}</strong> of their trails.
                  This action cannot be undone.
                </>
              ) : confirmAction.type === 'suspend' ? (
                <>
                  Suspend <strong>{confirmAction.user.username}</strong>?
                  They will be unable to log in until reactivated.
                </>
              ) : (
                <>
                  Reactivate <strong>{confirmAction.user.username}</strong>?
                  They will be able to log in and use the platform again.
                </>
              )}
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setConfirmAction(null)}
                disabled={actionLoading}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px',
                  backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                  fontSize: '13px', fontWeight: 600, color: '#64748b',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.5 : 1,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={actionLoading}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                  fontSize: '13px', fontWeight: 600, cursor: actionLoading ? 'not-allowed' : 'pointer',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  backgroundColor: confirmAction.type === 'delete' ? '#ef4444'
                    : confirmAction.type === 'suspend' ? '#d97706' : '#16a34a',
                  opacity: actionLoading ? 0.7 : 1,
                }}
              >
                {actionLoading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                {confirmAction.type === 'delete' ? 'Delete'
                  : confirmAction.type === 'suspend' ? 'Suspend' : 'Reactivate'}
              </button>
            </div>

            {/* Close X */}
            {!actionLoading && (
              <button
                onClick={() => setConfirmAction(null)}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                  color: '#94a3b8', padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
