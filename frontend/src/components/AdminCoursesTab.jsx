import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, User, Layout, Users, MoreVertical, BookOpen, UserMinus } from 'lucide-react';
import { spacing, colors, typography } from '../theme';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import { AdminDataState } from './AdminDataState';
import { ConfirmDialog } from './ConfirmDialog';
import { createCourse, updateCourse, deleteCourse, fetchEnrolledStudents, assignTeacher, unassignTeacher, reorderCourses } from '../api/api';
import { handleSuccess, handleApiError } from '../utils/toast';

const getDisplayName = (person) => {
  if (!person) return null;
  const fullName = [person.firstName, person.lastName].filter(Boolean).join(' ').trim();
  if (fullName) return fullName;
  if (person.username) return person.username.split('@')[0];
  return null;
};

const isAdminIdentity = (person) => {
  if (!person) return false;
  if (person.role === 'admin') return true;
  if (person.username && person.username.toLowerCase().includes('@admin')) return true;
  return false;
};

const getTeacherNames = (course) => {
  const people = [course.instructor, ...(course.assignedTeachers || [])].filter(Boolean);
  const hasNonAdminTeacher = people.some((person) => !isAdminIdentity(person));
  const filtered = hasNonAdminTeacher ? people.filter((person) => !isAdminIdentity(person)) : people;

  const seen = new Set();
  const uniqueNames = [];
  filtered.forEach((person) => {
    const idKey = person._id ? String(person._id) : null;
    const name = getDisplayName(person);
    const nameKey = name ? name.toLowerCase() : null;
    const key = idKey || nameKey;
    if (!name || !key || seen.has(key)) return;
    seen.add(key);
    uniqueNames.push(name);
  });

  return uniqueNames.join(', ') || 'Unassigned';
};

const reorderCourseList = (coursesList, draggedId, targetId) => {
  const fromIndex = coursesList.findIndex((course) => String(course._id) === String(draggedId));
  const toIndex = coursesList.findIndex((course) => String(course._id) === String(targetId));

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return coursesList;

  const updated = [...coursesList];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);
  return updated;
};

