import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../../components/Friend.jsx";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state/index.js";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <WidgetWrapper sx={{ m: "2rem 0" }}>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {Array.isArray(friends) && friends.length > 0 ? (
          friends.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
            />
          ))
        ) : (
          <p sx={{ fontSize: "0.85rem", opacity: 0.7 }}>
            You have no friends yet. Add some friends to see them here!
          </p>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
