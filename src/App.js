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
import Article from "./pages/article/Article";
import Segment from "./pages/segment/Segment";
import ProductList from "./pages/product-list/ProductList";
import ParameterList from "./pages/parameter-list/ParameterList";
import GroupList from "./pages/group-list/GroupList";
import Product from "./pages/product/Product";
import Parameter from "./pages/parameter/Parameter";
import Group from "./pages/group/Group";
import RealmList from "./pages/realm-list/RealmList";
import Realm from "./pages/realm/Realm";
import ActorList from "./pages/actor-list/ActorList";
import ClaimList from "./pages/claim-list/ClaimList";
import FeeList from "./pages/fee-list/FeeList";
import Claim from "./pages/claim/Claim";
import TermList from "./pages/term-list/TermList";
import Term from "./pages/term/Term";
import RegionList from "./pages/region-list/RegionList";
import Region from "./pages/region/Region";
import FoundationList from "./pages/foundation-list/FoundationList";
import Foundation from "./pages/foundation/Foundation";
import ObjectList from "./pages/object-list/ObjectList";
import Object from "./pages/object/Object";
import Stage from "./pages/stage/Stage";

const sections = [
    { title: 'Главная', url: '/' },
    { title: 'Перечень инвест.инструментов', url: '/products-dashboard' },
    { title: 'Сравнение инвест.инструментов', url: '/dashboard' },
    { title: 'Этапы реализации инвест.инструментов', url: '/timelines' },
    { title: 'Глоссарий', url: '/terms' },
    { title: 'Карта', url: '/map' },
    { title: 'ИнвестМаркет', url: '/market' },
    //{ title: 'Контакты', url: '#' },
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
                            <Route path={'/article'} element={<Article />} />
                            <Route path={'/segment'} element={<Segment />} />
                            <Route path={'/product-list'} element={<ProductList />} />
                            <Route path={'/product'} element={<Product />} />
                            <Route path={'/parameter-list'} element={<ParameterList />} />
                            <Route path={'/parameter'} element={<Parameter />} />
                            <Route path={'/group-list'} element={<GroupList />} />
                            <Route path={'/group'} element={<Group />} />
                            <Route path={'/realm-list'} element={<RealmList />} />
                            <Route path={'/realm'} element={<Realm />} />

                            <Route path={'/actor-list'} element={<ActorList />} />
                            <Route path={'/fee-list'} element={<FeeList />} />
                            <Route path={'/claim-list'} element={<ClaimList />} />
                            <Route path={'/claim'} element={<Claim />} />
                            <Route path={'/term-list'} element={<TermList />} />
                            <Route path={'/term'} element={<Term />} />
                            <Route path={'/region-list'} element={<RegionList />} />
                            <Route path={'/region'} element={<Region />} />
                            <Route path={'/foundation-list'} element={<FoundationList />} />
                            <Route path={'/foundation'} element={<Foundation />} />
                            <Route path={'/object-list'} element={<ObjectList />} />
                            <Route path={'/object'} element={<Object />} />
                            <Route path={'/stage'} element={<Stage />} />
                        </Routes>
                    </BrowserRouter>
                </Container>
                <Footer description={''} title={''} />
            </ThemeProvider>
        </AuthContext.Provider>
    );
}
