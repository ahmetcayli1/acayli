export const Step2Personal = ({ formData, updateFormData }: any) => {
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Personal Details</h2>
        <p className="text-slate-400">Tell us a bit about yourself.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">First Name</label>
          <input 
            name="firstName" 
            value={formData.firstName || ''} 
            onChange={handleChange} 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Last Name</label>
          <input 
            name="lastName" 
            value={formData.lastName || ''} 
            onChange={handleChange} 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Year of Birth</label>
          <input 
            name="birthYear" 
            type="number"
            value={formData.birthYear || ''} 
            onChange={handleChange} 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="2000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Citizenship</label>
          <input 
            name="citizenship" 
            value={formData.citizenship || ''} 
            onChange={handleChange} 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="e.g. Turkey"
          />
        </div>
      </div>
    </div>
  );
};
