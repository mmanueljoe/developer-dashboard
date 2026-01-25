function Header({ username, theme, onThemeToggle }) {
  const date = new Date();
  const formattedTime = date.toLocaleDateString('en-UK', { hour: '2-digit', minute: '2-digit' });

  return (
    <header
      className="flex justify-between items-center gap-4 p-4 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800"
      role="banner"
    >
      <span className="font-medium text-black dark:text-white">{username}</span>

      <div className="flex items-center gap-4">
        <span className="text-sm text-neutral-600 dark:text-neutral-400" aria-hidden="true">
          {formattedTime}
        </span>
        <button
          type="button"
          onClick={onThemeToggle}
          aria-pressed={theme === 'dark'}
          className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 hover:bg-primary-200 dark:hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black active:opacity-90"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </header>
  );
}

export default Header;
