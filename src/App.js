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
import Timelines from "./pages/timelines/Timelines";
import DocumentList from "./pages/document-list/DocumentList";
import Document from "./pages/document/Document";
import AuthContext from "./components/auth-context/AuthContext";
import Admin from "./pages/admin/Admin";
import FeatureList from "./pages/feature-list/FeatureList";
import Feature from "./pages/feature/Feature";
import Login from "./pages/login/Login";
import ProductDashboard from "./pages/product-dashboard/ProductDashboard";

const sections = [
    { title: 'Главная', url: '/' },
    { title: 'Инструменты', url: '/products-dashboard' },
    { title: 'Сравнение инвест.инструментов', url: '/dashboard' },
    { title: 'Этапы исполнения', url: '/timelines' },
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
    function getCookie(cname) {
        let name = cname + '='
        let decodedCookie = decodeURIComponent(document.cookie)
        let ca = decodedCookie.split(';')
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i]
            while (c.charAt(0) == ' ') {
                c = c.substring(1)
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length)
            }
        }
        return ''
    }
    let token = getCookie('authToken')
    const authToken = React.useState(token)
    return (
        <AuthContext.Provider value={authToken}>
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
                            <Route path={'/timelines'} element={<Timelines />} />
                            <Route path={'/admin'} element={<Admin />} />
                            <Route path={'/login'} element={<Login />} />
                            <Route path={'/document-list'} element={<DocumentList />} />
                            <Route path={'/document'} element={<Document />} />
                            <Route path={'/feature-list'} element={<FeatureList />} />
                            <Route path={'/feature'} element={<Feature />} />
                            <Route path={'/products-dashboard'} element={<ProductDashboard />} />
                        </Routes>
                    </BrowserRouter>
                </Container>
                <Footer description={''} title={''} />
            </ThemeProvider>
        </AuthContext.Provider>
    );
}
