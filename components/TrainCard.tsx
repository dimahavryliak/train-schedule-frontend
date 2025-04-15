import React from "react";
import { Train } from "@/api/trainApi";
import { useRouter } from "next/navigation";

export default function TrainCard({ train }: { train: Train }) {
  const router = useRouter();

  const handleBook = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        "https://web-production-a1584.up.railway.app/auth/add-trip",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: parseInt(userId), trainId: train.id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add trip");
      }

      alert("Trip added successfully!");
    } catch (error) {
      console.error("Error adding trip:", error);
      alert("Failed to add trip. Please try again.");
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md mb-4 relative">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 mr-2">{train.name}</h3>
        <img src="/train.png" alt="Train Icon" className="w-6 h-6" />
      </div>
      <p className="text-gray-600">
        <strong>Відправлення:</strong> {train.departure}
      </p>
      <p className="text-gray-600">
        <strong>Прибуття:</strong> {train.arrival}
      </p>
      <p className="text-gray-600">
        <strong>Дата:</strong> {new Date(train.date).toLocaleString()}
      </p>
      <button
        className="absolute bottom-4 right-4 bg-blue-400 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300"
        onClick={handleBook}
      >
        Book
      </button>
    </div>
  );
}
