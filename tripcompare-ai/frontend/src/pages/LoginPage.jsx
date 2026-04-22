import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-md items-center px-5 py-8">
      <section className="glass-card w-full rounded-3xl p-6 shadow-soft">
        <h1 className="font-display text-3xl text-slate-700">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-600">Login to plan your smart budget trip.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none ring-sky-200/60 focus:ring"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none ring-sky-200/60 focus:ring"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-sky-300 py-3 font-bold text-slate-700 transition hover:bg-sky-200 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          New user? <Link className="font-semibold text-sky-600" to="/signup">Create account</Link>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;
