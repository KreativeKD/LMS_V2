import React, { useEffect, useState } from 'react';
import { spacing, colors, typography } from '../theme';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import {
  updateSettings,
  fetchAdminAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
  , fetchSettings, uploadBannerImage, deleteBannerImage
} from '../api/api';
import { handleSuccess, handleApiError } from '../utils/toast';

export const AdminSettingsTab = ({ loading }) => {
  const [semesterDate, setSemesterDate] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: '',
    tickerText: '',
    isTicker: true,
    isActive: true
  });

  const loadAnnouncements = async () => {
    setAnnouncementLoading(true);
    try {
      const data = await fetchAdminAnnouncements();
      setAnnouncements(data || []);
    } catch (err) {
      handleApiError(err);
    } finally {
      setAnnouncementLoading(false);
    }
  };

  const [bannerImages, setBannerImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      setBannerImages(data.bannerImages || []);
    } catch (err) {
      // ignore here; settings may be empty
    }
  };

  useEffect(() => {
    loadAnnouncements();
    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await updateSettings({ semesterCompletionDate: semesterDate });
      handleSuccess('Settings updated successfully');
    } catch (err) {
      handleApiError(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleReset = () => {
    setSemesterDate('');
  };

  const resetAnnouncementForm = () => {
    setEditingAnnouncementId(null);
    setAnnouncementForm({
      title: '',
      message: '',
      tickerText: '',
      isTicker: true,
      isActive: true
    });
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    setAnnouncementLoading(true);
    try {
      const payload = {
        title: announcementForm.title.trim(),
        message: announcementForm.message.trim(),
        tickerText: announcementForm.tickerText.trim(),
        isTicker: announcementForm.isTicker,
        isActive: announcementForm.isActive
      };

      if (!payload.title || !payload.message) {
        throw new Error('Title and message are required');
      }

      if (editingAnnouncementId) {
        await updateAnnouncement(editingAnnouncementId, payload);
        handleSuccess('Announcement updated');
      } else {
        await createAnnouncement(payload);
        handleSuccess('Announcement created');
      }

      resetAnnouncementForm();
      await loadAnnouncements();
    } catch (err) {
      handleApiError(err);
    } finally {
      setAnnouncementLoading(false);
    }
  };

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncementId(announcement._id);
    setAnnouncementForm({
      title: announcement.title || '',
      message: announcement.message || '',
      tickerText: announcement.tickerText || '',
      isTicker: !!announcement.isTicker,
      isActive: announcement.isActive !== false
    });
  };

  const handleDeleteAnnouncement = async (id) => {
    const ok = window.confirm('Delete this announcement?');
    if (!ok) return;

    setAnnouncementLoading(true);
    try {
      await deleteAnnouncement(id);
      handleSuccess('Announcement deleted');
      if (editingAnnouncementId === id) resetAnnouncementForm();
      await loadAnnouncements();
    } catch (err) {
      handleApiError(err);
    } finally {
      setAnnouncementLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadBannerImage(file);
      handleSuccess('Banner uploaded');
      await loadSettings();
    } catch (err) {
      handleApiError(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBanner = async (imgPath) => {
    const ok = window.confirm('Delete this banner image?');
    if (!ok) return;
    try {
      await deleteBannerImage(imgPath);
      handleSuccess('Banner deleted');
      await loadSettings();
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div>
      <h2 style={{ ...typography.h3, marginBottom: spacing.lg }}>System Settings</h2>
      {loading && (
        <p style={{ ...typography.small, color: colors.textMuted, marginBottom: spacing.md }}>
          Loading dashboard data...
        </p>
      )}

      <Card style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          <div>
            <label style={{ ...typography.label, display: 'block', marginBottom: spacing.sm }}>
              Semester Completion Date
            </label>
            <p style={{ ...typography.small, color: colors.textMuted, marginBottom: spacing.md }}>
              After this date, student logins will be automatically frozen.
            </p>
            <Input
              type="date"
              value={semesterDate}
              onChange={(e) => setSemesterDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: spacing.md }}>
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="primary" type="submit" loading={formLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      <div style={{ height: spacing.xl }} />

      <Card style={{ maxWidth: '950px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, width: '100%' }}>
          <div>
            <h3 style={{ ...typography.h4, marginBottom: spacing.xs }}>Announcements & Ticker</h3>
            <p style={{ ...typography.small, color: colors.textMuted }}>
              New courses generate announcements automatically. You can add manual announcements and control ticker visibility here.
            </p>
          </div>

          <form onSubmit={handleAnnouncementSubmit} style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <Input
              label="Announcement Title"
              value={announcementForm.title}
              onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., New DSP batch now open"
              fullWidth
            />

            <div>
              <label style={{ ...typography.label, display: 'block', marginBottom: spacing.sm }}>
                Announcement Message
              </label>
              <textarea
                value={announcementForm.message}
                onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Write the detailed announcement..."
                rows={4}
                style={{
                  width: '100%',
                  border: `2px solid ${colors.border}`,
                  borderRadius: 12,
                  padding: spacing.md,
                  background: '#fff',
                  color: colors.text,
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <Input
              label="Ticker Text"
              value={announcementForm.tickerText}
              onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, tickerText: e.target.value }))}
              placeholder="Short text for moving ticker (optional)"
              fullWidth
            />

            <div style={{ display: 'flex', gap: spacing.lg, flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <input
                  type="checkbox"
                  checked={announcementForm.isTicker}
                  onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, isTicker: e.target.checked }))}
                />
                <span style={typography.small}>Show in ticker</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <input
                  type="checkbox"
                  checked={announcementForm.isActive}
                  onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                />
                <span style={typography.small}>Active</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
              <Button variant="primary" type="submit" loading={announcementLoading}>
                {editingAnnouncementId ? 'Update Announcement' : 'Add Announcement'}
              </Button>
              <Button variant="secondary" onClick={resetAnnouncementForm}>
                Clear
              </Button>
            </div>
          </form>

          <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: spacing.md }}>
            <h4 style={{ ...typography.h5, marginBottom: spacing.md }}>Current Announcements</h4>

            {announcementLoading && announcements.length === 0 ? (
              <p style={{ ...typography.small, color: colors.textMuted }}>Loading announcements...</p>
            ) : null}

            {!announcementLoading && announcements.length === 0 ? (
              <p style={{ ...typography.small, color: colors.textMuted }}>No announcements yet.</p>
            ) : null}

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {announcements.map((item) => (
                <div
                  key={item._id}
                  style={{
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    padding: spacing.md,
                    background: '#fff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md }}>
                    <div>
                      <p style={{ ...typography.label, fontWeight: 700 }}>{item.title}</p>
                      <p style={{ ...typography.small, color: colors.textSecondary, marginTop: spacing.xs }}>{item.message}</p>
                      <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', marginTop: spacing.sm }}>
                        <span style={{ ...typography.xsmall, padding: '4px 8px', borderRadius: 999, background: 'rgba(79,70,229,0.08)', color: '#3730a3' }}>
                          {item.type === 'course' ? 'Auto (Course)' : 'Manual'}
                        </span>
                        <span style={{ ...typography.xsmall, padding: '4px 8px', borderRadius: 999, background: item.isTicker ? 'rgba(16,185,129,0.12)' : 'rgba(148,163,184,0.18)', color: item.isTicker ? '#047857' : '#475569' }}>
                          {item.isTicker ? 'Ticker On' : 'Ticker Off'}
                        </span>
                        <span style={{ ...typography.xsmall, padding: '4px 8px', borderRadius: 999, background: item.isActive ? 'rgba(59,130,246,0.12)' : 'rgba(239,68,68,0.12)', color: item.isActive ? '#1d4ed8' : '#b91c1c' }}>
                          {item.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: spacing.sm }}>
                      <Button variant="secondary" size="sm" onClick={() => handleEditAnnouncement(item)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteAnnouncement(item._id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          
          <div style={{ marginTop: spacing.lg }}>
            <h3 style={{ ...typography.h4, marginBottom: spacing.xs }}>Banner Images</h3>
            <p style={{ ...typography.small, color: colors.textMuted }}>Upload images to show in the site banner (admin only). Images are stored on the server.</p>
            <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center', marginTop: spacing.sm }}>
              <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
              {uploading ? <span style={{ ...typography.small }}>Uploading...</span> : null}
            </div>

            <div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' }}>
              {bannerImages.map((img) => (
                <div key={img} style={{ position: 'relative' }}>
                  <img src={img} alt="banner" style={{ width: 200, height: 90, objectFit: 'cover', borderRadius: 8, border: `1px solid ${colors.border}` }} />
                  <div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.xs }}>
                    <button type="button" className="btn-secondary" onClick={() => handleDeleteBanner(img)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettingsTab;
