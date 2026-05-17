import { PersonAddOutlined, PersonRemoveOutlined, HourglassEmptyOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../state/index.js";
import FlexBetween from "./FlexBetween.jsx";
import UserImage from "./UserImage.jsx";
import { useState } from "react";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const [requestSent, setRequestSent] = useState(false);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = Array.isArray(friends)
    ? friends.find((friend) => friend._id === friendId)
    : false;

  const handleAction = async () => {
    if (isFriend) {
      // Remove friend
      const response = await fetch(`http://localhost:3001/users/${_id}/${friendId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } else {
      // Send friend request
      const res = await fetch(`http://localhost:3001/users/${_id}/request/${friendId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setRequestSent(true);
    }
  };

  // Don't show button request for self
  if (String(_id) === String(friendId)) return (
    <FlexBetween>
      <FlexBetween sx={{ gap: "1rem" }}>
        <UserImage image={userPicturePath} size="55px" />
        <Box onClick={() => { navigate(`/profile/${friendId}`); navigate(0); }}>
          <Typography color={main} variant="h5" fontWeight="500"
            sx={{ "&:hover": { color: palette.primary.light, cursor: "pointer" } }}>
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">{subtitle}</Typography>
        </Box>
      </FlexBetween>
    </FlexBetween>
  );

  return (
    <FlexBetween>
      <FlexBetween sx={{ gap: "1rem" }}>
        <UserImage image={userPicturePath} size="55px" />
        <Box onClick={() => { navigate(`/profile/${friendId}`); navigate(0); }}>
          <Typography color={main} variant="h5" fontWeight="500"
            sx={{ "&:hover": { color: palette.primary.light, cursor: "pointer" } }}>
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">{subtitle}</Typography>
        </Box>
      </FlexBetween>
      <Tooltip title={isFriend ? "Remove friend" : requestSent ? "Request sent" : "Send friend request"}>
        <span>
          <IconButton
            onClick={handleAction}
            disabled={requestSent && !isFriend}
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          >
            {isFriend ? (
              <PersonRemoveOutlined sx={{ color: primaryDark }} />
            ) : requestSent ? (
              <HourglassEmptyOutlined sx={{ color: primaryDark }} />
            ) : (
              <PersonAddOutlined sx={{ color: primaryDark }} />
            )}
          </IconButton>
        </span>
      </Tooltip>
    </FlexBetween>
  );
};

export default Friend;