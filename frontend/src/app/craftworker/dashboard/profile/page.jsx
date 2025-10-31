"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CraftworkerDashboardLayout from "@/components/craftworker/CraftworkerDashboardLayout";
import { getCraftworkerProfile, updateCraftworkerProfile } from "@/store/slices/craftworkerSlice";
import { Save, Loader2, X } from "lucide-react";

export default function CraftworkerProfile() {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.craftworker);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: {
      city: "",
      state: "",
    },
    skills: [],
    experience: "",
    certifications: [],
    bio: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");

  useEffect(() => {
    if (user?.role === "craftworker") {
      dispatch(getCraftworkerProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        phone: profile.phone || "",
        location: {
          city: profile.location?.city || "",
          state: profile.location?.state || "",
        },
        skills: profile.skills || [],
        experience: profile.experience || "",
        certifications: profile.certifications || [],
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "city" || name === "state") {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addCert = () => {
    if (certInput.trim() && !formData.certifications.includes(certInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, certInput.trim()],
      }));
      setCertInput("");
    }
  };

  const removeCert = (cert) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== cert),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dispatch(updateCraftworkerProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <CraftworkerDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </CraftworkerDashboardLayout>
    );
  }

  return (
    <CraftworkerDashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-card-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your craftworker profile information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              Phone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.location.city}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-foreground mb-2">
              State *
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.location.state}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-foreground mb-2">
            Experience *
          </label>
          <input
            type="text"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            disabled={!isEditing}
            required
            placeholder="e.g., 5 years in construction"
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            disabled={!isEditing}
            rows={4}
            placeholder="Tell us about yourself..."
            maxLength={500}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">{formData.bio.length}/500 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              placeholder="Add a skill"
              disabled={!isEditing}
              className="flex-1 px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={addSkill}
              disabled={!isEditing}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Certifications</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCert())}
              placeholder="Add a certification"
              disabled={!isEditing}
              className="flex-1 px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={addCert}
              disabled={!isEditing}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.certifications.map((cert, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-2"
              >
                {cert}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => removeCert(cert)}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                if (profile) {
                  setFormData({
                    fullName: profile.fullName || "",
                    phone: profile.phone || "",
                    location: {
                      city: profile.location?.city || "",
                      state: profile.location?.state || "",
                    },
                    skills: profile.skills || [],
                    experience: profile.experience || "",
                    certifications: profile.certifications || [],
                    bio: profile.bio || "",
                  });
                }
              }}
              disabled={isSaving}
              className="px-6 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </CraftworkerDashboardLayout>
  );
}

