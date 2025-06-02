import React from 'react';
import './App.scss';
import Header from '../Header/Header';
import { Card, CardContent, Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import Router from '../../Router';
import { PartsProvider } from '../../contexts/parts/provider';
import partsRawData from "../../data/parts.json"

export const theme = createTheme({
  palette: {
    primary: {
      main: '#d3ff31',
    },
    secondary: {
      main: '#5D31FF',
    },
    background: {
      default: '#1c1c1c',
      paper: '#2d2d2d',
    },
    text: {
      primary: 'rgba(255,255,255,0.9)',
    },
    error: {
      main: '#FF316C',
    },
    info: {
      main: '#6CFF31',
    },
    success: {
      main: '#31FFC4',
    },
    warning: {
      main: '#FFC431',
    },
  },
});

function App(props: {}) {
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      <CssBaseline enableColorScheme />      
      <Header />
      <Container maxWidth="lg">
        <Card
          variant="outlined"
          sx={{
            marginTop: theme.spacing(14)
          }} >
          <CardContent>
            <PartsProvider data={partsRawData}>
              <Router />
            </PartsProvider>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default App;
