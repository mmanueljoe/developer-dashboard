import ResourcePreview from '@components/ResourcePreview';

function Dashboard({ devResources, onViewMore }) {
  const categories = Object.keys(devResources);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6" role="main">
      {categories.map((categoryId) => (
        <ResourcePreview
          key={categoryId}
          categoryId={categoryId}
          title={categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}
          items={devResources[categoryId]}
          onViewMore={onViewMore}
        />
      ))}
    </div>
  );
}

export default Dashboard;
