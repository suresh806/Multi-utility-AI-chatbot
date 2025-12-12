import React from 'react';

const JOKES = [
  'Why did the developer go broke? Because he used up all his cache.',
  'Why do Java developers wear glasses? Because they cannot see the bigger picture.',
  'Why did the computer show up at work late? It had a hard drive.',
  'Why was the cell phone wearing glasses? Because it lost its contacts.',
  'Why do programmers prefer dark mode? Because light attracts bugs!',
  'A SQL query walks into a bar and asks if he can join you!',
  'Why was the JavaScript developer sad? Because he cannot do it.',
  'Why do developers always get Christmas wrong? December 25 equals January 4!',
  'How many programmers does it take to change a light bulb? None, that is a hardware problem.',
  'Why do C++ programmers get Halloween and Christmas mixed up? Because DEC 25 = OCT 31!'
];

const QUOTES = [
  'The best way to get started is to quit talking and begin doing. - Walt Disney',
  'Success is not in what you have, but who you are. - Bo Bennett',
  'Opportunities do not happen, you create them. - Chris Grosser',
  'The only way to do great work is to love what you do. - Steve Jobs',
  'The future belongs to those who believe in beauty of dreams. - Eleanor Roosevelt',
  'Do what you can, with what you have, where you are. - Theodore Roosevelt',
  'Best time to plant tree was 20 years ago now. - Chinese Proverb',
  'It is during our darkest moments that we must focus to see the light. - Aristotle',
  'You miss 100% of the shots you do not take. - Wayne Gretzky'
];

const RIDDLES = [
  { q: 'I have cities, but no houses. What am I?', ans: 'A map', options: ['A globe', 'A map', 'A painting', 'A book'] },
  { q: 'What has hands but cannot clap?', ans: 'A clock', options: ['A clock', 'A statue', 'A glove', 'A robot'] },
  { q: 'What gets wetter the more it dries?', ans: 'A towel', options: ['A sponge', 'A towel', 'Paper', 'A cloth'] },
  { q: 'I have a head and tail but no body. What am I?', ans: 'A coin', options: ['A snake', 'A kite', 'A coin', 'A key'] },
  { q: 'The more you take, the more you leave behind. What am I?', ans: 'Footsteps', options: ['Money', 'Footsteps', 'Time', 'Words'] },
  { q: 'I can travel around the world while staying in a corner. What am I?', ans: 'A stamp', options: ['A plane', 'A stamp', 'A letter', 'A postcard'] }
];

const HANGMAN_WORDS = ['JAVASCRIPT', 'PROGRAMMING', 'DEVELOPER', 'COMPUTER', 'ALGORITHM', 'DATABASE', 'FUNCTION', 'VARIABLE', 'INTERNET', 'SECURITY'];

