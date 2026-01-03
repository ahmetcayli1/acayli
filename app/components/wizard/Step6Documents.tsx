import { useState } from "react";

export const Step6Documents = ({ formData, updateFormData }: any) => {
  const [uploading, setUploading] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    setUploading(true);
    
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/documents/parse", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      
      if (data.suggestions) {
        setSuggestions(data.suggestions);
        // Auto-fill form data if needed, or just show suggestions
        if (data.suggestions.gpa) {
            updateFormData({ gpa: data.suggestions.gpa });
        }
      }
      
      updateFormData({ 
        documents: { 
            ...formData.documents, 
            [e.target.name]: { name: file.name, parsed: true } 
        } 
      });

    } catch (err) {
      console.error(err);
      alert("Failed to parse document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Upload Documents</h2>
        <p className="text-slate-400">Upload your CV and Transcript to auto-fill your profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 border-dashed">
            <h3 className="font-semibold mb-4">CV / Resume</h3>
            <input 
                type="file" 
                name="cv"
                onChange={handleFileChange}
                accept=".pdf"
                className="block w-full text-sm text-slate-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-500/10 file:text-blue-400
                  hover:file:bg-blue-500/20"
            />
             {formData.documents?.cv?.parsed && <p className="text-green-400 text-sm mt-2">✓ Parsed successfully</p>}
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 border-dashed">
            <h3 className="font-semibold mb-4">Transcript</h3>
            <input 
                type="file" 
                name="transcript"
                onChange={handleFileChange}
                accept=".pdf"
                className="block w-full text-sm text-slate-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-500/10 file:text-blue-400
                  hover:file:bg-blue-500/20"
            />
             {formData.documents?.transcript?.parsed && <p className="text-green-400 text-sm mt-2">✓ Parsed successfully</p>}
        </div>
      </div>

      {suggestions && (
        <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
            <h4 className="text-blue-300 font-semibold mb-2">AI Suggestions found:</h4>
            <pre className="text-xs text-slate-300">{JSON.stringify(suggestions, null, 2)}</pre>
        </div>
      )}

      {uploading && <div className="text-center text-blue-400 animate-pulse">Analyzing documents...</div>}
    </div>
  );
};
