import React, { useState } from "react";

export default function AIImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("mui_aiimg_history") || "[]"));
  const [showHistory, setShowHistory] = useState(false);
  const [style, setStyle] = useState("art");
  const [size, setSize] = useState("medium");

  // Mock AI image generation (client-side)
  const generateImage = () => {
    setError("");
    setImage("");
    if (!prompt.trim()) {
      setError("Please enter a prompt to generate an image.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Canvas mock image
      const w = size === "small" ? 200 : size === "large" ? 400 : 300;
      const h = w * 0.65;
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      // background
      let grad = ctx.createLinearGradient(0,0,w,h);
      if (style === "art") {
        grad.addColorStop(0, "#f8ffae"); grad.addColorStop(1, "#43c6ac");
      } else if (style === "photo") {
        grad.addColorStop(0, "#e0c3fc"); grad.addColorStop(1, "#8ec5fc");
      } else if (style === "sketch") {
        grad.addColorStop(0, "#fff"); grad.addColorStop(1, "#ddd");
      } else {
        grad.addColorStop(0, "#f8ffae"); grad.addColorStop(1, "#43c6ac");
      }
      ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);

      // style overlay
      if (style === "sketch") {
        ctx.strokeStyle = "#333";
        for (let i = 0; i < 12; i++) {
          ctx.beginPath();
          ctx.moveTo(Math.random()*w, Math.random()*h);
          ctx.lineTo(Math.random()*w, Math.random()*h);
          ctx.stroke();
        }
      }

      // title
      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "#222";
      ctx.fillText("AI Generated Image", 16, 32);

      // prompt text
      ctx.font = "15px Arial";
      ctx.fillStyle = "#222";
      // wrap prompt
      const words = prompt.split(" ");
      let line = "", y = 60;
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        if (ctx.measureText(testLine).width > w - 32 && line) {
          ctx.fillText(line, 16, y);
          line = words[i] + " ";
          y += 22;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 16, y);

      // style label
      ctx.font = "italic 13px Arial";
      ctx.fillStyle = "#555";
      ctx.fillText(`Style: ${style.charAt(0).toUpperCase() + style.slice(1)}, Size: ${size}`, 16, h - 28);

      // signature
      ctx.font = "11px Arial";
      ctx.fillStyle = "#888";
      ctx.fillText("This is a mock image. Connect an API for real AI images.", 16, h - 10);

      const dataUrl = c.toDataURL("image/png");
      setImage(dataUrl);

      // Save to history
      const newEntry = { prompt, style, size, dataUrl, time: new Date().toISOString() };
      const newHistory = [newEntry, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem("mui_aiimg_history", JSON.stringify(newHistory));

      setLoading(false);
    }, 1200);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    setError("");
  };

  const handleStyleChange = (e) => setStyle(e.target.value);
  const handleSizeChange = (e) => setSize(e.target.value);

  const handleHistoryClick = (entry) => {
    setPrompt(entry.prompt);
    setStyle(entry.style);
    setSize(entry.size);
    setImage(entry.dataUrl);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("mui_aiimg_history");
  };

  return (
    <div className="container py-4" style={{maxWidth: 480}}>
      <h4 className="mb-3 text-center">🎨 AI Image Generator</h4>
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="mb-2">
            <label className="form-label fw-semibold">Prompt</label>
            <input
              className="form-control"
              value={prompt}
              onChange={handlePromptChange}
              placeholder="Describe an image (e.g. astronaut riding a horse in space)"
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="row g-2 mb-2">
            <div className="col">
              <label className="form-label mb-1 small">Style</label>
              <select className="form-select" value={style} onChange={handleStyleChange} disabled={loading}>
                <option value="art">Art</option>
                <option value="photo">Photo</option>
                <option value="sketch">Sketch</option>
              </select>
            </div>
            <div className="col">
              <label className="form-label mb-1 small">Size</label>
              <select className="form-select" value={size} onChange={handleSizeChange} disabled={loading}>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2 mb-2">
            <button className="btn btn-primary flex-grow-1" onClick={generateImage} disabled={loading}>
              {loading ? (
                <span><span className="spinner-border spinner-border-sm me-2"></span>Generating...</span>
              ) : "Generate Image"}
            </button>
            <button className="btn btn-outline-secondary" type="button" onClick={()=>setShowHistory(h=>!h)}>
              {showHistory ? "Hide History" : "History"}
            </button>
          </div>
          {error && <div className="alert alert-danger py-2 mb-2">{error}</div>}
          {image && (
            <div className="text-center mt-3">
              <img src={image} alt="AI Generated" style={{maxWidth: "100%", maxHeight: 260, borderRadius: 10, boxShadow: "0 2px 8px #0002"}} />
              <div className="small text-muted mt-2">Right-click to save image</div>
            </div>
          )}
        </div>
      </div>
      {showHistory && (
        <div className="card shadow-sm mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-semibold">Recent Generations</span>
              <button className="btn btn-sm btn-outline-danger" onClick={clearHistory}>Clear</button>
            </div>
            {history.length === 0 && <div className="text-muted small">No history yet.</div>}
            <div className="row g-2">
              {history.map((h, i) => (
                <div className="col-6" key={i}>
                  <div className="border rounded p-1 mb-2 bg-light" style={{cursor:"pointer"}} onClick={()=>handleHistoryClick(h)}>
                    <img src={h.dataUrl} alt="prev" style={{width:"100%", borderRadius:6, marginBottom:4}} />
                    <div className="small text-truncate" title={h.prompt}>{h.prompt}</div>
                    <div className="text-muted tiny">{h.style}, {h.size}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

// Example: API call for real AI image generation (DALL·E, Stable Diffusion, etc.)
// async function generateImageFromAPI(prompt) {
//   const response = await fetch("YOUR_AI_IMAGE_API_URL", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ prompt }),
//   });
//   const data = await response.json();
//   // return data.image_url or similar
// }
