function CategoryPage({ categoryId, items, onBack }) {
  const title = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  return (
    <div className="flex flex-col gap-4" role="main">
      <h2 className="text-xl font-semibold text-black dark:text-white mb-3">{title}</h2>
      <button
        type="button"
        onClick={onBack}
        className="px-4 py-2 rounded-md text-sm font-medium bg-primary-500 text-white border border-primary-600 dark:border-primary-400 hover:bg-primary-600 dark:hover:bg-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black active:opacity-90"
        aria-label="Back to Dashboard"
      >
        Back to Dashboard
      </button>
      <ul className="flex flex-col gap-2 mb-4">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col gap-0.5">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 font-medium underline underline-offset-2 hover:text-primary-700 dark:hover:text-primary-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
            >
              {item.name}
            </a>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryPage;
