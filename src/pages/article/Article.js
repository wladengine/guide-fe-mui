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
    Typography, CircularProgress, Backdrop
} from "@mui/material";
import {
    CreateRounded,
} from "@mui/icons-material";
import MessageSuccessfullySaved from "../../components/message-succsessfully-saved/MessageSuccsessfullySaved";
import MessageUnauthorized from "../../components/message-unauthorized/MessageUnauthorized";
import DialogActionConfirmation from "../../components/dialog-action-confirmation/DialogActionConfirmation";
import {baseUrl, standardGetRequestWithoutCookies} from "../../globalConstants";

const Article = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const id = searchParams.get('id')
    const param_document = searchParams.get('document') ?? -1

    const [number, setNumber] = React.useState('')
    const [name, setName] = React.useState('')
    const [documentName, setDocumentName] = React.useState('')
    const [document, setDocument] = React.useState(param_document)
    const [segmentIds, setSegmentIds] = React.useState(null)
    const [segments, setSegments] = React.useState(null)
    const [segmentIdToDelete, setSegmentIdToDelete] = React.useState(null)
    const [authToken] = useContext(AuthContext)

    useEffect(() => {
        fetch(`${baseUrl}/articles/${id}`, standardGetRequestWithoutCookies)
            .then((response) => {
                if (!response.ok) {
                    GetDocument(document)
                    return null
                }
                return response.json()
            })
            .then((data) => {
                if (data !== null){
                    setNumber(data.number)
                    setName(data.name)
                    setDocument(data.document)
                    setSegmentIds(data.segments)
                    GetDocument(data.document)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => { getSegments() }, [])
    const getSegments = () => {
        fetch(`${baseUrl}/articles/${id}/segments`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setSegments(
                    data.sort((a, b) => {
                        return a.number - b.number
                    }),
                )
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const GetDocument = (documentId) => {
        fetch(`${baseUrl}/documents/${documentId}`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setDocumentName(data.short_name)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const [isSuccessfullySaved, setIsSuccessfullySaved] = React.useState(false)
    const [isMessageUnauthorized, setIsMessageUnauthorized] = React.useState(false)

    const saveArticle = () => {
        const reqBody = {
            document: parseInt(document),
            number: number,
            name: name,
            segments: segmentIds,
        }
        const reqJSON = JSON.stringify(reqBody)
        const isPOST = (id ?? -1) <= 0
        const requestOptions = {
            method: isPOST ? 'POST' : 'PATCH',
            headers: { 'Content-Type': 'application/javascript', token: authToken },
            body: reqJSON,
            redirect: 'follow',
        }
        backdropOpen()
        const fetchUrl = isPOST ? `${baseUrl}/articles` : `${baseUrl}/articles/${id}`
        fetch(fetchUrl, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    if (response.status == '401') {
                        setIsMessageUnauthorized(true)
                    }
                    //alert('Error while save article')
                    return null
                }
                return response.json()
            })
            .then((data) => {
                console.log(data)
                setIsSuccessfullySaved(true)
                setTimeout(setIsSuccessfullySaved, 5 * 1000, false)
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => { backdropClose() })
    }
    const segmentTemplate = {
        id: -1,
        number: "",
        name: ""
    }
    const rowsSegments =
        segments == null ?
            [segmentTemplate] :
            segments
                .sort()
                .map((val) => Object.create(segmentTemplate, {
                    id: { value: val.id },
                    number: { value: val.number },
                    name: { value: val.text },
                }))
    const columnsSegments = [
        { field: 'number', headerName: '#', width: 50 },
        { field: 'name', headerName: 'Статья', flex: 1 }
    ];

    const onCreateNewRecordHandler = () => { window.location.href = `./segment?article=${id}`}
    const onDeleteRecordHandler = (segment_id) => { showDeleteDialog(segment_id) }
    const onEditRecordHandler = (segment_id) => { window.location.href = `./segment?id=${segment_id}` }

    const documentUrl = `./document?id=${document}`

    const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);
    const deleteSegment = () => {
        closeDeleteDialog();
        backdropOpen();
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/javascript', token: authToken },
            redirect: 'follow',
        }
        fetch(`${baseUrl}/segments/${segmentIdToDelete}`, requestOptions)
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
                getSegments()
            })
    }
    const showDeleteDialog = (segmentId) => {
        setSegmentIdToDelete(segmentId)
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
                        onOk={deleteSegment}
                        onCancel={closeDeleteDialog}
                        open={deleteDialogVisible}
                    >
                        Удалить выбранный абзац? Данное действие будет невозможно отменить.
                    </DialogActionConfirmation>
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/admin">
                            Управление данными
                        </Link>
                        <Link underline="hover" color="inherit" href="/document-list">
                            Документы
                        </Link>
                        <Link underline="hover" color="inherit" href={documentUrl}>
                            {documentName}
                        </Link>
                        <Typography key="3" color="text.primary">
                            ст. {number}
                        </Typography>
                    </Breadcrumbs>
                    <h2>Документ</h2>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="article_number">
                                Номер статьи
                            </InputLabel>
                            <Input
                                id="article_number"
                                value={number}
                                onChange={(e) => {
                                    setNumber(e.target.value)
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
                            <InputLabel htmlFor="article_text">
                                Текст статьи
                            </InputLabel>
                            <Input
                                id="article_text"
                                multiline
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
                        <Button onClick={saveArticle}>
                            Сохранить
                        </Button>
                        {isSuccessfullySaved && <MessageSuccessfullySaved />}
                        {isMessageUnauthorized && <MessageUnauthorized />}
                    </Grid>
                    <Grid item lg={12} md={12} sm={12}>
                        <h4>Статьи</h4>
                        <CrudDataGrid
                            columns={columnsSegments}
                            rows={rowsSegments}
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

export default Article
