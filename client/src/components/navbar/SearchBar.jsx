import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search issues...",
  isMobile = false,
  sx = {},
}) => {
  const searchBarContent = (
    <TextField
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        style: {
          borderRadius: 50,
          backgroundColor: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        },
      }}
      sx={sx}
    />
  );

  if (isMobile) {
    return searchBarContent;
  }

  return (
    <motion.div
      initial={{ width: 200 }}
      whileFocus={{ width: 300 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}>
      {searchBarContent}
    </motion.div>
  );
};

export default SearchBar;
