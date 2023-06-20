import React, { useEffect } from 'react'
import CrudDataGrid from "../../components/crud-data-grid/CrudDataGrid";
import {Backdrop, Breadcrumbs, CircularProgress, Link, Stack, Typography} from "@mui/material";
import { getCookie } from '../../utils/CookiesProvider'
import {baseUrl} from "../../globalConstants";

const GroupList = () => {
    const [groups, setGroups] = React.useState(null)

    useEffect(() => {
        backdropOpen()
        const authToken = getCookie('authToken')
        fetch(`${baseUrl}/groups`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': authToken
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setGroups(data)
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => { backdropClose() })
    }, [])

    const columns = [
        { field: 'name', headerName: 'Название', flex: 1 },
        { field: 'count', headerName: 'Число параметров', width: 150 }
    ];
    const templateRow = {
        id: -1,
        name: "",
        count: 0,
    }
    const rows = groups == null ? [templateRow] :
        groups.map((val) => Object.create(templateRow, {
            id: { value: val.id },
            name: { value: val.name },
            count: { value: val.parameters?.length ?? 0 },
        }))

    const onCreateNewRecordHandler = () => { window.location.href = `./group?id=-1` }
    const onDeleteRecordHandler = () => {}
    const onEditRecordHandler = (id) => { window.location.href = `./group?id=${id}` }

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
                    Группы характеристик
                </Typography>
            </Breadcrumbs>
            <Typography variant="h5" color="text.primary">Группы характеристик</Typography>
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

export default GroupList