export const AdminCoursesTab = ({ courses, teachers, onCoursesUpdate, loading, error, onRetry }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [courseForm, setCourseForm] = useState({ title: '', description: '', courseType: 'academic', descriptionPdf: '', contentHours: '', image: '' });
  const [editingCourse, setEditingCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [teacherActionLoadingId, setTeacherActionLoadingId] = useState(null);
  const [orderedCourses, setOrderedCourses] = useState(courses || []);
  const [draggedCourseId, setDraggedCourseId] = useState(null);
  const [dragOverCourseId, setDragOverCourseId] = useState(null);
  const [reorderLoading, setReorderLoading] = useState(false);

  useEffect(() => {
    setOrderedCourses(courses || []);
  }, [courses]);

  const handleEdit = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description || '',
      courseType: course.courseType || 'academic',
      descriptionPdf: course.descriptionPdf || '',
      contentHours: Number.isFinite(course.contentHours) ? String(course.contentHours) : '',
      image: course.image || ''
    });
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCourseForm({ ...courseForm, image: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionPdfChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      handleApiError({ message: 'Please upload a valid PDF file for course description.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCourseForm((prev) => ({ ...prev, descriptionPdf: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse._id, {
          ...courseForm,
          contentHours: Number(courseForm.contentHours)
        });
        handleSuccess('Course updated successfully!');
      } else {
        await createCourse({
          ...courseForm,
          contentHours: Number(courseForm.contentHours)
        });
        handleSuccess('Course created successfully!');
      }
      setCourseForm({ title: '', description: '', courseType: 'academic', descriptionPdf: '', contentHours: '', image: '' });
      setEditingCourse(null);
      setShowModal(false);
      onCoursesUpdate();
    } catch (err) {
      handleApiError(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewStudents = async (courseId) => {
    try {
      const students = await fetchEnrolledStudents(courseId);
      setEnrolledStudents(students);
      setShowStudentsModal(true);
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleAssignTeacher = async (e) => {
    e.preventDefault();
    try {
      await assignTeacher(editingCourse._id, selectedTeacherId);
      handleSuccess('Instructor assigned successfully');
      setSelectedTeacherId('');
      await onCoursesUpdate();
      setEditingCourse((prev) => {
        if (!prev) return prev;
        const assignedTeacher = teachers.find((teacher) => String(teacher._id) === String(selectedTeacherId));
        if (!assignedTeacher) return prev;
        const alreadyAssigned = (prev.assignedTeachers || []).some((teacher) => String(teacher._id) === String(selectedTeacherId));
        if (alreadyAssigned) return prev;
        return {
          ...prev,
          assignedTeachers: [...(prev.assignedTeachers || []), assignedTeacher]
        };
      });
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleUnassignTeacher = async (teacherId) => {
    if (!editingCourse?._id || !teacherId) return;
    setTeacherActionLoadingId(teacherId);
    try {
      await unassignTeacher(editingCourse._id, teacherId);
      handleSuccess('Instructor unassigned successfully');
      await onCoursesUpdate();
      setEditingCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          assignedTeachers: (prev.assignedTeachers || []).filter((teacher) => String(teacher._id) !== String(teacherId))
        };
      });
    } catch (err) {
      handleApiError(err);
    } finally {
      setTeacherActionLoadingId(null);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCourse(deleteTarget._id);
      handleSuccess('Course deleted successfully');
      setShowDeleteDialog(false);
      onCoursesUpdate();
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleCardDrop = async (targetCourseId) => {
    if (!draggedCourseId || !targetCourseId || String(draggedCourseId) === String(targetCourseId)) {
      setDraggedCourseId(null);
      setDragOverCourseId(null);
      return;
    }

    const previousOrder = [...orderedCourses];
    const nextOrder = reorderCourseList(previousOrder, draggedCourseId, targetCourseId);
    if (nextOrder === previousOrder) {
      setDraggedCourseId(null);
      setDragOverCourseId(null);
      return;
    }

    setOrderedCourses(nextOrder);
    setReorderLoading(true);

    try {
      await reorderCourses(nextOrder.map((course) => course._id));
      handleSuccess('Course order updated');
    } catch (err) {
      setOrderedCourses(previousOrder);
      handleApiError(err);
    } finally {
      setDraggedCourseId(null);
      setDragOverCourseId(null);
      setReorderLoading(false);
    }
  };

  const dropdownStyle = {
    position: 'absolute',
    right: 0,
    top: '100%',
    marginTop: spacing.sm,
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
    minWidth: '180px',
    zIndex: 1000,
    overflow: 'hidden',
  };

  const dropdownItemStyle = {
    width: '100%',
    textAlign: 'left',
    padding: spacing.md,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    color: colors.text,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
        <h2 style={typography.h3}>Manage Courses</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Course
        </Button>
      </div>

      {loading && (
        <AdminDataState type="loading" message="Loading courses and instructor assignments..." />
      )}

      {!loading && error && (
        <AdminDataState type="error" message={error} onAction={onRetry} actionLabel="Reload Courses" />
      )}

      {!loading && !error && courses.length === 0 && (
        <AdminDataState type="empty" message="No courses found. Create one to get started." />
      )}

      {!loading && !error && courses.length > 0 && (
      <>
      <p style={{ ...typography.small, margin: '0 0 ' + spacing.sm + ' 0', color: colors.textMuted }}>
        Drag and drop a course card to move it left or right.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: spacing.md }}>
        {orderedCourses.map(course => (
          <div 
            key={course._id} 
            draggable={!reorderLoading}
            onDragStart={() => {
              setDraggedCourseId(course._id);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (dragOverCourseId !== course._id) {
                setDragOverCourseId(course._id);
              }
            }}
            onDragLeave={() => {
              if (dragOverCourseId === course._id) {
                setDragOverCourseId(null);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              handleCardDrop(course._id);
            }}
            onDragEnd={() => {
              setDraggedCourseId(null);
              setDragOverCourseId(null);
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: colors.surface,
              borderRadius: '12px',
              border: `1px solid ${dragOverCourseId === course._id ? colors.primary : colors.border}`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease',
              height: '100%',
              position: 'relative',
              cursor: reorderLoading ? 'wait' : 'grab',
              opacity: draggedCourseId === course._id ? 0.65 : 1
            }}
          >
            {/* Image Section */}
            <div style={{
              height: '124px',
              background: course.image ? 'transparent' : colors.gradient,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px 12px 0 0'
            }}>
              {course.image ? (
                <img 
                  src={course.image} 
                  alt={course.title}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }} 
                />
              ) : (
                <BookOpen size={32} color="rgba(255, 255, 255, 0.8)" />
              )}
            </div>

            {/* Content Section */}
            <div style={{ padding: spacing.md, flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Course Title */}
              <h3 style={{ 
                margin: '0 0 ' + spacing.sm + ' 0',
                fontSize: '0.94rem',
                fontWeight: 600,
                color: colors.text,
                lineHeight: '1.3'
              }}>
                {course.title}
              </h3>

              {/* Teachers Info */}
              <p style={{ 
                ...typography.small,
                margin: '0 0 ' + spacing.md + ' 0',
                color: colors.textMuted 
              }}>
                <strong>Instructor:</strong> {getTeacherNames(course)}
              </p>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center' }}>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => navigate(`/course/read/${course._id}`)}
                  style={{ flex: 1 }}
                >
                  <Eye size={14} />
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleEdit(course)}
                  style={{ flex: 1 }}
                >
                  <Edit size={14} />
                </Button>

                <div style={{ position: 'relative' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === course._id ? null : course._id);
                    }}
                  >
                    <MoreVertical size={16} />
                  </Button>

                  {openDropdown === course._id && (
                    <div style={dropdownStyle} onClick={(e) => e.stopPropagation()}>
                      <button
                        style={dropdownItemStyle}
                        onClick={() => {
                          setEditingCourse(course);
                          setShowAssignModal(true);
                          setOpenDropdown(null);
                        }}
                      >
                        <User size={14} /> Assign Instructor
                      </button>
                      <button
                        style={dropdownItemStyle}
                        onClick={() => {
                          navigate(`/course/edit/${course._id}`);
                          setOpenDropdown(null);
                        }}
                      >
                        <Layout size={14} /> Edit Curriculum
                      </button>
                      <button
                        style={dropdownItemStyle}
                        onClick={() => {
                          handleViewStudents(course._id);
                          setOpenDropdown(null);
                        }}
                      >
                        <Users size={14} /> View Students
                      </button>
                      <div style={{ height: '1px', background: colors.border, margin: '4px 0' }} />
                      <button
                        style={{ ...dropdownItemStyle, color: colors.danger }}
                        onClick={() => {
                          setDeleteTarget(course);
                          setShowDeleteDialog(true);
                          setOpenDropdown(null);
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            zIndex: 1000,
            overflowY: 'auto',
            padding: `${spacing.xl} 0`
          }}
        >
          <Card style={{ maxWidth: '500px', width: '90%', maxHeight: '92vh', overflowY: 'auto' }}>
            <h2 style={typography.h3}>{editingCourse ? 'Edit Course' : 'Create Course'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, marginTop: spacing.lg }}>
              <Input
                label="Course Title"
                placeholder="e.g., Introduction to React"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                required
              />
              <Input
                label="Description (Optional Text)"
                placeholder="Short summary (optional)"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              />
              <div>
                <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: 600, fontSize: '0.9rem', color: colors.text }}>
                  Course Type
                </label>
                <select
                  value={courseForm.courseType}
                  onChange={(e) => setCourseForm({ ...courseForm, courseType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    borderRadius: '8px',
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="academic">Academic</option>
                  <option value="professional">Professional</option>
                  <option value="short-term">Short Term</option>
                </select>
              </div>
              <Input
                label="No. of Course Hours"
                type="number"
                min="0"
                step="0.5"
                placeholder="e.g., 24"
                value={courseForm.contentHours}
                onChange={(e) => setCourseForm({ ...courseForm, contentHours: e.target.value })}
                required
              />
              <div>
                <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: 600, fontSize: '0.9rem', color: colors.text }}>
                  Description PDF
                </label>
                {courseForm.descriptionPdf && (
                  <div style={{ marginBottom: spacing.sm, ...typography.small, color: colors.textMuted }}>
                    PDF uploaded. It will be shown to students as course description.
                  </div>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleDescriptionPdfChange}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    border: `2px dashed ${colors.border}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                  required={!editingCourse}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: spacing.sm, fontWeight: 600, fontSize: '0.9rem', color: colors.text }}>Course Image</label>
                <div style={{ position: 'relative', marginBottom: spacing.md }}>
                  {courseForm.image && (
                    <div style={{ marginBottom: spacing.md, borderRadius: '8px', overflow: 'hidden', maxHeight: '200px' }}>
                      <img src={courseForm.image} alt="Course preview" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      border: `2px dashed ${colors.border}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: spacing.md }}>
                <Button variant="secondary" onClick={() => { setShowModal(false); setEditingCourse(null); setCourseForm({ title: '', description: '', courseType: 'academic', descriptionPdf: '', contentHours: '', image: '' }); }} fullWidth>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" loading={formLoading} fullWidth>
                  {editingCourse ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Course?"
        message="This action cannot be undone. All associated data will be lost."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

      {/* Students Modal */}
      {showStudentsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <Card style={{ maxWidth: '560px', width: '92%', maxHeight: '78vh' }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: spacing.lg }}>
                <h2 style={{ ...typography.h3, margin: 0 }}>Enrolled Students</h2>
                <span style={{ ...typography.small, color: colors.textMuted }}>
                  {enrolledStudents.length} total
                </span>
              </div>

              {enrolledStudents.length > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.md,
                    overflowY: 'auto',
                    paddingRight: '6px',
                    maxHeight: '52vh'
                  }}
                >
                  {enrolledStudents.map(student => (
                    <div
                      key={student._id}
                      style={{
                        padding: '12px 14px',
                        background: colors.surfaceAlt,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(16, 185, 129, 0.12)',
                          flexShrink: 0
                        }}
                      >
                        <Users size={18} color={colors.primary} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.25, fontWeight: 600, color: colors.text }}>
                          {student.username.split('@')[0]}
                        </p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', lineHeight: 1.25, color: colors.textMuted }}>
                          {student.username}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: spacing.xl, color: colors.textMuted }}>
                  <Users size={48} style={{ marginBottom: spacing.md, opacity: 0.5 }} />
                  <p>No students enrolled yet.</p>
                </div>
              )}

              <Button variant="secondary" onClick={() => setShowStudentsModal(false)} style={{ marginTop: spacing.lg }} fullWidth>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Assign Instructor Modal */}
      {showAssignModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <Card style={{ maxWidth: '400px', width: '90%' }}>
            <h2 style={typography.h3}>Assign Instructor</h2>
            <form onSubmit={handleAssignTeacher} style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, marginTop: spacing.lg }}>
              <div>
                <label style={{ ...typography.label, display: 'block', marginBottom: spacing.sm }}>Select Instructor</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    borderRadius: '8px',
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    fontFamily: 'inherit',
                  }}
                  required
                >
                  <option value="">-- Select an Instructor --</option>
                  {teachers.map(t => (
                    <option key={t._id} value={t._id}>{t.username}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ ...typography.label, display: 'block', marginBottom: spacing.sm }}>Assigned Instructors</label>
                {(editingCourse?.assignedTeachers || []).length === 0 ? (
                  <p style={{ ...typography.small, color: colors.textMuted, margin: 0 }}>No instructors assigned yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {(editingCourse?.assignedTeachers || []).map((teacher) => (
                      <div
                        key={teacher._id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: spacing.md,
                          padding: spacing.sm,
                          borderRadius: '8px',
                          background: colors.surface,
                          border: `1px solid ${colors.border}`
                        }}
                      >
                        <span style={{ ...typography.small, color: colors.text }}>
                          {getDisplayName(teacher) || teacher.username || 'Instructor'}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnassignTeacher(teacher._id)}
                          loading={teacherActionLoadingId === teacher._id}
                          style={{ color: colors.danger }}
                        >
                          <UserMinus size={14} /> Unassign
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: spacing.md }}>
                <Button variant="secondary" onClick={() => setShowAssignModal(false)} fullWidth>Cancel</Button>
                <Button variant="primary" type="submit" fullWidth>Assign</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminCoursesTab;
