import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from "../../components/auth-context/AuthContext";
import CrudDataGrid from "../../components/crud-data-grid/CrudDataGrid";
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
    Typography, Backdrop, CircularProgress
} from "@mui/material";
import {
    CreateRounded,
} from "@mui/icons-material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MessageSuccessfullySaved from "../../components/message-succsessfully-saved/MessageSuccsessfullySaved";
import MessageUnauthorized from "../../components/message-unauthorized/MessageUnauthorized";
import ru from 'date-fns/locale/ru';
import DatePickerRu from "../../components/date-picker-ru/DatePickerRu";
import DialogActionConfirmation from "../../components/dialog-action-confirmation/DialogActionConfirmation";
import {getCookie, ref} from '../../utils/CookiesProvider'
const Document = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [id, setId] = React.useState(searchParams.get('id'))
    const [articles, setArticles] = React.useState(null)
    const [articleIdToDelete, setArticleIdToDelete] = React.useState(null)

    const [authToken] = useContext(AuthContext)
    const baseUrl = 'http://487346.msk-kvm.ru:3333'

    useEffect(ref, []);

    useEffect(() => {
        const authToken = getCookie('authToken')
        console.log(authToken, 'authToken')
        fetch(`${baseUrl}/documents/${id}`, {
            method: 'GET',
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
                setName(data.short_name)
                let date = new Date(data.date)
                setDate(date)
                setDescription(data.full_name)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => { getArticles() }, [])
    const getArticles = () => {
        fetch(`${baseUrl}/documents/${id}/articles`, {
            method: 'GET',
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
                setArticles(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const [isSuccessfullySaved, setIsSuccessfullySaved] = React.useState(false)
    const [isMessageUnauthorized, setIsMessageUnauthorized] = React.useState(false)

    const saveDocument = () => {
        console.log(authToken)
        const reqBody = {
            short_name: name,
            date: new Date(date).toJSON(),
            full_name: description,
        }
        const reqJSON = JSON.stringify(reqBody)
        const isPOST = (id ?? -1) <= 0
        const requestOptions = {
            method: isPOST ? 'POST' : 'PATCH',
            headers: { 'Content-Type': 'application/javascript', token: authToken },
            mode: 'cors',
            body: reqJSON,
            redirect: 'follow',
        }
        backdropOpen()
        const fetchUrl = isPOST ? `${baseUrl}/documents` : `${baseUrl}/documents/${id}`
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

    const [name, setName] = React.useState('')
    const [date, setDate] = React.useState(new Date())
    const [description, setDescription] = React.useState('')
    const articleTemplate = {
        id: -1,
        number: "",
        name: ""
    }
    const rowsArticles =
        articles == null ?
            [articleTemplate] :
            articles
                .sort()
                .map((val) => Object.create(articleTemplate, {
                    id: { value: val.id },
                    number: { value: val.number },
                    name: { value: val.name },
                }))
    const columnsArticles = [
        { field: 'number', headerName: '#', width: 50 },
        { field: 'name', headerName: 'Статья', flex: 1 }
    ];
    const onCreateNewRecordHandler = () => { window.location.href = `./article?document=${id}`}
    const onDeleteRecordHandler = (article_id) => { showDeleteDialog(article_id) }
    const onEditRecordHandler = (article_id) => { window.location.href = `./article?id=${article_id}` }

    const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);
    const deleteArticle = () => {
        closeDeleteDialog();
        backdropOpen();
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/javascript', token: authToken },
            redirect: 'follow',
        }
        fetch(`${baseUrl}/articles/${articleIdToDelete}`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    if (response.status == '401') {
                        setIsMessageUnauthorized(true)
                    }
                    return false
                }
                return true
            })
            .then((deleteResult) => {
                if (deleteResult) {
                    setIsSuccessfullySaved(true)
                    // afterDelete()
                    setTimeout(setIsSuccessfullySaved, 5 * 1000, false)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => {
                backdropClose()
                getArticles()
            })
    }
    const showDeleteDialog = (articleId) => {
        setArticleIdToDelete(articleId)
        setDeleteDialogVisible(true);
    }
    const closeDeleteDialog = () => {
        setDeleteDialogVisible(false);
    }

    const [backdropVisible, setBackdropVisible] = React.useState(false);
    const backdropClose = () => {
        setBackdropVisible(false);
    };
    const backdropOpen = () => {
        setBackdropVisible(true);
    };

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
                    <DialogActionConfirmation
                        onOk={deleteArticle}
                        onCancel={closeDeleteDialog}
                        open={deleteDialogVisible}
                    >
                        Удалить выбранную статью? Данное действие будет невозможно отменить.
                    </DialogActionConfirmation>
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/admin">
                            Управление данными
                        </Link>
                        <Link underline="hover" color="inherit" href="/document-list">
                            Документы
                        </Link>
                        <Typography key="3" color="text.primary">
                            {name}
                        </Typography>
                    </Breadcrumbs>
                    <h2>Документ</h2>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="document_name">
                                Название документа
                            </InputLabel>
                            <Input
                                id="document_name"
                                value={name}
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
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                            <DatePickerRu value={date} setValueHandler={setDate} labelText={"Дата документа"} />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="document_description">
                                Описание документа
                            </InputLabel>
                            <Input
                                id="document_description"
                                multiline
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value)
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
                        <Button onClick={saveDocument}>
                            Сохранить
                        </Button>
                        {isSuccessfullySaved && <MessageSuccessfullySaved />}
                        {isMessageUnauthorized && <MessageUnauthorized />}
                    </Grid>
                    <Grid item lg={12} md={12} sm={12}>
                        <h4>Статьи</h4>
                        <CrudDataGrid
                            columns={columnsArticles}
                            rows={rowsArticles}
                            onCreateNewRecordHandler={onCreateNewRecordHandler}
                            onDeleteRecordHandler={onDeleteRecordHandler}
                            onEditRecordHandler={onEditRecordHandler}
                        />
                        {authToken && <Button
                                color="primary"
                                className="px-4"
                                href={`../#/article?document=${id}`}
                            >
                                Добавить
                            </Button>}
                    </Grid>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Document
