const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiGet<T>(path: string): Promise<T> {
  const url = path.startsWith("/api/dashboard/") ? path : `${API_URL}${path}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GET ${path} failed with status ${res.status}`);
  }

  return res.json();
}

export async function apiPost<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`POST ${path} failed with status ${res.status}`);
  }

  return res.json();
}

export async function apiPatch<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`PATCH ${path} failed with status ${res.status}`);
  }

  return res.json();
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`DELETE ${path} failed with status ${res.status}`);
  }

  return res.json();
}