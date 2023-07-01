import React, { useEffect } from 'react'
import CrudDataGrid from "../../components/crud-data-grid/CrudDataGrid";
import {Backdrop, Breadcrumbs, Button, CircularProgress, Link, Stack, Typography} from "@mui/material";
import {baseUrl, getDeleteParametersWithCookies, standardGetRequestWithoutCookies} from "../../globalConstants";
import DialogActionConfirmation from "../../components/dialog-action-confirmation/DialogActionConfirmation";
import SnackbarSuccess from "../../components/snackbar-success/SnackbarSuccess";
import SnackbarError from "../../components/snackbar-error/SnackbarError";

const FeeList = () => {
    const [fees, setFees] = React.useState(null)

    useEffect(() => { getFees() }, [])
    const getFees = () => {
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
    }

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

    const onCreateNewRecordHandler = () => { window.location.href = `./fee?id=-1` }
    const onDeleteRecordHandler = (id) => { showDeleteDialog(id) }
    const onEditRecordHandler = (id) => { window.location.href = `./fee?id=${id}` }

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
    const deleteFee = () => {
        closeDeleteDialog();
        const requestOptions = getDeleteParametersWithCookies('')
        backdropOpen();
        fetch(`${baseUrl}/fees/${objectIdToDelete}`, requestOptions)
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
                    getFees()
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
            />
            <DialogActionConfirmation
                onOk={deleteFee}
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

export default FeeList