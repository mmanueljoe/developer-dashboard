import { PREVIEW_LIMIT } from '@utils/constants';
import { getFaviconUrl } from '@utils/getFavicon';

function ResourcePreview({ categoryId, title, items, onViewMore, searchQuery }) {
  const displayItems = searchQuery ? items : items.slice(0, PREVIEW_LIMIT);
  const shouldShowViewMore = !searchQuery && items.length > 0;

  return (
    <section
      className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 sm:p-5"
      aria-labelledby={`heading-${categoryId}`}
    >
      <h2 id={`heading-${categoryId}`} className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-3">
        {title}
      </h2>
      <ul className="flex flex-col gap-2 mb-4">
        {displayItems.map((item) => {
          const faviconUrl = getFaviconUrl(item.url);
          return (
            <li key={item.id} className="flex items-start gap-3">
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
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
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
      {shouldShowViewMore && (
        <button
          type="button"
          onClick={() => onViewMore(categoryId)}
          className="px-4 py-2.5 rounded-md text-sm font-medium bg-primary-500 text-white border border-primary-600 dark:border-primary-400 hover:bg-primary-600 dark:hover:bg-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black active:opacity-90 flex items-center gap-2 justify-center"
          aria-label="View more resources in this category"
        >
          <span>View more</span>
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
      )}
      {searchQuery && displayItems.length === 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-2">No matches in this category</p>
      )}
    </section>
  );
}

export default ResourcePreview;
