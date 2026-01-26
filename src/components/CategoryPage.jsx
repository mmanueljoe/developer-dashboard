import { getFaviconUrl } from '@utils/getFavicon';

function CategoryPage({ categoryId, items, onBack }) {
  const title = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  return (
    <div className="flex flex-col gap-4" role="main">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <h2 className="text-lg sm:text-xl font-semibold text-black dark:text-white">{title}</h2>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 rounded-md text-sm font-medium bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 hover:bg-primary-200 dark:hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black active:opacity-90 flex items-center gap-2"
          aria-label="Back to Dashboard"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>
      <ul className="flex flex-col gap-3">
        {items.map((item) => {
          const faviconUrl = getFaviconUrl(item.url);
          return (
            <li
              key={item.id}
              className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 sm:p-5 flex items-start gap-3"
            >
              {faviconUrl && (
                <img
                  src={faviconUrl}
                  alt=""
                  className="w-5 h-5 shrink-0 mt-0.5 rounded"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 font-medium underline underline-offset-2 hover:text-primary-700 dark:hover:text-primary-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
                >
                  {item.name}
                </a>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CategoryPage;
