import React, { useEffect } from 'react'
import CrudDataGrid from "../../components/crud-data-grid/CrudDataGrid";
import {Backdrop, Breadcrumbs, CircularProgress, Link, Stack, Typography} from "@mui/material";
import {baseUrl, standardGetRequestWithoutCookies} from "../../globalConstants";

const FeeList = () => {
    const [fees, setFees] = React.useState(null)

    useEffect(() => {
        backdropOpen()
        fetch(`${baseUrl}/fees`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setFees(data)
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => { backdropClose() })
    }, [])

    const columns = [
        { field: 'name', headerName: 'Название', flex: 1 }
    ];
    const templateRow = {
        id: -1,
        name: "",
    }
    const rows = fees == null ? [templateRow] :
        fees.map((val) => Object.create(templateRow, {
            id: { value: val.id },
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
                    Суммы
                </Typography>
            </Breadcrumbs>
            <Typography variant="h5" color="text.primary">Суммы</Typography>
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

export default FeeList