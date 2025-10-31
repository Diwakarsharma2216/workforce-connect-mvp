"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProviderDashboardLayout from "@/components/provider/ProviderDashboardLayout";
import { listProviderJobs } from "@/store/slices/providerJobSlice";
import { createProviderApplication, listProviderApplications } from "@/store/slices/providerApplicationSlice";
import { getRoster } from "@/store/slices/providerSlice";
import {
  Loader2,
  Briefcase,
  Calendar,
  MapPin,
  Users,
  Search,
  X,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

export default function ProviderJobs() {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.providerJob);
  const { roster } = useSelector((state) => state.provider);
  const { applications } = useSelector((state) => state.providerApplication);
  const [locationFilter, setLocationFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [selectedCraftsman, setSelectedCraftsman] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    dispatch(listProviderJobs({ status: "open" }));
    dispatch(getRoster());
    dispatch(listProviderApplications());
  }, [dispatch]);

  const activeRoster = roster.filter((item) => item.status === "active");

  const handleSearch = () => {
    const filters = {
      status: "open",
    };
    if (locationFilter.trim()) {
      filters.location = locationFilter.trim();
    }
    if (skillFilter.trim()) {
      filters.skills = [skillFilter.trim()];
    }
    dispatch(listProviderJobs(filters));
  };

  const handleApplyClick = (jobId) => {
    if (activeRoster.length === 0) {
      alert("You need to add craftworkers to your roster before applying for jobs.");
      return;
    }
    setSelectedJobId(jobId);
    setShowApplyModal(true);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedCraftsman || !selectedJobId) return;

    setIsApplying(true);
    try {
      await dispatch(
        createProviderApplication({
          jobId: selectedJobId,
          craftsmanId: selectedCraftsman,
        })
      ).unwrap();
      setShowApplyModal(false);
      setSelectedCraftsman("");
      setSelectedJobId(null);
      // Refresh applications to update applied status
    } catch (error) {
      console.error("Failed to apply:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const isJobAppliedFor = (jobId) => {
    return applications.some(
      (app) => (app.jobId?._id?.toString() || app.jobId?.toString()) === jobId.toString()
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <ProviderDashboardLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-card-foreground mb-2">Available Jobs</h1>
        <p className="text-muted-foreground">Browse and apply for jobs on behalf of your craftworkers</p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Location</label>
            <div className="relative">
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Filter by location..."
                className="w-full px-4 py-2 pl-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Skill</label>
            <div className="relative">
              <input
                type="text"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                placeholder="Filter by skill..."
                className="w-full px-4 py-2 pl-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Search Jobs
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No jobs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => {
            const applied = isJobAppliedFor(job._id);
            return (
              <div
                key={job._id}
                className="p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">{job.title}</h3>
                    {job.companyId && (
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>{job.companyId.companyName}</strong>
                      </p>
                    )}
                  </div>
                  {applied && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                  )}
                </div>

                {job.description && (
                  <p className="text-sm text-foreground mb-4 line-clamp-3">{job.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  {job.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  )}

                  {job.startDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Start: {formatDate(job.startDate)}</span>
                    </div>
                  )}

                  {job.numberOfPositions && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{job.numberOfPositions} position(s)</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/provider/dashboard/jobs/${job._id}`}
                    className="flex-1 text-center px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    View Details
                  </Link>
                  {!applied && (
                    <button
                      onClick={() => handleApplyClick(job._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <UserCheck className="w-4 h-4" />
                      Apply
                    </button>
                  )}
                  {applied && (
                    <button
                      disabled
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-600 rounded-lg cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Applied
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-card-foreground">Apply for Job</h3>
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  setSelectedCraftsman("");
                  setSelectedJobId(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label htmlFor="craftsman" className="block text-sm font-medium text-foreground mb-2">
                  Select Craftworker *
                </label>
                <select
                  id="craftsman"
                  value={selectedCraftsman}
                  onChange={(e) => setSelectedCraftsman(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Choose a craftworker...</option>
                  {activeRoster.map((item) => {
                    const craftworker = item.craftsmanId;
                    return (
                      <option key={craftworker?._id} value={craftworker?._id}>
                        {craftworker?.fullName} - {craftworker?.location?.city}, {craftworker?.location?.state}
                      </option>
                    );
                  })}
                </select>
                {activeRoster.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    No active craftworkers in your roster. Add craftworkers to your team first.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isApplying || !selectedCraftsman}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Apply for Job
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowApplyModal(false);
                    setSelectedCraftsman("");
                    setSelectedJobId(null);
                  }}
                  disabled={isApplying}
                  className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProviderDashboardLayout>
  );
}

