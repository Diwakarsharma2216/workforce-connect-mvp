"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import CompanyDashboardLayout from "@/components/company/CompanyDashboardLayout";
import { getJob, updateJob, deleteJob } from "@/store/slices/jobSlice";
import { listApplicants, updateApplicationStatus } from "@/store/slices/applicantSlice";
import {
  Loader2,
  ArrowLeft,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  FileText,
  Award,
  CheckCircle2,
  X,
  Check,
} from "lucide-react";
import Link from "next/link";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const jobId = params.id;
  const { currentJob, loading: jobLoading, error: jobError } = useSelector((state) => state.job);
  const { applicantsByJob, loading: applicantsLoading } = useSelector((state) => state.applicant);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusNotes, setStatusNotes] = useState("");
  const [statusAction, setStatusAction] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillsRequired: [],
    location: "",
    startDate: "",
    endDate: "",
    numberOfPositions: "",
    certificationsRequired: [],
    status: "open",
    documentsRequired: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [docInput, setDocInput] = useState("");

  useEffect(() => {
    if (jobId) {
      dispatch(getJob(jobId));
      dispatch(listApplicants(jobId));
    }
  }, [dispatch, jobId]);

  useEffect(() => {
    if (currentJob) {
      setFormData({
        title: currentJob.title || "",
        description: currentJob.description || "",
        skillsRequired: currentJob.skillsRequired || [],
        location: currentJob.location || "",
        startDate: currentJob.startDate ? new Date(currentJob.startDate).toISOString().split("T")[0] : "",
        endDate: currentJob.endDate ? new Date(currentJob.endDate).toISOString().split("T")[0] : "",
        numberOfPositions: currentJob.numberOfPositions?.toString() || "",
        certificationsRequired: currentJob.certificationsRequired || [],
        status: currentJob.status || "open",
        documentsRequired: currentJob.documentsRequired || [],
      });
    }
  }, [currentJob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skillsRequired.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((s) => s !== skill),
    }));
  };

  const addCert = () => {
    if (certInput.trim() && !formData.certificationsRequired.includes(certInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        certificationsRequired: [...prev.certificationsRequired, certInput.trim()],
      }));
      setCertInput("");
    }
  };

  const removeCert = (cert) => {
    setFormData((prev) => ({
      ...prev,
      certificationsRequired: prev.certificationsRequired.filter((c) => c !== cert),
    }));
  };

  const addDoc = () => {
    if (docInput.trim() && !formData.documentsRequired.includes(docInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        documentsRequired: [...prev.documentsRequired, docInput.trim()],
      }));
      setDocInput("");
    }
  };

  const removeDoc = (doc) => {
    setFormData((prev) => ({
      ...prev,
      documentsRequired: prev.documentsRequired.filter((d) => d !== doc),
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateJob({ jobId, jobData: formData })).unwrap();
      setShowEditModal(false);
      dispatch(getJob(jobId)); // Refresh job data
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      try {
        await dispatch(deleteJob(jobId)).unwrap();
        router.push("/company/dashboard/jobs");
      } catch (error) {
        console.error("Failed to delete job:", error);
      }
    }
  };

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
      dispatch(listApplicants(jobId)); // Refresh applicants
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
      pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
      approved: "bg-green-500/20 text-green-700 dark:text-green-400",
      rejected: "bg-red-500/20 text-red-700 dark:text-red-400",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.pending}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const applicants = jobId ? applicantsByJob[jobId] || [] : [];

  if (jobLoading && !currentJob) {
    return (
      <CompanyDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </CompanyDashboardLayout>
    );
  }

  if (jobError) {
    return (
      <CompanyDashboardLayout>
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{jobError}</p>
          <Link
            href="/company/dashboard/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
        </div>
      </CompanyDashboardLayout>
    );
  }

  if (!currentJob) {
    return (
      <CompanyDashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Job not found</p>
          <Link
            href="/company/dashboard/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
        </div>
      </CompanyDashboardLayout>
    );
  }

  return (
    <CompanyDashboardLayout>
      <div className="mb-6">
        <Link
          href="/company/dashboard/jobs"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-card-foreground">{currentJob.title}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentJob.status === "open"
                    ? "bg-green-500/20 text-green-700 dark:text-green-400"
                    : "bg-gray-500/20 text-gray-700 dark:text-gray-400"
                }`}
              >
                {currentJob.status}
              </span>
            </div>
            <p className="text-muted-foreground">Job Details and Applicants</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Details */}
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

        {/* Right Column - Applicants */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">Applicants</h2>
            {applicantsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : applicants.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No applicants yet</p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {applicants.map((application) => {
                    const craftworker = application.craftworkerId;
                    return (
                      <div
                        key={application._id}
                        className="p-4 bg-accent/50 rounded-lg border border-border"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-card-foreground">
                              {craftworker?.fullName || "Unknown"}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {new Date(application.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                          {getStatusBadge(application.status)}
                        </div>
                        {application.status === "pending" && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => openStatusModal(application, "approved")}
                              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded text-xs hover:bg-green-500/30 transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              Approve
                            </button>
                            <button
                              onClick={() => openStatusModal(application, "rejected")}
                              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-red-500/20 text-red-700 dark:text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
                            >
                              <X className="w-3 h-3" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <Link
                  href="/company/dashboard/applicants"
                  className="block text-center text-sm text-primary hover:underline"
                >
                  View all applicants →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Job Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-card-foreground">Edit Job</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="space-y-4">
                {/* Same form fields as in jobs page */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Number of Positions *
                    </label>
                    <input
                      type="number"
                      name="numberOfPositions"
                      value={formData.numberOfPositions}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Skills Required
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill"
                      className="flex-1 px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skillsRequired.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Certifications Required
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCert())}
                      placeholder="Add a certification"
                      className="flex-1 px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={addCert}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.certificationsRequired.map((cert, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm flex items-center gap-2"
                      >
                        {cert}
                        <button
                          type="button"
                          onClick={() => removeCert(cert)}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Documents Required
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={docInput}
                      onChange={(e) => setDocInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addDoc())}
                      placeholder="Add a document type"
                      className="flex-1 px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={addDoc}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.documentsRequired.map((doc, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm flex items-center gap-2"
                      >
                        {doc}
                        <button
                          type="button"
                          onClick={() => removeDoc(doc)}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={jobLoading}
                    className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {jobLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                        Updating...
                      </>
                    ) : (
                      "Update Job"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
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
                  disabled={applicantsLoading}
                  className={`flex-1 px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    statusAction === "approved"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {applicantsLoading ? (
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
                  disabled={applicantsLoading}
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

