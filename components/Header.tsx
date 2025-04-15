"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Header() {
  const { username, logout } = useAuth();

  return (
    <header className="bg-white/50 backdrop-blur-md shadow-md fixed top-0 left-0 w-full z-50">
      <nav className="container mx-auto flex justify-between items-center py-8 px-6">
        <Link href="/" className="text-2xl font-bold text-white">
          TrainHub
        </Link>
        <div className="flex items-center gap-4">
          {username ? (
            <>
              <Link
                href="/my-trips"
                className="bg-blue-400 px-4 py-2 rounded-lg text-white hover:bg-blue-500 transition"
              >
                My Trips
              </Link>
              <button
                onClick={logout}
                className="bg-red-400 px-4 py-2 rounded-lg text-white hover:bg-red-500 transition"
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
