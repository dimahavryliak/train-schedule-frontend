"use client";

import { useState, useEffect } from "react";
import { login } from "@/api/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export interface RegisterResponse {
  message?: string;
  username?: string;
  userId?: number;
}

export async function register(
  username: string,
  password: string
): Promise<RegisterResponse> {
  const response = await fetch(
    "https://web-production-a1584.up.railway.app/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to register");
  }

  return response.json();
}

export default function LoginPage() {
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUsername } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await login(username, password);
      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("username", response.username || "");
        localStorage.setItem("userId", response.userId?.toString() || "");
        setUsername(response.username || "");
        router.push("/");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred while logging in");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className=" bg-white/50 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
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
          <p className="text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <a href="/auth/register" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export function Header() {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setUsername(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="bg-blue-100 shadow-md">
      <nav className="container mx-auto flex justify-between items-center py-8 px-6">
        <Link href="/" className="text-2xl font-bold text-black">
          TrainHub
        </Link>
        <div className="flex items-center gap-4">
          {username ? (
            <>
              <Link
                href="/my-trips"
                className="bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-600 transition"
              >
                My Trips
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
