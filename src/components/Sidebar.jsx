import { Link } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dashboard/analytics", label: "Analytics" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="block py-2 px-4 hover:bg-gray-700 rounded"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
