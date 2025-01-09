import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
// import App from './components/JobSearchPlatform';
import { ThemeProvider } from "@mui/material/styles";
import reportWebVitals from './reportWebVitals';
import JobSearchPlatform from './components/JobSearchPlatform';
import theme from "./components/theme";
// import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <BrowserRouter> Wrap your app with BrowserRouter */}
    <ThemeProvider theme={theme}>
    <JobSearchPlatform />
  </ThemeProvider>,
    {/* <App /> */}
    {/* <JobSearchPlatform/> */}
    {/* </BrowserRouter> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
