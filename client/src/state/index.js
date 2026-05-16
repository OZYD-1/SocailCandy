import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  user: null,
  token: null,
  posts: [],
  notifications: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.notifications = [];
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload.notifications;
    },
    markNotificationsSeen: (state) => {
      state.notifications = state.notifications.map((n) => ({ ...n, seen: true }));
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
  },
});

export const {
  setMode, setLogin, setLogout, setFriends, setPosts, setPost,
  setNotifications, markNotificationsSeen, setUser,
} = authSlice.actions;
export default authSlice.reducer;