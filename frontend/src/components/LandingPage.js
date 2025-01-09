// LandingPage.js
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import backgroundImage from "./job-background.jpg";

const LandingPage = () => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "2rem",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "black",
        height: "588px",
        opacity: "0.8"
      }}
    >
    <Box
      sx={{
        textAlign: "center",
        padding: "4rem 2rem",
        color:"black",
        textShadow: "0 0 3px white, 0 0 5px white",
        fontStyle:"italic"
        // backgroundColor: "#e9ecef",
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom sx={{ fontSize:"3rem"}}>
        Welcome to JobMatchAI
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: "2rem" , marginLeft: "400px", marginRight:"400px", fontSize:"1.5rem"}}>
        Your one-stop platform for finding and posting jobs, uploading resumes,
        and assessing candidates.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{
          padding: "0.75rem 2rem",
          fontSize: "1rem",
        }}
      >
        Get Started
      </Button>
    </Box>
    </div>
  );
};

export default LandingPage;
