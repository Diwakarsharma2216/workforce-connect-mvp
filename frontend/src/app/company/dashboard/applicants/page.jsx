"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CompanyDashboardLayout from "@/components/company/CompanyDashboardLayout";
import { listJobs } from "@/store/slices/jobSlice";
import { listApplicants, updateApplicationStatus } from "@/store/slices/applicantSlice";
import { Loader2, Check, X, User, MapPin, Briefcase, Calendar, CheckCircle2 } from "lucide-react";

export default function CompanyApplicants() {
  const dispatch = useDispatch();
  const { jobs } = useSelector((state) => state.job);
  const { applicantsByJob, loading, error } = useSelector((state) => state.applicant);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusNotes, setStatusNotes] = useState("");
  const [statusAction, setStatusAction] = useState("");

  useEffect(() => {
    dispatch(listJobs());
  }, [dispatch]);

  useEffect(() => {
    if (selectedJobId) {
      dispatch(listApplicants(selectedJobId));
    }
  }, [dispatch, selectedJobId]);

  const handleStatusUpdate = async () => {
    if (!selectedApplication || !statusAction) return;

    try {
      await dispatch(
        updateApplicationStatus({
          applicationId: selectedApplication._id,
          status: statusAction,
          notes: statusNotes || undefined,
        })
      ).unwrap();
      setShowStatusModal(false);
      setSelectedApplication(null);
      setStatusNotes("");
      setStatusAction("");
      // Refresh applicants for the selected job
      if (selectedJobId) {
        dispatch(listApplicants(selectedJobId));
      }
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

  const openStatusModal = (application, action) => {
    setSelectedApplication(application);
    setStatusAction(action);
    setStatusNotes("");
    setShowStatusModal(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
      approved: "bg-green-500/20 text-green-700 dark:text-green-400",
      rejected: "bg-red-500/20 text-red-700 dark:text-red-400",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const currentApplicants = selectedJobId ? applicantsByJob[selectedJobId] || [] : [];

  return (
    <CompanyDashboardLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-card-foreground mb-2">Applicants</h1>
        <p className="text-muted-foreground">View and manage job applicants here</p>
      </div>

      <div className="mb-6">
        <label htmlFor="jobSelect" className="block text-sm font-medium text-foreground mb-2">
          Select Job
        </label>
        <select
          id="jobSelect"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">-- Select a job --</option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title} ({job.status})
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      {!selectedJobId ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Please select a job to view applicants</p>
        </div>
      ) : loading && currentApplicants.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : currentApplicants.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No applicants found for this job</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentApplicants.map((application) => {
            const craftworker = application.craftworkerId;
            const provider = application.providerId;

            return (
              <div
                key={application._id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-card-foreground">
                        {craftworker?.fullName || "Unknown"}
                      </h3>
                      {getStatusBadge(application.status)}
                    </div>
                    {provider && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Submitted by Provider: {provider.companyName || "Unknown Provider"}
                      </p>
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => openStatusModal(application, "approved")}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => openStatusModal(application, "rejected")}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                {craftworker && (
                  <div className="space-y-3 mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {craftworker.location?.city && craftworker.location?.state
                          ? `${craftworker.location.city}, ${craftworker.location.state}`
                          : "Location not specified"}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="w-4 h-4" />
                        Experience: {craftworker.experience || "Not specified"}
                      </div>
                    </div>

                    {craftworker.skills && craftworker.skills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {craftworker.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {craftworker.certifications && craftworker.certifications.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Certifications:</p>
                        <div className="flex flex-wrap gap-2">
                          {craftworker.certifications.map((cert, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {craftworker.bio && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Bio:</p>
                        <p className="text-sm text-muted-foreground">{craftworker.bio}</p>
                      </div>
                    )}
                  </div>
                )}

                {application.notes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-2">Review Notes:</p>
                    <p className="text-sm text-muted-foreground">{application.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-card-foreground mb-4">
                {statusAction === "approved" ? "Approve" : "Reject"} Application
              </h2>
              <p className="text-muted-foreground mb-4">
                {selectedApplication.craftworkerId?.fullName || "Unknown"} applied for this
                position.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={4}
                  placeholder="Add any notes about this decision..."
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleStatusUpdate}
                  disabled={loading}
                  className={`flex-1 px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    statusAction === "approved"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      Processing...
                    </>
                  ) : statusAction === "approved" ? (
                    <>
                      <Check className="w-4 h-4 inline mr-2" />
                      Approve
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 inline mr-2" />
                      Reject
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedApplication(null);
                    setStatusNotes("");
                    setStatusAction("");
                  }}
                  disabled={loading}
                  className="px-6 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CompanyDashboardLayout>
  );
}


