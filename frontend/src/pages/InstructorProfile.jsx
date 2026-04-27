import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import {
  fetchMyInstructorProfile,
  updateMyInstructorProfile,
} from "../api/api";
import { Button, Card, Input, PageLayout } from "../components";
import { colors, spacing, typography } from "../theme";
import { handleApiError, showToast } from "../utils/toast";

const initialForm = {
  name: "",
  designation: "Professor",
  dept: "",
  institution: "",
  photo: "",
  bio: "",
  stats: {
    experience: "",
    publications: "",
    patents: "",
    startups: "",
  },
  contact: {
    website: "",
    linkedin: "",
    email: "",
  },
};

const InstructorProfile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const requiredMissing = useMemo(() => {
    const missing = [];

    if (!form.name.trim()) missing.push("Name");
    if (!form.designation.trim()) missing.push("Designation");
    if (!form.photo.trim()) missing.push("Photo");
    if ((form.bio || "").trim().length < 50)
      missing.push("Bio (min 50 characters)");
    if (!form.stats.experience.trim()) missing.push("Years Experience");
    if (!form.stats.publications.trim()) missing.push("Publications");
    if (!form.stats.patents.trim()) missing.push("Patents");
    if (!form.stats.startups.trim()) missing.push("Startups");

    return missing;
  }, [form]);

  const isComplete = requiredMissing.length === 0;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchMyInstructorProfile();
        setForm({
          ...initialForm,
          ...data,
          stats: {
            ...initialForm.stats,
            ...(data?.stats || {}),
          },
          contact: {
            ...initialForm.contact,
            ...(data?.contact || {}),
          },
        });
      } catch (error) {
        handleApiError(error, "Failed to load instructor profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast.error("Please select a valid image file");
      return;
    }

    const maxSizeBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      showToast.error("Image must be 2 MB or smaller");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, photo: String(reader.result || "") }));
    };
    reader.onerror = () => {
      showToast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: form.name,
        designation: form.designation,
        dept: form.dept,
        institution: form.institution,
        photo: form.photo,
        bio: form.bio,
        stats: form.stats,
        contact: form.contact,
      };

      await updateMyInstructorProfile(payload);
      showToast.success("Instructor profile published to Professor tab");
    } catch (error) {
      if (error.profile) {
        setForm((prev) => ({
          ...prev,
          ...error.profile,
          stats: {
            ...prev.stats,
            ...(error.profile?.stats || {}),
          },
          contact: {
            ...prev.contact,
            ...(error.profile?.contact || {}),
          },
        }));
      }
      handleApiError(error, "Please complete all required fields");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Instructor Profile">
        <p style={{ color: colors.textMuted }}>Loading profile...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Instructor Profile">
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "grid",
          gap: spacing.lg,
        }}
      >
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: spacing.md,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ ...typography.h3, margin: 0 }}>
                Instructor Profile
              </h2>
              <p
                style={{
                  ...typography.small,
                  margin: `${spacing.xs} 0 0 0`,
                  color: colors.textMuted,
                }}
              >
                Complete all required fields before your profile appears in the
                Professor tab.
              </p>
            </div>
            <Button variant="secondary" onClick={() => navigate("/teacher")}>
              <ArrowLeft size={16} /> Back
            </Button>
          </div>
        </Card>

        <Card>
          <div style={{ display: "grid", gap: spacing.md }}>
            <div
              style={{
                ...typography.label,
                color: isComplete ? colors.success : colors.danger,
              }}
            >
              {isComplete
                ? "Profile status: Complete (visible in Professor tab)"
                : `Profile status: Incomplete (${requiredMissing.length} required field(s) missing)`}
            </div>
            {!isComplete && (
              <div style={{ ...typography.small, color: colors.textMuted }}>
                Missing: {requiredMissing.join(", ")}
              </div>
            )}
          </div>
        </Card>

        <Card>
          <form
            onSubmit={handleSave}
            style={{ display: "grid", gap: spacing.md }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: spacing.md,
              }}
            >
              <Input
                label="Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Designation *"
                value={form.designation}
                onChange={(e) =>
                  setForm({ ...form, designation: e.target.value })
                }
                required
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: spacing.md,
              }}
            >
              <Input
                label="Department"
                value={form.dept}
                onChange={(e) => setForm({ ...form, dept: e.target.value })}
              />
              <Input
                label="Institution"
                value={form.institution}
                onChange={(e) =>
                  setForm({ ...form, institution: e.target.value })
                }
              />
            </div>

            <div style={{ display: "grid", gap: spacing.sm }}>
              <label style={typography.label}>Photo * (Upload Image)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{
                  width: "100%",
                  borderRadius: 10,
                  border: `1px solid ${colors.border}`,
                  padding: spacing.md,
                  color: colors.text,
                  background: colors.surface,
                }}
                required={!form.photo}
              />
              <span style={{ ...typography.xsmall, color: colors.textMuted }}>
                Recommended: square image, JPG/PNG, max 2 MB.
              </span>
              {form.photo && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: spacing.md,
                    marginTop: spacing.xs,
                  }}
                >
                  <img
                    src={form.photo}
                    alt="Instructor preview"
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: `1px solid ${colors.border}`,
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setForm((prev) => ({ ...prev, photo: "" }))}
                  >
                    Remove Photo
                  </Button>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gap: spacing.xs }}>
              <label style={typography.label}>
                Bio * (minimum 50 characters)
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={6}
                style={{
                  width: "100%",
                  borderRadius: 10,
                  border: `1px solid ${colors.border}`,
                  padding: spacing.md,
                  fontFamily: "inherit",
                  color: colors.text,
                  background: colors.surface,
                }}
                required
              />
              <span style={{ ...typography.xsmall, color: colors.textMuted }}>
                {form.bio.trim().length} characters. Use blank lines to create
                paragraphs.
              </span>
            </div>

            <div style={{ ...typography.label, marginTop: spacing.sm }}>
              Stats (required)
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: spacing.md,
              }}
            >
              <Input
                label="Years Experience *"
                value={form.stats.experience}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stats: { ...form.stats, experience: e.target.value },
                  })
                }
                required
              />
              <Input
                label="Publications *"
                value={form.stats.publications}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stats: { ...form.stats, publications: e.target.value },
                  })
                }
                required
              />
              <Input
                label="Patents *"
                value={form.stats.patents}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stats: { ...form.stats, patents: e.target.value },
                  })
                }
                required
              />
              <Input
                label="Startups *"
                value={form.stats.startups}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stats: { ...form.stats, startups: e.target.value },
                  })
                }
                required
              />
            </div>

            <div style={{ ...typography.label, marginTop: spacing.sm }}>
              Contact
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: spacing.md,
              }}
            >
              <Input
                label="Email"
                value={form.contact.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contact: { ...form.contact, email: e.target.value },
                  })
                }
              />
              <Input
                label="Website"
                value={form.contact.website}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contact: { ...form.contact, website: e.target.value },
                  })
                }
              />
              <Input
                label="LinkedIn"
                value={form.contact.linkedin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contact: { ...form.contact, linkedin: e.target.value },
                  })
                }
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: spacing.sm,
              }}
            >
              <Button type="submit" variant="primary" loading={saving}>
                <Save size={16} /> Save Instructor Profile
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
};

export default InstructorProfile;
