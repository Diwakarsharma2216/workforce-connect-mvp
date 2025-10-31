"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import ProviderDashboardLayout from "@/components/provider/ProviderDashboardLayout";
import { getProviderJob } from "@/store/slices/providerJobSlice";
import { createProviderApplication, listProviderApplications } from "@/store/slices/providerApplicationSlice";
import { getRoster } from "@/store/slices/providerSlice";
import {
  Loader2,
  Calendar,
  MapPin,
  Users,
  Briefcase,
  Building2,
  X,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function ProviderJobDetail() {
  const params = useParams();
  const dispatch = useDispatch();
  const { jobs, currentJob } = useSelector((state) => state.providerJob);
  const { roster } = useSelector((state) => state.provider);
  const { applications } = useSelector((state) => state.providerApplication);
  const [selectedCraftsman, setSelectedCraftsman] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const job = currentJob || jobs.find((j) => j._id === params.id);

  useEffect(() => {
    if (!job) {
      dispatch(getProviderJob(params.id));
    }
    dispatch(getRoster());
    dispatch(listProviderApplications());
  }, [dispatch, params.id, job]);

  const activeRoster = roster.filter((item) => item.status === "active");

  const isJobAppliedFor = job
    ? applications.some(
        (app) =>
          (app.jobId?._id?.toString() || app.jobId?.toString()) === job._id.toString()
      )
    : false;

  const handleApplyClick = () => {
    if (activeRoster.length === 0) {
      alert("You need to add craftworkers to your roster before applying for jobs.");
      return;
    }
    setShowApplyModal(true);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedCraftsman || !job) return;

    setIsApplying(true);
    try {
      await dispatch(
        createProviderApplication({
          jobId: job._id,
          craftsmanId: selectedCraftsman,
        })
      ).unwrap();
      setShowApplyModal(false);
      setSelectedCraftsman("");
      // Refresh job list to update applied status
      dispatch(getProviderJob(params.id));
    } catch (error) {
      console.error("Failed to apply:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!job) {
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
      <Link
        href="/provider/dashboard/jobs"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        ← Back to Jobs
      </Link>

      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-card-foreground mb-2">{job.title}</h1>
            {job.companyId && (
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{job.companyId.companyName}</span>
                {job.companyId.industry && (
                  <span className="text-sm">• {job.companyId.industry}</span>
                )}
              </div>
            )}
          </div>
          {isJobAppliedFor && (
            <span className="px-3 py-1 bg-green-500/20 text-green-600 rounded-full text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Applied
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {job.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
          )}
          {job.startDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Start: {formatDate(job.startDate)}</span>
            </div>
          )}
          {job.endDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>End: {formatDate(job.endDate)}</span>
            </div>
          )}
          {job.numberOfPositions && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{job.numberOfPositions} position(s)</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">Job Description</h2>
        <p className="text-foreground whitespace-pre-wrap">{job.description || "No description provided."}</p>
      </div>

      {job.skillsRequired && job.skillsRequired.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skillsRequired.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {job.certificationsRequired && job.certificationsRequired.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Required Certifications</h2>
          <ul className="list-disc list-inside space-y-1">
            {job.certificationsRequired.map((cert, idx) => (
              <li key={idx} className="text-foreground">
                {cert}
              </li>
            ))}
          </ul>
        </div>
      )}

      {job.documentsRequired && job.documentsRequired.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Required Documents</h2>
          <ul className="list-disc list-inside space-y-1">
            {job.documentsRequired.map((doc, idx) => (
              <li key={idx} className="text-foreground">
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {job.companyId && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Company Information</h2>
          <div className="space-y-2 text-foreground">
            <p>
              <strong>Company:</strong> {job.companyId.companyName}
            </p>
            {job.companyId.industry && (
              <p>
                <strong>Industry:</strong> {job.companyId.industry}
              </p>
            )}
            {job.companyId.location && (
              <p>
                <strong>Location:</strong> {job.companyId.location}
              </p>
            )}
            {job.companyId.contactPerson && (
              <p>
                <strong>Contact Person:</strong> {job.companyId.contactPerson}
              </p>
            )}
            {job.companyId.phone && (
              <p>
                <strong>Phone:</strong> {job.companyId.phone}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-4">
        {!isJobAppliedFor && (
          <button
            onClick={handleApplyClick}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <UserCheck className="w-5 h-5" />
            Apply for This Job
          </button>
        )}
        {isJobAppliedFor && (
          <button
            disabled
            className="flex items-center gap-2 px-6 py-3 bg-green-500/20 text-green-600 rounded-lg cursor-not-allowed"
          >
            <CheckCircle2 className="w-5 h-5" />
            Already Applied
          </button>
        )}
      </div>

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

