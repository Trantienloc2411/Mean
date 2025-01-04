import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Your App</h1>
        <div className="flex gap-4">
          <Link to="/profile">Profile</Link>
          <button>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
