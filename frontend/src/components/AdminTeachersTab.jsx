import React, { useState } from 'react';
import { Plus, Trash2, User } from 'lucide-react';
import { spacing, colors, typography } from '../theme';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import { AdminDataState } from './AdminDataState';
import { ConfirmDialog } from './ConfirmDialog';
import { addTeacher, deleteTeacher } from '../api/api';
import { handleSuccess, handleApiError } from '../utils/toast';

const getTeacherCourses = (teacher, courses = []) => {
  const teacherId = String(teacher?._id || '');
  if (!teacherId) return [];

  return (courses || []).filter((course) => {
    const instructorId = String(course?.instructor?._id || course?.instructor || '');
    const assignedTeacherIds = (course?.assignedTeachers || []).map((item) => String(item?._id || item || ''));
    return instructorId === teacherId || assignedTeacherIds.includes(teacherId);
  });
};

const formatTeacherDisplayName = (username = '') => {
  const rawName = username.split('@')[0] || '';
  return rawName
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

export const AdminTeachersTab = ({ teachers, courses, onTeachersUpdate, loading, error, onRetry }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherForm, setTeacherForm] = useState({ name: '', password: '' });
  const [formLoading, setFormLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await addTeacher(teacherForm.name, teacherForm.password);
      handleSuccess('Instructor added successfully!');
      setTeacherForm({ name: '', password: '' });
      setShowModal(false);
      onTeachersUpdate();
    } catch (err) {
      handleApiError(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTeacher(deleteTarget._id);
      handleSuccess('Instructor deleted successfully');
      setShowDeleteDialog(false);
      onTeachersUpdate();
    } catch (err) {
      handleApiError(err);
    }
  };

  const openTeacherDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDetailsModal(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
        <h2 style={typography.h3}>Manage Instructors</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Instructor
        </Button>
      </div>

      {loading && (
        <AdminDataState type="loading" message="Loading instructor accounts..." />
      )}

      {!loading && error && (
        <AdminDataState type="error" message={error} onAction={onRetry} actionLabel="Reload Instructors" />
      )}

      {!loading && !error && teachers.length === 0 && (
        <AdminDataState type="empty" message="No instructors yet. Add one to get started." />
      )}

      {!loading && !error && teachers.length > 0 && (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: spacing.lg }}>
        {teachers.map(teacher => (
          <Card key={teacher._id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(79,70,229,0.08))',
                    padding: spacing.md,
                    borderRadius: '50%',
                    border: `1px solid ${colors.border}`,
                    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)'
                  }}
                >
                  <User size={24} color={colors.primary} />
                </div>
                <button
                  type="button"
                  onClick={() => openTeacherDetails(teacher)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    textAlign: 'left',
                    cursor: 'pointer',
                    minWidth: 0,
                    flex: 1
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '1.22rem',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                      color: colors.text,
                      fontFamily: '"Aptos Display", "Segoe UI", sans-serif'
                    }}
                  >
                    {formatTeacherDisplayName(teacher.username) || 'Unknown Instructor'}
                  </h3>
                  <p
                    style={{
                      margin: `${spacing.xs} 0 0 0`,
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: colors.primary,
                      letterSpacing: '0.01em',
                      textTransform: 'uppercase',
                      fontFamily: '"Aptos", "Segoe UI", sans-serif'
                    }}
                  >
                    Instructor Account
                  </p>
                  <p
                    style={{
                      margin: `${spacing.xs} 0 0 0`,
                      ...typography.small,
                      color: colors.textMuted,
                      fontSize: '0.92rem',
                      fontWeight: 500,
                      fontFamily: '"Aptos", "Segoe UI", sans-serif'
                    }}
                  >
                    {teacher.username}
                  </p>
                </button>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setDeleteTarget(teacher);
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
      )}

      {/* Add Instructor Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <Card style={{ maxWidth: '500px', width: '90%' }}>
            <h2 style={typography.h3}>Add Instructor</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, marginTop: spacing.lg }}>
              <Input
                label="Instructor Name"
                placeholder="e.g., John Doe"
                value={teacherForm.name}
                onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Set a secure password"
                value={teacherForm.password}
                onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                required
              />
              <p style={{ ...typography.small, color: colors.primary, margin: spacing.sm }}>
                Login credentials: <strong>{teacherForm.name || 'name'}@instructor</strong>
              </p>
              <div style={{ display: 'flex', gap: spacing.md }}>
                <Button variant="secondary" onClick={() => { setShowModal(false); setTeacherForm({ name: '', password: '' }); }} fullWidth>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" loading={formLoading} fullWidth>
                  Add Instructor
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showDetailsModal && selectedTeacher && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <Card style={{ maxWidth: '520px', width: '92%', maxHeight: '84vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md }}>
                <div>
                  <h2 style={{ ...typography.h3, margin: 0 }}>{selectedTeacher.username?.split('@')[0] || 'Instructor'}</h2>
                  <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: `${spacing.xs} 0 0 0` }}>
                    {selectedTeacher.username}
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: spacing.md }}>
                <div style={{ padding: spacing.md, borderRadius: 12, border: `1px solid ${colors.border}`, background: colors.surfaceAlt }}>
                  <p style={{ ...typography.small, color: colors.textMuted, margin: 0 }}>Role</p>
                  <p style={{ ...typography.label, margin: `${spacing.xs} 0 0 0` }}>Instructor</p>
                </div>
                <div style={{ padding: spacing.md, borderRadius: 12, border: `1px solid ${colors.border}`, background: colors.surfaceAlt }}>
                  <p style={{ ...typography.small, color: colors.textMuted, margin: 0 }}>Courses Assigned</p>
                  <p style={{ ...typography.label, margin: `${spacing.xs} 0 0 0` }}>{getTeacherCourses(selectedTeacher, courses).length}</p>
                </div>
              </div>

              <div>
                <h3 style={{ ...typography.h4, margin: 0 }}>Course Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginTop: spacing.md }}>
                  {getTeacherCourses(selectedTeacher, courses).length === 0 ? (
                    <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>
                      No courses are currently assigned to this instructor.
                    </p>
                  ) : (
                    getTeacherCourses(selectedTeacher, courses).map((course) => (
                      <div
                        key={course._id}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          border: `1px solid ${colors.border}`,
                          borderRadius: 12,
                          padding: spacing.md,
                          background: colors.surface
                        }}
                      >
                        <p style={{ ...typography.label, margin: 0 }}>{course.title}</p>
                        <p style={{ ...typography.small, color: colors.textMuted, margin: `${spacing.xs} 0 0 0` }}>
                          Type: {course.courseType || 'academic'}
                        </p>
                        <p style={{ ...typography.small, color: colors.textMuted, margin: `${spacing.xs} 0 0 0` }}>
                          Hours: {Number.isFinite(course.contentHours) ? course.contentHours : 0}
                        </p>
                        <p style={{ ...typography.small, color: colors.textMuted, margin: `${spacing.xs} 0 0 0` }}>
                          Chapters: {course.chapters?.length || course.chapterCount || 0}
                        </p>
                        <p style={{ ...typography.small, color: colors.textMuted, margin: `${spacing.xs} 0 0 0` }}>
                          Enrollments: {Number.isFinite(course.studentsCount) ? course.studentsCount : (course.students?.length || 0)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Instructor?"
        message="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};

export default AdminTeachersTab;
