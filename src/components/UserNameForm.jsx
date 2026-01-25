import { useState } from 'react';

function UserNameForm({ onSubmit }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = inputValue.trim();

    if (trimmed) {
      onSubmit(trimmed);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-black">
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <label htmlFor="username" className="block text-sm font-medium text-black dark:text-white">
          Your username
        </label>
        <input
          id="username"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your username"
          autoFocus
          className="w-full px-3 py-2.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-md text-sm font-medium bg-primary-500 text-white border border-primary-600 dark:border-primary-400 hover:bg-primary-600 dark:hover:bg-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
          aria-label="Continue to dashboard"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

export default UserNameForm;
