import React, { useEffect } from 'react'
import CrudDataGrid from "../../components/crud-data-grid/CrudDataGrid";
import {Backdrop, Breadcrumbs, CircularProgress, Link, Stack, Typography} from "@mui/material";
import {baseUrl, standardGetRequestWithoutCookies} from "../../globalConstants";

const RealmList = () => {
    const [realms, setRealms] = React.useState(null)

    useEffect(() => {
        backdropOpen()
        fetch(`${baseUrl}/realms`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setRealms(data)
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => { backdropClose() })
    }, [])

    const columns = [
        { field: 'description', headerName: 'Название', flex: 1 }
    ];
    const templateRow = {
        id: -1,
        description: "",
    }
    const rows = realms == null ? [templateRow] :
        realms.map((val) => Object.create(templateRow, {
            id: { value: val.id },
            description: { value: val.description },
        }))

    const onCreateNewRecordHandler = () => { window.location.href = `./realm?id=-1` }
    const onDeleteRecordHandler = () => {}
    const onEditRecordHandler = (id) => { window.location.href = `./realm?id=${id}` }

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
                    Сферы для инвестирования
                </Typography>
            </Breadcrumbs>
            <Typography variant="h5" color="text.primary">Сферы для инвестирования</Typography>
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

export default RealmList
