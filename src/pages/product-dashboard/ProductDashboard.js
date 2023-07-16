import React, {useEffect} from "react";
import ProductDashboardRow from "../../components/product-dashboard-row/ProductDashboardRow";
import {
    Backdrop,
    Grid,
    Stack,
    CircularProgress,
    Divider
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {baseUrl, standardGetRequestWithoutCookies} from "../../globalConstants";

const ProductDashboard = () => {
    const [products, setProducts] = React.useState(null)
    const [productDocumentsCache, setProductDocumentsCache] = React.useState({});
    useEffect(() => {
        fetch(`${baseUrl}/products`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setProducts(data)
                data.forEach((val, index) => {
                    cacheDocumentsForProduct(val.id)
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    const cacheDocumentsForProduct = (productId) => {
        const cached = getDataFromProductDocumentsCache(productId)
        if (!cached) {
            fetch(`${baseUrl}/products/${productId}/documents`, standardGetRequestWithoutCookies)
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    addToProductDocumentsCache(productId, data)
                })
                .catch(function (error) {
                    console.log(error)
                })
                .finally(() => backdropClose())
        }
    }

    const addToProductDocumentsCache = (key, value) => {
        setProductDocumentsCache(prevCache => ({
            ...prevCache,
            [key]: value,
        }))
    }
    const getDataFromProductDocumentsCache = (key) => {
        return productDocumentsCache[key] || null
    }

    const termsRows =
        products && products
        .map((val, index) =>
            getDataFromProductDocumentsCache(val.id) === null ? <></> :
            <ProductDashboardRow
                key={index}
                product={val}
                filteredFeatures={
                    getDataFromProductDocumentsCache(val.id)
                    //features.filter((item) => item.product.id === val.id)
                        //.map((v) => v.parameter)
                }
            />)

    const [backdropVisible, setBackdropVisible] = React.useState(false);
    const backdropClose = () => {
        setBackdropVisible(false);
    };
    const backdropOpen = () => {
        setBackdropVisible(true);
    };

    return (
        <Grid container spacing={2}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backdropVisible}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid item xs={11} className="ms-4">
                <Stack spacing={1} style={{marginLeft: 12, marginRight: 48, marginTop: 12, marginBottom: 12}}>
                    <Typography variant="h5" color="text.primary" style={{whiteSpace: "pre-line"}}>
                        Перечень инвестиционных инструментов
                    </Typography>
                    <Grid container>
                        <Grid item xs={3}>
                            <Typography variant="body" color="text.primary" style={{whiteSpace: "pre-line"}}>
                                Наименование инструмента
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <Typography variant="body" color="text.primary" style={{whiteSpace: "pre-line"}}>
                                Нормативные документы
                            </Typography>
                        </Grid>
                    </Grid>
                    <Stack spacing={2}>
                        {termsRows}
                        <Divider />
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default ProductDashboard