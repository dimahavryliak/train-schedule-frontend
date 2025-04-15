"use client";

import { useEffect, useState } from "react";
import { fetchUserTrips, removeTrip } from "@/api/authApi";
import { fetchTrains, Train } from "@/api/trainApi";

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("User not logged in");
          return;
        }

        const tripIds = await fetchUserTrips(parseInt(userId));

        const trainDetails = await Promise.all(
          tripIds.map((id) =>
            fetchTrains().then((trains) =>
              trains.find((train) => train.id === id)
            )
          )
        );

        setTrips(
          trainDetails.filter((train) => train !== undefined) as Train[]
        );
      } catch (err) {
        setError("Failed to load trips");
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  const handleDelete = async (trainId: number) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User not logged in");
        return;
      }

      await removeTrip(parseInt(userId), trainId);

      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== trainId));
    } catch (err) {
      alert("Failed to delete trip. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className=" container mx-auto p-8 mt-25">
      <h1 className="text-3xl font-bold mb-6 text-gray-200">My Trips</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="border border-gray-300 rounded-lg p-4 shadow-md bg-white/50 backdrop-blur-md"
          >
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              {trip.name}
            </h2>
            <p className="text-gray-600">
              <strong>Departure:</strong> {trip.departure}
            </p>
            <p className="text-gray-600">
              <strong>Arrival:</strong> {trip.arrival}
            </p>
            <p className="text-gray-600">
              <strong>Date:</strong> {new Date(trip.date).toLocaleString()}
            </p>
            <button
              className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition"
              onClick={() => handleDelete(trip.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
