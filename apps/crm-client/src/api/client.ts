import { getAuth } from 'firebase/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  // Get Token from Firebase Client SDK
  const auth = getAuth();
  const user = auth.currentUser;
  let token = '';

  if (user) {
    token = await user.getIdToken();
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
}
