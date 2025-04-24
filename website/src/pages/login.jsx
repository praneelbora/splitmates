import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "../services/api"; // Adjust if needed
import { useAuth } from "../context/authContext";

export default function Login() {
  const { login, logout, user, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  if(token) navigate('/groups')
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/v1/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/groups");
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center  text-[#EBF1D5]">
      <div className="w-full p-8 space-y-6  rounded-lg shadow-md flex flex-col justify-center items-center" >
        <h2 className="text-2xl font-bold text-center">Splitmates Login</h2>
        <form onSubmit={handleLogin} className="space-y-4 lg:w-[50%]">
          <div>
            <label>Email</label>
            <input
      className="bg-[#1f1f1f] w-full mt-1 text-[#EBF1D5] border border-[#55554f] rounded-md p-2 text-base min-h-[40px] pl-3 flex-1"

              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
      className="bg-[#1f1f1f] w-full mt-1 text-[#EBF1D5] border border-[#55554f] rounded-md p-2 text-base min-h-[40px] pl-3 flex-1"

              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-[#EBF1D5]"
          >
            Login
          </button>
        </form>
        <p className="text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
