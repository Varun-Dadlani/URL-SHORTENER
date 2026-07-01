import { useState } from "react";
import api from "../api/axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("/auth/register",{email,password});
      alert("Account created! Please login");
      window.location.href = "/login";
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
  <div className="center">
    <div className="card">
      <h2>Register</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>
      <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      {error && <p className="error">{error}</p>}
    </div>
  </div>
);

}
