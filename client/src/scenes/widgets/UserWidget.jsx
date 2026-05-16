import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@mui/icons-material";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  IconButton,
  Modal,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import UserImage from "../../components/UserImage.jsx";
import FlexBetween from "../../components/FlexBetween.jsx";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../state/index.js";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setLocalUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user);
  const isOwner = loggedInUser?._id === userId;

  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const res = await fetch(`http://localhost:3001/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setLocalUser(data);
  };

  useEffect(() => {
    getUser();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const openEdit = () => {
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      location: user.location || "",
      occupation: user.occupation || "",
      twitter: user.socialLinks?.twitter || "",
      linkedin: user.socialLinks?.linkedin || "",
      instagram: user.socialLinks?.instagram || "",
    });
    setEditOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:3001/users/${userId}/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          location: form.location,
          occupation: form.occupation,
          socialLinks: {
            twitter: form.twitter,
            linkedin: form.linkedin,
            instagram: form.instagram,
          },
        }),
      });
      const updated = await res.json();
      setLocalUser(updated);
      if (isOwner) dispatch(setUser({ user: updated }));
      setEditOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const { firstName, lastName, location, occupation, viewedProfile, impressions, friends, socialLinks } = user;

  const SocialRow = ({ icon, label, subtitle, url }) => (
    <FlexBetween sx={{ gap: "1rem", mb: "0.5rem" }}>
      <FlexBetween sx={{ gap: "1rem" }}>
        <Box sx={{ color: main, display: "flex", alignItems: "center" }}>{icon}</Box>
        <Box>
          <Typography color={main} fontWeight="500" fontSize="0.85rem">{label}</Typography>
          {url ? (
            <Typography
              component="a"
              href={url.startsWith("http") ? url : `https://${url}`}
              target="_blank"
              rel="noreferrer"
              color="primary"
              fontSize="0.75rem"
              sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              {url}
            </Typography>
          ) : (
            <Typography color={medium} fontSize="0.75rem">{subtitle}</Typography>
          )}
        </Box>
      </FlexBetween>
      {isOwner && (
        <EditOutlined
          sx={{ color: main, cursor: "pointer", fontSize: "1rem" }}
          onClick={openEdit}
        />
      )}
    </FlexBetween>
  );

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        sx={{ gap: "0.5rem", pb: "1.1rem" }}
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween sx={{ gap: "1rem" }}>
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{ m: "0.5rem", mb: "0rem", "&:hover": { color: dark, cursor: "pointer" } }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography sx={{ m: "0", mb: "0rem" }} color={medium}>
              {friends.length} friends
            </Typography>
          </Box>
        </FlexBetween>
        {isOwner && (
          <ManageAccountsOutlined
            onClick={(e) => { e.stopPropagation(); openEdit(); }}
            sx={{ borderRadius: "50%", "&:hover": { cursor: "pointer", backgroundColor: palette.neutral.light } }}
          />
        )}
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box sx={{ p: "1rem 0" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", mb: "0.5rem" }}>
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location || "—"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation || "—"}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box sx={{ p: "1rem 0" }}>
        <FlexBetween sx={{ mb: "0.5rem" }}>
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">{viewedProfile}</Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">{impressions}</Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW — Social Links */}
      <Box sx={{ p: "1rem 0" }}>
        <Typography sx={{ fontSize: "1rem", color: main, fontWeight: "500", mb: "1rem" }}>
          Social Profiles
        </Typography>
        <SocialRow
          icon={<TwitterIcon />}
          label="Twitter / X"
          subtitle={isOwner ? "Click edit to add your Twitter" : "Not added"}
          url={socialLinks?.twitter}
        />
        <SocialRow
          icon={<LinkedInIcon />}
          label="LinkedIn"
          subtitle={isOwner ? "Click edit to add your LinkedIn" : "Not added"}
          url={socialLinks?.linkedin}
        />
        <SocialRow
          icon={<InstagramIcon />}
          label="Instagram"
          subtitle={isOwner ? "Click edit to add your Instagram" : "Not added"}
          url={socialLinks?.instagram}
        />
      </Box>

      {/* EDIT PROFILE MODAL */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 480 },
            bgcolor: palette.background.alt,
            borderRadius: "12px",
            boxShadow: 24,
            p: "2rem",
            outline: "none",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <FlexBetween sx={{ mb: "1.5rem" }}>
            <Typography variant="h5" fontWeight="600" color={dark}>
              Edit Profile
            </Typography>
            <IconButton onClick={() => setEditOpen(false)} size="small">
              <CloseOutlined />
            </IconButton>
          </FlexBetween>

          <Typography color={medium} fontSize="0.8rem" fontWeight="600"
            sx={{ mb: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>
            Basic Info
          </Typography>
          <Box sx={{ display: "flex", gap: "0.75rem", mb: "0.75rem" }}>
            <TextField label="First Name" value={form.firstName || ""}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              fullWidth size="small" />
            <TextField label="Last Name" value={form.lastName || ""}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              fullWidth size="small" />
          </Box>
          <TextField label="Location" value={form.location || ""}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            fullWidth size="small" sx={{ mb: "0.75rem" }} />
          <TextField label="Occupation" value={form.occupation || ""}
            onChange={(e) => setForm({ ...form, occupation: e.target.value })}
            fullWidth size="small" sx={{ mb: "1.5rem" }} />

          <Typography color={medium} fontSize="0.8rem" fontWeight="600"
            sx={{ mb: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>
            Social Links
          </Typography>
          <TextField label="Twitter / X URL" placeholder="https://twitter.com/username"
            value={form.twitter || ""}
            onChange={(e) => setForm({ ...form, twitter: e.target.value })}
            fullWidth size="small" sx={{ mb: "0.75rem" }} />
          <TextField label="LinkedIn URL" placeholder="https://linkedin.com/in/username"
            value={form.linkedin || ""}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            fullWidth size="small" sx={{ mb: "0.75rem" }} />
          <TextField label="Instagram URL" placeholder="https://instagram.com/username"
            value={form.instagram || ""}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            fullWidth size="small" sx={{ mb: "1.5rem" }} />

          <Box sx={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={() => setEditOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} /> : <SaveOutlined />}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </WidgetWrapper>
  );
};

export default UserWidget;