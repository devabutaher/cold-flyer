export async function loginUser(email, password) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Login failed");
  return data;
}

export async function registerUser(name, email, password, phone) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone }),
    credentials: "include",
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Registration failed");
  return data;
}

export async function googleAuth(idToken) {
  const res = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    credentials: "include",
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Google sign-in failed");
  return data;
}
