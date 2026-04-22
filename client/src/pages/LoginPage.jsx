import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      await login(form);
      navigate("/dashboard");
    } catch (loginError) {
      setError(loginError.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-panel dark:border-slate-700 dark:bg-slate-900/70">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Welcome Back</h2>
        <p className="mt-1 text-sm text-slate-500">Login to access your dashboard and wishlist.</p>

        <div className="mt-5 space-y-4">
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={onChange}
            placeholder="Email"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <input
            name="password"
            type="password"
            required
            value={form.password}
            onChange={onChange}
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}

        <button type="submit" className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400">
          Login
        </button>

        <p className="mt-4 text-sm text-slate-500">
          New user? <Link to="/signup" className="font-semibold text-emerald-500">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
