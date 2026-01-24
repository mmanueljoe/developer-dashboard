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
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Your username</label>
        <input
          id="username"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your username"
          autoFocus
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default UserNameForm;
