"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProviderDashboardLayout from "@/components/provider/ProviderDashboardLayout";
import { getProviderProfile, updateProviderProfile } from "@/store/slices/providerSlice";
import { Save, Loader2 } from "lucide-react";

export default function ProviderProfile() {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.provider);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    companyName: "",
    location: "",
    contactPerson: "",
    phone: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.role === "provider") {
      dispatch(getProviderProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (profile) {
      setFormData({
        companyName: profile.companyName || "",
        location: profile.location || "",
        contactPerson: profile.contactPerson || "",
        phone: profile.phone || "",
        description: profile.description || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dispatch(updateProviderProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <ProviderDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ProviderDashboardLayout>
    );
  }

  return (
    <ProviderDashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-card-foreground mb-2">Agency Profile</h1>
          <p className="text-muted-foreground">Manage your agency profile information</p>
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
            <label htmlFor="companyName" className="block text-sm font-medium text-foreground mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="contactPerson" className="block text-sm font-medium text-foreground mb-2">
              Contact Person *
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
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
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={!isEditing}
            rows={6}
            maxLength={500}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">{formData.description.length}/500 characters</p>
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
                    companyName: profile.companyName || "",
                    location: profile.location || "",
                    contactPerson: profile.contactPerson || "",
                    phone: profile.phone || "",
                    description: profile.description || "",
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
    </ProviderDashboardLayout>
  );
}

