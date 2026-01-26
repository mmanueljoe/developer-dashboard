import { useState } from 'react';
import Header from '@components/Header';
import SideNav from '@components/SideNav';

function Layout({ categories, activeCategory, onSelectCategory, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelect = (id) => {
    onSelectCategory(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      <Header onMenuToggle={() => setSidebarOpen((s) => !s)} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1 relative min-h-0 overflow-hidden">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <aside
          className={`
            fixed left-0 top-0 z-40 h-full w-64 pt-16
            border-r border-neutral-200 dark:border-neutral-800
            bg-neutral-50 dark:bg-neutral-950
            transform transition-transform duration-200 ease-out
            flex flex-col overflow-hidden
            lg:fixed lg:left-0 lg:top-16 lg:bottom-0 lg:z-10 lg:w-56 lg:min-w-56 lg:pt-4 lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          aria-label="Sidebar"
        >
          <SideNav categories={categories} activeCategory={activeCategory} onSelectCategory={handleSelect} />
        </aside>
        <main className="flex-1 min-w-0 p-4 sm:p-6 overflow-y-auto lg:ml-56">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
