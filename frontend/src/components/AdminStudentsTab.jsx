import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { User, Lock, Unlock, Search, Trash2 } from 'lucide-react';
import { spacing, colors, typography, borderRadius } from '../theme';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { AdminDataState } from './AdminDataState';
import { ConfirmDialog } from './ConfirmDialog';
import { deleteStudent, freezeStudent, unfreezeStudent } from '../api/api';
import { handleSuccess, handleApiError } from '../utils/toast';

const stripRoleSuffix = (username = '') => username.replace(/@(admin|teacher|student)$/i, '');

export const AdminStudentsTab = ({ students, semesterDate, onStudentsUpdate, loading, error, onRetry }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionType, setActionType] = useState('delete');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth < 1024;
  const shouldStackActions = viewportWidth < 480;

  const openActionConfirm = (student, action) => {
    setDeleteTarget(student);
    setActionType(action);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      if (actionType === 'delete') {
        await deleteStudent(deleteTarget._id);
      } else if (actionType === 'freeze') {
        await freezeStudent(deleteTarget._id);
      } else if (actionType === 'unfreeze') {
        await unfreezeStudent(deleteTarget._id);
      }

      const successMessageMap = {
        delete: 'Student deleted successfully',
        freeze: 'Student account frozen successfully',
        unfreeze: 'Student account unfrozen successfully'
      };

      handleSuccess(successMessageMap[actionType] || 'Action completed successfully');
      setShowDeleteDialog(false);
      onStudentsUpdate();
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStudentFreezeStatus = useCallback((student) => {
    const isManualFrozen = student.isFrozen;

    let isDateFrozen = false;
    if (semesterDate && !student.unfrozenByAdmin) {
      try {
        const completionDate = new Date(semesterDate);
        isDateFrozen = new Date() > completionDate;
      } catch (err) {
        console.error('Error calculating completion date:', err);
        isDateFrozen = false;
      }
    }

    return isManualFrozen || isDateFrozen;
  }, [semesterDate]);

  const studentsWithStatus = useMemo(
    () =>
      (students || []).map((student) => ({
        ...student,
        isFrozen: getStudentFreezeStatus(student)
      })),
    [students, getStudentFreezeStatus]
  );

  const studentCounts = useMemo(() => {
    const total = studentsWithStatus.length;
    const frozen = studentsWithStatus.filter((student) => student.isFrozen).length;
    const active = total - frozen;
    return { total, frozen, active };
  }, [studentsWithStatus]);

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = studentsWithStatus.filter((student) => {
      const statusMatch =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !student.isFrozen) ||
        (statusFilter === 'frozen' && student.isFrozen);

      const name = stripRoleSuffix(student.username || '').toLowerCase();
      const username = (student.username || '').toLowerCase();
      const searchMatch = !query || name.includes(query) || username.includes(query);

      return statusMatch && searchMatch;
    });

    return filtered.sort((a, b) => {
      if (a.isFrozen !== b.isFrozen) return a.isFrozen ? -1 : 1;
      return (a.username || '').localeCompare(b.username || '');
    });
  }, [studentsWithStatus, statusFilter, searchQuery]);

  return (
    <div>
      <h2 style={{ ...typography.h3, marginBottom: spacing.lg }}>
        Manage Students
      </h2>

      {loading && (
        <AdminDataState type="loading" message="Loading student accounts and freeze states..." />
      )}

      {!loading && error && (
        <AdminDataState type="error" message={error} onAction={onRetry} actionLabel="Reload Students" />
      )}

      {!loading && !error && (
      <>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.sm,
          marginBottom: spacing.lg
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: spacing.md,
            alignItems: isMobile ? 'stretch' : 'center',
            justifyContent: 'space-between'
          }}
        >
          <Input
            fullWidth={isMobile}
            placeholder="Search by name or username"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            icon={<Search size={16} />}
            size="sm"
            style={{
              width: isMobile ? '100%' : 'min(460px, 48vw)',
              minWidth: isMobile ? '100%' : '340px'
            }}
          />

          <div
            style={{
              display: 'flex',
              gap: spacing.sm,
              overflowX: isMobile ? 'auto' : 'visible',
              flexWrap: isMobile ? 'nowrap' : 'wrap',
              paddingBottom: isMobile ? spacing.xs : 0
            }}
          >
            <Button
              variant={statusFilter === 'all' ? 'primary' : 'secondary'}
              size={isMobile ? 'md' : 'sm'}
              onClick={() => setStatusFilter('all')}
              style={{ minWidth: isMobile ? 100 : 'auto' }}
            >
              All ({studentCounts.total})
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'success' : 'secondary'}
              size={isMobile ? 'md' : 'sm'}
              onClick={() => setStatusFilter('active')}
              style={{ minWidth: isMobile ? 110 : 'auto' }}
            >
              Active ({studentCounts.active})
            </Button>
            <Button
              variant={statusFilter === 'frozen' ? 'warning' : 'secondary'}
              size={isMobile ? 'md' : 'sm'}
              onClick={() => setStatusFilter('frozen')}
              style={{ minWidth: isMobile ? 110 : 'auto' }}
            >
              Frozen ({studentCounts.frozen})
            </Button>
          </div>
        </div>

        <div
          style={{
            ...typography.small,
            color: colors.textMuted,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.sm,
            flexWrap: 'wrap'
          }}
        >
          <span>
            Showing <strong style={{ color: colors.text }}>{filteredStudents.length}</strong> of{' '}
            <strong style={{ color: colors.text }}>{studentCounts.total}</strong> students
          </span>
          {searchQuery.trim() && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                border: 'none',
                background: 'transparent',
                color: colors.accent,
                cursor: 'pointer',
                padding: 0,
                ...typography.small,
                fontWeight: 600
              }}
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Student Grid */}
      <style>{`
        .student-card-uniform {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .student-card-uniform > div {
          flex: 1;
          display: flex;
          align-items: stretch !important;
        }
      `}</style>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile
            ? '1fr'
            : isTablet
            ? 'repeat(auto-fill, minmax(260px, 1fr))'
            : 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: isMobile ? spacing.md : spacing.lg
        }}
      >
        {filteredStudents.map(student => {
          const isFrozen = student.isFrozen;
          const displayName = stripRoleSuffix(student.username || '') || 'Student';

          return (
            <Card
              key={student._id}
              className="student-card-uniform"
              style={{
                transition: 'all 0.2s ease',
                border: `1px solid ${isFrozen ? colors.dangerLight : colors.border}`,
                background: isFrozen ? 'rgba(239, 68, 68, 0.04)' : colors.surface,
                boxShadow: isFrozen ? '0 8px 24px rgba(239,68,68,0.08)' : '0 8px 24px rgba(17,24,39,0.06)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: spacing.md,
                  width: '100%',
                  height: '100%'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: isMobile ? 'stretch' : 'flex-start',
                    justifyContent: 'space-between',
                    width: '100%',
                    gap: spacing.md,
                    flexDirection: isMobile ? 'column' : 'row'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.md,
                      minWidth: 0
                    }}
                  >
                    <div
                      style={{
                        background: isFrozen ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                        padding: isMobile ? spacing.sm : spacing.md,
                        borderRadius: '50%',
                        border: `2px solid ${isFrozen ? colors.dangerLight : colors.primaryLight}`
                      }}
                    >
                      <User
                        size={isMobile ? 20 : 24}
                        color={isFrozen ? colors.danger : colors.primary}
                      />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <h3
                        style={{
                          ...typography.h5,
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {student.firstName || student.lastName ? `${student.firstName || ''} ${student.lastName || ''}`.trim() : displayName}
                      </h3>

                      <p
                        style={{
                          ...typography.bodySmall,
                          color: colors.textMuted,
                          margin: '2px 0 0',
                          wordBreak: 'break-word'
                        }}
                      >
                        {student.username}
                      </p>

                      <div style={{ marginTop: spacing.xs, ...typography.xsmall, color: colors.textMuted }}>
                        <div style={{ marginBottom: 2 }}>
                          <span style={{ fontWeight: 600 }}>Location:</span> {[student.city, student.country].filter(Boolean).join(', ') || 'Not specified'}
                        </div>
                        <div>
                          <span style={{ fontWeight: 600 }}>Joined:</span> {student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      ...typography.xsmall,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: borderRadius.full,
                      background: isFrozen ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.14)',
                      color: isFrozen ? colors.danger : colors.primary,
                      border: `1px solid ${isFrozen ? colors.dangerLight : colors.primaryLight}`,
                      whiteSpace: 'nowrap',
                      alignSelf: isMobile ? 'flex-start' : 'auto'
                    }}
                  >
                    {isFrozen ? 'Frozen' : 'Active'}
                  </span>
                </div>

                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: shouldStackActions ? 'column' : 'row',
                    gap: spacing.sm,
                    marginTop: spacing.xs
                  }}
                >
                  <Button
                    size={isMobile ? 'md' : 'sm'}
                    variant={isFrozen ? 'success' : 'warning'}
                    onClick={() => openActionConfirm(student, isFrozen ? 'unfreeze' : 'freeze')}
                    disabled={isSubmitting}
                    fullWidth={shouldStackActions}
                    style={!shouldStackActions ? { flex: 1 } : undefined}
                  >
                    {isFrozen ? <Unlock size={14} /> : <Lock size={14} />}
                    {isFrozen ? 'Unfreeze' : 'Freeze'}
                  </Button>

                  <Button
                    size={isMobile ? 'md' : 'sm'}
                    variant="danger"
                    onClick={() => openActionConfirm(student, 'delete')}
                    disabled={isSubmitting}
                    fullWidth={shouldStackActions}
                    style={!shouldStackActions ? { flex: 1 } : undefined}
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {students?.length === 0 && (
        <Card
          isEmpty={true}
          emptyMessage="No students yet."
          style={{ marginTop: spacing.lg }}
        />
      )}

      {students?.length > 0 && filteredStudents.length === 0 && (
        <Card
          isEmpty={true}
          emptyMessage="No students found for the current search/filter."
          style={{ marginTop: spacing.lg }}
        />
      )}
      </>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={
          actionType === 'delete'
            ? 'Delete Student?'
            : actionType === 'freeze'
            ? 'Freeze Student Account?'
            : 'Unfreeze Student Account?'
        }
        message={
          actionType === 'delete'
            ? 'This action cannot be undone. All data will be lost.'
            : actionType === 'freeze'
            ? 'Student will no longer be able to login.'
            : 'Student will regain access to their account.'
        }
        confirmText={
          actionType === 'delete'
            ? 'Delete'
            : actionType === 'freeze'
            ? 'Freeze'
            : 'Unfreeze'
        }
        cancelText="Cancel"
        variant={
          actionType === 'delete'
            ? 'danger'
            : actionType === 'freeze'
            ? 'warning'
            : 'success'
        }
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        loading={isSubmitting}
      />
    </div>
  );
};

export default AdminStudentsTab;  
