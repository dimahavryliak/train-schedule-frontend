"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register, login } from "@/api/authApi";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUsername } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await register(username, password);
      if (response.message === "User registered successfully") {
        const loginResponse = await login(username, password);
        if (loginResponse.access_token) {
          localStorage.setItem("token", loginResponse.access_token);
          localStorage.setItem("username", loginResponse.username || "");
          localStorage.setItem(
            "userId",
            loginResponse.userId?.toString() || ""
          );
          setUsername(loginResponse.username || "");
          router.push("/");
        } else {
          setError("Failed to log in after signup");
        }
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred while signing up");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className=" bg-white/50 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-m font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-m font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
