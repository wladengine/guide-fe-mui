import React, { useEffect } from 'react'
import CrudDataGrid from "../../components/crud-data-grid/CrudDataGrid";
import {Breadcrumbs, Link, Stack, Typography} from "@mui/material";

const FeatureList = () => {
    const baseUrl = 'http://487346.msk-kvm.ru:3333'

    const [features, setFeatures] = React.useState(null)
    useEffect(() => {
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
    }, [])

    const columns = [
        { field: 'product', headerName: 'Продукт', width: 100 },
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
            segments: { value: val.segments.length }
        }))

    const onCreateNewRecordHandler = () => { window.location.href = `./feature?id=-1` }
    const onDeleteRecordHandler = () => {}
    const onEditRecordHandler = (id) => { window.location.href = `./feature?id=${id}` }

    return (
        <Stack>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/admin">
                    Управление данными
                </Link>
                <Typography key="3" color="text.primary">
                    Характеристики
                </Typography>
            </Breadcrumbs>
            <h2>Характеристики</h2>
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