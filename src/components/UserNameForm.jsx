import { useState, useRef } from 'react';
import { useApp } from '@contexts/AppContext';

function UserNameForm() {
  const { setUsername } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = inputValue.trim();

    if (!trimmed) {
      setError('Username is required.');
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    if (trimmed.length < 6) {
      setError('Username must be at least 6 characters.');
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    setError('');
    setUsername(trimmed);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-white dark:bg-black">
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4" noValidate>
        <label htmlFor="username" className="block text-sm font-medium text-black dark:text-white">
          Your username
        </label>
        <input
          id="username"
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError('');
          }}
          placeholder="Enter your username"
          autoFocus
          className="w-full px-3 py-2.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black focus-visible:border-primary-500"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'username-error' : undefined}
        />
        {error && (
          <p id="username-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="px-4 py-2.5 rounded-md text-sm font-medium bg-primary-500 text-white border border-primary-600 dark:border-primary-400 hover:bg-primary-600 dark:hover:bg-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black active:opacity-90 flex items-center gap-2 justify-center"
          aria-label="Continue to dashboard"
        >
          <span>Continue</span>
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default UserNameForm;
