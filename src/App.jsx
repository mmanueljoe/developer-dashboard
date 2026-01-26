import devResources from '@data/devResources.json';
import { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@contexts/AppContext';
import ErrorBoundary from '@components/ErrorBoundary';
import LoadingScreen from '@components/LoadingScreen';
import UserNameForm from '@components/UserNameForm';
import Layout from '@components/Layout';
import Dashboard from '@components/Dashboard';
import CategoryPage from '@components/CategoryPage';

function AppContent() {
  const { username } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const categories = Object.keys(devResources);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!username) {
      setActiveCategory(null);
    }
  }, [username]);

  if (isLoading) return <LoadingScreen />;
  if (!username) return <UserNameForm />;

  return (
    <Layout categories={categories} activeCategory={activeCategory} onSelectCategory={setActiveCategory}>
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

function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AppProvider>
  );
}

export default App;
