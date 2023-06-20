import React, { useEffect } from 'react'
import CrudDataGrid from "../../components/crud-data-grid/CrudDataGrid";
import {Backdrop, Breadcrumbs, CircularProgress, Link, Stack, Typography} from "@mui/material";
import {baseUrl, standardGetRequestWithoutCookies} from "../../globalConstants";

const ProductList = () => {
    const [products, setProducts] = React.useState(null)

    useEffect(() => {
        backdropOpen()
        fetch(`${baseUrl}/products`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setProducts(data)
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => { backdropClose() })
    }, [])

    const columns = [
        { field: 'short_name', headerName: 'Сокращение', width: 100 },
        { field: 'name', headerName: 'Название', flex: 1 }
    ];
    const templateRow = {
        id: -1,
        short_name: "",
        name: "",
    }
    const rows = products == null ? [templateRow] :
        products.map((val) => Object.create(templateRow, {
            id: { value: val.id },
            short_name: { value: val.short_name },
            name: { value: val.name },
        }))

    const onCreateNewRecordHandler = () => { window.location.href = `./product?id=-1` }
    const onDeleteRecordHandler = () => {}
    const onEditRecordHandler = (id) => { window.location.href = `./product?id=${id}` }

    const [backdropVisible, setBackdropVisible] = React.useState(false);
    const backdropClose = () => {
        setBackdropVisible(false);
    };
    const backdropOpen = () => {
        setBackdropVisible(true);
    };

    return (
        <Stack spacing={2}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backdropVisible}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/admin">
                    Управление данными
                </Link>
                <Typography key="3" color="text.primary">
                    Инструменты
                </Typography>
            </Breadcrumbs>
            <Typography variant="h5" color="text.primary">Инструменты</Typography>
            <CrudDataGrid
                columns={columns}
                rows={rows}
                onCreateNewRecordHandler={onCreateNewRecordHandler}
                onDeleteRecordHandler={onDeleteRecordHandler}
                onEditRecordHandler={onEditRecordHandler}
                showNewRecordButton={false}
            />
        </Stack>

    )
}

export default ProductList
