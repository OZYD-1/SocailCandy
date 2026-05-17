import { Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween.jsx";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography sx={{ color: dark, fontWeight: "500" }} variant="h5">
          Sponsored
        </Typography>
        <Typography sx={{ color: medium }}>Create Ad</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="http://localhost:3001/assets/info4.jpeg"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography sx={{ color: main }}>MikaCosmetics</Typography>
        <Typography sx={{ color: medium }}>mikacosmetics.com</Typography>
      </FlexBetween>
      <Typography sx={{ color: medium, m: "0.5rem 0" }}>
        Your pathway to stunning and immaculate beauty and made sure your skin
        is exfoliating skin and shining like light.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;