export default function EntertainmentModule({ darkMode = false }) {
  const [activeTab, setActiveTab] = React.useState('home');
  const [joke, setJoke] = React.useState('');
  const [quote, setQuote] = React.useState('');
  const [currentRiddle, setCurrentRiddle] = React.useState(null);
  const [riddleScore, setRiddleScore] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 384);
  
  // Check for mobile screen on resize
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 384);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Memory Game
  const [memoryCards, setMemoryCards] = React.useState([]);
  const [flipped, setFlipped] = React.useState([]);
  const [matched, setMatched] = React.useState([]);
  const [memoryScore, setMemoryScore] = React.useState(0);
  
  // Hangman
  const [hangmanWord, setHangmanWord] = React.useState('');
  const [hangmanGuesses, setHangmanGuesses] = React.useState([]);
  const [hangmanWrong, setHangmanWrong] = React.useState(0);
  const [hangmanGameOver, setHangmanGameOver] = React.useState(false);
  const [hangmanWon, setHangmanWon] = React.useState(false);
  
  // Speed Game
  const [speedScore, setSpeedScore] = React.useState(0);
  const [speedTime, setSpeedTime] = React.useState(30);
  const [speedActive, setSpeedActive] = React.useState(false);
  const [speedTargets, setSpeedTargets] = React.useState([]);

  const getJoke = () => setJoke(JOKES[Math.floor(Math.random() * JOKES.length)]);
  const getQuote = () => setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const startRiddle = () => setCurrentRiddle(RIDDLES[Math.floor(Math.random() * RIDDLES.length)]);

  const handleRiddleAnswer = (selected) => {
    if (selected === currentRiddle.ans) {
      setRiddleScore(riddleScore + 1);
      alert('✅ Correct!');
    } else {
      alert('❌ Wrong! Answer: ' + currentRiddle.ans);
    }
    setTimeout(() => startRiddle(), 500);
  };

  // Memory Game Functions
  const initMemoryGame = () => {
    const emojis = ['🎮', '🎯', '🎲', '🎪', '🎭', '🎨', '🎬', '🎤'];
    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setMemoryCards(cards);
    setFlipped([]);
    setMatched([]);
    setMemoryScore(0);
  };

  const handleMemoryCardClick = (idx) => {
    if (flipped.includes(idx) || matched.includes(idx)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      if (memoryCards[newFlipped[0]] === memoryCards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
        setMemoryScore(memoryScore + 1);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  // Hangman Functions
  const initHangman = () => {
    const word = HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)];
    setHangmanWord(word);
    setHangmanGuesses([]);
    setHangmanWrong(0);
    setHangmanGameOver(false);
    setHangmanWon(false);
  };

  const handleHangmanGuess = (letter) => {
    if (hangmanGuesses.includes(letter) || hangmanGameOver || hangmanWon) return;
    
    const newGuesses = [...hangmanGuesses, letter];
    setHangmanGuesses(newGuesses);

    if (!hangmanWord.includes(letter)) {
      const newWrong = hangmanWrong + 1;
      setHangmanWrong(newWrong);
      if (newWrong >= 6) {
        setHangmanGameOver(true);
      }
    }

    const guessedLetters = new Set([...newGuesses, ...hangmanWord.split('')]);
    if (guessedLetters.size === hangmanWord.length + newGuesses.length - hangmanWord.split('').filter(l => newGuesses.includes(l)).length) {
      if (hangmanWord.split('').every(l => newGuesses.includes(l))) {
        setHangmanWon(true);
      }
    }
  };

  const getHangmanDisplay = () => {
    return hangmanWord.split('').map(l => hangmanGuesses.includes(l) ? l : '_').join(' ');
  };

  // Speed Game
  const startSpeedGame = () => {
    setSpeedScore(0);
    setSpeedTime(30);
    setSpeedActive(true);
    generateSpeedTargets();
  };

  const generateSpeedTargets = () => {
    setSpeedTargets([Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]);
  };

  const handleSpeedClick = (num) => {
    if (!speedActive) return;
    if ((speedTargets[0] + speedTargets[1]) === num) {
      setSpeedScore(speedScore + 1);
      generateSpeedTargets();
    }
  };

  React.useEffect(() => {
    if (memoryCards.length === 0) initMemoryGame();
  }, [memoryCards.length]);

  React.useEffect(() => {
    if (hangmanWord === '') initHangman();
  }, [hangmanWord]);

  React.useEffect(() => {
    if (!speedActive) return;
    const timer = setInterval(() => {
      setSpeedTime(t => {
        if (t <= 1) {
          setSpeedActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [speedActive]);

  const tabStyle = (id) => ({
    background: activeTab === id ? 'linear-gradient(135deg, #667eea, #764ba2)' : darkMode ? 'transparent' : 'transparent',
    border: activeTab === id ? 'none' : `1px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`,
    color: activeTab === id ? 'white' : darkMode ? '#a8afc7' : '#666',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    fontWeight: activeTab === id ? '600' : '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
    fontSize: '0.9rem'
  });

  return (
    <div style={{ background: darkMode ? 'linear-gradient(135deg, #0f172015 0%, #151a3315 100%)' : 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', borderRadius: '12px', padding: '1.5rem', height: '100%', overflowY: 'auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: darkMode ? '#e8f0ff' : '#333' }}>🎮 Entertainment Hub</h3>
        <p style={{ color: darkMode ? '#a8afc7' : '#666', marginBottom: '0', fontSize: '0.9rem' }}>Games, jokes, riddles, and brain teasers!</p>
      </div>

      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem', borderBottom: `2px solid ${darkMode ? '#1f2d42' : '#e5e7eb'}`, paddingBottom: '1rem', overflowX: 'auto', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('home')} style={tabStyle('home')}>🏠 Home</button>
        <button onClick={() => setActiveTab('jokes')} style={tabStyle('jokes')}>😂 Jokes</button>
        <button onClick={() => setActiveTab('riddles')} style={tabStyle('riddles')}>🧩 Riddles</button>
        <button onClick={() => setActiveTab('memory')} style={tabStyle('memory')}>🧠 Memory</button>
        <button onClick={() => setActiveTab('hangman')} style={tabStyle('hangman')}>📝 Hangman</button>
        <button onClick={() => setActiveTab('speed')} style={tabStyle('speed')}>⚡ Speed</button>
      </div>

      {activeTab === 'home' && (
        <div>
          <h4 style={{ fontWeight: 'bold', marginBottom: '1.5rem', color: darkMode ? '#e8f0ff' : '#333' }}>Pick an activity:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            <div onClick={() => setActiveTab('jokes')} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}><div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>😂</div><h6 style={{ marginBottom: 0 }}>Jokes & Quotes</h6></div>
            <div onClick={() => setActiveTab('riddles')} style={{ background: 'linear-gradient(135deg, #f5a623, #f78c3d)', color: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(245, 166, 35, 0.3)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}><div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧩</div><h6 style={{ marginBottom: 0 }}>Riddles</h6></div>
            <div onClick={() => setActiveTab('memory')} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}><div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧠</div><h6 style={{ marginBottom: 0 }}>Memory Game</h6></div>
            <div onClick={() => setActiveTab('hangman')} style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}><div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📝</div><h6 style={{ marginBottom: 0 }}>Hangman</h6></div>
            <div onClick={() => setActiveTab('speed')} style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)', color: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}><div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚡</div><h6 style={{ marginBottom: 0 }}>Speed Game</h6></div>
          </div>
        </div>
      )}

      {activeTab === 'jokes' && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: darkMode ? '#1f2d42' : 'white', padding: '2rem', borderRadius: '12px', boxShadow: darkMode ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.08)' }}>
            <h5 style={{ fontWeight: 'bold', marginBottom: '1rem', color: darkMode ? '#e8f0ff' : '#333' }}>😂 Jokes</h5>
            <button onClick={getJoke} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '1rem', fontWeight: 'bold', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>🔄 Get Joke</button>
            {joke && <div style={{ padding: '1.5rem', background: darkMode ? 'rgba(102, 126, 234, 0.1)' : '#f0f4ff', borderRadius: '8px', borderLeft: `4px solid #667eea`, color: darkMode ? '#a8afc7' : '#333', fontStyle: 'italic', lineHeight: '1.6' }}>"{joke}"</div>}
          </div>
          <div style={{ background: darkMode ? '#1f2d42' : 'white', padding: '2rem', borderRadius: '12px', boxShadow: darkMode ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.08)' }}>
            <h5 style={{ fontWeight: 'bold', marginBottom: '1rem', color: darkMode ? '#e8f0ff' : '#333' }}>💭 Quotes</h5>
            <button onClick={getQuote} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #f093fb, #f5576c)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '1rem', fontWeight: 'bold', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 87, 108, 0.3)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>✨ Get Quote</button>
            {quote && <div style={{ padding: '1.5rem', background: darkMode ? 'rgba(245, 87, 108, 0.1)' : '#fff8f0', borderRadius: '8px', borderLeft: `4px solid #f5576c`, color: darkMode ? '#a8afc7' : '#333', fontStyle: 'italic', lineHeight: '1.6' }}>"{quote}"</div>}
          </div>
        </div>
      )}

      {activeTab === 'riddles' && (
        <div style={{ background: darkMode ? '#1f2d42' : 'white', padding: '2rem', borderRadius: '12px', boxShadow: darkMode ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.08)', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h5 style={{ fontWeight: 'bold', color: darkMode ? '#e8f0ff' : '#333', marginBottom: '0' }}>🧩 Riddle Challenge</h5>
            <div style={{ background: 'linear-gradient(135deg, #f5a623, #f78c3d)', color: 'white', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem' }}>Score: {riddleScore}</div>
          </div>
          {!currentRiddle ? (
            <button onClick={startRiddle} style={{ width: '100%', padding: '1.5rem', background: 'linear-gradient(135deg, #f5a623, #f78c3d)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 166, 35, 0.3)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>🚀 Start Riddles</button>
          ) : (
            <div>
              <div style={{ background: darkMode ? 'rgba(245, 166, 35, 0.1)' : '#f0f9ff', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: `2px solid ${darkMode ? 'rgba(245, 166, 35, 0.3)' : '#3b82f6'}` }}>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: darkMode ? '#e8f0ff' : '#333', marginBottom: '0' }}>❓ {currentRiddle.q}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                {currentRiddle.options.map((opt, i) => (
                  <button key={i} onClick={() => handleRiddleAnswer(opt)} style={{ padding: '1rem', background: darkMode ? '#0a0e27' : '#f3f4f6', border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: darkMode ? '#e8f0ff' : '#333', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f5a623'; e.currentTarget.style.background = darkMode ? '#1f2d42' : '#fff8e5'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = darkMode ? '#2a3f5f' : '#e5e7eb'; e.currentTarget.style.background = darkMode ? '#0a0e27' : '#f3f4f6'; }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'memory' && (
        <div style={{ background: darkMode ? '#1f2d42' : 'white', padding: '1rem', borderRadius: '12px', boxShadow: darkMode ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.08)', maxWidth: '380px', margin: '0 auto', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h5 style={{ fontWeight: 'bold', color: darkMode ? '#e8f0ff' : '#333', marginBottom: '0', fontSize: '0.95rem' }}>🧠 Memory</h5>
            <div style={{ background: '#10b981', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem' }}>Score: {memoryScore}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginBottom: '1rem', overflow: 'hidden' }}>
            {memoryCards.map((card, idx) => (
              <button key={idx} onClick={() => handleMemoryCardClick(idx)} style={{ padding: '0.6rem', background: matched.includes(idx) ? darkMode ? '#0a0e27' : '#f0f0f0' : flipped.includes(idx) ? darkMode ? '#1f2d42' : '#fff' : 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: darkMode ? '#e8f0ff' : '#333', transition: 'all 0.2s', opacity: matched.includes(idx) ? 0.3 : 1, minHeight: '40px', aspectRatio: '1' }}>
                {flipped.includes(idx) || matched.includes(idx) ? card : '?'}
              </button>
            ))}
          </div>
          <button onClick={initMemoryGame} style={{ width: '100%', padding: '0.6rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>🔄 New Game</button>
        </div>
      )}

      {activeTab === 'hangman' && (
        <div style={{ background: darkMode ? '#1f2d42' : 'white', padding: '1rem', borderRadius: '12px', boxShadow: darkMode ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.08)', maxWidth: '380px', margin: '0 auto', overflowX: 'hidden', overflowY: 'auto', maxHeight: '70vh' }}>
          <h5 style={{ fontWeight: 'bold', color: darkMode ? '#e8f0ff' : '#333', marginBottom: '0.8rem', fontSize: '0.95rem' }}>📝 Hangman</h5>
          <div style={{ background: darkMode ? '#0a0e27' : '#f3f4f6', padding: '0.8rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.4rem', letterSpacing: '0.3rem', fontFamily: 'monospace', fontWeight: 'bold', color: darkMode ? '#e8f0ff' : '#333', marginBottom: '0.4rem' }}>{getHangmanDisplay()}</p>
            <p style={{ color: darkMode ? '#a8afc7' : '#666', fontSize: '0.85rem', marginBottom: '0' }}>Wrong: {hangmanWrong}/6</p>
          </div>
          
          {(hangmanGameOver || hangmanWon) ? (
            <div style={{ background: hangmanWon ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '0.7rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center', border: `2px solid ${hangmanWon ? '#10b981' : '#ef4444'}` }}>
              <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: hangmanWon ? '#10b981' : '#ef4444', marginBottom: '0.3rem' }}>{hangmanWon ? '✅ Won!' : '❌ Over!'}</p>
              <p style={{ color: darkMode ? '#a8afc7' : '#666', fontSize: '0.8rem', marginBottom: '0' }}>Word: {hangmanWord}</p>
            </div>
          ) : null}

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(5, 1fr)' : 'repeat(6, 1fr)', gap: '0.3rem', marginBottom: '1rem' }}>
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(letter => (
              <button key={letter} onClick={() => handleHangmanGuess(letter)} disabled={hangmanGuesses.includes(letter) || hangmanGameOver || hangmanWon} style={{ padding: '0.35rem', background: hangmanGuesses.includes(letter) ? darkMode ? '#0a0e27' : '#e5e7eb' : '#667eea', color: darkMode && !hangmanGuesses.includes(letter) ? 'white' : darkMode ? '#6b7280' : '#333', border: 'none', borderRadius: '3px', cursor: hangmanGuesses.includes(letter) || hangmanGameOver || hangmanWon ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '0.65rem', opacity: hangmanGuesses.includes(letter) ? 0.5 : 1, minHeight: '26px' }}>
                {letter}
              </button>
            ))}
          </div>

          <button onClick={initHangman} style={{ width: '100%', padding: '0.6rem', background: '#06b6d4', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>🔄 New Game</button>
        </div>
      )}

      {activeTab === 'speed' && (
        <div style={{ background: darkMode ? '#1f2d42' : 'white', padding: '1rem', borderRadius: '12px', boxShadow: darkMode ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.08)', maxWidth: '380px', margin: '0 auto', overflow: 'hidden' }}>
          <h5 style={{ fontWeight: 'bold', color: darkMode ? '#e8f0ff' : '#333', marginBottom: '1rem', fontSize: '0.95rem' }}>⚡ Speed Game</h5>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ background: darkMode ? '#0a0e27' : '#f3f4f6', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: darkMode ? '#a8afc7' : '#666', marginBottom: '0.2rem' }}>Score</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0' }}>{speedScore}</p>
            </div>
            <div style={{ background: darkMode ? '#0a0e27' : '#f3f4f6', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: darkMode ? '#a8afc7' : '#666', marginBottom: '0.2rem' }}>Time</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0' }}>{speedTime}s</p>
            </div>
            <div style={{ background: darkMode ? '#0a0e27' : '#f3f4f6', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: darkMode ? '#a8afc7' : '#666', marginBottom: '0.2rem' }}>Total</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ec4899', marginBottom: '0' }}>{speedTargets[0] + speedTargets[1]}</p>
            </div>
          </div>

          {speedActive ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', marginBottom: '1rem' }}>
              <button onClick={() => handleSpeedClick(speedTargets[0] + speedTargets[1])} style={{ padding: '1.2rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>{speedTargets[0] + speedTargets[1]}</button>
              <button onClick={() => handleSpeedClick(speedTargets[0] + speedTargets[1] - 1)} style={{ padding: '1.2rem', background: darkMode ? '#0a0e27' : '#f3f4f6', color: darkMode ? '#e8f0ff' : '#333', border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>{speedTargets[0] + speedTargets[1] - 1}</button>
            </div>
          ) : (
            <button onClick={startSpeedGame} style={{ width: '100%', padding: '0.8rem', background: 'linear-gradient(135deg, #ec4899, #f43f5e)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem' }}>🚀 Start Game</button>
          )}
          
          {!speedActive && speedScore > 0 && (
            <div style={{ background: darkMode ? '#0a0e27' : '#f3f4f6', padding: '0.8rem', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: darkMode ? '#a8afc7' : '#666' }}>Final Score: <span style={{ fontWeight: 'bold', color: '#10b981', fontSize: '1rem' }}>{speedScore}</span></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
