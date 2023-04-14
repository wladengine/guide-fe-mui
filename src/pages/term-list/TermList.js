import React, {useContext, useEffect} from 'react'
import CrudDataGrid from "../../components/crud-data-grid/CrudDataGrid";
import {Backdrop, Breadcrumbs, Button, CircularProgress, Link, Stack, Typography} from "@mui/material";
import DialogActionConfirmation from "../../components/dialog-action-confirmation/DialogActionConfirmation";
import SnackbarSuccess from "../../components/snackbar-success/SnackbarSuccess";
import SnackbarError from "../../components/snackbar-error/SnackbarError";
import AuthContext from "../../components/auth-context/AuthContext";

const TermList = () => {
    const [terms, setTerms] = React.useState(null)
    const [authToken] = useContext(AuthContext)

    const baseUrl = 'http://487346.msk-kvm.ru:3333'

    useEffect(() => { getClaims() }, [])
    const getClaims = () => {
        backdropOpen()
        fetch(`${baseUrl}/terms`, {
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
                setTerms(data)
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => { backdropClose() })
    }

    const columns = [
        { field: 'name', headerName: 'Название', flex: 1 },
        { field: 'definition', headerName: 'Описание', flex: 2 },
        { field: 'document', headerName: 'ФЗ', width: 100 },
    ];
    const templateRow = {
        id: -1,
        name: "",
        definition: "",
        document: "",
    }
    const rows = terms == null ? [templateRow] :
        terms.map((val) => Object.create(templateRow, {
            id: { value: val.id },
            name: { value: val.name },
            definition: { value: val.definition },
            document: { value: val.document.short_name },
        }))

    const onCreateNewRecordHandler = () => { window.location.href = `./term?id=-1` }
    const onDeleteRecordHandler = (id) => { showDeleteDialog(id) }
    const onEditRecordHandler = (id) => { window.location.href = `./term?id=${id}` }

    const [backdropVisible, setBackdropVisible] = React.useState(false);
    const backdropClose = () => {
        setBackdropVisible(false);
    };
    const backdropOpen = () => {
        setBackdropVisible(true);
    };

    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = React.useState(false)
    const [snackbarErrorOpen, setSnackbarErrorOpen] = React.useState(false)
    const [termIdToDelete, setTermIdToDelete] = React.useState(null)
    const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);
    const deleteTerm = () => {
        closeDeleteDialog();
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/javascript', token: authToken },
            redirect: 'follow',
        }
        backdropOpen();
        fetch(`${baseUrl}/terms/${termIdToDelete}`, requestOptions)
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
                    getClaims()
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    const showDeleteDialog = (object_id) => {
        setTermIdToDelete(object_id)
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
                    Глоссарий
                </Typography>
            </Breadcrumbs>
            <Typography variant="h5" color="text.primary">Глоссарий</Typography>
            <CrudDataGrid
                columns={columns}
                rows={rows}
                onCreateNewRecordHandler={onCreateNewRecordHandler}
                onDeleteRecordHandler={onDeleteRecordHandler}
                onEditRecordHandler={onEditRecordHandler}
            />
            <DialogActionConfirmation
                onOk={deleteTerm}
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

export default TermList