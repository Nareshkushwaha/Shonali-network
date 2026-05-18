import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import axios from "axios";
import { API_URL } from "../../config/api";

const AdminBrochures = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Abhi kaunsi file live hai (Local Storage se padh lenge for simplicity)
  const [activeBrochureName, setActiveBrochureName] = useState(localStorage.getItem("shonali_active_pdf_name") || "No file uploaded");
  const [activeBrochureLink, setActiveBrochureLink] = useState(localStorage.getItem("shonali_active_pdf_link") || "");

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const token = localStorage.getItem("shonali_token");
      const res = await axios.get(`${API_URL}/brochures/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDownloads(res.data);
    } catch (err) { console.error(err); }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF first!");
    
    setLoading(true);
    const formData = new FormData();
    formData.append("pdfFile", file);

    try {
      const token = localStorage.getItem("shonali_token");
      const res = await axios.post(`${API_URL}/brochures/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });

      // Saving status to local storage so the public website knows it's available
      localStorage.setItem("shonali_active_pdf_name", file.name);
      localStorage.setItem("shonali_active_pdf_link", res.data.fileUrl);
      
      setActiveBrochureName(file.name);
      setActiveBrochureLink(res.data.fileUrl);
      setFile(null);
      alert("✅ Brochure Uploaded & Live on Website!");
      
    } catch (err) {
      alert("❌ Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  const removeBrochure = () => {
      localStorage.removeItem("shonali_active_pdf_name");
      localStorage.removeItem("shonali_active_pdf_link");
      setActiveBrochureName("No file uploaded");
      setActiveBrochureLink("");
      alert("Brochure removed from public website!");
  }

  return (
    <AdminLayout>
      <main className="pt-8 px-6 pb-12 max-w-7xl mx-auto min-h-screen">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-8">Brochure Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Upload Section */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-sm text-slate-500 uppercase mb-4">Current Live File</h3>
              
              <div className={`p-4 rounded-xl border-2 border-dashed ${activeBrochureLink ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'} mb-6`}>
                 <p className={`font-bold ${activeBrochureLink ? 'text-green-700' : 'text-red-500'} text-sm truncate`}>
                    {activeBrochureName}
                 </p>
                 {activeBrochureLink && (
                    <button onClick={removeBrochure} className="text-xs text-red-500 mt-2 font-bold underline">Remove Access</button>
                 )}
              </div>

              <h3 className="font-bold text-sm text-slate-500 uppercase mb-2">Upload New PDF</h3>
              <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-xs p-2 border rounded-lg mb-4" />
              <button onClick={handleUpload} disabled={loading} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg text-sm hover:bg-black transition-colors">
                {loading ? "Uploading..." : "Make Live on Website"}
              </button>
            </div>
          </div>

          {/* Leads/Downloads Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                 <h3 className="font-bold text-slate-800">Download History <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">{downloads.length} Leads</span></h3>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-white text-slate-400 text-xs uppercase tracking-wider">
                     <tr>
                       <th className="p-4 border-b">Name</th>
                       <th className="p-4 border-b">Email</th>
                       <th className="p-4 border-b">Company</th>
                       <th className="p-4 border-b text-right">Date</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {downloads.map((d: any) => (
                        <tr key={d.id} className="hover:bg-slate-50">
                           <td className="p-4 font-semibold text-slate-800">{d.name}</td>
                           <td className="p-4 text-slate-500">{d.email}</td>
                           <td className="p-4 text-slate-500">{d.company}</td>
                           <td className="p-4 text-right text-slate-400 text-xs">{new Date(d.download_date).toLocaleDateString()}</td>
                        </tr>
                     ))}
                   </tbody>
                 </table>
              </div>
            </div>
          </div>
        </div>

      </main>
    </AdminLayout>
  );
};

export default AdminBrochures;