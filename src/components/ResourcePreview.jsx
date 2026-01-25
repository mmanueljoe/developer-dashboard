import { PREVIEW_LIMIT } from '../constants';

function ResourcePreview({ categoryId, title, items, onViewMore }) {
  const preview = items.slice(0, PREVIEW_LIMIT);
  return (
    <section
      className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4"
      aria-labelledby={`heading-${categoryId}`}
    >
      <h2 id={`heading-${categoryId}`} className="text-xl font-semibold text-black dark:text-white mb-3">
        {title}
      </h2>
      <ul className="flex flex-col gap-2 mb-4">
        {preview.map((item) => (
          <li key={item.id} className="flex flex-col gap-0.5">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 font-medium underline underline-offset-2"
            >
              {item.name}
            </a>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onViewMore(categoryId)}
        className="bg-primary-500 text-white px-4 py-2 rounded-md text-sm font-medium border border-primary-600 dark:border-primary-400 hover:bg-primary-600 dark:hover:bg-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
        aria-label="View more resources in this category"
      >
        View more
      </button>
    </section>
  );
}

export default ResourcePreview;
