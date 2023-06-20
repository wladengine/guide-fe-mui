import React, { useEffect } from 'react'
import CrudDataGrid from "../../components/crud-data-grid/CrudDataGrid";
import {Backdrop, Breadcrumbs, CircularProgress, Link, Stack, Typography} from "@mui/material";
import {baseUrl, standardGetRequestWithoutCookies} from "../../globalConstants";

const FeatureList = () => {
    const [features, setFeatures] = React.useState(null)
    useEffect(() => {
        backdropOpen()
        fetch(`${baseUrl}/features`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setFeatures(data)
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => { backdropClose() })
    }, [])

    const columns = [
        { field: 'product', headerName: 'Инвест.инструмент', width: 150 },
        { field: 'parameter', headerName: 'Параметр', flex: 1 },
        { field: 'segments', headerName: '#', width: 50 }
    ];
    const templateRow = {
        id: -1,
        product: "",
        parameter: "",
        segments: 0
    }
    const rows = features == null ? [templateRow] :
        features.map((val) => Object.create(templateRow, {
            id: { value: val.id },
            product: { value: val.product.short_name },
            parameter: { value: val.parameter.name },
            segments: { value: val.segments?.length ?? 0 }
        }))

    const onCreateNewRecordHandler = () => { window.location.href = `./feature?id=-1` }
    const onDeleteRecordHandler = () => {}
    const onEditRecordHandler = (id) => { window.location.href = `./feature?id=${id}` }

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
                    Характеристики
                </Typography>
            </Breadcrumbs>
            <Typography variant="h5" color="text.primary">Характеристики</Typography>
            <CrudDataGrid
                columns={columns}
                rows={rows}
                onCreateNewRecordHandler={onCreateNewRecordHandler}
                onDeleteRecordHandler={onDeleteRecordHandler}
                onEditRecordHandler={onEditRecordHandler}
            />
        </Stack>

    )
}

export default FeatureList