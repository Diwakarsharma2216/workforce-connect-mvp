"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Building2, MapPin, Phone, Briefcase, Hammer, Award, FileText } from "lucide-react";
import Link from "next/link";
import { getUserProfile } from "@/store/slices/authSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, profile, loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/select-role");
      return;
    }
    // Fetch latest profile data
    dispatch(getUserProfile());
  }, [dispatch, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Error loading profile: {error}</div>
      </div>
    );
  }

  // Render based on role
  const renderProfileContent = () => {
    if (user?.role === "company" && profile) {
      return (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Company Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Company Name</label>
                <p className="text-card-foreground font-medium">{profile.companyName}</p>
              </div>
              {profile.industry && (
                <div>
                  <label className="text-sm text-muted-foreground">Industry</label>
                  <p className="text-card-foreground font-medium">{profile.industry}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-muted-foreground">Location</label>
                <p className="text-card-foreground font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  {profile.location}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Contact Person</label>
                <p className="text-card-foreground font-medium">{profile.contactPerson}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <p className="text-card-foreground font-medium flex items-center gap-1">
                  <Phone className="w-4 h-4 text-primary" />
                  {profile.phone}
                </p>
              </div>
              {profile.description && (
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground">Description</label>
                  <p className="text-card-foreground mt-1">{profile.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (user?.role === "provider" && profile) {
      return (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Provider Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Company Name</label>
                <p className="text-card-foreground font-medium">{profile.companyName}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Location</label>
                <p className="text-card-foreground font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  {profile.location}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Contact Person</label>
                <p className="text-card-foreground font-medium">{profile.contactPerson}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <p className="text-card-foreground font-medium flex items-center gap-1">
                  <Phone className="w-4 h-4 text-primary" />
                  {profile.phone}
                </p>
              </div>
              {profile.description && (
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground">Description</label>
                  <p className="text-card-foreground mt-1">{profile.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (user?.role === "craftworker" && profile) {
      return (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Hammer className="w-5 h-5 text-primary" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <p className="text-card-foreground font-medium">{profile.fullName}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <p className="text-card-foreground font-medium flex items-center gap-1">
                  <Phone className="w-4 h-4 text-primary" />
                  {profile.phone}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">City</label>
                <p className="text-card-foreground font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  {profile.location?.city || profile.city}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">State</label>
                <p className="text-card-foreground font-medium">{profile.location?.state || profile.state}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground">Experience</label>
                <p className="text-card-foreground mt-1">{profile.experience}</p>
              </div>
              {profile.bio && (
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground">Bio</label>
                  <p className="text-card-foreground mt-1">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>

          {profile.skills && profile.skills.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.certifications && profile.certifications.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition inline-block"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        {/* Profile Header */}
        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">
                {profile?.companyName || profile?.fullName || "Profile"}
              </h1>
              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <p className="text-card-foreground font-medium">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Role</label>
              <p className="text-card-foreground font-medium capitalize">{user?.role}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Account Status</label>
              <p className="text-card-foreground font-medium">
                <span className={`px-2 py-1 rounded-full text-xs ${user?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user?.isActive ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
            {user?.lastLogin && (
              <div>
                <label className="text-sm text-muted-foreground">Last Login</label>
                <p className="text-card-foreground font-medium">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Role-specific Profile Details */}
        {renderProfileContent()}
      </div>
    </div>
  );
}

