import React, {useEffect} from "react";
import ProductDashboardRow from "../../components/product-dashboard-row/ProductDashboardRow";
import {
    Backdrop,
    Grid,
    Stack,
    CircularProgress
} from "@mui/material";
import Typography from "@mui/material/Typography";

const ProductDashboard = () => {
    const baseUrl = 'http://487346.msk-kvm.ru:3333'
    const [features, setFeatures] = React.useState(null)
    useEffect(() => {
        backdropOpen();
        fetch(`${baseUrl}/features`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setFeatures(data)
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => backdropClose())
    }, [])

    const GetAllUniqueParameters = () =>
        features && features
            .map((v) => v.product)
            .filter((item, pos, self) => self.findIndex(v => v.id === item.id) === pos)

    const termsRows =
        features && GetAllUniqueParameters()
        .map((val, index) =>
            <ProductDashboardRow
                key={index}
                product={val}
                filteredFeatures={
                    features
                        .filter((item) => item.product.id === val.id)
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
                <h3 style={{marginLeft: 12}}>Перечень инвестиционных инструментов</h3>
                <Grid container>
                    <Grid item xs={3}>
                        <Typography variant="body2" color="text.primary" style={{whiteSpace: "pre-line"}}>
                            Наименование инструмента
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="body2" color="text.primary" style={{whiteSpace: "pre-line"}}>
                            Нормативные документы
                        </Typography>
                    </Grid>
                </Grid>
                <Stack spacing={1} style={{marginLeft: 12, marginRight: 48, marginTop: 12}}>
                    {termsRows}
                </Stack>
            </Grid>
        </Grid>
    )
}

export default ProductDashboard