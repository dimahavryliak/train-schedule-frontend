export interface LoginResponse {
  access_token?: string;
  message?: string;
  username?: string;
  userId?: number;
}

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(
    "https://web-production-a1584.up.railway.app/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to log in");
  }

  return response.json();
}

export interface RegisterResponse {
  id: any;
  message?: string;
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

export async function fetchUserTrips(userId: number): Promise<number[]> {
  const response = await fetch(
    `https://web-production-a1584.up.railway.app/auth/trips/${userId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user trips");
  }
  const data = await response.json();
  return data.trips;
}

export async function removeTrip(
  userId: number,
  trainId: number
): Promise<void> {
  const response = await fetch(
    "https://web-production-a1584.up.railway.app/auth/remove-trip",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, trainId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove trip");
  }
}
