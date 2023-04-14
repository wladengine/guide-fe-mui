import React, {useContext, useEffect} from 'react'
import CrudDataGrid from "../../components/crud-data-grid/CrudDataGrid";
import {Backdrop, Breadcrumbs, Button, CircularProgress, Link, Stack, Typography} from "@mui/material";
import DialogActionConfirmation from "../../components/dialog-action-confirmation/DialogActionConfirmation";
import SnackbarSuccess from "../../components/snackbar-success/SnackbarSuccess";
import SnackbarError from "../../components/snackbar-error/SnackbarError";
import AuthContext from "../../components/auth-context/AuthContext";

const ObjectList = () => {
    const [objects, setObjects] = React.useState(null)
    const [authToken] = useContext(AuthContext)

    const baseUrl = 'http://487346.msk-kvm.ru:3333'

    useEffect(() => { getObjects() }, [])
    const getObjects = () => {
        backdropOpen()
        fetch(`${baseUrl}/objects`, {
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
                setObjects(data)
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => { backdropClose() })
    }

    const columns = [
        { field: 'region', headerName: 'Регион', flex: 1 },
        { field: 'foundation', headerName: 'Вид экономической зоны', flex: 1 },
        { field: 'town', headerName: 'Населённый пункт', flex: 1 },
        { field: 'link', headerName: 'Ссылка', flex: 1 },
        { field: 'description', headerName: 'Примечание', flex: 1 }
    ];
    const templateRow = {
        id: -1,
        region: "",
        foundation: "",
        town: "",
        link: "",
        description: "",
    }
    const rows = objects == null ? [templateRow] :
        objects.map((val) => Object.create(templateRow, {
            id: { value: val.id },
            region: { value: val.region.name },
            foundation: { value: val.foundation.description },
            town: { value: val.town },
            link: { value: val.link },
            description: { value: val.description },
        }))

    const onCreateNewRecordHandler = () => { window.location.href = `./object?id=-1` }
    const onDeleteRecordHandler = (id) => { showDeleteDialog(id) }
    const onEditRecordHandler = (id) => { window.location.href = `./object?id=${id}` }

    const [backdropVisible, setBackdropVisible] = React.useState(false);
    const backdropClose = () => {
        setBackdropVisible(false);
    };
    const backdropOpen = () => {
        setBackdropVisible(true);
    };

    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = React.useState(false)
    const [snackbarErrorOpen, setSnackbarErrorOpen] = React.useState(false)
    const [objectIdToDelete, setObjectIdToDelete] = React.useState(null)
    const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);
    const deleteSegment = () => {
        closeDeleteDialog();
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/javascript', token: authToken },
            redirect: 'follow',
        }
        backdropOpen();
        fetch(`${baseUrl}/objects/${objectIdToDelete}`, requestOptions)
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
                    getObjects()
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    const showDeleteDialog = (claimId) => {
        setObjectIdToDelete(claimId)
        setDeleteDialogVisible(true);
    }
    const closeDeleteDialog = () => {
        setDeleteDialogVisible(false);
    }

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
                    Объекты карты
                </Typography>
            </Breadcrumbs>
            <Typography variant="h5" color="text.primary">Объекты карты</Typography>
            <CrudDataGrid
                columns={columns}
                rows={rows}
                onCreateNewRecordHandler={onCreateNewRecordHandler}
                onDeleteRecordHandler={onDeleteRecordHandler}
                onEditRecordHandler={onEditRecordHandler}
            />
            <DialogActionConfirmation
                onOk={deleteSegment}
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
        </Stack>
    )
}

export default ObjectList