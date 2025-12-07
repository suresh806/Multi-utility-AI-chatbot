import React, { useState, useEffect } from "react";

export default function EducationModule({ darkMode = false }) {
  const QUIZZES = [
    { id: 1, title: "General Knowledge", questions: 20, time: 15, difficulty: "Medium", category: "GK", questions_array: [
      { q: "What is the capital of France?", opts: ["Paris", "London", "Berlin", "Madrid"], ans: "Paris" },
      { q: "Who wrote Hamlet?", opts: ["Shakespeare", "Dickens", "Hemingway", "Austen"], ans: "Shakespeare" },
      { q: "Which is the largest planet?", opts: ["Saturn", "Jupiter", "Neptune", "Uranus"], ans: "Jupiter" },
      { q: "Who was the first President of USA?", opts: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"], ans: "George Washington" },
      { q: "What is the smallest country?", opts: ["Monaco", "Vatican City", "Liechtenstein", "San Marino"], ans: "Vatican City" },
      { q: "Which river is the longest?", opts: ["Amazon", "Nile", "Yangtze", "Mississippi"], ans: "Nile" },
      { q: "What is the hardest natural substance?", opts: ["Gold", "Iron", "Diamond", "Platinum"], ans: "Diamond" },
      { q: "Who invented the telephone?", opts: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"], ans: "Alexander Graham Bell" },
      { q: "What is the capital of Japan?", opts: ["Osaka", "Tokyo", "Kyoto", "Yokohama"], ans: "Tokyo" },
      { q: "Which continent is the largest?", opts: ["Africa", "Europe", "Asia", "North America"], ans: "Asia" },
      { q: "Who painted the Mona Lisa?", opts: ["Vincent Van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], ans: "Leonardo da Vinci" },
      { q: "What is the speed of light?", opts: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "100,000 km/s"], ans: "300,000 km/s" },
      { q: "Which element has symbol Au?", opts: ["Silver", "Gold", "Aluminum", "Argon"], ans: "Gold" },
      { q: "How many strings does a violin have?", opts: ["4", "6", "8", "5"], ans: "4" },
      { q: "What is the capital of Australia?", opts: ["Sydney", "Melbourne", "Canberra", "Brisbane"], ans: "Canberra" },
      { q: "Who wrote Pride and Prejudice?", opts: ["Charlotte Bronte", "Jane Austen", "Emily Bronte", "George Eliot"], ans: "Jane Austen" },
      { q: "What is the Great Wall of China made of?", opts: ["Wood", "Brick and Stone", "Metal", "Concrete"], ans: "Brick and Stone" },
      { q: "Which is the deepest ocean?", opts: ["Atlantic", "Indian", "Arctic", "Pacific"], ans: "Pacific" },
      { q: "How many sides does a hexagon have?", opts: ["5", "6", "7", "8"], ans: "6" },
      { q: "What is the chemical symbol for Gold?", opts: ["Go", "Gd", "Au", "Ag"], ans: "Au" }
    ]},
    { id: 2, title: "Math Skills", questions: 15, time: 10, difficulty: "Easy", category: "Math", questions_array: [
      { q: "What is 5 + 3?", opts: ["5", "8", "10", "15"], ans: "8" },
      { q: "What is 12 x 2?", opts: ["12", "24", "36", "48"], ans: "24" },
      { q: "What is 100 ÷ 5?", opts: ["10", "15", "20", "25"], ans: "20" },
      { q: "What is 7 × 8?", opts: ["54", "56", "58", "60"], ans: "56" },
      { q: "What is 9 + 6?", opts: ["14", "15", "16", "17"], ans: "15" },
      { q: "What is 50 - 12?", opts: ["35", "36", "37", "38"], ans: "38" },
      { q: "What is 15 ÷ 3?", opts: ["4", "5", "6", "7"], ans: "5" },
      { q: "What is 6 × 9?", opts: ["48", "52", "54", "56"], ans: "54" },
      { q: "What is 25 + 25?", opts: ["45", "48", "50", "52"], ans: "50" },
      { q: "What is 100 - 35?", opts: ["60", "62", "65", "68"], ans: "65" },
      { q: "What is 8 × 7?", opts: ["54", "55", "56", "57"], ans: "56" },
      { q: "What is 144 ÷ 12?", opts: ["10", "11", "12", "13"], ans: "12" },
      { q: "What is 20 + 30?", opts: ["45", "48", "50", "55"], ans: "50" },
      { q: "What is 99 - 50?", opts: ["45", "47", "49", "51"], ans: "49" },
      { q: "What is 11 × 5?", opts: ["50", "52", "54", "55"], ans: "55" }
    ]},
    { id: 3, title: "Science", questions: 20, time: 20, difficulty: "Hard", category: "Science", questions_array: [
      { q: "What is the chemical formula for water?", opts: ["H2O", "CO2", "O2", "NH3"], ans: "H2O" },
      { q: "Which planet is closest to the Sun?", opts: ["Venus", "Mercury", "Earth", "Mars"], ans: "Mercury" },
      { q: "What is the powerhouse of the cell?", opts: ["Nucleus", "Mitochondria", "Chloroplast", "Ribosome"], ans: "Mitochondria" },
      { q: "What is the speed of sound?", opts: ["343 m/s", "200 m/s", "500 m/s", "100 m/s"], ans: "343 m/s" },
      { q: "Which gas do plants absorb?", opts: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], ans: "Carbon Dioxide" },
      { q: "What is the atomic number of Carbon?", opts: ["4", "6", "8", "10"], ans: "6" },
      { q: "What is the boiling point of water?", opts: ["50°C", "75°C", "100°C", "125°C"], ans: "100°C" },
      { q: "Which organelle makes proteins?", opts: ["Ribosome", "Mitochondria", "Golgi", "ER"], ans: "Ribosome" },
      { q: "What is the charge of an electron?", opts: ["Positive", "Negative", "Neutral", "Mixed"], ans: "Negative" },
      { q: "How many bones are in the human body?", opts: ["186", "206", "226", "246"], ans: "206" },
      { q: "What is the largest organ in the body?", opts: ["Heart", "Brain", "Skin", "Liver"], ans: "Skin" },
      { q: "What is the chemical symbol for Oxygen?", opts: ["Ox", "O", "O2", "Og"], ans: "O" },
      { q: "What percentage of air is Nitrogen?", opts: ["21%", "50%", "78%", "99%"], ans: "78%" },
      { q: "Which process converts glucose to energy?", opts: ["Photosynthesis", "Respiration", "Fermentation", "Oxidation"], ans: "Respiration" },
      { q: "What is the SI unit of force?", opts: ["Joule", "Newton", "Watt", "Pascal"], ans: "Newton" },
      { q: "What does DNA stand for?", opts: ["Deoxyribonucleic Acid", "Dynamic Nucleic Acid", "Digital Nucleic Acid", "Deoxy Nuclear Acid"], ans: "Deoxyribonucleic Acid" },
      { q: "What is the normal body temperature?", opts: ["35.5°C", "36.5°C", "37.5°C", "38.5°C"], ans: "37.5°C" },
      { q: "How many chambers does a human heart have?", opts: ["2", "3", "4", "5"], ans: "4" },
      { q: "What is the speed of Earth's rotation?", opts: ["100 km/h", "500 km/h", "1000 km/h", "1670 km/h"], ans: "1670 km/h" },
      { q: "Which layer of atmosphere do we live in?", opts: ["Stratosphere", "Troposphere", "Mesosphere", "Thermosphere"], ans: "Troposphere" }
    ]}
  ];

  const TOOLS = [
    { id: 1, name: "Word Counter", icon: "📝", desc: "Count words & characters" },
    { id: 2, name: "Grade Calc", icon: "📊", desc: "Calculate GPA/Marks" },
    { id: 3, name: "Time Manager", icon: "⏱️", desc: "Study time tracker" }
  ];

  const [mode, setMode] = useState("home");
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizProgress, setQuizProgress] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTime, setQuizTime] = useState(0);
  const [toolMode, setToolMode] = useState(null);
  const [wordText, setWordText] = useState("");
  const [gradeInput, setGradeInput] = useState("");
  const [studyTime, setStudyTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [summarizeText, setSummarizeText] = useState("");
  const [importantPoints, setImportantPoints] = useState([]);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setStudyTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (currentQuiz && !quizFinished) {
      const interval = setInterval(() => setQuizTime(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [currentQuiz, quizFinished]);

  const handleAnswer = (answer) => {
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);
    
    if (answer === currentQuiz.questions_array[quizProgress].ans) {
      setQuizScore(s => s + 1);
    }

    if (quizProgress < currentQuiz.questions_array.length - 1) {
      setQuizProgress(quizProgress + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setQuizProgress(0);
    setUserAnswers([]);
    setQuizFinished(false);
    setQuizScore(0);
    setQuizTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const extractImportantPoints = (text) => {
    if (!text.trim()) return [];
    
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const importantKeywords = ["important", "key", "significant", "must", "should", "critical", "essential", "mainly", "therefore", "however", "because", "thus", "consequently", "finally"];
    
    const scoredSentences = sentences.map(sent => {
      const trimmed = sent.trim();
      let score = 0;
      let wordCount = trimmed.split(/\s+/).length;
      
      importantKeywords.forEach(keyword => {
        if (trimmed.toLowerCase().includes(keyword)) score += 2;
      });
      
      if (wordCount >= 8 && wordCount <= 25) score += 1;
      if (sentences.indexOf(sent) === 0 || sentences.indexOf(sent) === sentences.length - 1) score += 1;
      
      return { text: trimmed, score };
    });
    
    const topPoints = scoredSentences.sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.text);
    
    return topPoints;
  };

  return (
    <div style={{ background: darkMode ? "linear-gradient(135deg, #0f172015 0%, #151a3315 100%)" : "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)", borderRadius: "12px", padding: "1.5rem", height: "100%", overflowY: "auto" }}>
      {mode === "home" && (
        <div>
          <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem", color: darkMode ? "#e8f0ff" : "#333" }}>📚 Education Hub</h3>
          <p style={{ color: darkMode ? "#a8afc7" : "#666", marginBottom: "2rem", fontSize: "0.9rem" }}>Master your skills with professional quizzes, summaries & tools</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
            <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)", cursor: "pointer", textAlign: "center", transition: "transform 0.2s" }} onClick={() => setMode("quizzes")} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎯</div>
              <h5 style={{ fontWeight: "bold", marginBottom: "0.3rem" }}>Quizzes</h5>
              <p style={{ fontSize: "0.85rem", opacity: "0.9" }}>Test your knowledge</p>
            </div>

            <div style={{ background: "linear-gradient(135deg, #f5a623, #f78c3d)", color: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 16px rgba(245, 166, 35, 0.3)", cursor: "pointer", textAlign: "center", transition: "transform 0.2s" }} onClick={() => setMode("summarizer")} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📋</div>
              <h5 style={{ fontWeight: "bold", marginBottom: "0.3rem" }}>Summarizer</h5>
              <p style={{ fontSize: "0.85rem", opacity: "0.9" }}>Quick summaries & notes</p>
            </div>

            <div style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)", cursor: "pointer", textAlign: "center", transition: "transform 0.2s" }} onClick={() => setMode("tools")} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🛠️</div>
              <h5 style={{ fontWeight: "bold", marginBottom: "0.3rem" }}>Tools</h5>
              <p style={{ fontSize: "0.85rem", opacity: "0.9" }}>Useful utilities</p>
            </div>
          </div>
        </div>
      )}

      {mode === "quizzes" && (
        <div>
          <button onClick={() => { setMode("home"); resetQuiz(); }} style={{ marginBottom: "1.5rem", padding: "0.6rem 1.2rem", background: darkMode ? "#1f2d42" : "#e5e7eb", border: `1px solid ${darkMode ? "#2a3f5f" : "transparent"}`, borderRadius: "8px", cursor: "pointer", fontWeight: "600", color: darkMode ? "#e8f0ff" : "#333" }}>← Back Home</button>

          {!currentQuiz ? (
            <div>
              <h4 style={{ fontWeight: "bold", marginBottom: "1.5rem", color: darkMode ? "#e8f0ff" : "#333" }}>Available Quizzes</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
                {QUIZZES.map(q => (
                  <div key={q.id} style={{ background: darkMode ? "#1f2d42" : "white", padding: "1.5rem", borderRadius: "12px", boxShadow: darkMode ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.08)", cursor: "pointer", transition: "all 0.3s", border: "2px solid transparent" }} onClick={() => setCurrentQuiz(q)} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = darkMode ? "0 4px 16px rgba(102, 126, 234, 0.3)" : "0 4px 16px rgba(102, 126, 234, 0.2)"; e.currentTarget.style.borderColor = "#667eea"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = darkMode ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <h5 style={{ fontWeight: "bold", marginBottom: "0.8rem", color: darkMode ? "#e8f0ff" : "#333" }}>{q.title}</h5>
                    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", fontSize: "0.85rem" }}>
                      <span style={{ background: darkMode ? "#0a0e27" : "#f3f4f6", padding: "0.4rem 0.8rem", borderRadius: "6px", color: darkMode ? "#a8afc7" : "#666" }}>{q.questions} Qs</span>
                      <span style={{ background: darkMode ? "#0a0e27" : "#f3f4f6", padding: "0.4rem 0.8rem", borderRadius: "6px", color: darkMode ? "#a8afc7" : "#666" }}>{q.time} min</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: "600", color: q.difficulty === "Easy" ? "#10b981" : q.difficulty === "Medium" ? "#f59e0b" : "#ef4444" }}>{q.difficulty}</span>
                      <span style={{ fontSize: "0.85rem", color: "#667eea", fontWeight: "bold" }}>Start →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : quizFinished ? (
            <div style={{ background: darkMode ? "#1f2d42" : "white", padding: "2.5rem", borderRadius: "16px", boxShadow: darkMode ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.1)", textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
              <h3 style={{ fontWeight: "bold", marginBottom: "1rem", color: darkMode ? "#e8f0ff" : "#333" }}>Quiz Completed!</h3>

              <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", padding: "2rem", borderRadius: "12px", marginBottom: "2rem" }}>
                <p style={{ fontSize: "0.9rem", opacity: "0.9" }}>Your Score</p>
                <h2 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{quizScore}/{currentQuiz.questions_array.length}</h2>
                <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{Math.round((quizScore / currentQuiz.questions_array.length) * 100)}%</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
                <div style={{ background: darkMode ? "rgba(6, 214, 160, 0.1)" : "#f0fdf4", padding: "1rem", borderRadius: "8px", border: `2px solid ${darkMode ? "rgba(6, 214, 160, 0.3)" : "#10b981"}` }}>
                  <p style={{ fontSize: "0.85rem", color: darkMode ? "#a8afc7" : "#666" }}>Correct</p>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981" }}>{quizScore}</p>
                </div>
                <div style={{ background: darkMode ? "rgba(255, 214, 10, 0.1)" : "#fef3c7", padding: "1rem", borderRadius: "8px", border: `2px solid ${darkMode ? "rgba(255, 214, 10, 0.3)" : "#f59e0b"}` }}>
                  <p style={{ fontSize: "0.85rem", color: darkMode ? "#a8afc7" : "#666" }}>Wrong</p>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f59e0b" }}>{currentQuiz.questions_array.length - quizScore}</p>
                </div>
                <div style={{ background: darkMode ? "rgba(59, 130, 246, 0.1)" : "#f0f9ff", padding: "1rem", borderRadius: "8px", border: `2px solid ${darkMode ? "rgba(59, 130, 246, 0.3)" : "#3b82f6"}` }}>
                  <p style={{ fontSize: "0.85rem", color: darkMode ? "#a8afc7" : "#666" }}>Time</p>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3b82f6" }}>{formatTime(quizTime)}</p>
                </div>
              </div>

              <button onClick={resetQuiz} style={{ width: "100%", padding: "1rem", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>Take Another Quiz</button>
            </div>
          ) : (
            <div style={{ background: darkMode ? "#1f2d42" : "white", padding: "2rem", borderRadius: "16px", boxShadow: darkMode ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h4 style={{ fontWeight: "bold", color: darkMode ? "#e8f0ff" : "#333" }}>{currentQuiz.title}</h4>
                <div style={{ background: darkMode ? "#0a0e27" : "#f3f4f6", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: "bold", color: "#667eea" }}>⏱️ {formatTime(quizTime)}</div>
              </div>

              <div style={{ background: darkMode ? "rgba(102, 126, 234, 0.1)" : "#f0f9ff", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", border: `1px solid ${darkMode ? "rgba(102, 126, 234, 0.2)" : "#bfdbfe"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: "600", color: darkMode ? "#e8f0ff" : "#333" }}>Progress: {quizProgress + 1}/{currentQuiz.questions_array.length}</span>
                  <span style={{ fontWeight: "bold", color: "#667eea" }}>{Math.round(((quizProgress + 1) / currentQuiz.questions_array.length) * 100)}%</span>
                </div>
                <div style={{ height: "8px", background: darkMode ? "#2a3f5f" : "#e0e7ff", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${((quizProgress + 1) / currentQuiz.questions_array.length) * 100}%`, height: "100%", background: "linear-gradient(90deg, #667eea, #764ba2)", transition: "width 0.3s" }} />
                </div>
              </div>

              <h5 style={{ fontWeight: "bold", marginBottom: "1.5rem", color: darkMode ? "#e8f0ff" : "#333", fontSize: "1.1rem" }}>Q{quizProgress + 1}: {currentQuiz.questions_array[quizProgress]?.q}</h5>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                {currentQuiz.questions_array[quizProgress]?.opts.map((opt, idx) => (
                  <button key={idx} onClick={() => handleAnswer(opt)} style={{ padding: "1rem", background: darkMode ? "#0a0e27" : "#f3f4f6", border: `2px solid ${darkMode ? "#2a3f5f" : "#e5e7eb"}`, borderRadius: "8px", cursor: "pointer", textAlign: "left", fontWeight: "600", color: darkMode ? "#e8f0ff" : "#333", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#667eea"; e.currentTarget.style.background = darkMode ? "#151a33" : "#f0f9ff"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = darkMode ? "#2a3f5f" : "#e5e7eb"; e.currentTarget.style.background = darkMode ? "#0a0e27" : "#f3f4f6"; }}>
                    {String.fromCharCode(65 + idx)}. {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "summarizer" && (
        <div>
          <button onClick={() => setMode("home")} style={{ marginBottom: "1.5rem", padding: "0.6rem 1.2rem", background: darkMode ? "#1f2d42" : "#e5e7eb", border: `1px solid ${darkMode ? "#2a3f5f" : "transparent"}`, borderRadius: "8px", cursor: "pointer", fontWeight: "600", color: darkMode ? "#e8f0ff" : "#333" }}>← Back Home</button>

          <h4 style={{ fontWeight: "bold", marginBottom: "1.5rem", color: darkMode ? "#e8f0ff" : "#333" }}>📋 Text Summarizer - Extract Important Points</h4>

          <div style={{ background: darkMode ? "#1f2d42" : "white", padding: "2rem", borderRadius: "12px", boxShadow: darkMode ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.08)" }}>
            <p style={{ color: darkMode ? "#a8afc7" : "#666", marginBottom: "1rem", fontSize: "0.9rem" }}>Paste your paragraph and we'll extract the most important points automatically:</p>
            
            <textarea 
              value={summarizeText} 
              onChange={(e) => setSummarizeText(e.target.value)} 
              placeholder="Paste your paragraph here..." 
              style={{ width: "100%", height: "150px", padding: "1rem", borderRadius: "8px", border: `2px solid ${darkMode ? "#2a3f5f" : "#e5e7eb"}`, fontFamily: "inherit", fontSize: "0.95rem", marginBottom: "1rem", background: darkMode ? "#0a0e27" : "#fff", color: darkMode ? "#e8f0ff" : "#000" }} 
            />

            <button 
              onClick={() => setImportantPoints(extractImportantPoints(summarizeText))} 
              style={{ width: "100%", padding: "1rem", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem", marginBottom: "1.5rem", transition: "all 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            >
              ✨ Extract Important Points
            </button>

            {importantPoints.length > 0 && (
              <div>
                <h5 style={{ fontWeight: "bold", marginBottom: "1rem", color: darkMode ? "#e8f0ff" : "#333", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.2rem" }}>🎯</span> Important Points Found ({importantPoints.length})
                </h5>
                <div style={{ background: darkMode ? "rgba(16, 185, 129, 0.1)" : "#f0fdf4", padding: "1.5rem", borderRadius: "8px", border: `2px solid ${darkMode ? "rgba(16, 185, 129, 0.3)" : "#10b981"}` }}>
                  {importantPoints.map((point, i) => (
                    <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: i < importantPoints.length - 1 ? "1rem" : "0" }}>
                      <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0, fontSize: "0.85rem" }}>
                        {i + 1}
                      </div>
                      <p style={{ color: darkMode ? "#e8f0ff" : "#333", fontWeight: "500", lineHeight: "1.5" }}>{point}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
                  <div style={{ background: darkMode ? "rgba(59, 130, 246, 0.1)" : "#f0f9ff", padding: "1rem", borderRadius: "8px", textAlign: "center", border: `2px solid ${darkMode ? "rgba(59, 130, 246, 0.3)" : "#3b82f6"}` }}>
                    <p style={{ fontSize: "0.85rem", color: darkMode ? "#a8afc7" : "#666" }}>Text Length</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3b82f6" }}>{Math.round(summarizeText.length / 100)}</p>
                    <p style={{ fontSize: "0.75rem", color: darkMode ? "#6b7280" : "#999" }}>~100 chars</p>
                  </div>
                  <div style={{ background: darkMode ? "rgba(245, 158, 11, 0.1)" : "#fef3c7", padding: "1rem", borderRadius: "8px", textAlign: "center", border: `2px solid ${darkMode ? "rgba(245, 158, 11, 0.3)" : "#f59e0b"}` }}>
                    <p style={{ fontSize: "0.85rem", color: darkMode ? "#a8afc7" : "#666" }}>Compression Ratio</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f59e0b" }}>{Math.round((1 - importantPoints.join(" ").length / summarizeText.length) * 100)}%</p>
                    <p style={{ fontSize: "0.75rem", color: darkMode ? "#6b7280" : "#999" }}>reduced</p>
                  </div>
                  <div style={{ background: darkMode ? "rgba(16, 185, 129, 0.1)" : "#f0fdf4", padding: "1rem", borderRadius: "8px", textAlign: "center", border: `2px solid ${darkMode ? "rgba(16, 185, 129, 0.3)" : "#10b981"}` }}>
                    <p style={{ fontSize: "0.85rem", color: darkMode ? "#a8afc7" : "#666" }}>Key Points</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981" }}>{importantPoints.length}</p>
                    <p style={{ fontSize: "0.75rem", color: darkMode ? "#6b7280" : "#999" }}>extracted</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const text = importantPoints.map((p, i) => `${i + 1}. ${p}`).join("\n\n");
                    navigator.clipboard.writeText(text);
                    alert("Important points copied to clipboard!");
                  }}
                  style={{ width: "100%", padding: "1rem", background: "#10b981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", marginTop: "1.5rem" }}
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            )}

            {summarizeText && importantPoints.length === 0 && (
              <div style={{ background: darkMode ? "rgba(245, 158, 11, 0.1)" : "#fef3c7", padding: "1rem", borderRadius: "8px", border: `2px solid ${darkMode ? "rgba(245, 158, 11, 0.3)" : "#f59e0b"}`, color: darkMode ? "#fbbf24" : "#92400e" }}>
                <p style={{ fontWeight: "600" }}>💡 Tip:</p>
                <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>Click "Extract Important Points" button above to analyze your text and extract key information!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {mode === "tools" && (
        <div>
          <button onClick={() => setMode("home")} style={{ marginBottom: "1.5rem", padding: "0.6rem 1.2rem", background: darkMode ? "#1f2d42" : "#e5e7eb", border: `1px solid ${darkMode ? "#2a3f5f" : "transparent"}`, borderRadius: "8px", cursor: "pointer", fontWeight: "600", color: darkMode ? "#e8f0ff" : "#333" }}>← Back Home</button>

          {!toolMode ? (
            <div>
              <h4 style={{ fontWeight: "bold", marginBottom: "1.5rem", color: darkMode ? "#e8f0ff" : "#333" }}>Professional Tools</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" }}>
                {TOOLS.map(tool => (
                  <div key={tool.id} style={{ background: darkMode ? "#1f2d42" : "white", padding: "1.5rem", borderRadius: "12px", boxShadow: darkMode ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.08)", cursor: "pointer", textAlign: "center", transition: "all 0.3s" }} onClick={() => setToolMode(tool.id)} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = darkMode ? "0 4px 16px rgba(102, 126, 234, 0.3)" : "0 4px 16px rgba(102, 126, 234, 0.2)"; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = darkMode ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>{tool.icon}</div>
                    <h5 style={{ fontWeight: "bold", marginBottom: "0.3rem", color: darkMode ? "#e8f0ff" : "#333" }}>{tool.name}</h5>
                    <p style={{ fontSize: "0.85rem", color: darkMode ? "#a8afc7" : "#666" }}>{tool.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : toolMode === 1 ? (
            <div style={{ background: darkMode ? "#1f2d42" : "white", padding: "2rem", borderRadius: "12px", boxShadow: darkMode ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.08)" }}>
              <button onClick={() => setToolMode(null)} style={{ marginBottom: "1rem", padding: "0.5rem 1rem", background: darkMode ? "#0a0e27" : "#e5e7eb", border: `1px solid ${darkMode ? "#2a3f5f" : "transparent"}`, borderRadius: "6px", cursor: "pointer", color: darkMode ? "#e8f0ff" : "#333" }}>← Back</button>
              <h4 style={{ fontWeight: "bold", marginBottom: "1rem", color: darkMode ? "#e8f0ff" : "#333" }}>📝 Word Counter</h4>
              <textarea value={wordText} onChange={(e) => setWordText(e.target.value)} placeholder="Paste your text here..." style={{ width: "100%", height: "150px", padding: "1rem", borderRadius: "8px", border: `2px solid ${darkMode ? "#2a3f5f" : "#e5e7eb"}`, fontFamily: "inherit", fontSize: "0.95rem", background: darkMode ? "#0a0e27" : "#fff", color: darkMode ? "#e8f0ff" : "#000" }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "1rem" }}>
                <div style={{ background: darkMode ? "rgba(16, 185, 129, 0.1)" : "#f0fdf4", padding: "1rem", borderRadius: "8px", textAlign: "center", border: `2px solid ${darkMode ? "rgba(16, 185, 129, 0.3)" : "#10b981"}` }}>
                  <p style={{ fontSize: "0.85rem", color: darkMode ? "#a8afc7" : "#666" }}>Words</p>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}>{wordText.trim().split(/\s+/).filter(w => w).length}</p>
                </div>
                <div style={{ background: darkMode ? "rgba(245, 158, 11, 0.1)" : "#fef3c7", padding: "1rem", borderRadius: "8px", textAlign: "center", border: `2px solid ${darkMode ? "rgba(245, 158, 11, 0.3)" : "#f59e0b"}` }}>
                  <p style={{ fontSize: "0.85rem", color: darkMode ? "#a8afc7" : "#666" }}>Characters</p>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b" }}>{wordText.length}</p>
                </div>
                <div style={{ background: darkMode ? "rgba(59, 130, 246, 0.1)" : "#f0f9ff", padding: "1rem", borderRadius: "8px", textAlign: "center", border: `2px solid ${darkMode ? "rgba(59, 130, 246, 0.3)" : "#3b82f6"}` }}>
                  <p style={{ fontSize: "0.85rem", color: darkMode ? "#a8afc7" : "#666" }}>Lines</p>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6" }}>{wordText.split("\n").length}</p>
                </div>
              </div>
            </div>
          ) : toolMode === 2 ? (
            <div style={{ background: darkMode ? "#1f2d42" : "white", padding: "2rem", borderRadius: "12px", boxShadow: darkMode ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.08)" }}>
              <button onClick={() => setToolMode(null)} style={{ marginBottom: "1rem", padding: "0.5rem 1rem", background: darkMode ? "#0a0e27" : "#e5e7eb", border: `1px solid ${darkMode ? "#2a3f5f" : "transparent"}`, borderRadius: "6px", cursor: "pointer", color: darkMode ? "#e8f0ff" : "#333" }}>← Back</button>
              <h4 style={{ fontWeight: "bold", marginBottom: "1rem", color: darkMode ? "#e8f0ff" : "#333" }}>📊 Grade Calculator</h4>
              <input type="number" placeholder="Enter your score (0-100)" value={gradeInput} onChange={(e) => setGradeInput(e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "8px", border: `2px solid ${darkMode ? "#2a3f5f" : "#e5e7eb"}`, marginBottom: "1rem", fontSize: "1rem", background: darkMode ? "#0a0e27" : "#fff", color: darkMode ? "#e8f0ff" : "#000" }} />
              {gradeInput && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                  <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", padding: "1.5rem", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.9rem", opacity: "0.9" }}>Grade</p>
                    <p style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{parseInt(gradeInput) >= 90 ? "A+" : parseInt(gradeInput) >= 80 ? "A" : parseInt(gradeInput) >= 70 ? "B" : parseInt(gradeInput) >= 60 ? "C" : "D"}</p>
                  </div>
                  <div style={{ background: "linear-gradient(135deg, #f5a623, #f78c3d)", color: "white", padding: "1.5rem", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.9rem", opacity: "0.9" }}>Status</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{parseInt(gradeInput) >= 40 ? "✅ Pass" : "❌ Fail"}</p>
                  </div>
                </div>
              )}
            </div>
          ) : toolMode === 3 ? (
            <div style={{ background: darkMode ? "#1f2d42" : "white", padding: "2rem", borderRadius: "12px", boxShadow: darkMode ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.08)" }}>
              <button onClick={() => setToolMode(null)} style={{ marginBottom: "1rem", padding: "0.5rem 1rem", background: darkMode ? "#0a0e27" : "#e5e7eb", border: `1px solid ${darkMode ? "#2a3f5f" : "transparent"}`, borderRadius: "6px", cursor: "pointer", color: darkMode ? "#e8f0ff" : "#333" }}>← Back</button>
              <h4 style={{ fontWeight: "bold", marginBottom: "1rem", color: darkMode ? "#e8f0ff" : "#333" }}>⏱️ Study Time Tracker</h4>
              <div style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", padding: "2rem", borderRadius: "12px", textAlign: "center", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.9rem", opacity: "0.9" }}>Study Time</p>
                <p style={{ fontSize: "3.5rem", fontWeight: "bold", fontFamily: "monospace" }}>{formatTime(studyTime)}</p>
              </div>
              <button onClick={() => setTimerActive(!timerActive)} style={{ width: "100%", padding: "1rem", background: timerActive ? "#ef4444" : "#10b981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem", marginBottom: "1rem" }}>{timerActive ? "⏸️ Stop" : "▶️ Start"}</button>
              <button onClick={() => { setStudyTime(0); setTimerActive(false); }} style={{ width: "100%", padding: "1rem", background: darkMode ? "#0a0e27" : "#e5e7eb", border: `1px solid ${darkMode ? "#2a3f5f" : "transparent"}`, borderRadius: "8px", cursor: "pointer", fontWeight: "bold", color: darkMode ? "#e8f0ff" : "#333" }}>🔄 Reset</button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
