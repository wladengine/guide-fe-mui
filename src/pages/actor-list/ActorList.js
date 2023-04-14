import React, { useEffect } from 'react'
import CrudDataGrid from "../../components/crud-data-grid/CrudDataGrid";
import {Backdrop, Breadcrumbs, CircularProgress, Link, Stack, Typography} from "@mui/material";

const ActorList = () => {
    const [products, setProducts] = React.useState(null)

    const baseUrl = 'http://487346.msk-kvm.ru:3333'

    useEffect(() => {
        backdropOpen()
        fetch(`${baseUrl}/actors`, {
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
                setProducts(data)
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => { backdropClose() })
    }, [])

    const columns = [
        { field: 'type', headerName: 'Тип', flex: 1 },
        { field: 'name', headerName: 'Название', flex: 1 }
    ];
    const templateRow = {
        id: -1,
        type: "",
        name: "",
    }
    const rows = products == null ? [templateRow] :
        products.map((val) => Object.create(templateRow, {
            id: { value: val.id },
            type: { value: val.type.name },
            name: { value: val.name },
        }))

    const onCreateNewRecordHandler = () => {}
    const onDeleteRecordHandler = () => {}
    const onEditRecordHandler = (id) => {}

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
                    Инвесторы
                </Typography>
            </Breadcrumbs>
            <Typography variant="h5" color="text.primary">Инвесторы</Typography>
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

export default ActorList