import React, { useEffect } from 'react'
import CrudDataGrid from "../../components/crud-data-grid/CrudDataGrid";
import {Backdrop, Breadcrumbs, CircularProgress, Link, Stack, Typography} from "@mui/material";

const DocumentList = () => {
    const [documents, setDocuments] = React.useState(null)

    const baseUrl = 'http://487346.msk-kvm.ru:3333'

    useEffect(() => {
        backdropOpen()
        fetch(`${baseUrl}/documents`, {
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
                setDocuments(data)
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => { backdropClose() })
    }, [])

    const columns = [
        { field: 'fz', headerName: 'ФЗ', width: 100 },
        { field: 'description', headerName: 'Описание', flex: 1 },
        {
            field: 'date',
            headerName: 'Дата',
            type: 'date',
            width: 100,
        }
    ];
    const templateRow = {
        id: -1,
        fz: "",
        description: "",
        date: new Date(0)
    }
    const rows = documents == null ? [templateRow] :
        documents.map((val) => Object.create(templateRow, {
            id: { value: val.id },
            fz: { value: val.short_name },
            description: { value: val.full_name },
            date: { value: new Date(val.date) }
        }))

    const onCreateNewRecordHandler = () => { window.location.href = `./document?id=-1` }
    const onDeleteRecordHandler = () => {}
    const onEditRecordHandler = (id) => { window.location.href = `./document?id=${id}` }

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
                    Документы
                </Typography>
            </Breadcrumbs>
            <Typography variant="h5" color="text.primary">Документы</Typography>
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

export default DocumentList
