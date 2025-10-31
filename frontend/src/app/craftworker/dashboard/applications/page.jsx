"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CraftworkerDashboardLayout from "@/components/craftworker/CraftworkerDashboardLayout";
import { listApplications, deleteApplication } from "@/store/slices/applicationSlice";
import {
  Loader2,
  Bookmark,
  Calendar,
  MapPin,
  Building2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function CraftworkerApplications() {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector((state) => state.application);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(listApplications({ status: statusFilter || undefined }));
  }, [dispatch, statusFilter]);

  const handleWithdraw = async (applicationId) => {
    if (confirm("Are you sure you want to withdraw this application?")) {
      try {
        await dispatch(deleteApplication(applicationId)).unwrap();
        dispatch(listApplications({ status: statusFilter || undefined }));
      } catch (error) {
        console.error("Failed to withdraw application:", error);
      }
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

  const getStatusBadge = (status) => {
    const styles = {
      pending: {
        icon: <Clock className="w-4 h-4" />,
        bg: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
      },
      approved: {
        icon: <CheckCircle2 className="w-4 h-4" />,
        bg: "bg-green-500/20 text-green-700 dark:text-green-400",
      },
      rejected: {
        icon: <XCircle className="w-4 h-4" />,
        bg: "bg-red-500/20 text-red-700 dark:text-red-400",
      },
    };

    const style = styles[status] || styles.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${style.bg}`}>
        {style.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredApplications = applications.filter((app) => {
    if (!statusFilter) return true;
    return app.status === statusFilter;
  });

  return (
    <CraftworkerDashboardLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-card-foreground mb-2">My Applications</h1>
        <p className="text-muted-foreground">View and manage your job applications</p>
      </div>

      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Applications</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      {loading && applications.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No applications found</p>
          <Link
            href="/craftworker/dashboard/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Browse Available Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const job = application.jobId;
            const company = job?.companyId;

            return (
              <div
                key={application._id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-card-foreground">
                        {job?.title || "Job Not Found"}
                      </h3>
                      {getStatusBadge(application.status)}
                    </div>
                    {company && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Building2 className="w-4 h-4" />
                        {company.companyName}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Applied on: {formatDate(application.appliedAt)}
                    </p>
                    {application.reviewedAt && (
                      <p className="text-sm text-muted-foreground">
                        Reviewed on: {formatDate(application.reviewedAt)}
                      </p>
                    )}
                  </div>
                  {application.status === "pending" && (
                    <button
                      onClick={() => handleWithdraw(application._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Withdraw
                    </button>
                  )}
                </div>

                {job && (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDate(job.startDate)} - {formatDate(job.endDate)}
                    </div>
                  </div>
                )}

                {application.notes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-2">Review Notes:</p>
                    <p className="text-sm text-muted-foreground">{application.notes}</p>
                  </div>
                )}

                {job && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Link
                      href={`/craftworker/dashboard/jobs/${job._id}`}
                      className="text-primary hover:underline text-sm"
                    >
                      View Job Details →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </CraftworkerDashboardLayout>
  );
}

