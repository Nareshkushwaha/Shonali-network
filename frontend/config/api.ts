// 1. Ye check karega ki aap local machine par ho ya nahi
const isLocalhost = 
  window.location.hostname === "localhost" || 
  window.location.hostname === "127.0.0.1" || 
  window.location.hostname.startsWith("192.168.");

// 2. SMART AUTO-DETECTION LOGIC (Local, IP, aur Domain sabke liye)
export const API_URL = isLocalhost
  ? `http://${window.location.hostname}:5000/api` // 👉 लोकल लैपटॉप के लिए (Port 5000)
  : window.location.hostname.includes("shonalinetworks.com")
    ? "https://shonalinetworks.com/api"            // 👉 जब आप shonalinetworks.com डोमेन से खोलेंगे
    : "http://72.61.170.129:5000/api";             // 👉 जब आप लाइव सर्वर की IP से खोलेंगे

// F12 Console me check karne ke liye
console.log("🚀 Current API is hitting:", API_URL);

export const getAuthHeaders = () => {
  const token = localStorage.getItem("shonali_token");
  return { headers: { Authorization: `Bearer ${token}` } };
};