import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, User as UserIcon, XCircle, Key, Trash2, Clock3 } from 'lucide-react';
import { spacing, colors, typography, borderRadius } from '../theme';
import { Button } from './Button';
import { Card } from './Card';
import { AdminDataState } from './AdminDataState';
import {
  approveRequest,
  fetchPasswordResetRequests,
  approvePasswordResetRequest,
  rejectPasswordResetRequest,
  deletePasswordResetRequest,
  fetchAdminTestimonials,
  approveAdminTestimonial,
  rejectAdminTestimonial,
  deleteAdminTestimonial
} from '../api/api';
import { handleSuccess, handleApiError } from '../utils/toast';

export const AdminRequestsTab = ({ requests, onRequestsUpdate, loading, error, onRetry }) => {
  const [activeView, setActiveView] = useState('registration'); // registration | password | testimonials
  const [passwordResetRequests, setPasswordResetRequests] = useState([]);
  const [testimonialRequests, setTestimonialRequests] = useState([]);
  const [loadingPasswordResets, setLoadingPasswordResets] = useState(false);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [testimonialError, setTestimonialError] = useState('');
  const [busyRequestId, setBusyRequestId] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadPasswordResetRequests();
    loadTestimonialRequests();
  }, []);

  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth < 1024;

  const loadPasswordResetRequests = async () => {
    setLoadingPasswordResets(true);
    try {
      const data = await fetchPasswordResetRequests();
      setPasswordResetRequests(data || []);
      setPasswordError('');
    } catch (err) {
      setPasswordError(err?.message || 'Failed to load password reset requests');
    } finally {
      setLoadingPasswordResets(false);
    }
  };

  useEffect(() => {
    if (activeView === 'password') {
      loadPasswordResetRequests();
    } else if (activeView === 'testimonials') {
      loadTestimonialRequests();
    }
  }, [activeView]);

  const loadTestimonialRequests = async () => {
    setLoadingTestimonials(true);
    try {
      const data = await fetchAdminTestimonials();
      setTestimonialRequests(data?.testimonials || []);
      setTestimonialError('');
    } catch (err) {
      setTestimonialError(err?.message || 'Failed to load testimonial requests');
    } finally {
      setLoadingTestimonials(false);
    }
  };

  const handleApprove = async (requestId) => {
    setBusyRequestId(requestId);
    try {
      await approveRequest(requestId);
      handleSuccess('Registration request approved successfully');
      onRequestsUpdate();
    } catch (err) {
      handleApiError(err);
    } finally {
      setBusyRequestId(null);
    }
  };

  const handleApprovePasswordReset = async (requestId) => {
    setBusyRequestId(requestId);
    try {
      await approvePasswordResetRequest(requestId);
      handleSuccess('Password reset request approved');
      loadPasswordResetRequests();
    } catch (err) {
      handleApiError(err);
    } finally {
      setBusyRequestId(null);
    }
  };

  const handleRejectPasswordReset = async (requestId) => {
    setBusyRequestId(requestId);
    try {
      await rejectPasswordResetRequest(requestId);
      handleSuccess('Password reset request rejected');
      loadPasswordResetRequests();
    } catch (err) {
      handleApiError(err);
    } finally {
      setBusyRequestId(null);
    }
  };

  const handleDeletePasswordReset = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this password reset request?')) return;
    setBusyRequestId(requestId);
    try {
      await deletePasswordResetRequest(requestId);
      handleSuccess('Password reset request deleted');
      loadPasswordResetRequests();
    } catch (err) {
      handleApiError(err);
    } finally {
      setBusyRequestId(null);
    }
  };

  const handleApproveTestimonial = async (testimonialId) => {
    setBusyRequestId(testimonialId);
    try {
      await approveAdminTestimonial(testimonialId);
      handleSuccess('Testimonial approved');
      loadTestimonialRequests();
    } catch (err) {
      handleApiError(err);
    } finally {
      setBusyRequestId(null);
    }
  };

  const handleRejectTestimonial = async (testimonialId) => {
    setBusyRequestId(testimonialId);
    try {
      await rejectAdminTestimonial(testimonialId);
      handleSuccess('Testimonial rejected');
      loadTestimonialRequests();
    } catch (err) {
      handleApiError(err);
    } finally {
      setBusyRequestId(null);
    }
  };

  const handleDeleteTestimonial = async (testimonialId) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    setBusyRequestId(testimonialId);
    try {
      await deleteAdminTestimonial(testimonialId);
      handleSuccess('Testimonial deleted');
      loadTestimonialRequests();
    } catch (err) {
      handleApiError(err);
    } finally {
      setBusyRequestId(null);
    }
  };

  const statusBadgeStyles = {
    pending: { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
    approved: { bg: '#d1fae5', color: '#065f46', label: 'Approved' },
    rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
    completed: { bg: '#dbeafe', color: '#1e40af', label: 'Completed' }
  };

  const getStatusBadge = (status) => {
    const style = statusBadgeStyles[status] || statusBadgeStyles.pending;
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${spacing.xs} ${spacing.sm}`,
          borderRadius: borderRadius.full,
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.02em',
          background: style.bg,
          color: style.color
        }}
      >
        {style.label}
      </span>
    );
  };

  const registrationCount = requests?.length || 0;
  const passwordCount = passwordResetRequests?.length || 0;
  const testimonialCount = testimonialRequests?.length || 0;

  const isRegistrationViewLoading = activeView === 'registration' && loading;
  const isPasswordViewLoading = activeView === 'password' && loadingPasswordResets;
  const isTestimonialViewLoading = activeView === 'testimonials' && loadingTestimonials;

  const sortedPasswordRequests = useMemo(() => {
    return [...(passwordResetRequests || [])].sort((a, b) => {
      const order = { pending: 0, approved: 1, completed: 2, rejected: 3 };
      const statusDiff = (order[a.status] ?? 99) - (order[b.status] ?? 99);
      if (statusDiff !== 0) return statusDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [passwordResetRequests]);

  const sortedTestimonialRequests = useMemo(() => {
    return [...(testimonialRequests || [])].sort((a, b) => {
      const order = { pending: 0, approved: 1, rejected: 2 };
      const statusDiff = (order[a.status] ?? 99) - (order[b.status] ?? 99);
      if (statusDiff !== 0) return statusDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [testimonialRequests]);

  return (
    <div>
      <div style={{ marginBottom: spacing.xl }}>
        <div
          style={{
            display: 'flex',
            gap: spacing.sm,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: borderRadius.lg,
            padding: spacing.xs,
            width: '100%',
            overflowX: 'auto',
            flexWrap: 'nowrap'
          }}
        >
          <Button
            variant={activeView === 'registration' ? 'primary' : 'ghost'}
            onClick={() => setActiveView('registration')}
            size={isMobile ? 'md' : 'sm'}
            style={{
              textTransform: 'none',
              minWidth: isMobile ? '220px' : '210px',
              justifyContent: 'center'
            }}
          >
            <UserIcon size={16} />
            Registration Requests
            <span style={{ marginLeft: spacing.xs, fontWeight: 700 }}>({registrationCount})</span>
          </Button>
          <Button
            variant={activeView === 'password' ? 'primary' : 'ghost'}
            onClick={() => setActiveView('password')}
            size={isMobile ? 'md' : 'sm'}
            style={{
              textTransform: 'none',
              minWidth: isMobile ? '240px' : '230px',
              justifyContent: 'center'
            }}
          >
            <Key size={16} />
            Password Reset Requests
            <span style={{ marginLeft: spacing.xs, fontWeight: 700 }}>({passwordCount})</span>
          </Button>
          <Button
            variant={activeView === 'testimonials' ? 'primary' : 'ghost'}
            onClick={() => setActiveView('testimonials')}
            size={isMobile ? 'md' : 'sm'}
            style={{
              textTransform: 'none',
              minWidth: isMobile ? '220px' : '210px',
              justifyContent: 'center'
            }}
          >
            <CheckCircle size={16} />
            Testimonials
            <span style={{ marginLeft: spacing.xs, fontWeight: 700 }}>({testimonialCount})</span>
          </Button>
        </div>
      </div>

      {activeView === 'registration' && (
        <div>
          <h2 style={{ ...typography.h3, marginBottom: spacing.lg }}>Pending Registration Requests</h2>

          {isRegistrationViewLoading ? (
            <AdminDataState type="loading" message="Loading registration requests..." />
          ) : error ? (
            <AdminDataState type="error" message={error} onAction={onRetry} actionLabel="Reload Requests" />
          ) : registrationCount === 0 ? (
            <AdminDataState type="empty" message="No pending registration requests." />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : isTablet
                ? 'repeat(auto-fill, minmax(280px, 1fr))'
                : 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: spacing.lg
            }}>
              {requests.map((req) => (
                <Card key={req._id}>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, minWidth: 0 }}>
                      <div style={{ background: colors.glass, padding: isMobile ? spacing.sm : spacing.md, borderRadius: '50%', flexShrink: 0 }}>
                        <UserIcon size={isMobile ? 20 : 22} color={colors.primary} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ ...typography.label, margin: 0, overflowWrap: 'anywhere' }}>
                          {req.firstName} {req.lastName}
                        </h3>
                        <p style={{ ...typography.small, color: colors.textMuted, margin: 0 }}>
                          Requested: {new Date(req.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="success"
                      onClick={() => handleApprove(req._id)}
                      size={isMobile ? 'md' : 'sm'}
                      loading={busyRequestId === req._id}
                      fullWidth
                    >
                      <CheckCircle size={16} /> Approve
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeView === 'password' && (
        <div>
          <h2 style={{ ...typography.h3, marginBottom: spacing.lg }}>Password Reset Requests</h2>

          {isPasswordViewLoading ? (
            <AdminDataState type="loading" message="Loading password reset requests..." />
          ) : passwordError ? (
            <AdminDataState type="error" message={passwordError} onAction={loadPasswordResetRequests} actionLabel="Reload Requests" />
          ) : passwordCount === 0 ? (
            <AdminDataState type="empty" message="No password reset requests." />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : isTablet
                ? 'repeat(auto-fill, minmax(300px, 1fr))'
                : 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: spacing.lg
            }}>
              {sortedPasswordRequests.map((req) => {
                const isBusy = busyRequestId === req._id;
                return (
                  <Card key={req._id}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: spacing.md,
                        flexDirection: isMobile ? 'column' : 'row'
                      }}>
                        <div style={{ display: 'flex', gap: spacing.md, minWidth: 0 }}>
                          <div style={{ background: colors.glass, padding: isMobile ? spacing.sm : spacing.md, borderRadius: '50%', flexShrink: 0 }}>
                            <Key size={isMobile ? 20 : 22} color={colors.primary} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <h3 style={{ ...typography.bodyLarge, margin: 0, fontWeight: 700, overflowWrap: 'anywhere' }}>{req.username}</h3>
                            {req.userId && (
                              <p style={{ ...typography.small, color: colors.textMuted, margin: `${spacing.xs} 0 0 0` }}>
                                {req.userId.firstName} {req.userId.lastName}
                              </p>
                            )}
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.sm,
                          width: isMobile ? '100%' : 'auto',
                          justifyContent: isMobile ? 'space-between' : 'flex-end'
                        }}>
                          {getStatusBadge(req.status)}
                          {req.status !== 'pending' && (
                            <Button
                              variant="ghost"
                              size={isMobile ? 'md' : 'sm'}
                              onClick={() => handleDeletePasswordReset(req._id)}
                              loading={isBusy}
                              style={{ color: colors.danger }}
                            >
                              <Trash2 size={14} />
                              {isMobile && 'Delete'}
                            </Button>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gap: spacing.xs }}>
                        <p style={{ ...typography.small, color: colors.textMuted, margin: 0 }}>
                          <Clock3 size={12} style={{ marginRight: spacing.xs, verticalAlign: 'text-top' }} />
                          Requested: {new Date(req.createdAt).toLocaleString()}
                        </p>
                        {req.approvedAt && (
                          <p style={{ ...typography.small, color: colors.success, margin: 0 }}>
                            Approved: {new Date(req.approvedAt).toLocaleDateString()}
                          </p>
                        )}
                        {req.expiresAt && req.status === 'approved' && (
                          <p style={{ ...typography.small, color: colors.warning, margin: 0 }}>
                            Expires: {new Date(req.expiresAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {req.status === 'pending' && (
                        <div style={{
                          display: 'flex',
                          gap: spacing.sm,
                          flexDirection: isMobile ? 'column' : 'row'
                        }}>
                          <Button
                            variant="success"
                            onClick={() => handleApprovePasswordReset(req._id)}
                            size={isMobile ? 'md' : 'sm'}
                            loading={isBusy}
                            fullWidth
                          >
                            <CheckCircle size={16} /> Approve
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleRejectPasswordReset(req._id)}
                            size={isMobile ? 'md' : 'sm'}
                            loading={isBusy}
                            fullWidth
                          >
                            <XCircle size={16} /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeView === 'testimonials' && (
        <div>
          <h2 style={{ ...typography.h3, marginBottom: spacing.lg }}>General Testimonial Requests</h2>

          {isTestimonialViewLoading ? (
            <AdminDataState type="loading" message="Loading testimonial requests..." />
          ) : testimonialError ? (
            <AdminDataState type="error" message={testimonialError} onAction={loadTestimonialRequests} actionLabel="Reload Testimonials" />
          ) : testimonialCount === 0 ? (
            <AdminDataState type="empty" message="No testimonial requests." />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : isTablet
                ? 'repeat(auto-fill, minmax(300px, 1fr))'
                : 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: spacing.lg
            }}>
              {sortedTestimonialRequests.map((req) => {
                const isBusy = busyRequestId === req._id;
                return (
                  <Card key={req._id}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md }}>
                        <div>
                          <h3 style={{ ...typography.bodyLarge, margin: 0, fontWeight: 700 }}>{req.author}</h3>
                          <p style={{ ...typography.small, color: colors.textMuted, margin: `${spacing.xs} 0 0 0` }}>
                            {req.role}
                          </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: spacing.sm }}>
                          {getStatusBadge(req.status)}
                          {req.status !== 'pending' && (
                            <Button
                              variant="ghost"
                              size={isMobile ? 'md' : 'sm'}
                              onClick={() => handleDeleteTestimonial(req._id)}
                              loading={isBusy}
                              style={{ color: colors.danger }}
                            >
                              <Trash2 size={14} />
                              {isMobile && 'Delete'}
                            </Button>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '2px', color: '#fbbf24' }}>
                        {[1, 2, 3, 4, 5].map((value) => (
                          <span key={`${req._id}-star-${value}`} style={{ color: value <= (req.rating || 0) ? '#fbbf24' : '#cbd5e1', fontSize: '18px', lineHeight: 1 }}>
                            ★
                          </span>
                        ))}
                      </div>

                      <p style={{ ...typography.bodySmall, margin: 0, whiteSpace: 'pre-wrap' }}>
                        "{req.text}"
                      </p>

                      <p style={{ ...typography.small, color: colors.textMuted, margin: 0 }}>
                        Submitted: {new Date(req.createdAt).toLocaleString()}
                      </p>

                      {req.status === 'pending' && (
                        <div style={{ display: 'flex', gap: spacing.sm, flexDirection: isMobile ? 'column' : 'row' }}>
                          <Button
                            variant="success"
                            onClick={() => handleApproveTestimonial(req._id)}
                            size={isMobile ? 'md' : 'sm'}
                            loading={isBusy}
                            fullWidth
                          >
                            <CheckCircle size={16} /> Approve
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleRejectTestimonial(req._id)}
                            size={isMobile ? 'md' : 'sm'}
                            loading={isBusy}
                            fullWidth
                          >
                            <XCircle size={16} /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminRequestsTab;
