"use client";
import { useState } from "react";

export default function GenerateForm({ onGenerate }: { onGenerate: any }) {
  const [formData, setFormData] = useState({
    title: "", 
    location: "", 
    employment: "Full-time", 
    must: "", 
    nice: "", 
    tone: "Professional"
  });
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handlePrint = () => {
    const printContent = document.getElementById("jd-output-content");
    const win = window.open("", "", "height=700,width=900");
    win?.document.write(`<html><head><title>${formData.title} JD</title>`);
    win?.document.write(`<style>body{font-family:sans-serif;padding:40px;line-height:1.6;} h1{color:#1a1a1a; border-bottom: 2px solid #eee; padding-bottom: 10px;}</style></head><body>`);
    win?.document.write(`<h1>Job Description: ${formData.title}</h1>`);
    win?.document.write(printContent?.innerHTML || "");
    win?.document.write(`</body></html>`);
    win?.document.close();
    win?.print();
  };

  const handleSubmit = async () => {
    if (!formData.title) return alert("Please enter a job title");
    setLoading(true);
    try {
      const res = await onGenerate({
        ...formData,
        must: formData.must.split("\n").filter(Boolean),
        nice: formData.nice.split("\n").filter(Boolean)
      });
      if (res.error) alert("You've reached your free limit. Upgrade to Pro!");
      else setOutput(res);
    } catch (err) {
      alert("Error generating JD. Check your OpenAI Key.");
    }
    setLoading(false);
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      {/* Left Side: Input Form */}
      <div className="lg:col-span-2 space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Brand Tone</label>
          <select 
            className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            value={formData.tone} 
            onChange={e => setFormData({...formData, tone: e.target.value})}
          >
            <option>Professional</option>
            <option>Casual & Scrappy</option>
            <option>Executive</option>
            <option>Inclusive & Warm</option>
          </select>
        </div>

        <input 
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" 
          placeholder="Role Title (e.g. Senior Software Engineer)" 
          onChange={e => setFormData({...formData, title: e.target.value})} 
        />
        
        <input 
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" 
          placeholder="Location" 
          onChange={e => setFormData({...formData, location: e.target.value})} 
        />

        <textarea 
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm h-32" 
          placeholder="Must-haves (One per line...)" 
          onChange={e => setFormData({...formData, must: e.target.value})} 
        />

        <button 
          onClick={handleSubmit} 
          disabled={loading} 
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-100"
        >
          {loading ? "AI is writing..." : "Generate Job Description"}
        </button>
      </div>

      {/* Right Side: AI Output */}
      <div className="lg:col-span-3 bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preview</span>
          {output && (
            <button onClick={handlePrint} className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-md text-blue-600 font-semibold hover:bg-slate-50 transition">
              Download PDF
            </button>
          )}
        </div>
        <div id="jd-output-content" className="whitespace-pre-wrap text-sm text-slate-700 h-[450px] overflow-auto leading-relaxed">
          {output || <div className="text-slate-400 italic mt-20 text-center">Your generated JD will appear here...</div>}
        </div>
      </div>
    </div>
  );
}