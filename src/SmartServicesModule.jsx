import React, { useState, useRef, useEffect } from 'react';
import { Calculator, Cloud, DollarSign, QrCode, Wand2, Timer } from 'lucide-react';

const ToolCard = ({ title, icon: Icon, children, darkMode = false }) => (
  <div style={{ 
    background: darkMode ? '#1f2d42' : 'white', 
    padding: '1.5rem', 
    borderRadius: '12px', 
    boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)', 
    border: `1px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
      {Icon && <Icon size={24} style={{ color: darkMode ? '#60a5fa' : '#3b82f6' }} />}
      <h5 style={{ fontWeight: '600', fontSize: '1.1rem', color: darkMode ? '#e8f0ff' : '#1f2937', margin: 0 }}>{title}</h5>
    </div>
    {children}
  </div>
);

export default function SmartServicesModule({ darkMode = false }) {
  const [tab, setTab] = useState('calc');
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState('');
  const [op, setOp] = useState('');
  const [qr, setQr] = useState('');
  const [qrInput, setQrInput] = useState('');
  const [img, setImg] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imgLoad, setImgLoad] = useState(false);
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [convRes, setConvRes] = useState('');
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState('');
  const [weatherLoad, setWeatherLoad] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const stopwatchInterval = useRef(null);

  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchInterval.current = setInterval(() => {
        setStopwatchTime(prev => prev + 10);
      }, 10);
    } else {
      clearInterval(stopwatchInterval.current);
    }
    return () => clearInterval(stopwatchInterval.current);
  }, [stopwatchRunning]);

  const rates = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.12, JPY: 149.5, AUD: 1.53, CAD: 1.36, CHF: 0.88 };

  const handleNum = (n) => {
    setDisplay(display === '0' ? n : display + n);
  };

  const handleOp = (operation) => {
    setPrev(display);
    setOp(operation);
    setDisplay('0');
  };

  const handleEq = () => {
    if (!prev || !op) return;
    const p = parseFloat(prev);
    const c = parseFloat(display);
    let result;
    if (op === '+') result = p + c;
    else if (op === '-') result = p - c;
    else if (op === '*') result = p * c;
    else if (op === '/') result = p / c;
    else return;
    setDisplay(String(result));
    setPrev('');
    setOp('');
  };

  const handleClear = () => {
    setDisplay('0');
    setPrev('');
    setOp('');
  };

  const handleDel = () => {
    setDisplay(display.length === 1 ? '0' : display.slice(0, -1));
  };

  const genQR = () => {
    if (!qrInput.trim()) return;
    setQr('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(qrInput));
  };

  const genImg = () => {
    if (!prompt.trim()) return;
    setImgLoad(true);
    setImg('https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=512&height=512&nologo=true');
    setImgLoad(false);
  };

  const convert = () => {
    if (!amount || isNaN(amount)) return;
    const res = (parseFloat(amount) * (rates[to] / rates[from])).toFixed(2);
    setConvRes(amount + ' ' + from + ' = ' + res + ' ' + to);
  };

  const getWeather = async () => {
    if (!city.trim()) return;
    setWeatherLoad(true);
    try {
      const geoRes = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(city) + '&count=1');
      const geoData = await geoRes.json();
      if (!geoData.results || !geoData.results[0]) {
        setWeather('City not found');
        setWeatherLoad(false);
        return;
      }
      const { latitude, longitude } = geoData.results[0];
      const wRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&current_weather=true');
      const wData = await wRes.json();
      const w = wData.current_weather;
      setWeather('Temp: ' + w.temperature + 'C, Wind: ' + w.windspeed + ' km/h');
    } catch {
      setWeather('Error fetching');
    }
    setWeatherLoad(false);
  };

  const formatStopwatch = () => {
    const ms = Math.floor((stopwatchTime % 100) / 10);
    const secs = Math.floor((stopwatchTime / 1000) % 60);
    const mins = Math.floor((stopwatchTime / 60000) % 60);
    const hours = Math.floor(stopwatchTime / 3600000);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleStopwatchStart = () => {
    setStopwatchRunning(true);
  };

  const handleStopwatchStop = () => {
    setStopwatchRunning(false);
  };

  const handleStopwatchReset = () => {
    setStopwatchRunning(false);
    setStopwatchTime(0);
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qr;
    link.download = 'qr-code.png';
    link.click();
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = img;
    link.download = 'generated-image.png';
    link.click();
  };

  const tabs = ['calc', 'qr', 'img', 'curr', 'weather', 'stopwatch'];
  const tabIcons = { calc: '🧮', qr: '📱', img: '🎨', curr: '💱', weather: '☁️', stopwatch: '⏱️' };
  const names = { calc: 'Calculator', qr: 'QR Code', img: 'AI Image', curr: 'Currency', weather: 'Weather', stopwatch: 'Stopwatch' };

  return (
    <div style={{ 
      background: darkMode ? 'linear-gradient(135deg, #0f172015 0%, #151a3315 100%)' : 'linear-gradient(135deg, #3b82f615 0%, #6366f115 100%)',
      borderRadius: '12px',
      padding: '1rem',
      height: '100%',
      overflowY: 'auto'
    }}>
      <div className="mb-4">
        <h3 className="fw-bold mb-1" style={{ color: darkMode ? '#e8f0ff' : '#1f2937' }}>Smart Services</h3>
        <p className="text-muted small" style={{ color: darkMode ? '#a8afc7' : '#6b7280' }}>Powerful tools for productivity and creativity</p>
      </div>

      {/* Tab Navigation */}
      <div className="d-flex gap-2 mb-4" style={{ borderBottom: `2px solid ${darkMode ? '#1f2d42' : '#e5e7eb'}`, paddingBottom: '1rem', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t)} 
            style={{ 
              background: tab === t 
                ? 'linear-gradient(135deg, #3b82f6, #6366f1)' 
                : darkMode 
                  ? '#1f2d42' 
                  : '#e5e7eb', 
              border: tab === t 
                ? `2px solid ${darkMode ? '#60a5fa' : '#2563eb'}` 
                : `2px solid ${darkMode ? '#2a3f5f' : '#d1d5db'}`, 
              color: tab === t ? 'white' : darkMode ? '#a8afc7' : '#4b5563', 
              padding: '0.6rem 1rem', 
              borderRadius: '8px', 
              fontWeight: '600', 
              cursor: 'pointer', 
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              boxShadow: tab === t ? `0 4px 12px ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.3)'}` : 'none'
            }}>
            <span style={{ marginRight: '0.3rem' }}>{tabIcons[t]}</span>
              {names[t]}
            </button>
          ))}
      </div>

        {tab === 'calc' && (
          <ToolCard title="Calculator" icon={Calculator} darkMode={darkMode}>
            <div style={{ background: darkMode ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', padding: '1rem', borderRadius: '10px', marginBottom: '1.2rem', textAlign: 'right', fontSize: '2rem', fontWeight: 'bold', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)' }}>
              {display}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', marginBottom: '1rem' }}>
              {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map(b => (
                <button 
                  key={b} 
                  onClick={() => b === '=' ? handleEq() : b === '/' || b === '*' || b === '-' || b === '+' ? handleOp(b) : handleNum(b)} 
                  style={{ 
                    padding: '0.8rem', 
                    background: b === '=' 
                      ? 'linear-gradient(135deg, #10b981, #059669)' 
                      : darkMode 
                        ? '#1f2d42' 
                        : '#f3f4f6', 
                    color: b === '=' 
                      ? 'white' 
                      : darkMode 
                        ? '#e8f0ff' 
                        : '#1f2937', 
                    border: `2px solid ${b === '=' ? '#10b981' : darkMode ? '#2a3f5f' : '#e5e7eb'}`, 
                    borderRadius: '8px', 
                    fontWeight: '700', 
                    cursor: 'pointer', 
                    fontSize: '1rem', 
                    transition: 'all 0.2s ease'
                  }}>
                  {b}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <button 
                onClick={handleClear} 
                style={{ 
                  padding: '0.8rem', 
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.95rem'
                }}>
                Clear
              </button>
              <button 
                onClick={handleDel} 
                style={{ 
                  padding: '0.8rem', 
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.95rem'
                }}>
                Delete
              </button>
            </div>
          </ToolCard>
        )}

        {tab === 'qr' && (
          <ToolCard title="QR Code Generator" icon={QrCode} darkMode={darkMode}>
            <textarea 
              value={qrInput} 
              onChange={e => setQrInput(e.target.value)} 
              placeholder="Enter text or URL..." 
              style={{ 
                width: '100%', 
                padding: '1rem', 
                marginBottom: '1.2rem', 
                borderRadius: '10px', 
                border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, 
                background: darkMode ? '#0a0e27' : '#f9fafb',
                color: darkMode ? '#e8f0ff' : '#1f2937',
                minHeight: '100px', 
                fontFamily: 'inherit', 
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }} 
            />
            <button 
              onClick={genQR} 
              style={{ 
                width: '100%', 
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)', 
                color: 'white', 
                border: 'none', 
                padding: '1rem', 
                borderRadius: '10px', 
                cursor: 'pointer', 
                fontWeight: '600', 
                marginBottom: '1.5rem', 
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}>
              📱 Generate QR Code
            </button>
            {qr && (
              <div style={{ textAlign: 'center', padding: '2rem', background: darkMode ? '#1f2d42' : '#f9fafb', borderRadius: '12px', border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}` }}>
                <img src={qr} alt="QR" style={{ maxWidth: '100%', width: '300px', height: '300px', marginBottom: '1.2rem', borderRadius: '8px' }} />
                <button 
                  onClick={downloadQR} 
                  style={{ 
                    width: '100%', 
                    background: 'linear-gradient(135deg, #10b981, #059669)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '1rem', 
                    borderRadius: '10px', 
                    cursor: 'pointer', 
                    fontWeight: '600', 
                    fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}>
                  📥 Download QR Code
                </button>
              </div>
            )}
          </ToolCard>
        )}

        {tab === 'img' && (
          <ToolCard title="AI Image Generator" icon={Wand2} darkMode={darkMode}>
            <textarea 
              value={prompt} 
              onChange={e => setPrompt(e.target.value)} 
              placeholder="Describe the image..." 
              style={{ 
                width: '100%', 
                padding: '1rem', 
                marginBottom: '1.2rem', 
                borderRadius: '10px', 
                border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, 
                background: darkMode ? '#0a0e27' : '#f9fafb',
                color: darkMode ? '#e8f0ff' : '#1f2937',
                minHeight: '100px', 
                fontFamily: 'inherit', 
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }} 
            />
            <button 
              onClick={genImg} 
              disabled={imgLoad} 
              style={{ 
                width: '100%', 
                background: imgLoad ? (darkMode ? '#2a3f5f' : '#d1d5db') : 'linear-gradient(135deg, #3b82f6, #6366f1)', 
                color: 'white', 
                border: 'none', 
                padding: '1rem', 
                borderRadius: '10px', 
                cursor: 'pointer', 
                fontWeight: '600', 
                marginBottom: '1.5rem', 
                fontSize: '1rem',
                opacity: imgLoad ? 0.7 : 1,
                transition: 'all 0.2s ease'
              }}>
              {imgLoad ? '⏳ Generating...' : '🎨 Generate Image'}
            </button>
            {img && (
              <div style={{ textAlign: 'center', padding: '2rem', background: darkMode ? '#1f2d42' : '#f9fafb', borderRadius: '12px', border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}` }}>
                <img src={img} alt="Generated" style={{ maxWidth: '100%', width: '100%', maxHeight: '500px', marginBottom: '1.2rem', borderRadius: '10px' }} />
                <button 
                  onClick={downloadImage} 
                  style={{ 
                    width: '100%', 
                    background: 'linear-gradient(135deg, #10b981, #059669)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '1rem', 
                    borderRadius: '10px', 
                    cursor: 'pointer', 
                    fontWeight: '600', 
                    fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}>
                  📥 Download Image
                </button>
              </div>
            )}
          </ToolCard>
        )}

        {tab === 'curr' && (
          <ToolCard title="Currency Converter" icon={DollarSign} darkMode={darkMode}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '0.6rem', color: darkMode ? '#a8afc7' : '#4b5563' }}>Amount</label>
              <input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                placeholder="Enter amount" 
                style={{ 
                  width: '100%', 
                  padding: '0.9rem', 
                  borderRadius: '10px', 
                  border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, 
                  background: darkMode ? '#0a0e27' : '#f9fafb',
                  color: darkMode ? '#e8f0ff' : '#1f2937',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease'
                }} 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '0.6rem', color: darkMode ? '#a8afc7' : '#4b5563' }}>From</label>
                <select 
                  value={from} 
                  onChange={e => setFrom(e.target.value)} 
                  style={{ 
                    width: '100%', 
                    padding: '0.9rem', 
                    borderRadius: '10px', 
                    border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, 
                    background: darkMode ? '#0a0e27' : '#f9fafb',
                    color: darkMode ? '#e8f0ff' : '#1f2937',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}>
                  {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '0.6rem', color: darkMode ? '#a8afc7' : '#4b5563' }}>To</label>
                <select 
                  value={to} 
                  onChange={e => setTo(e.target.value)} 
                  style={{ 
                    width: '100%', 
                    padding: '0.9rem', 
                    borderRadius: '10px', 
                    border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, 
                    background: darkMode ? '#0a0e27' : '#f9fafb',
                    color: darkMode ? '#e8f0ff' : '#1f2937',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}>
                  {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button 
              onClick={convert} 
              style={{ 
                width: '100%', 
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)', 
                color: 'white', 
                border: 'none', 
                padding: '1rem', 
                borderRadius: '10px', 
                cursor: 'pointer', 
                fontWeight: '600', 
                marginBottom: '1.2rem', 
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}>
              💱 Convert
            </button>
            {convRes && <div style={{ padding: '1.2rem', background: darkMode ? '#1f2d42' : '#f0f4ff', borderRadius: '10px', textAlign: 'center', fontWeight: '700', color: darkMode ? '#60a5fa' : '#3b82f6', border: `2px solid ${darkMode ? '#2a3f5f' : '#dbeafe'}`, fontSize: '1.05rem' }}>{convRes}</div>}
          </ToolCard>
        )}

        {tab === 'weather' && (
          <ToolCard title="Weather Checker" icon={Cloud} darkMode={darkMode}>
            <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                value={city} 
                onChange={e => setCity(e.target.value)} 
                onKeyPress={e => e.key === 'Enter' && getWeather()} 
                placeholder="Enter city..." 
                style={{ 
                  flex: 1, 
                  padding: '0.9rem', 
                  borderRadius: '10px', 
                  border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, 
                  background: darkMode ? '#0a0e27' : '#f9fafb',
                  color: darkMode ? '#e8f0ff' : '#1f2937',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease'
                }} 
              />
              <button 
                onClick={getWeather} 
                disabled={weatherLoad} 
                style={{ 
                  background: weatherLoad ? (darkMode ? '#2a3f5f' : '#d1d5db') : 'linear-gradient(135deg, #3b82f6, #6366f1)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.9rem 1.8rem', 
                  borderRadius: '10px', 
                  cursor: 'pointer', 
                  fontWeight: '600', 
                  fontSize: '1rem',
                  opacity: weatherLoad ? 0.7 : 1,
                  transition: 'all 0.2s ease'
                }}>
                {weatherLoad ? 'Loading...' : 'Search'}
              </button>
            </div>
            {weather && <div style={{ padding: '1.2rem', background: darkMode ? '#1f2d42' : '#f0f4ff', borderRadius: '10px', textAlign: 'center', fontWeight: '600', color: darkMode ? '#60a5fa' : '#3b82f6', border: `2px solid ${darkMode ? '#2a3f5f' : '#dbeafe'}`, fontSize: '1rem' }}>{weather}</div>}
          </ToolCard>
        )}

        {tab === 'stopwatch' && (
          <ToolCard title="Stopwatch" icon={Timer} darkMode={darkMode}>
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', padding: '1rem', borderRadius: '10px', marginBottom: '1.2rem', textAlign: 'center', fontSize: '2.8rem', fontWeight: 'bold', fontFamily: 'monospace', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)' }}>
              {formatStopwatch()}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {!stopwatchRunning && (
                <button 
                  onClick={handleStopwatchStart} 
                  style={{ 
                    padding: '0.8rem', 
                    background: 'linear-gradient(135deg, #10b981, #059669)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontWeight: '600', 
                    cursor: 'pointer', 
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease'
                  }}>
                  ▶ Start
                </button>
              )}
              {stopwatchRunning && (
                <button 
                  onClick={handleStopwatchStop} 
                  style={{ 
                    padding: '0.8rem', 
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontWeight: '600', 
                    cursor: 'pointer', 
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease'
                  }}>
                  ⏸ Stop
                </button>
              )}
              <button 
                onClick={handleStopwatchReset} 
                style={{ 
                  padding: '0.8rem', 
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: '600', 
                  cursor: 'pointer', 
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease'
                }}>
                ↻ Reset
              </button>
            </div>
          </ToolCard>
        )}
    </div>
  );
}
