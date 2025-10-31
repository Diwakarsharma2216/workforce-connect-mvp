"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CompanyDashboardLayout from "@/components/company/CompanyDashboardLayout";
import { listJobs, createJob, updateJob, deleteJob } from "@/store/slices/jobSlice";
import { Plus, Loader2, Edit2, Trash2, Briefcase, Calendar, MapPin, Users, X } from "lucide-react";

export default function CompanyJobs() {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.job);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

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
    dispatch(listJobs({ status: statusFilter || undefined }));
  }, [dispatch, statusFilter]);

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

  const resetForm = () => {
    setFormData({
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
    setSkillInput("");
    setCertInput("");
    setDocInput("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createJob(formData)).unwrap();
      resetForm();
      setShowCreateModal(false);
      dispatch(listJobs({ status: statusFilter || undefined }));
    } catch (error) {
      console.error("Failed to create job:", error);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || "",
      description: job.description || "",
      skillsRequired: job.skillsRequired || [],
      location: job.location || "",
      startDate: job.startDate ? new Date(job.startDate).toISOString().split("T")[0] : "",
      endDate: job.endDate ? new Date(job.endDate).toISOString().split("T")[0] : "",
      numberOfPositions: job.numberOfPositions?.toString() || "",
      certificationsRequired: job.certificationsRequired || [],
      status: job.status || "open",
      documentsRequired: job.documentsRequired || [],
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateJob({ jobId: editingJob._id, jobData: formData })).unwrap();
      resetForm();
      setShowEditModal(false);
      setEditingJob(null);
      dispatch(listJobs({ status: statusFilter || undefined }));
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  const handleDelete = async (jobId) => {
    if (confirm("Are you sure you want to delete this job?")) {
      try {
        await dispatch(deleteJob(jobId)).unwrap();
        dispatch(listJobs({ status: statusFilter || undefined }));
      } catch (error) {
        console.error("Failed to delete job:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <CompanyDashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-card-foreground mb-2">Jobs</h1>
          <p className="text-muted-foreground">Manage your job postings here</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Job
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Jobs</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
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
              resetForm();
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mx-auto"
          >
            <Plus className="w-5 h-5" />
            Create Your First Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-card-foreground flex-1">{job.title}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    job.status === "open"
                      ? "bg-green-500/20 text-green-700 dark:text-green-400"
                      : "bg-gray-500/20 text-gray-700 dark:text-gray-400"
                  }`}
                >
                  {job.status}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{job.description}</p>
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
                <button
                  onClick={() => handleEdit(job)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-card-foreground">Create New Job</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
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
                    disabled={loading}
                    className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create Job"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
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

      {/* Edit Job Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-card-foreground">Edit Job</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingJob(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="space-y-4">
                {/* Same form fields as create modal */}
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
                    disabled={loading}
                    className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
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
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingJob(null);
                      resetForm();
                    }}
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
    </CompanyDashboardLayout>
  );
}
