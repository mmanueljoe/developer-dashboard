import devResources from '@data/devResources.json';
import { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@contexts/AppContext';
import ErrorBoundary from '@components/ErrorBoundary';
import LoadingScreen from '@components/LoadingScreen';
import UserNameForm from '@components/UserNameForm';
import Layout from '@components/Layout';
import Dashboard from '@components/Dashboard';
import CategoryPage from '@components/CategoryPage';
import SearchBar from '@components/SearchBar';
import { filterResources, filterItems } from '@utils/filterResources';

function AppContent() {
  const { username } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const categories = Object.keys(devResources);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!username) {
      setActiveCategory(null);
      setSearchQuery('');
    }
  }, [username]);

  if (isLoading) return <LoadingScreen />;
  if (!username) return <UserNameForm />;

  const filteredResources = searchQuery ? filterResources(devResources, searchQuery) : devResources;
  const filteredCategories = Object.keys(filteredResources);

  return (
    <Layout categories={categories} activeCategory={activeCategory} onSelectCategory={setActiveCategory}>
      <div className="flex flex-col gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        {activeCategory === null ? (
          <Dashboard
            devResources={filteredResources}
            originalResources={devResources}
            onViewMore={(id) => setActiveCategory(id)}
            searchQuery={searchQuery}
            hasResults={filteredCategories.length > 0}
          />
        ) : (
          <CategoryPage
            categoryId={activeCategory}
            items={filterItems(devResources[activeCategory] || [], searchQuery)}
            onBack={() => setActiveCategory(null)}
            searchQuery={searchQuery}
          />
        )}
      </div>
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
