"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProviderDashboardLayout from "@/components/provider/ProviderDashboardLayout";
import { listProviderApplications } from "@/store/slices/providerApplicationSlice";
import {
  Loader2,
  Briefcase,
  Calendar,
  MapPin,
  Building2,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";
import Link from "next/link";

export default function ProviderApplications() {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector((state) => state.providerApplication);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(listProviderApplications(statusFilter ? { status: statusFilter } : {}));
  }, [dispatch, statusFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-600 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-600 rounded-full flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-600 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  return (
    <ProviderDashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-card-foreground mb-2">My Applications</h1>
          <p className="text-muted-foreground">Applications submitted on behalf of your craftworkers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <label className="text-sm font-medium text-foreground">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
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
      ) : applications.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No applications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const job = application.jobId;
            const craftworker = application.craftworkerId;
            return (
              <div
                key={application._id}
                className="p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-card-foreground">{job?.title || "Unknown Job"}</h3>
                      {getStatusBadge(application.status)}
                    </div>
                    {job?.companyId && (
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Building2 className="w-4 h-4" />
                        <span>{job.companyId.companyName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <User className="w-4 h-4" />
                      <strong className="text-foreground">Craftworker:</strong>
                    </div>
                    <p className="text-foreground ml-6">
                      {craftworker?.fullName || "Unknown"}
                      {craftworker?.location && (
                        <span className="text-muted-foreground">
                          {" "}
                          - {craftworker.location.city}, {craftworker.location.state}
                        </span>
                      )}
                    </p>
                    {craftworker?.skills && craftworker.skills.length > 0 && (
                      <div className="mt-2 ml-6 flex flex-wrap gap-1">
                        {craftworker.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {craftworker.skills.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded">
                            +{craftworker.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      <strong className="text-foreground">Applied:</strong>
                    </div>
                    <p className="text-foreground ml-6">{formatDate(application.appliedAt)}</p>
                    {application.reviewedAt && (
                      <>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 mt-2">
                          <Calendar className="w-4 h-4" />
                          <strong className="text-foreground">Reviewed:</strong>
                        </div>
                        <p className="text-foreground ml-6">{formatDate(application.reviewedAt)}</p>
                      </>
                    )}
                  </div>
                </div>

                {job?.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                )}

                {application.notes && (
                  <div className="mt-4 p-3 bg-accent rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-1">Review Notes:</p>
                    <p className="text-sm text-muted-foreground">{application.notes}</p>
                  </div>
                )}

                {job?._id && (
                  <div className="mt-4">
                    <Link
                      href={`/provider/dashboard/jobs/${job._id}`}
                      className="inline-flex items-center gap-2 text-primary hover:underline"
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
    </ProviderDashboardLayout>
  );
}

