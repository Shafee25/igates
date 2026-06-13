const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getUrl(path: string) {
  // If API_URL is "/api" and path already starts with "/api", avoid duplication
  if (API_URL === "/api" && path.startsWith("/api")) {
    return path;
  }
  return `${API_URL}${path}`;
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = getUrl(path);

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GET ${path} failed with status ${res.status}`);
  }

  return res.json();
}

export async function apiPost<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(getUrl(path), {
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
  const res = await fetch(getUrl(path), {
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
  const res = await fetch(getUrl(path), {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`DELETE ${path} failed with status ${res.status}`);
  }

  return res.json();
}