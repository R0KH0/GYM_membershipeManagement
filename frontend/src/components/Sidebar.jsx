import { LayoutDashboard, DollarSign, Users } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import pandaLogo from "@/assets/panda-logo.png";

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: DollarSign, label: "Earning", path: "/earning" },
    { icon: Users, label: "Members", path: "/members" },
  ];

  return (
    <aside className="w-60 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center justify-center">
        <img src={pandaLogo} alt="Logo" className="w-24 h-24" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            activeClassName="bg-primary text-primary-foreground hover:bg-primary"
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;