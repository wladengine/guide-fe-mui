import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Footer from "./components/footer/Footer";
import Market from "./pages/market/Market";
import Main from "./pages/main/Main";
import Dashboard from "./pages/dashboard/Dashboard";
import Map from "./pages/map/Map";
import Terms from "./pages/terms/Terms";

const sections = [
    { title: 'Главная', url: '/' },
    { title: 'Сравнение инвест.инструментов', url: '/dashboard' },
    { title: 'Глоссарий', url: '/terms' },
    { title: 'Карта', url: '/map' },
    { title: 'ИнвестМаркет', url: '/market' },
    { title: 'Контакты', url: '#' },
    // { title: 'Science', url: '#' },
    // { title: 'Health', url: '#' },
    // { title: 'Style', url: '#' },
    // { title: 'Travel', url: '#' },
];
const theme = createTheme();

export default function App() {
  return (
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container maxWidth="lg">
              <Header
                  title="Информационно-аналитическая система «Интерактивный справочник инвестора в публичные сферы»"
                  sections={sections}
              />
              <BrowserRouter>
                  <Routes>
                      <Route path={'/'} element={<Main />} />
                      <Route path={'/market'} element={<Market />} />
                      <Route path={'/dashboard'} element={<Dashboard />} />
                      <Route path={'/map'} element={<Map />} />
                      <Route path={'/terms'} element={<Terms />} />
                  </Routes>
              </BrowserRouter>
          </Container>
          <Footer />
      </ThemeProvider>
  );
}
