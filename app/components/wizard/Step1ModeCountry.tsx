import { COUNTRIES } from "@/app/config/countries";
import clsx from "clsx";

export const Step1ModeCountry = ({ formData, updateFormData }: any) => {
  const toggleCountry = (code: string) => {
    const current = formData.countries || [];
    if (current.includes(code)) {
      updateFormData({ countries: current.filter((c: string) => c !== code) });
    } else {
      updateFormData({ countries: [...current, code] });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Path & Destination</h2>
        <p className="text-slate-400">Select whether you want to pursue a Bachelor's or Master's degree and where.</p>
      </div>

      {/* Mode Selection */}
      <div className="flex justify-center">
        <div className="bg-slate-800 p-1 rounded-xl inline-flex">
          {['BACHELOR', 'MASTER'].map((mode) => (
            <button
              key={mode}
              onClick={() => updateFormData({ mode })}
              className={clsx(
                "px-8 py-3 rounded-lg font-medium transition-all",
                formData.mode === mode 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              {mode.charAt(0) + mode.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Country Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {COUNTRIES.map((country: any) => {
          const isSelected = formData.countries?.includes(country.code);
          return (
            <div
              key={country.code}
              onClick={() => !country.disabled && toggleCountry(country.code)}
              className={clsx(
                "relative p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02]",
                isSelected 
                  ? "border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(37,99,235,0.2)]" 
                  : "border-slate-700 bg-slate-800/50 hover:border-slate-500",
                country.disabled && "opacity-50 cursor-not-allowed grayscale"
              )}
            >
              {country.disabled && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/30">
                  Soon
                </div>
              )}
              <div className="text-4xl mb-4">{country.flag}</div>
              <div className="text-xl font-bold">{country.name}</div>
              <div className="text-sm text-slate-400 mt-1">{country.code}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
