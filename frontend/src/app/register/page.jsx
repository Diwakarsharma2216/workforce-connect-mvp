"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import { BriefcaseBusiness, Users, Hammer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { registerUser, clearError } from "@/store/slices/authSlice";

const ROLE_INFO = {
  company: {
    title: "Company",
    icon: <BriefcaseBusiness className="w-6 h-6" />,
    description: "Post jobs and hire faster",
  },
  provider: {
    title: "Agency",
    icon: <Users className="w-6 h-6" />,
    description: "Manage teams and assign work",
  },
  craftworker: {
    title: "Craft Worker",
    icon: <Hammer className="w-6 h-6" />,
    description: "Get matched with jobs and get paid",
  },
};

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, errors, user, isAuthenticated } = useSelector((state) => state.auth);
  const role = searchParams.get("role") || "company";

  const [formData, setFormData] = useState({
    // Common fields
    email: "",
    password: "",
    role: role,
    // Company & Provider fields
    companyName: "",
    industry: "",
    location: "",
    contactPerson: "",
    phone: "",
    description: "",
    // Craftworker fields
    fullName: "",
    city: "",
    state: "",
    experience: "",
    skills: [],
    certifications: [],
    bio: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [certificationInput, setCertificationInput] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, role }));
    dispatch(clearError());
  }, [role, dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setSuccess(true);
      // Redirect after 2 seconds
      setTimeout(() => {
        const userRole = user.role;
        if (userRole === "company") {
          router.push("/company/dashboard");
        } else if (userRole === "provider") {
          router.push("/provider/dashboard");
        } else if (userRole === "craftworker") {
          router.push("/craftworker/dashboard");
        } else {
          router.push("/");
        }
      }, 2000);
    }
  }, [isAuthenticated, user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    dispatch(clearError());
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addCertification = () => {
    if (certificationInput.trim() && !formData.certifications.includes(certificationInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, certificationInput.trim()],
      }));
      setCertificationInput("");
    }
  };

  const removeCertification = (cert) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== cert),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setSuccess(false);

    // Prepare request body based on role
    let requestBody = {
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    if (formData.role === "company") {
      requestBody = {
        ...requestBody,
        companyName: formData.companyName,
        location: formData.location,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
      };
      if (formData.industry) requestBody.industry = formData.industry;
      if (formData.description) requestBody.description = formData.description;
    } else if (formData.role === "provider") {
      requestBody = {
        ...requestBody,
        companyName: formData.companyName,
        location: formData.location,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
      };
      if (formData.description) requestBody.description = formData.description;
    } else if (formData.role === "craftworker") {
      requestBody = {
        ...requestBody,
        fullName: formData.fullName,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        experience: formData.experience,
      };
      if (formData.skills.length > 0) requestBody.skills = formData.skills;
      if (formData.certifications.length > 0) requestBody.certifications = formData.certifications;
      if (formData.bio) requestBody.bio = formData.bio;
    }

    dispatch(registerUser(requestBody));
  };

  const roleInfo = ROLE_INFO[role] || ROLE_INFO.company;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Back button */}
        <Link
          href="/select-role"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition inline-block"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to login</span>
        </Link>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            {roleInfo.icon}
            <h2 className="text-2xl font-bold text-gray-900">
              Register as {roleInfo.title}
            </h2>
          </div>
          <p className="text-gray-600 mb-6">{roleInfo.description}</p>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
              Registration successful! Redirecting...
            </div>
          )}

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              <ul className="list-disc list-inside">
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>

            {/* Company Fields */}
            {formData.role === "company" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </>
            )}

            {/* Provider Fields */}
            {formData.role === "provider" && (
              <>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </>
            )}

            {/* Craftworker Fields */}
            {formData.role === "craftworker" && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    Experience *
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    rows={3}
                    maxLength={200}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Describe your work experience..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="Add a skill and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      Add
                    </button>
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-blue-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certifications
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={certificationInput}
                      onChange={(e) => setCertificationInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="Add a certification and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addCertification}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      Add
                    </button>
                  </div>
                  {formData.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.certifications.map((cert, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {cert}
                          <button
                            type="button"
                            onClick={() => removeCertification(cert)}
                            className="hover:text-green-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-primary text-white py-2.5 px-4 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : success ? "Registered!" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

