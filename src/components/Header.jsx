function Header({ username, theme, onThemeToggle }) {
  const date = new Date();
  const formattedTime = date.toLocaleDateString('en-UK', { hour: '2-digit', minute: '2-digit' });

  return (
    <header>
      <span>{username}</span>

      <div>
        <span>{formattedTime}</span>
        <button type="button" onClick={onThemeToggle} aria-pressed={theme === 'dark'}>
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </header>
  );
}

export default Header;
