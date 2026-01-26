import { useApp } from '@contexts/AppContext';

function Header({ onMenuToggle, sidebarOpen }) {
  const { username, theme, toggleTheme, logout } = useApp();
  const date = new Date();
  const formattedTime = date.toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit' });

  return (
    <header
      className="sticky top-0 z-50 flex justify-between items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800"
      role="banner"
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            aria-expanded={sidebarOpen}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            className="shrink-0 p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
          >
            {sidebarOpen ? (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        )}
        <span className="font-medium text-black dark:text-white truncate">{username}</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400" aria-hidden="true">
          {formattedTime}
        </span>
        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={theme === 'dark'}
          className="p-2 rounded-md bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 hover:bg-primary-200 dark:hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black active:opacity-90"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364 6.364l-2.121-2.121M7.757 7.757L5.636 5.636m12.728 0l-2.121 2.121M7.757 16.243l-2.121 2.121"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={logout}
          className="p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
          aria-label="Log out"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Header;
