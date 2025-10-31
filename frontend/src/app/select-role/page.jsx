"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, Users, Hammer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { loginUser, clearError } from "@/store/slices/authSlice";

const ROLES = [
  {
    title: "Company",
    roleKey: "company",
    icon: <BriefcaseBusiness className="w-10 h-10 mb-2" />,
    description: "Post jobs and hire faster",
    color: "from-[#2563eb] to-[#4338CA]",
  },
  {
    title: "Provider",
    roleKey: "provider",
    icon: <Users className="w-10 h-10 mb-2" />,
    description: "Manage teams and assign work",
    color: "from-[#4338CA] to-[#2563eb]",
  },
  {
    title: "Craft",
    roleKey: "craftworker",
    icon: <Hammer className="w-10 h-10 mb-2" />,
    description: "Get matched with jobs and get paid",
    color: "from-[#16A34A] to-[#2563eb]",
  },
];

export default function SelectRolePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, user, isAuthenticated } = useSelector((state) => state.auth);

  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    dispatch(clearError());
  };

  const handleBack = () => {
    setSelectedRole(null);
    setEmail("");
    setPassword("");
    dispatch(clearError());
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role after successful login
      const role = user.role;
      if (role === "company") {
        router.push("/company/dashboard");
      } else if (role === "provider") {
        router.push("/provider/dashboard");
      } else if (role === "craftworker") {
        router.push("/craftworker/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginUser({ email, password }));
  };

  // Show login form when role is selected
  if (selectedRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="w-full max-w-md">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to role selection</span>
          </button>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Login as {selectedRole.title}
            </h2>
            <p className="text-gray-600 mb-6">
              Enter your credentials to access your account
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-2.5 px-4 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>

          {/* Register Section */}
          <div className="mt-6 bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Register for: {selectedRole.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Don't have an account? Register as a {selectedRole.title.toLowerCase()} to get started.
            </p>
            <Link
              href={`/register?role=${selectedRole.roleKey}`}
              className="inline-block w-full text-center bg-white border-2 border-primary text-primary py-2.5 px-4 rounded-lg font-medium hover:bg-primary hover:text-white transition"
            >
              Register as {selectedRole.title}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show role selection
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white py-12 px-2">
      <div className="w-full max-w-2xl flex flex-col items-center space-y-4 mt-6 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-0">
          Select Your Role
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-6">
          Choose how you want to continue.
        </p>
        <div className="flex flex-col md:flex-row gap-8 w-full items-center md:justify-center pt-2">
          {ROLES.map((role) => (
            <button
              key={role.title}
              onClick={() => handleRoleSelect(role)}
              className={
                `group flex-1 min-w-[180px] max-w-[230px] border border-white/40 backdrop-blur flex flex-col items-center text-center p-7 rounded-2xl shadow-xl bg-gradient-to-br ${role.color}
                 text-white transition scale-100 hover:scale-105 hover:shadow-2xl active:scale-100 hover:ring-2 hover:ring-offset-2 hover:ring-[#4338CA]/60
                `
              }
              style={{
                boxShadow: "0 2px 16px 0 rgba(67,56,202,0.08)",
              }}
            >
              <span className="flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                {role.icon}
              </span>
              <div className="text-lg md:text-xl font-semibold mb-1">{role.title}</div>
              <div className="text-sm text-blue-50/80">{role.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
