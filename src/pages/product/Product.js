import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from "../../components/auth-context/AuthContext";
import {
    Grid,
    Button,
    Stack,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    Breadcrumbs,
    Link,
    Typography, Backdrop, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import {
    CreateRounded,
} from "@mui/icons-material";
import MessageSuccessfullySaved from "../../components/message-succsessfully-saved/MessageSuccsessfullySaved";
import MessageUnauthorized from "../../components/message-unauthorized/MessageUnauthorized";
import CrudDataGrid from "../../components/crud-data-grid/CrudDataGrid";
import AutocompleteCombobox from "../../components/autocomplete-combobox/AutocompleteCombobox";
import PropTypes from "prop-types";
import SnackbarSuccess from "../../components/snackbar-success/SnackbarSuccess";
import SnackbarError from "../../components/snackbar-error/SnackbarError";
import DialogActionConfirmation from "../../components/dialog-action-confirmation/DialogActionConfirmation";
import {
    baseUrl,
    getPatchParametersWithCookies,
    getPostParametersWithCookies,
    standardGetRequestWithoutCookies
} from "../../globalConstants";

const Product = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [id, setId] = React.useState(searchParams.get('id'))
    const [name, setName] = React.useState('')
    const [shortName, setShortName] = React.useState('')
    const [stages, setStages] = React.useState(null)
    const [authToken] = useContext(AuthContext)

    useEffect(() => {
        fetch(`${baseUrl}/products/${id}`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setName(data.name)
                setShortName(data.short_name)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => { getStages() }, [])
    const getStages = () => {
        if (id === -1) {
            setStages(null)
            return
        }

        fetch(`${baseUrl}/products/${id}/stages`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setStages(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    const saveProduct = () => {
        const reqBody = {
            name: name,
            short_name: shortName,
        }
        const reqJSON = JSON.stringify(reqBody)
        const isPOST = (id ?? -1) <= 0
        const requestOptions = isPOST
            ? getPostParametersWithCookies(reqJSON)
            : getPatchParametersWithCookies(reqJSON)

        backdropOpen()
        const fetchUrl = isPOST ? `${baseUrl}/products` : `${baseUrl}/products/${id}`
        fetch(fetchUrl, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    if (response.status == '401') {
                        setIsMessageUnauthorized(true)
                    }
                    console.log(response)
                    console.log(response.status)
                    return null
                }
                return response.json()
            })
            .then((data) => {
                console.log(data)
                setId(data.id)
                setIsSuccessfullySaved(true)
                setTimeout(setIsSuccessfullySaved, 5 * 1000, false)
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => { backdropClose() })
    }

    const columnsStages = [
        { field: 'number', headerName: '#', width: 100 },
        { field: 'name', headerName: 'Название', flex: 1 },
        { field: 'dates', headerName: 'Даты', flex: 1 },
        { field: 'stage', headerName: 'НПА', width: 200 },
    ]
    const stageTemplate = {
        id: -1,
        number: '',
        name: '',
        dates: '',
        stage: ''
    }
    const rowsStages =
        stages == null ?
            [stageTemplate] :
            stages
                .map((val) => Object.create(stageTemplate, {
                    id: { value: val.id },
                    number: { value: val.number },
                    name: { value: val.name },
                    dates: { value: val.dates },
                    stage: { value: `ч ${val.segment.number} ст. ${val.segment.article.number} ${val.segment.document.short_name}` },
                }))
    const createNewStage = () => { window.location.href = `./stage?product=${id}` }
    const editStage = (stage_id) => { window.location.href = `./stage?id=${stage_id}` }

    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = React.useState(false)
    const [snackbarErrorOpen, setSnackbarErrorOpen] = React.useState(false)
    const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);
    const [stageIdToDelete, setStageIdToDelete] = React.useState(null)
    const showDeleteDialog = (stageId) => {
        setStageIdToDelete(stageId)
        setDeleteDialogVisible(true);
    }
    const closeDeleteDialog = () => {
        setDeleteDialogVisible(false);
    }
    const deleteStage = () => {
        closeDeleteDialog();
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/javascript', token: authToken },
            redirect: 'follow',
        }
        backdropOpen();
        fetch(`${baseUrl}/stages/${stageIdToDelete}`, requestOptions)
            .then((response) => {
                backdropClose()
                if (!response.ok) {
                    if (response.status == '401') {
                        setSnackbarErrorOpen(true)
                    }
                    return false
                }
                return true
            })
            .then((deleteResult) => {
                if (deleteResult) {
                    setSnackbarSuccessOpen(true)
                    getStages()
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const [isSuccessfullySaved, setIsSuccessfullySaved] = React.useState(false)
    const [isMessageUnauthorized, setIsMessageUnauthorized] = React.useState(false)

    const [backdropVisible, setBackdropVisible] = React.useState(false);
    const backdropClose = () => { setBackdropVisible(false); };
    const backdropOpen = () => { setBackdropVisible(true); };

    return (
        <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12}>
                <Stack spacing={1}>
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
                        <Link underline="hover" color="inherit" href="/product-list">
                            Инструменты
                        </Link>
                        <Typography key="3" color="text.primary">
                            {name}
                        </Typography>
                    </Breadcrumbs>
                    <Typography variant="h5" color="text.primary">Инструмент</Typography>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="product_name">
                                Название инструмента
                            </InputLabel>
                            <Input
                                id="product_name"
                                value={name}
                                multiline
                                onChange={(e) => {
                                    setName(e.target.value)
                                }}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <CreateRounded />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="product_short_name">
                                Сокращение
                            </InputLabel>
                            <Input
                                id="product_short_name"
                                value={shortName}
                                onChange={(e) => {
                                    setShortName(e.target.value)
                                }}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <CreateRounded />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12}>
                        <Button onClick={saveProduct}>
                            Сохранить
                        </Button>
                        {isSuccessfullySaved && <MessageSuccessfullySaved />}
                        {isMessageUnauthorized && <MessageUnauthorized />}
                    </Grid>
                    <Grid item lg={12} md={12} sm={12}>
                        <CrudDataGrid
                            rows={rowsStages}
                            columns={columnsStages}
                            onCreateNewRecordHandler={createNewStage}
                            onEditRecordHandler={editStage}
                            onDeleteRecordHandler={showDeleteDialog}
                        />
                        <DialogActionConfirmation
                            onOk={deleteStage}
                            onCancel={closeDeleteDialog}
                            open={deleteDialogVisible}
                        >
                            Удалить выбранную запись? Данное действие будет невозможно отменить.
                        </DialogActionConfirmation>
                        <SnackbarSuccess open={snackbarSuccessOpen} onClose={() => { setSnackbarSuccessOpen(false)}}>
                            Запись успешно удалена
                        </SnackbarSuccess>
                        <SnackbarError open={snackbarErrorOpen} onClose={() => { setSnackbarErrorOpen(false)}}>
                            Ошибка: пользователь не авторизован <br />
                            <Button href={'./login'} color="inherit" size="small">
                                Войти
                            </Button>
                        </SnackbarError>
                    </Grid>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Product
