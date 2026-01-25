import ResourcePreview from './ResourcePreview';

function Dashboard({ devResources, onViewMore }) {
  const categories = Object.keys(devResources);
  return (
    <div className="flex flex-col gap-6" role="main">
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
