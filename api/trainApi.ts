export interface Train {
  id: number;
  name: string;
  departure: string;
  arrival: string;
  date: string;
}

export async function fetchTrains(): Promise<Train[]> {
  const response = await fetch(
    "https://web-production-a1584.up.railway.app/train"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch trains");
  }
  return response.json();
}
