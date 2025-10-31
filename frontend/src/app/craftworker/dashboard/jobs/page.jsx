"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CraftworkerDashboardLayout from "@/components/craftworker/CraftworkerDashboardLayout";
import { listPublicJobs } from "@/store/slices/publicJobSlice";
import { createApplication, listApplications } from "@/store/slices/applicationSlice";
import {
  Loader2,
  Briefcase,
  Calendar,
  MapPin,
  Users,
  Search,
  X,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function CraftworkerJobs() {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.publicJob);
  const { applications } = useSelector((state) => state.application);
  const [locationFilter, setLocationFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  useEffect(() => {
    dispatch(listPublicJobs({ status: "open" }));
    dispatch(listApplications());
  }, [dispatch]);

  useEffect(() => {
    // Extract job IDs from applications
    const appliedIds = new Set(applications.map((app) => app.jobId?._id || app.jobId));
    setAppliedJobIds(appliedIds);
  }, [applications]);

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
    dispatch(listPublicJobs(filters));
  };

  const handleApply = async (jobId) => {
    try {
      await dispatch(createApplication({ jobId })).unwrap();
      // Refresh applications to update applied status
      dispatch(listApplications());
    } catch (error) {
      console.error("Failed to apply:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <CraftworkerDashboardLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-card-foreground mb-2">Available Jobs</h1>
        <p className="text-muted-foreground">Browse and apply to available job opportunities</p>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-card border border-border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Location</label>
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Filter by location..."
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Skill</label>
            <input
              type="text"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="Filter by skill..."
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      {loading && jobs.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No jobs found</p>
          <button
            onClick={() => {
              setLocationFilter("");
              setSkillFilter("");
              dispatch(listPublicJobs({ status: "open" }));
            }}
            className="text-primary hover:underline"
          >
            Clear filters and show all jobs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => {
            const isApplied = appliedJobIds.has(job._id);
            const company = job.companyId;

            return (
              <div
                key={job._id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-card-foreground mb-1">{job.title}</h3>
                    {company && (
                      <p className="text-sm text-muted-foreground">{company.companyName}</p>
                    )}
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                    Open
                  </span>
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {job.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(job.startDate)} - {formatDate(job.endDate)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {job.numberOfPositions} position{job.numberOfPositions !== 1 ? "s" : ""}
                  </div>
                </div>

                {job.skillsRequired && job.skillsRequired.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skillsRequired.length > 3 && (
                        <span className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs">
                          +{job.skillsRequired.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/craftworker/dashboard/jobs/${job._id}`}
                    className="flex-1 text-center px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    View Details
                  </Link>
                  {isApplied ? (
                    <button
                      disabled
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-700 dark:text-green-400 rounded-lg cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Applied
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(job._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CraftworkerDashboardLayout>
  );
}

