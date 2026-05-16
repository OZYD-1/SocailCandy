import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutlined,
  SendOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  InputBase,
  CircularProgress,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween.jsx";
import Friend from "../../components/Friend.jsx";
import UserImage from "../../components/UserImage.jsx";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setPosts } from "../../state/index.js";
import { toast } from "react-hot-toast";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const isOwner = loggedInUserId === postUserId;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const primary = palette.primary.main;

  const patchLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch {
      toast.error("Failed to like post");
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, comment: commentText }),
      });
      if (!response.ok) throw new Error();
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setCommentText("");
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      if (!response.ok) throw new Error();
      const updatedPosts = await response.json();
      dispatch(setPosts({ posts: updatedPosts }));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${name}'s post`,
      text: description,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <WidgetWrapper sx={{ m: "2rem 0" }}>
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween sx={{ mt: "0.25rem" }}>
        <FlexBetween sx={{ gap: "1rem" }}>
          {/* LIKE */}
          <FlexBetween sx={{ gap: "0.3rem" }}>
            <IconButton onClick={patchLike} disabled={isLiking}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          {/* COMMENT TOGGLE */}
          <FlexBetween sx={{ gap: "0.3rem" }}>
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween sx={{ gap: "0.5rem" }}>
          {/* SHARE */}
          <IconButton onClick={handleShare}>
            <ShareOutlined />
          </IconButton>
          {/* DELETE (only owner) */}
          {isOwner && (
            <IconButton onClick={handleDelete} sx={{ color: "#e53935" }}>
              <DeleteOutlined />
            </IconButton>
          )}
        </FlexBetween>
      </FlexBetween>

      {/* COMMENTS SECTION */}
      {isComments && (
        <Box sx={{ mt: "0.5rem" }}>
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <Box key={i}>
                <Divider />
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", p: "0.5rem" }}>
                  <UserImage image={c.userPicturePath} size="32px" />
                  <Box>
                    <Typography fontSize="0.8rem" fontWeight="500" color={main}>
                      {c.firstName} {c.lastName}
                    </Typography>
                    <Typography fontSize="0.85rem" color={medium}>
                      {c.comment}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography sx={{ color: medium, fontSize: "0.85rem", p: "0.5rem", textAlign: "center" }}>
              No comments yet. Be the first!
            </Typography>
          )}

          <Divider />

          {/* Add comment input */}
          <FlexBetween sx={{ gap: "0.5rem", pt: "0.75rem" }}>
            <InputBase
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              sx={{
                flex: 1,
                backgroundColor: palette.neutral.light,
                borderRadius: "1.5rem",
                padding: "0.4rem 1rem",
                fontSize: "0.85rem",
              }}
            />
            <IconButton
              onClick={handleAddComment}
              disabled={!commentText.trim() || isSubmitting}
              sx={{ color: primary }}
            >
              {isSubmitting ? <CircularProgress size={20} /> : <SendOutlined />}
            </IconButton>
          </FlexBetween>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;