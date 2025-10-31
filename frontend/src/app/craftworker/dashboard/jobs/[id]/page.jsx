"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import CraftworkerDashboardLayout from "@/components/craftworker/CraftworkerDashboardLayout";
import { getPublicJob } from "@/store/slices/publicJobSlice";
import { createApplication, listApplications } from "@/store/slices/applicationSlice";
import {
  Loader2,
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  FileText,
  Award,
  Building2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const jobId = params.id;
  const { currentJob, loading: jobLoading, error: jobError } = useSelector((state) => state.publicJob);
  const { applications } = useSelector((state) => state.application);
  const [isApplied, setIsApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (jobId) {
      dispatch(getPublicJob(jobId));
      dispatch(listApplications());
    }
  }, [dispatch, jobId]);

  useEffect(() => {
    if (currentJob && applications.length > 0) {
      const applied = applications.some(
        (app) => (app.jobId?._id || app.jobId) === currentJob._id
      );
      setIsApplied(applied);
    }
  }, [currentJob, applications]);

  const handleApply = async () => {
    if (!currentJob) return;
    setIsApplying(true);
    try {
      await dispatch(createApplication({ jobId: currentJob._id })).unwrap();
      dispatch(listApplications());
      setIsApplied(true);
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

  if (jobLoading && !currentJob) {
    return (
      <CraftworkerDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </CraftworkerDashboardLayout>
    );
  }

  if (jobError) {
    return (
      <CraftworkerDashboardLayout>
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{jobError}</p>
          <Link
            href="/craftworker/dashboard/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
        </div>
      </CraftworkerDashboardLayout>
    );
  }

  if (!currentJob) {
    return (
      <CraftworkerDashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Job not found</p>
          <Link
            href="/craftworker/dashboard/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
        </div>
      </CraftworkerDashboardLayout>
    );
  }

  const company = currentJob.companyId;

  return (
    <CraftworkerDashboardLayout>
      <div className="mb-6">
        <Link
          href="/craftworker/dashboard/jobs"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-card-foreground">{currentJob.title}</h1>
              <span className="px-3 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                {currentJob.status}
              </span>
            </div>
            {company && (
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Building2 className="w-5 h-5" />
                <span className="text-lg">{company.companyName}</span>
              </div>
            )}
            <p className="text-muted-foreground">Job Details</p>
          </div>
          {currentJob.status === "open" && (
            <div>
              {isApplied ? (
                <button
                  disabled
                  className="flex items-center gap-2 px-6 py-2 bg-green-500/20 text-green-700 dark:text-green-400 rounded-lg cursor-not-allowed"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Applied
                </button>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={isApplying}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-5 h-5" />
                      Apply Now
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">Job Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{currentJob.description}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">Job Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-muted-foreground">{currentJob.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-foreground">Start Date</p>
                  <p className="text-muted-foreground">{formatDate(currentJob.startDate)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-foreground">End Date</p>
                  <p className="text-muted-foreground">{formatDate(currentJob.endDate)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-foreground">Number of Positions</p>
                  <p className="text-muted-foreground">{currentJob.numberOfPositions}</p>
                </div>
              </div>
            </div>
          </div>

          {currentJob.skillsRequired && currentJob.skillsRequired.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6" />
                Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentJob.skillsRequired.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {currentJob.certificationsRequired && currentJob.certificationsRequired.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Certifications Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentJob.certificationsRequired.map((cert, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {currentJob.documentsRequired && currentJob.documentsRequired.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Documents Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentJob.documentsRequired.map((doc, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Company Info */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">Company Details</h2>
            {company ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Company Name</p>
                  <p className="text-muted-foreground">{company.companyName}</p>
                </div>
                {company.industry && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Industry</p>
                    <p className="text-muted-foreground">{company.industry}</p>
                  </div>
                )}
                {company.location && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Location</p>
                    <p className="text-muted-foreground">{company.location}</p>
                  </div>
                )}
                {company.contactPerson && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Contact Person</p>
                    <p className="text-muted-foreground">{company.contactPerson}</p>
                  </div>
                )}
                {company.description && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">About Company</p>
                    <p className="text-sm text-muted-foreground">{company.description}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Company information not available</p>
            )}
          </div>
        </div>
      </div>
    </CraftworkerDashboardLayout>
  );
}

