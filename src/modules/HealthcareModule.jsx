import React, { useState } from "react";

export default function HealthcareModule({ darkMode = false }) {
  const [activeTab, setActiveTab] = useState("tools");
  const [symptom, setSymptom] = useState("");
  const [symptomResult, setSymptomResult] = useState("");
  
  const checkSymptom = () => {
    const t = symptom.toLowerCase();
    let out = [];
    if (/fever|hot|temperature/.test(t)) out.push("Possible: Viral fever, Flu. Hydrate, rest, paracetamol if needed.");
    if (/cough|cold/.test(t)) out.push("Possible: Common cold. Consider steam inhalation & warm fluids.");
    if (/headache|head/.test(t)) out.push("Possible: Tension headache. Hydration and rest recommended.");
    if (/stomach|abdomen/.test(t)) out.push("Possible: Gastritis or indigestion. Try light food and hydration.");
    if (/pain|ache/.test(t)) out.push("Pain detected. If severe or persistent, consult a doctor.");
    if (out.length === 0) out.push("No clear match. Consult a doctor if symptoms persist.");
    setSymptomResult(out.join("\n\n"));
  };

  const [bmiHeight, setBmiHeight] = useState("");
  const [bmiWeight, setBmiWeight] = useState("");
  const [bmiResult, setBmiResult] = useState("");
  
  const calcBMI = () => {
    const h = parseFloat(bmiHeight) / 100;
    const w = parseFloat(bmiWeight);
    if (!h || !w) { setBmiResult("Enter valid height and weight"); return; }
    const bmi = w / (h * h);
    let msg = "Your BMI is " + bmi.toFixed(1) + ". ";
    if (bmi < 18.5) msg += "Underweight";
    else if (bmi < 25) msg += "Normal weight";
    else if (bmi < 30) msg += "Overweight";
    else msg += "Obese";
    setBmiResult(msg);
  };

  const [waterKg, setWaterKg] = useState("");
  const [waterResult, setWaterResult] = useState("");
  
  const calcWater = () => {
    const kg = parseFloat(waterKg);
    if (!kg) { setWaterResult("Enter valid weight"); return; }
    const liters = (kg * 0.033).toFixed(2);
    setWaterResult("Recommended daily water intake: " + liters + " liters");
  };

  const [bpSys, setBpSys] = useState("");
  const [bpDia, setBpDia] = useState("");
  const [bpResult, setBpResult] = useState("");
  
  const checkBP = () => {
    const sys = parseInt(bpSys, 10);
    const dia = parseInt(bpDia, 10);
    if (!sys || !dia) { setBpResult("Enter valid BP values"); return; }
    let msg = "BP: " + sys + "/" + dia + " mmHg - ";
    if (sys < 90 || dia < 60) msg += "Low Blood Pressure";
    else if (sys <= 120 && dia <= 80) msg += "Normal";
    else if (sys <= 139 || dia <= 89) msg += "Prehypertension";
    else msg += "High Blood Pressure";
    setBpResult(msg);
  };

  const [medications, setMedications] = useState(() => {
    try { return JSON.parse(localStorage.getItem("health_meds") || "[]"); } catch { return []; }
  });
  const [medName, setMedName] = useState("");
  const [medTime, setMedTime] = useState("");
  
  const addMed = () => {
    if (!medName || !medTime) return;
    const newMed = { id: Date.now(), name: medName, time: medTime, taken: false };
    const updated = [...medications, newMed];
    setMedications(updated);
    localStorage.setItem("health_meds", JSON.stringify(updated));
    setMedName("");
    setMedTime("");
  };
  
  const removeMed = (id) => {
    const updated = medications.filter(x => x.id !== id);
    setMedications(updated);
    localStorage.setItem("health_meds", JSON.stringify(updated));
  };
  
  const toggleMed = (id) => {
    const updated = medications.map(x => x.id === id ? { ...x, taken: !x.taken } : x);
    setMedications(updated);
    localStorage.setItem("health_meds", JSON.stringify(updated));
  };

  const [prescriptions, setPrescriptions] = useState(() => {
    try { return JSON.parse(localStorage.getItem("health_prescriptions") || "[]"); } catch { return []; }
  });
  const [presName, setPresName] = useState("");
  const [presdoctor, setPresdoctor] = useState("");
  const [presDate, setPresDate] = useState("");
  
  const addPres = () => {
    if (!presName || !presdoctor) return;
    const newPres = { id: Date.now(), name: presName, doctor: presdoctor, date: presDate || new Date().toLocaleDateString() };
    const updated = [...prescriptions, newPres];
    setPrescriptions(updated);
    localStorage.setItem("health_prescriptions", JSON.stringify(updated));
    setPresName("");
    setPresdoctor("");
    setPresDate("");
  };
  
  const removePres = (id) => {
    const updated = prescriptions.filter(x => x.id !== id);
    setPrescriptions(updated);
    localStorage.setItem("health_prescriptions", JSON.stringify(updated));
  };

  const [appointments, setAppointments] = useState(() => {
    try { return JSON.parse(localStorage.getItem("health_appointments") || "[]"); } catch { return []; }
  });
  const [appDoctor, setAppDoctor] = useState("");
  const [appDate, setAppDate] = useState("");
  const [appTime, setAppTime] = useState("");
  
  const addApp = () => {
    if (!appDoctor || !appDate) return;
    const newApp = { id: Date.now(), doctor: appDoctor, date: appDate, time: appTime, status: "upcoming" };
    const updated = [...appointments, newApp];
    setAppointments(updated);
    localStorage.setItem("health_appointments", JSON.stringify(updated));
    setAppDoctor("");
    setAppDate("");
    setAppTime("");
  };
  
  const removeApp = (id) => {
    const updated = appointments.filter(x => x.id !== id);
    setAppointments(updated);
    localStorage.setItem("health_appointments", JSON.stringify(updated));
  };

  const [vaccinations, setVaccinations] = useState(() => {
    try { return JSON.parse(localStorage.getItem("health_vaccinations") || "[]"); } catch { return []; }
  });
  const [vaccName, setVaccName] = useState("");
  const [vaccDate, setVaccDate] = useState("");
  
  const addVacc = () => {
    if (!vaccName) return;
    const newVacc = { id: Date.now(), name: vaccName, date: vaccDate || new Date().toLocaleDateString() };
    const updated = [...vaccinations, newVacc];
    setVaccinations(updated);
    localStorage.setItem("health_vaccinations", JSON.stringify(updated));
    setVaccName("");
    setVaccDate("");
  };
  
  const removeVacc = (id) => {
    const updated = vaccinations.filter(x => x.id !== id);
    setVaccinations(updated);
    localStorage.setItem("health_vaccinations", JSON.stringify(updated));
  };

  const HEALTH_TIPS = [
    { icon: "💧", title: "Stay Hydrated", description: "Drink at least 8 glasses of water daily", color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { icon: "😴", title: "Sleep Well", description: "Get 7-9 hours of quality sleep", color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { icon: "🏃", title: "Stay Active", description: "Exercise for 30 minutes daily", color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
    { icon: "🥗", title: "Eat Healthy", description: "Include fruits and vegetables", color: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)" },
    { icon: "🧘", title: "Manage Stress", description: "Practice meditation daily", color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
    { icon: "🚫", title: "Avoid Smoking", description: "Say no to tobacco", color: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)" }
  ];

  return (
    <div style={{ background: darkMode ? "linear-gradient(135deg, #0f172015 0%, #151a3315 100%)" : "linear-gradient(135deg, #4facfe15 0%, #00f2fe15 100%)", borderRadius: "12px", padding: "clamp(0.75rem, 2vw, 1rem)", height: "100%", overflowY: "auto" }}>
      <div className="mb-4">
        <h3 className="fw-bold mb-1" style={{ color: darkMode ? '#e8f0ff' : '#333', fontSize: 'clamp(1.1rem, 3vw, 1.5rem)' }}>Healthcare Hub</h3>
        <p className="text-muted small" style={{ color: darkMode ? '#a8afc7' : '#666', fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)' }}>Monitor health and manage medications</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(clamp(100px, 22vw, 140px), 1fr))", gap: "clamp(0.75rem, 2vw, 1rem)", marginBottom: "1.5rem" }}>
        <div style={{ background: darkMode ? "#1f2d42" : "white", padding: "clamp(0.75rem, 1.5vw, 1rem)", borderRadius: "12px", boxShadow: darkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)", fontWeight: "bold", color: "#4facfe" }}>{medications.length}</div>
          <div style={{ fontSize: "clamp(0.75rem, 1.2vw, 0.85rem)", color: darkMode ? '#a8afc7' : "#666" }}>Medications</div>
        </div>
        <div style={{ background: darkMode ? "#1f2d42" : "white", padding: "clamp(0.75rem, 1.5vw, 1rem)", borderRadius: "12px", boxShadow: darkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)", fontWeight: "bold", color: "#667eea" }}>{prescriptions.length}</div>
          <div style={{ fontSize: "clamp(0.75rem, 1.2vw, 0.85rem)", color: darkMode ? '#a8afc7' : "#666" }}>Prescriptions</div>
        </div>
        <div style={{ background: darkMode ? "#1f2d42" : "white", padding: "clamp(0.75rem, 1.5vw, 1rem)", borderRadius: "12px", boxShadow: darkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)", fontWeight: "bold", color: "#fa709a" }}>{appointments.length}</div>
          <div style={{ fontSize: "clamp(0.75rem, 1.2vw, 0.85rem)", color: darkMode ? '#a8afc7' : "#666" }}>Appointments</div>
        </div>
        <div style={{ background: darkMode ? "#1f2d42" : "white", padding: "clamp(0.75rem, 1.5vw, 1rem)", borderRadius: "12px", boxShadow: darkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)", fontWeight: "bold", color: "#f59e0b" }}>{vaccinations.length}</div>
          <div style={{ fontSize: "clamp(0.75rem, 1.2vw, 0.85rem)", color: darkMode ? '#a8afc7' : "#666" }}>Vaccines</div>
        </div>
      </div>

      <div className="d-flex gap-2 mb-4" style={{ borderBottom: `2px solid ${darkMode ? '#1f2d42' : '#e5e7eb'}`, paddingBottom: "1rem", flexWrap: "wrap" }}>
        {["tools", "medications", "prescriptions", "appointments", "vaccinations", "tips"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? "linear-gradient(135deg, #4facfe, #00f2fe)" : "transparent",
              color: activeTab === tab ? "white" : (darkMode ? '#a8afc7' : "#666"),
              border: activeTab === tab ? "none" : `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`,
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: activeTab === tab ? "600" : "500",
              whiteSpace: "nowrap"
            }}
          >
            {tab === "tools" && "Tools"}
            {tab === "medications" && "Meds"}
            {tab === "prescriptions" && "Rx"}
            {tab === "appointments" && "Appts"}
            {tab === "vaccinations" && "Vacc"}
            {tab === "tips" && "Tips"}
          </button>
        ))}
      </div>

      {activeTab === "tools" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(150px, 45vw, 280px), 1fr))", gap: "clamp(1rem, 2vw, 1.5rem)" }}>
          <div style={{ background: darkMode ? "#1f2d42" : "white", padding: "1.5rem", borderRadius: "12px" }}>
            <h6 style={{ fontWeight: "bold", marginBottom: "1rem", color: darkMode ? '#e8f0ff' : '#333' }}>BMI Calculator</h6>
            <input type="text" placeholder="Height (cm)" value={bmiHeight} onChange={(e) => setBmiHeight(e.target.value)} style={{ width: "100%", padding: "0.75rem", marginBottom: "0.75rem", border: `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, borderRadius: "6px", background: darkMode ? '#0a0e27' : '#fff', color: darkMode ? '#e8f0ff' : '#000' }} />
            <input type="text" placeholder="Weight (kg)" value={bmiWeight} onChange={(e) => setBmiWeight(e.target.value)} style={{ width: "100%", padding: "0.75rem", marginBottom: "0.75rem", border: `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, borderRadius: "6px", background: darkMode ? '#0a0e27' : '#fff', color: darkMode ? '#e8f0ff' : '#000' }} />
            <button onClick={calcBMI} style={{ width: "100%", padding: "0.75rem", background: "linear-gradient(135deg, #4facfe, #00f2fe)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Calculate</button>
            {bmiResult && <div style={{ marginTop: "1rem", padding: "0.75rem", background: darkMode ? "rgba(79, 172, 254, 0.1)" : "#e0f7ff", borderRadius: "6px", fontSize: "0.9rem", color: darkMode ? '#a8afc7' : '#333' }}>{bmiResult}</div>}
          </div>

          <div style={{ background: darkMode ? "#1f2d42" : "white", padding: "1.5rem", borderRadius: "12px" }}>
            <h6 style={{ fontWeight: "bold", marginBottom: "1rem", color: darkMode ? '#e8f0ff' : '#333' }}>Water Intake</h6>
            <input type="text" placeholder="Your weight (kg)" value={waterKg} onChange={(e) => setWaterKg(e.target.value)} style={{ width: "100%", padding: "0.75rem", marginBottom: "0.75rem", border: `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, borderRadius: "6px", background: darkMode ? '#0a0e27' : '#fff', color: darkMode ? '#e8f0ff' : '#000' }} />
            <button onClick={calcWater} style={{ width: "100%", padding: "0.75rem", background: "linear-gradient(135deg, #4facfe, #00f2fe)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Calculate</button>
            {waterResult && <div style={{ marginTop: "1rem", padding: "0.75rem", background: darkMode ? "rgba(79, 172, 254, 0.1)" : "#e0f7ff", borderRadius: "6px", fontSize: "0.9rem", color: darkMode ? '#a8afc7' : '#333' }}>{waterResult}</div>}
          </div>

          <div style={{ background: darkMode ? "#1f2d42" : "white", padding: "1.5rem", borderRadius: "12px" }}>
            <h6 style={{ fontWeight: "bold", marginBottom: "1rem", color: darkMode ? '#e8f0ff' : '#333' }}>Blood Pressure</h6>
            <input type="text" placeholder="Systolic (mmHg)" value={bpSys} onChange={(e) => setBpSys(e.target.value)} style={{ width: "100%", padding: "0.75rem", marginBottom: "0.75rem", border: `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, borderRadius: "6px", background: darkMode ? '#0a0e27' : '#fff', color: darkMode ? '#e8f0ff' : '#000' }} />
            <input type="text" placeholder="Diastolic (mmHg)" value={bpDia} onChange={(e) => setBpDia(e.target.value)} style={{ width: "100%", padding: "0.75rem", marginBottom: "0.75rem", border: `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, borderRadius: "6px", background: darkMode ? '#0a0e27' : '#fff', color: darkMode ? '#e8f0ff' : '#000' }} />
            <button onClick={checkBP} style={{ width: "100%", padding: "0.75rem", background: "linear-gradient(135deg, #4facfe, #00f2fe)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Check</button>
            {bpResult && <div style={{ marginTop: "1rem", padding: "0.75rem", background: darkMode ? "rgba(79, 172, 254, 0.1)" : "#e0f7ff", borderRadius: "6px", fontSize: "0.9rem", color: darkMode ? '#a8afc7' : '#333' }}>{bpResult}</div>}
          </div>

          <div style={{ background: darkMode ? "#1f2d42" : "white", padding: "1.5rem", borderRadius: "12px" }}>
            <h6 style={{ fontWeight: "bold", marginBottom: "1rem", color: darkMode ? '#e8f0ff' : '#333' }}>Symptom Checker</h6>
            <textarea placeholder="Describe symptoms..." value={symptom} onChange={(e) => setSymptom(e.target.value)} style={{ width: "100%", padding: "0.75rem", marginBottom: "0.75rem", border: `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, borderRadius: "6px", minHeight: "80px", background: darkMode ? '#0a0e27' : '#fff', color: darkMode ? '#e8f0ff' : '#000' }} />
            <button onClick={checkSymptom} style={{ width: "100%", padding: "0.75rem", background: "linear-gradient(135deg, #4facfe, #00f2fe)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Analyze</button>
            {symptomResult && <div style={{ marginTop: "1rem", padding: "0.75rem", background: darkMode ? "rgba(79, 172, 254, 0.1)" : "#e0f7ff", borderRadius: "6px", fontSize: "0.9rem", whiteSpace: "pre-line", color: darkMode ? '#a8afc7' : '#333' }}>{symptomResult}</div>}
          </div>
        </div>
      )}

      {activeTab === "medications" && (
        <div>
          <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem" }}>
            <input type="text" placeholder="Medicine..." value={medName} onChange={(e) => setMedName(e.target.value)} style={{ flex: 1, padding: "0.75rem", border: `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, borderRadius: "6px", background: darkMode ? '#0a0e27' : '#fff', color: darkMode ? '#e8f0ff' : '#000' }} />
            <input type="time" value={medTime} onChange={(e) => setMedTime(e.target.value)} style={{ padding: "0.75rem", border: `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, borderRadius: "6px", background: darkMode ? '#0a0e27' : '#fff', color: darkMode ? '#e8f0ff' : '#000' }} />
            <button onClick={addMed} style={{ padding: "0.75rem 1.5rem", background: "#4facfe", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Add</button>
          </div>
          {medications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: darkMode ? '#6b7280' : "#999" }}>No medications tracked</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {medications.map(med => (
                <div key={med.id} style={{ background: darkMode ? "#1f2d42" : "white", padding: "1rem", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: "bold", color: darkMode ? '#e8f0ff' : '#333' }}>{med.name}</div>
                    <div style={{ fontSize: "0.85rem", color: darkMode ? '#a8afc7' : "#666" }}>{med.time}</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => toggleMed(med.id)} style={{ padding: "0.4rem 0.8rem", background: med.taken ? "#10b981" : (darkMode ? '#2a3f5f' : '#f3f4f6'), color: med.taken ? "white" : (darkMode ? '#a8afc7' : '#666'), border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}>{med.taken ? "Done" : "Pending"}</button>
                    <button onClick={() => removeMed(med.id)} style={{ padding: "0.4rem 0.8rem", background: "#ffe5e5", border: "none", borderRadius: "4px", cursor: "pointer", color: "#ef4444" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "prescriptions" && (
        <div>
          <div style={{ marginBottom: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "0.5rem" }}>
            <input type="text" placeholder="Medicine..." value={presName} onChange={(e) => setPresName(e.target.value)} style={{ padding: "0.75rem", border: `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, borderRadius: "6px", background: darkMode ? '#0a0e27' : '#fff', color: darkMode ? '#e8f0ff' : '#000' }} />
            <input type="text" placeholder="Doctor..." value={presdoctor} onChange={(e) => setPresdoctor(e.target.value)} style={{ padding: "0.75rem", border: `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, borderRadius: "6px", background: darkMode ? '#0a0e27' : '#fff', color: darkMode ? '#e8f0ff' : '#000' }} />
            <input type="date" value={presDate} onChange={(e) => setPresDate(e.target.value)} style={{ padding: "0.75rem", border: `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, borderRadius: "6px", background: darkMode ? '#0a0e27' : '#fff', color: darkMode ? '#e8f0ff' : '#000' }} />
            <button onClick={addPres} style={{ padding: "0.75rem", background: "#4facfe", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Add</button>
          </div>
          {prescriptions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: darkMode ? '#6b7280' : "#999" }}>No prescriptions</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
              {prescriptions.map(pres => (
                <div key={pres.id} style={{ background: darkMode ? '#1f2d42' : "white", padding: "1rem", borderRadius: "6px" }}>
                  <div style={{ fontWeight: "bold", color: darkMode ? '#e8f0ff' : '#333' }}>{pres.name}</div>
                  <div style={{ fontSize: "0.85rem", color: darkMode ? '#a8afc7' : "#666" }}>Dr. {pres.doctor}</div>
                  <div style={{ fontSize: "0.85rem", color: darkMode ? '#6b7280' : "#999", marginBottom: "1rem" }}>{pres.date}</div>
                  <button onClick={() => removePres(pres.id)} style={{ width: "100%", padding: "0.6rem", background: "#ffe5e5", border: "none", borderRadius: "4px", cursor: "pointer", color: "#ef4444" }}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "appointments" && (
        <div>
          <div style={{ marginBottom: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "0.5rem" }}>
            <input type="text" placeholder="Doctor..." value={appDoctor} onChange={(e) => setAppDoctor(e.target.value)} style={{ padding: "0.75rem", border: `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, borderRadius: "6px", background: darkMode ? '#0a0e27' : '#fff', color: darkMode ? '#e8f0ff' : '#000' }} />
            <input type="date" value={appDate} onChange={(e) => setAppDate(e.target.value)} style={{ padding: "0.75rem", border: `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, borderRadius: "6px", background: darkMode ? '#0a0e27' : '#fff', color: darkMode ? '#e8f0ff' : '#000' }} />
            <input type="time" value={appTime} onChange={(e) => setAppTime(e.target.value)} style={{ padding: "0.75rem", border: `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, borderRadius: "6px", background: darkMode ? '#0a0e27' : '#fff', color: darkMode ? '#e8f0ff' : '#000' }} />
            <button onClick={addApp} style={{ padding: "0.75rem", background: "#4facfe", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Add</button>
          </div>
          {appointments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: darkMode ? '#6b7280' : "#999" }}>No appointments</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
              {appointments.map(app => (
                <div key={app.id} style={{ background: darkMode ? '#1f2d42' : "white", padding: "1rem", borderRadius: "6px" }}>
                  <div style={{ fontWeight: "bold", color: darkMode ? '#e8f0ff' : '#333' }}>Dr. {app.doctor}</div>
                  <div style={{ fontSize: "0.85rem", color: darkMode ? '#a8afc7' : "#666" }}>{app.date} {app.time}</div>
                  <div style={{ fontSize: "0.8rem", color: darkMode ? '#6b7280' : "#999", marginBottom: "1rem" }}>{app.status}</div>
                  <button onClick={() => removeApp(app.id)} style={{ width: "100%", padding: "0.6rem", background: "#ffe5e5", border: "none", borderRadius: "4px", cursor: "pointer", color: "#ef4444" }}>Cancel</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "vaccinations" && (
        <div>
          <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem" }}>
            <input type="text" placeholder="Vaccine..." value={vaccName} onChange={(e) => setVaccName(e.target.value)} style={{ flex: 1, padding: "0.75rem", border: `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, borderRadius: "6px", background: darkMode ? '#0a0e27' : '#fff', color: darkMode ? '#e8f0ff' : '#000' }} />
            <input type="date" value={vaccDate} onChange={(e) => setVaccDate(e.target.value)} style={{ padding: "0.75rem", border: `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, borderRadius: "6px", background: darkMode ? '#0a0e27' : '#fff', color: darkMode ? '#e8f0ff' : '#000' }} />
            <button onClick={addVacc} style={{ padding: "0.75rem 1.5rem", background: "#4facfe", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Add</button>
          </div>
          {vaccinations.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: darkMode ? '#6b7280' : "#999" }}>No vaccinations</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {vaccinations.map(vacc => (
                <div key={vacc.id} style={{ background: darkMode ? '#1f2d42' : "white", padding: "1rem", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: "bold", color: darkMode ? '#e8f0ff' : '#333' }}>{vacc.name}</div>
                    <div style={{ fontSize: "0.85rem", color: darkMode ? '#a8afc7' : "#666" }}>{vacc.date}</div>
                  </div>
                  <button onClick={() => removeVacc(vacc.id)} style={{ padding: "0.4rem 0.8rem", background: "#ffe5e5", border: "none", borderRadius: "4px", cursor: "pointer", color: "#ef4444" }}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "tips" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
          {HEALTH_TIPS.map((tip, idx) => (
            <div key={idx} style={{ background: darkMode ? '#1f2d42' : "white", padding: "1.5rem", borderRadius: "12px", borderLeft: "4px solid #4facfe" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{tip.icon}</div>
              <h6 style={{ fontWeight: "bold", marginBottom: "0.5rem", color: darkMode ? '#e8f0ff' : '#333' }}>{tip.title}</h6>
              <p style={{ fontSize: "0.85rem", color: darkMode ? '#a8afc7' : "#666", marginBottom: 0 }}>{tip.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
