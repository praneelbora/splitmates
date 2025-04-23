import { Link, useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      <div className="text-xl font-bold text-teal-400">
        <Link to="/dashboard">Splitmates</Link>
      </div>

      <div className="flex space-x-4">
        <Link to="/dashboard" className="hover:text-teal-300">Dashboard</Link>
        <Link to="/add-expense" className="hover:text-teal-300">Add Expense</Link>
        <Link to="/add-group" className="hover:text-teal-300">Add Group</Link>
        <button
          onClick={handleLogout}
          className="ml-4 bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
