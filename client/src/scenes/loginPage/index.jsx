import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form.jsx";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          p: "1rem 6%",
          textAlign: "center",
          backgroundColor: theme.palette.background.alt,
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: "32px" , color: theme.palette.primary.main }}>
          SocialCandy
        </Typography>
      </Box>

      <Box
        sx={{
          width: isNonMobileScreens ? "70%" : "93%",
          p: "2rem",
          m: "4rem auto",
          borderRadius: "1.5rem",
          backgroundColor: theme.palette.background.alt,
        }}
      >
        <Typography sx={{ fontWeight: "500", variant: "h5", mb: "1.5rem", textAlign: "left" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "1.4rem", display: "inline", mr: "0.5rem" , color: theme.palette.primary.main }}>
            Welcome
          </Typography>
          to SocialCandy, the Social Media for Sociopaths!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;