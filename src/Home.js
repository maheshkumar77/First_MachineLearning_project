import { useState, useEffect } from "react";

export default function HeartAttackPrediction() {
  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    // Simple validation
    const requiredFields = ['age', 'sex', 'cp', 'trestbps', 'chol'];
    const isEmpty = requiredFields.some(field => !formData[field]);
    
    if (isEmpty) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setError("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-300 hover:border-red-300 bg-white";

  const labelClass = "font-semibold text-gray-700 mb-1 block";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center p-4 animate-gradient">
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl w-full max-w-4xl p-8 transform transition-all duration-500 hover:shadow-3xl border border-red-100">
        {/* Header with animated heart */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className={`relative ${pulse ? 'scale-110' : 'scale-100'} transition-transform duration-700`}>
              <div className="absolute inset-0 bg-red-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <svg 
                className="w-16 h-16 text-red-500 drop-shadow-lg" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-2">
            Heart Health Analyzer
          </h1>
          <p className="text-gray-600">Enter your health metrics for AI-powered heart attack risk assessment</p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* AGE */}
          <div className="space-y-1">
            <label className={labelClass}>Age</label>
            <input
              type="number"
              name="age"
              min="1"
              max="120"
              className={inputClass}
              onChange={handleChange}
              placeholder="Enter age"
            />
            <div className="h-1 w-full bg-gradient-to-r from-gray-200 to-red-300 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-500" 
                   style={{ width: `${Math.min((formData.age/120)*100, 100)}%` }}>
              </div>
            </div>
          </div>

          {/* SEX */}
          <div className="space-y-1">
            <label className={labelClass}>Gender</label>
            <select name="sex" className={inputClass} onChange={handleChange}>
              <option value="">Select gender</option>
              <option value="1">Male</option>
              <option value="0">Female</option>
            </select>
          </div>

          {/* CHEST PAIN TYPE */}
          <div className="space-y-1">
            <label className={labelClass}>Chest Pain Type</label>
            <select name="cp" className={inputClass} onChange={handleChange}>
              <option value="">Select type</option>
              <option value="0">Typical Angina</option>
              <option value="1">Atypical Angina</option>
              <option value="2">Non-anginal Pain</option>
              <option value="3">Asymptomatic</option>
            </select>
          </div>

          {/* RESTING BP */}
          <div className="space-y-1">
            <label className={labelClass}>Resting BP (mm Hg)</label>
            <input
              type="number"
              name="trestbps"
              min="90"
              max="200"
              className={inputClass}
              onChange={handleChange}
              placeholder="90-200"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Low</span>
              <span className={formData.trestbps > 140 ? 'text-red-500 font-bold' : ''}>
                {formData.trestbps || 'Normal'}
              </span>
              <span>High</span>
            </div>
          </div>

          {/* CHOLESTEROL */}
          <div className="space-y-1">
            <label className={labelClass}>Cholesterol (mg/dl)</label>
            <input 
              type="number" 
              name="chol" 
              className={inputClass} 
              onChange={handleChange}
              placeholder="125-200"
            />
          </div>

          {/* FBS */}
          <div className="space-y-1">
            <label className={labelClass}>Fasting Blood Sugar</label>
            <select name="fbs" className={inputClass} onChange={handleChange}>
              <option value="">Select</option>
              <option value="1">High (&gt; 120 mg/dl)</option>
              <option value="0">Normal (≤ 120 mg/dl)</option>
            </select>
          </div>

          {/* REST ECG */}
          <div className="space-y-1">
            <label className={labelClass}>Resting ECG</label>
            <select name="restecg" className={inputClass} onChange={handleChange}>
              <option value="">Select result</option>
              <option value="0">Normal</option>
              <option value="1">ST-T Wave Abnormality</option>
              <option value="2">Left Ventricular Hypertrophy</option>
            </select>
          </div>

          {/* MAX HEART RATE */}
          <div className="space-y-1">
            <label className={labelClass}>Max Heart Rate</label>
            <input 
              type="number" 
              name="thalach" 
              className={inputClass} 
              onChange={handleChange}
              placeholder="70-202"
            />
            <div className={`text-sm ${formData.thalach && formData.thalach < 60 ? 'text-red-500' : 'text-green-500'}`}>
              {formData.thalach ? `${formData.thalach} BPM` : 'Normal range: 60-100 BPM'}
            </div>
          </div>

          {/* EXERCISE ANGINA */}
          <div className="space-y-1">
            <label className={labelClass}>Exercise Angina</label>
            <select name="exang" className={inputClass} onChange={handleChange}>
              <option value="">Select</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>

          {/* OLDPEAK */}
          <div className="space-y-1">
            <label className={labelClass}>ST Depression (Oldpeak)</label>
            <input 
              type="number" 
              step="0.1" 
              name="oldpeak" 
              className={inputClass} 
              onChange={handleChange}
              placeholder="0.0 - 6.2"
            />
          </div>

          {/* SLOPE */}
          <div className="space-y-1">
            <label className={labelClass}>Slope</label>
            <select name="slope" className={inputClass} onChange={handleChange}>
              <option value="">Select slope</option>
              <option value="0">Upsloping</option>
              <option value="1">Flat</option>
              <option value="2">Downsloping</option>
            </select>
          </div>

          {/* CA */}
          <div className="space-y-1">
            <label className={labelClass}>Major Vessels (0-4)</label>
            <input 
              type="number" 
              name="ca" 
              min="0" 
              max="4" 
              className={inputClass} 
              onChange={handleChange}
              placeholder="0-4"
            />
          </div>

          {/* THAL */}
          <div className="space-y-1">
            <label className={labelClass}>Thalassemia</label>
            <select name="thal" className={inputClass} onChange={handleChange}>
              <option value="">Select type</option>
              <option value="1">Normal</option>
              <option value="2">Fixed Defect</option>
              <option value="3">Reversible Defect</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full mt-2 py-4 rounded-xl font-bold text-lg transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] ${
            loading 
              ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 shadow-lg hover:shadow-xl'
          } text-white relative overflow-hidden group`}
        >
          <span className="relative z-10 flex items-center justify-center">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Heart Data...
              </>
            ) : (
              <>
                <svg className="w-6 h-6 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Check Heart Attack Risk
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </button>

        {/* Results */}
        {result && (
          <div className={`mt-6 p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 transform transition-all duration-700 animate-slideIn`}>
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-xl font-bold text-green-800">Analysis Complete</h3>
            </div>
            <div className="space-y-2">
              <div className="bg-white/70 p-4 rounded-lg border border-green-100">
                <h4 className="font-semibold text-gray-800 mb-2">Risk Assessment:</h4>
                <div className={`text-2xl font-bold ${
                  result === 'High Risk' ? 'text-red-600' : 
                  result === 'Medium Risk' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {result}
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                This is an AI-powered prediction based on the provided metrics. Please consult with a healthcare professional for accurate diagnosis.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 transform transition-all duration-500 animate-shake">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>⚠️ This tool is for informational purposes only. Always seek professional medical advice.</p>
        </div>
      </div>
    </div>
  );
}