export function filterAssets({
  assets,
  searchQuery,
  filterType,
  sortBy,
}) {
  const query = searchQuery.trim().toLowerCase();

  const matchesQuery = (asset) => {
    if (!query) return true;
    const name = (asset.name || "").toLowerCase();
    const tags = Array.isArray(asset.tags)
      ? asset.tags.join(" ").toLowerCase()
      : (asset.tags || "").toString().toLowerCase();
    return name.includes(query) || tags.includes(query);
  };

  const normalizeType = (asset) => {
    const type = (asset.type || "").toLowerCase();
    if (["image", "video", "audio", "3d object"].includes(type)) return type;
    return "document";
  };

  const matchesFilter = (asset) => {
    if (filterType === "all") return true;
    return normalizeType(asset) === filterType;
  };

  const compareBy = (a, b) => {
    if (sortBy === "name") {
      return (a.name || "").localeCompare(b.name || "");
    }
    if (sortBy === "size") {
      return (b.size || 0) - (a.size || 0);
    }
    const aDate = new Date(a.created_on || 0).getTime();
    const bDate = new Date(b.created_on || 0).getTime();
    return bDate - aDate;
  };

  return assets
    .filter(matchesQuery)
    .filter(matchesFilter)
    .sort(compareBy);
}
