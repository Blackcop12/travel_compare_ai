import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      await signup(form);
      navigate("/dashboard");
    } catch (signupError) {
      setError(signupError.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-panel dark:border-slate-700 dark:bg-slate-900/70">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Create Account</h2>
        <p className="mt-1 text-sm text-slate-500">Join CompareX and track your best deals.</p>

        <div className="mt-5 space-y-4">
          <input
            name="name"
            type="text"
            required
            value={form.name}
            onChange={onChange}
            placeholder="Full name"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
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
            minLength={6}
            value={form.password}
            onChange={onChange}
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}

        <button type="submit" className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400">
          Signup
        </button>

        <p className="mt-4 text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-emerald-500">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
