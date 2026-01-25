import Header from './Header';
import SideNav from './SideNav';

function Layout({ username, theme, onThemeToggle, categories, activeCategory, onSelectCategory, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      <Header username={username} theme={theme} onThemeToggle={onThemeToggle} />
      <div className="flex flex-1">
        <aside
          className="w-56 min-w-[14rem] shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
          aria-label="Sidebar"
        >
          <SideNav categories={categories} activeCategory={activeCategory} onSelectCategory={onSelectCategory} />
        </aside>
        <main className="flex-1 min-w-0 p-6">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
