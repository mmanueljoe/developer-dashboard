import devResources from './devResources.json';
import { useState, useEffect } from 'react';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import UserNameForm from './components/UserNameForm';
import Header from './components/Header';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [theme, setTheme] = useState('light');
  const categories = Object.keys(devResources);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (isLoading) return <LoadingScreen />;
  if (!username) return <UserNameForm onSubmit={setUsername} />;

  function handleThemeToggle() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  return (
    <div className="app">
      <Header username={username} theme={theme} onThemeToggle={handleThemeToggle} />

      <main>
        {categories.map((category) => (
          <div key={category}>
            <h2>{category}</h2>
            <div>
              {devResources[category].map((item) => (
                <div key={item.id}>
                  <div>
                    <img src={item.icon} alt="Resource Icon" />
                  </div>
                  <div>
                    <p>{item.descrittion}</p>
                  </div>
                  <div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.name}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      <footer>
        <div>
          <a href="https://www.linkedin.com/in/your-profile">LinkedIn</a>
          <a href="https://www.github.com/your-profile">GitHub</a>
          <a href="https://www.twitter.com/your-profile">Twitter</a>
        </div>
        <p>Copyright 2026 Developer Resources</p>
      </footer>
    </div>
  );
}

export default App;
