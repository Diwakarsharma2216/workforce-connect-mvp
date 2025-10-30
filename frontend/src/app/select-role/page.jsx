import { BriefcaseBusiness, Users, Hammer } from "lucide-react";


const ROLES = [
  {
    title: "Company",
    icon: <BriefcaseBusiness className="w-10 h-10 mb-2" />,
    href: "/login/company",
    description: "Post jobs and hire faster",
    color: "from-[#2563eb] to-[#4338CA]",
  },
  {
    title: "Provider",
    icon: <Users className="w-10 h-10 mb-2" />,
    href: "/login/provider",
    description: "Manage teams and assign work",
    color: "from-[#4338CA] to-[#2563eb]",
  },
  {
    title: "Craft",
    icon: <Hammer className="w-10 h-10 mb-2" />,
    href: "/login/craft",
    description: "Get matched with jobs and get paid",
    color: "from-[#16A34A] to-[#2563eb]",
  },
];

export default function SelectRolePage() {
  return (
    <>
    
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white py-12 px-2">
        <div className="w-full max-w-2xl flex flex-col items-center space-y-4 mt-6 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-0">
            Select Your Role
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-6">
            Choose how you want to continue.
          </p>
          <div className="flex flex-col md:flex-row gap-8 w-full items-center md:justify-center pt-2">
            {ROLES.map(({ title, icon, href, description, color }) => (
              <a
                key={title}
                href={href}
                className={
                  `group flex-1 min-w-[180px] max-w-[230px] border border-white/40 backdrop-blur flex flex-col items-center text-center p-7 rounded-2xl shadow-xl bg-gradient-to-br ${color}
                   text-white transition scale-100 hover:scale-105 hover:shadow-2xl active:scale-100 hover:ring-2 hover:ring-offset-2 hover:ring-[#4338CA]/60
                  `
                }
                style={{
                  boxShadow: "0 2px 16px 0 rgba(67,56,202,0.08)",
                }}
              >
                <span className="flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                  {icon}
                </span>
                <div className="text-lg md:text-xl font-semibold mb-1">{title}</div>
                <div className="text-sm text-blue-50/80">{description}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}