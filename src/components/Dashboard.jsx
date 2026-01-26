import ResourcePreview from '@components/ResourcePreview';

function Dashboard({ devResources, originalResources, onViewMore, searchQuery, hasResults }) {
  const categories = Object.keys(devResources);

  if (!hasResults && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center" role="main">
        <svg
          className="h-12 w-12 text-neutral-400 dark:text-neutral-600 mb-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">No resources found</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-500">
          Try a different search term or clear the search to see all resources.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6" role="main">
      {categories.map((categoryId) => (
        <ResourcePreview
          key={categoryId}
          categoryId={categoryId}
          title={categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}
          items={devResources[categoryId]}
          originalItemsCount={originalResources?.[categoryId]?.length}
          onViewMore={onViewMore}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}

export default Dashboard;
