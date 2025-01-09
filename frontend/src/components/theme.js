// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff",
    },
    secondary: {
      main: "#6c757d",
    },
  },
  typography: {
    h2: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    body1: {
      fontSize: "1.25rem",
    },
  },
});

export default theme;
