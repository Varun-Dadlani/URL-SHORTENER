import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post(
        "/auth/login",
        new URLSearchParams({
          username: email,
          password: password,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      localStorage.setItem("token", res.data.access_token);
      window.location.href = "/";
    } catch (err) {
      setError("Invalid email or password");
    }
  };


  return (
  <div className="center">
    <div className="card">
      <h2>Login</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
      <p className="text-sm text-center mt-4">
          Create an account{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      {error && <p className="error">{error}</p>}
    </div>
  </div>
);

}
