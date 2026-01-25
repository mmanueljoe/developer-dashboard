import devResources from './devResources.json';
import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import UserNameForm from './components/UserNameForm';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CategoryPage from './components/CategoryPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [theme, setTheme] = useState('light');
  const categories = Object.keys(devResources);
  const [activeCategory, setActiveCategory] = useState(null);

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
    <Layout
      username={username}
      theme={theme}
      onThemeToggle={handleThemeToggle}
      categories={categories}
      activeCategory={activeCategory}
      onSelectCategory={setActiveCategory}
    >
      {activeCategory === null ? (
        <Dashboard devResources={devResources} onViewMore={(id) => setActiveCategory(id)} />
      ) : (
        <CategoryPage
          categoryId={activeCategory}
          items={devResources[activeCategory] || []}
          onBack={() => setActiveCategory(null)}
        />
      )}
    </Layout>
  );
}

export default App;
