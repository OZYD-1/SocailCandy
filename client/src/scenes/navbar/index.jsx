import { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../../state/index.js";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween.jsx";
import UserImage from "../../components/UserImage.jsx";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const alt = theme.palette.background.alt;
  const main = theme.palette.neutral.main;
  const medium = theme.palette.neutral.medium;

  const fullName = `${user.firstName} ${user.lastName}`;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    const timer = setTimeout(() => handleSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `http://localhost:3001/users/search/user?query=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
      setShowResults(true);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (userId) => {
    setShowResults(false);
    setSearch("");
    navigate(`/profile/${userId}`);
  };

  const SearchBox = () => (
    <Box ref={searchRef} sx={{ position: "relative" }}>
      <FlexBetween
        sx={{
          backgroundColor: neutralLight,
          borderRadius: "9px",
          gap: "0.5rem",
          padding: "0.1rem 0.75rem",
        }}
      >
        <InputBase
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          sx={{ minWidth: "160px" }}
        />
        {isSearching ? (
          <CircularProgress size={18} />
        ) : (
          <IconButton onClick={() => handleSearch(search)} sx={{ p: "4px" }}>
            <Search />
          </IconButton>
        )}
      </FlexBetween>

      {/* Dropdown results */}
      {showResults && results.length > 0 && (
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            top: "110%",
            left: 0,
            right: 0,
            zIndex: 1000,
            borderRadius: "8px",
            overflow: "hidden",
            minWidth: "220px",
          }}
        >
          {results.map((u) => (
            <Box
              key={u._id}
              onClick={() => handleResultClick(u._id)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.6rem 1rem",
                cursor: "pointer",
                "&:hover": { backgroundColor: neutralLight },
              }}
            >
              <UserImage image={u.picturePath} size="36px" />
              <Box>
                <Typography fontSize="0.85rem" fontWeight="500" color={dark}>
                  {u.firstName} {u.lastName}
                </Typography>
                <Typography fontSize="0.75rem" color={medium}>
                  {u.occupation || u.location || ""}
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      )}

      {showResults && results.length === 0 && !isSearching && search.trim() && (
        <Paper
          elevation={4}
          sx={{ position: "absolute", top: "110%", left: 0, right: 0, zIndex: 1000, borderRadius: "8px", p: "0.75rem 1rem" }}
        >
          <Typography fontSize="0.85rem" color={main}>No users found</Typography>
        </Paper>
      )}
    </Box>
  );

  return (
    <FlexBetween sx={{ padding: "1rem 6%", backgroundColor: alt }}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            fontSize: "25px",
            mr: "1rem",
            "&:hover": { color: dark, cursor: "pointer" },
          }}
        >
          SocialCandy
        </Typography>
        {isNonMobileScreens && <SearchBox />}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween sx={{ gap: "1rem" }}>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <Message sx={{ fontSize: "25px" }} />
          <Notifications sx={{ fontSize: "25px" }} />
          <Help sx={{ fontSize: "25px" }} />
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": { pr: "0.25rem", width: "3rem" },
                "& .MuiSelect-select:focus": { backgroundColor: neutralLight },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          sx={{
            position: "fixed",
            right: "0",
            bottom: "0",
            height: "100%",
            zIndex: "10",
            maxWidth: "500px",
            minWidth: "300px",
            backgroundColor: background,
          }}
        >
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton onClick={() => setIsMobileMenuToggled(false)}>
              <Close />
            </IconButton>
          </Box>
          <FlexBetween
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
              p: "1rem",
            }}
          >
            <SearchBox />
            <IconButton onClick={() => dispatch(setMode())} sx={{ fontSize: "25px" }}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": { pr: "0.25rem", width: "3rem" },
                  "& .MuiSelect-select:focus": { backgroundColor: neutralLight },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;