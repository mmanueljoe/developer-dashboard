function SideNav({ categories, activeCategory, onSelectCategory }) {
  return (
    <nav className="p-4" aria-label="Resource categories">
      <ul className="flex flex-col gap-1">
        <li>
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`
              w-full text-left px-3 py-2 rounded-md text-sm font-medium
              transition-colors
              ${activeCategory === null ? 'bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black active:opacity-90'}
            `}
            aria-current={activeCategory === null ? 'page' : undefined}
          >
            Dashboard
          </button>
        </li>

        {categories.map((id) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onSelectCategory(id)}
              className={`
                w-full text-left px-3 py-2 rounded-md text-sm font-medium
                transition-colors
                ${activeCategory === id ? 'bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black'}
              `}
              aria-current={activeCategory === id ? 'page' : undefined}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SideNav;
