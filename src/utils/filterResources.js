/**
 * Filter resources based on search query
 * Matches against name, description, and category name
 */
export function filterResources(resources, searchQuery) {
  if (!searchQuery || !searchQuery.trim()) {
    return resources;
  }

  const query = searchQuery.toLowerCase().trim();
  const filtered = {};

  Object.keys(resources).forEach((categoryId) => {
    const categoryName = categoryId.toLowerCase();
    const categoryItems = resources[categoryId].filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(query);
      const descMatch = item.description?.toLowerCase().includes(query);
      const categoryMatch = categoryName.includes(query);
      return nameMatch || descMatch || categoryMatch;
    });

    if (categoryItems.length > 0) {
      filtered[categoryId] = categoryItems;
    }
  });

  return filtered;
}

/**
 * Filter a single array of items
 */
export function filterItems(items, searchQuery) {
  if (!searchQuery || !searchQuery.trim()) {
    return items;
  }

  const query = searchQuery.toLowerCase().trim();
  return items.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(query);
    const descMatch = item.description?.toLowerCase().includes(query);
    return nameMatch || descMatch;
  });
}
