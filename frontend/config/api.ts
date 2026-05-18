// Ye check karega ki localhost, 127.0.0.1, ya 192.168.x.x (Local WiFi IP) hai ya nahi
const isLocalhost = 
  window.location.hostname === "localhost" || 
  window.location.hostname === "127.0.0.1" || 
  window.location.hostname.startsWith("192.168.");

// Agar local hai, toh port 5000 ko hit karega, warna Shonali Network ki live API
export const API_URL = isLocalhost 
  ? `http://${window.location.hostname}:5000/api` 
  : "https://shonalinetworks.com/api";

// 🔥 Ye line F12 Console mein sach bata degi
console.log("🚀 Current API is hitting:", API_URL);

export const getAuthHeaders = () => {
  const token = localStorage.getItem("shonali_token");
  return { headers: { Authorization: `Bearer ${token}` } };
};