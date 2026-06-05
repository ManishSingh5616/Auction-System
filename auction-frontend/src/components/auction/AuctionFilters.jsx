const CATEGORIES = ["All", "Electronics", "Fashion", "Art", "Collectibles", "Vehicles", "Real Estate", "Other"];
const SORTS = [
  { value: "createdAt", label: "Newest" },
  { value: "ending_soon", label: "Ending Soon" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "most_bids", label: "Most Bids" },
];

export default function AuctionFilters({ filters, setFilters }) {
  const handleSearch = (e) => {
    setFilters((f) => ({ ...f, search: e.target.value, page: 1 }));
  };

  const handleCategory = (cat) => {
    setFilters((f) => ({ ...f, category: cat, page: 1 }));
  };

  const handleSort = (e) => {
    setFilters((f) => ({ ...f, sort: e.target.value, page: 1 }));
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* Search + Sort row */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          value={filters.search}
          onChange={handleSearch}
          placeholder="Search auctions..."
          style={{
            flex: 1, background: "#141414", border: "1px solid #2a2a2a", borderRadius: "8px",
            padding: "0.7rem 1rem", color: "#f0ede6", fontSize: "0.9rem", outline: "none",
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
        <select
          value={filters.sort}
          onChange={handleSort}
          style={{
            background: "#141414", border: "1px solid #2a2a2a", borderRadius: "8px",
            padding: "0.7rem 1rem", color: "#888", fontSize: "0.85rem", outline: "none",
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif", appearance: "none", minWidth: "160px",
          }}
        >
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            style={{
              padding: "0.4rem 0.9rem", borderRadius: "100px", fontSize: "0.8rem",
              border: "1px solid",
              borderColor: filters.category === cat ? "#e8c547" : "#2a2a2a",
              background: filters.category === cat ? "#e8c54722" : "transparent",
              color: filters.category === cat ? "#e8c547" : "#666",
              cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
