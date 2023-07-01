import React, { useEffect } from 'react'
import CrudDataGrid from "../../components/crud-data-grid/CrudDataGrid";
import {Backdrop, Breadcrumbs, Button, CircularProgress, Link, Stack, Typography} from "@mui/material";
import {baseUrl, getDeleteParametersWithCookies, standardGetRequestWithoutCookies} from "../../globalConstants";
import {refreshAuthCookie} from "../../utils/CookiesProvider";
import DialogActionConfirmation from "../../components/dialog-action-confirmation/DialogActionConfirmation";
import SnackbarSuccess from "../../components/snackbar-success/SnackbarSuccess";
import SnackbarError from "../../components/snackbar-error/SnackbarError";

const DocumentList = () => {
    const [documents, setDocuments] = React.useState(null)

    useEffect(() => { getDocuments(); }, [])
    useEffect(refreshAuthCookie, []);
    const getDocuments = () => {
        backdropOpen()
        fetch(`${baseUrl}/documents`, standardGetRequestWithoutCookies)
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
    }

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
    const onDeleteRecordHandler = (id) => { showDeleteDialog(id) }
    const onEditRecordHandler = (id) => { window.location.href = `./document?id=${id}` }

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
    const deleteDocument = () => {
        closeDeleteDialog();
        const requestOptions = getDeleteParametersWithCookies('')
        backdropOpen();
        fetch(`${baseUrl}/documents/${objectIdToDelete}`, requestOptions)
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
                    getDocuments()
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    const showDeleteDialog = (object_id) => {
        setObjectIdToDelete(object_id)
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
            <DialogActionConfirmation
                onOk={deleteDocument}
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

export default DocumentList
