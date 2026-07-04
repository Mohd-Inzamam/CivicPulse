const SearchBar = ({
  value,
  onChange,
  placeholder = "Search issues...",
  isMobile = false,
  sx = {},
}) => {
  return (
    <div className="search-wrap" style={sx}>
      <i className="ti ti-search search-icon" aria-hidden="true" />
      <input
        className="search-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
