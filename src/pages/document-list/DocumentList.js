import React, { useEffect } from 'react'
import CrudDataGrid from "../../components/crud-data-grid/CrudDataGrid";
import {Breadcrumbs, Link, Stack, Typography} from "@mui/material";

const DocumentList = () => {
    const [documents, setDocuments] = React.useState(null)

    const baseUrl = 'http://487346.msk-kvm.ru:3333'

    useEffect(() => {
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
    const exampleDoc = {
        id: -1,
        fz: "",
        description: "",
        date: new Date(0)
    }
    const rows = documents == null ? [exampleDoc] :
        documents.map((val) => Object.create(exampleDoc, {
            id: { value: val.id },
            fz: { value: val.short_name },
            description: { value: val.full_name },
            date: { value: new Date(val.date) }
        }))

    const onCreateNewRecordHandler = () => { window.location.href = `./document?id=-1` }
    const onDeleteRecordHandler = () => {}
    const onEditRecordHandler = (id) => { window.location.href = `./document?id=${id}` }

    return (
        <Stack>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/admin">
                    Управление данными
                </Link>
                <Typography key="3" color="text.primary">
                    Документы
                </Typography>
            </Breadcrumbs>
            <h2>Документы</h2>
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
