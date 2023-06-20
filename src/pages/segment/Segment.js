import React, {useEffect, useState} from 'react'
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
    Typography,
    CircularProgress,
    Backdrop,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import {
    CreateRounded,
} from "@mui/icons-material";
import MuiAlert from '@mui/material/Alert';
import MessageSuccessfullySaved from "../../components/message-succsessfully-saved/MessageSuccsessfullySaved";
import MessageUnauthorized from "../../components/message-unauthorized/MessageUnauthorized";
import AutocompleteCombobox from "../../components/autocomplete-combobox/AutocompleteCombobox";
import PropTypes from "prop-types";
import SnackbarSuccess from "../../components/snackbar-success/SnackbarSuccess";
import SnackbarError from "../../components/snackbar-error/SnackbarError";
import {
    baseUrl,
    getPatchParametersWithCookies,
    getPostParametersWithCookies,
    standardGetRequestWithoutCookies
} from "../../globalConstants";

function AddFeatureDialog(props) {
    const { onClose, value: valueProp, open, ...other } = props;
    const [value, setValue] = React.useState(valueProp);

    React.useEffect(() => {
        if (!open) {
            setValue(valueProp);
        }
    }, [valueProp, open]);

    const [feature, setFeature] = React.useState('')
    const [features, setFeatures] = React.useState(null)

    useEffect(() => {
        fetch(`${baseUrl}/features`, standardGetRequestWithoutCookies)
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

    const optionsFeatures =
        features === null ?
            [] :
            features
                .map((val) => ({id: val.id, label: `[${val.product.short_name}] ${val.parameter.name}` }))
                .sort((a, b) => {
                    const nameA = a.label.toUpperCase()
                    const nameB = b.label.toUpperCase()
                    if (nameA < nameB) {
                        return -1
                    }
                    if (nameA > nameB) {
                        return 1
                    }
                    return 0
                })

    const handleCancel = () => {
        onClose();
    };
    const handleOk = () => {
        const featureId = parseInt(feature)
        const featExtended = features.find((x) => x.id == featureId)

        onClose(featureId, featExtended);
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            open={open}
            {...other}
        >
            <DialogTitle>Выберите характеристику</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    <AutocompleteCombobox
                        id={'segment'}
                        label={'Пункт'}
                        onValueChanged={(newVal) => {
                            setFeature(newVal.id)
                        }}
                        options={optionsFeatures}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    Отмена
                </Button>
                <Button onClick={handleOk}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}

AddFeatureDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
};

const Segment = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const id = searchParams.get('id')
    const param_article = searchParams.get('article') ?? -1

    const [number, setNumber] = React.useState('')
    const [text, setText] = React.useState('')
    const [document, setDocument] = React.useState('')
    const [documentName, setDocumentName] = React.useState('')
    const [articleNumber, setArticleNumber] = React.useState('')
    const [featuresData, setFeaturesData] = React.useState(null)
    const [features, setFeatures] = React.useState(null)
    const [addFeatureDialogVisible, setAddFeatureDialogVisible] = React.useState(false);
    const [article, setArticle] = React.useState(param_article)
    const [authToken] = useContext(AuthContext)

    useEffect(() => {
        fetch(`${baseUrl}/segments/${id}`, standardGetRequestWithoutCookies)
            .then((response) => {
                if (!response.ok) {
                    GetArticle(article)
                    GetDocument(document)
                    return null
                }
                return response.json()
            })
            .then((data) => {
                setNumber(data.number)
                setText(data.text)
                setArticle(data.article.id)
                setDocument(data.document.id)
                setArticleNumber(data.article.number)
                setDocumentName(data.document.short_name)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => { GetFeatures() }, [])
    const GetFeatures = () => {
        fetch(`${baseUrl}/segments/${id}/features`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setFeaturesData(data)
                setFeatures(data.map(val => val.id))
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
    const GetArticle = (articleId) => {
        fetch(`${baseUrl}/articles/${articleId}`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setDocument(data.document)
                setArticleNumber(data.number)
                GetDocument(data.document)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const featureTemplate = {
        id: -1,
        product: "",
        parameter: "",
        summary: "",
    }
    const rowsFeatures =
        featuresData == null ?
            [featureTemplate] :
            featuresData
                .sort()
                .map((val) => Object.create(featureTemplate, {
                    id: { value: val.id },
                    product: { value: val.product.short_name },
                    parameter: { value: val.parameter.name },
                    summary: { value: val.summary },
                }))
    const columnsFeatures = [
        { field: 'number', headerName: '#', width: 50 },
        { field: 'product', headerName: 'Инвест.инструмент', flex: 1 },
        { field: 'parameter', headerName: 'Параметр', flex: 1 },
        { field: 'summary', headerName: 'Описание', flex: 1 }
    ];
    const saveSegment = () => {
        const reqBody = {
            article_id: parseInt(article),
            number: number,
            text: text,
        }
        const reqJSON = JSON.stringify(reqBody)
        const isPOST = (id ?? -1) <= 0
        const requestOptions = isPOST
            ? getPostParametersWithCookies(reqJSON)
            : getPatchParametersWithCookies(reqJSON)

        backdropOpen()
        const fetchUrl = isPOST ? `${baseUrl}/segments` : `${baseUrl}/segments/${id}`
        fetch(fetchUrl, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    setIsMessageUnauthorized(true)
                    //alert('Error while save segments')
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

    const onCreateNewRecordHandler = () => { setAddFeatureDialogVisible(true) }
    const onDeleteRecordHandler = () => {}
    const onEditRecordHandler = (feature_id) => { window.location.href = `./feature?id=${feature_id}` }

    const handleClose = () => {
        setAddFeatureDialogVisible(false);
    };
    const onSaveFeature = (featureId, featureExtended) => {
        console.log('in onSaveFeature()')
        console.log(`onSaveFeature - featureId=${featureId} featureExtended=${featureExtended}`)
        if (featureId === undefined || featureExtended === undefined){
            handleClose()
            return
        }
        console.log([...featuresData, featureExtended], 'savedSegmentsIds')
        if (!features.includes(featureId)) {
            console.log('saving....')
            saveFeature(featureId);
            handleClose()
        }
    }
    const saveFeature = (feature_id) => {
        if (feature_id != null && feature_id >= 0) {
            console.log(feature_id, 'current feature')
            console.log(features, 'features')
            if (features != null) {
                const fff = features.find((x) => x.id === feature_id)
                console.log(fff, 'fff')
            }
            fetch(`${baseUrl}/features/${feature_id}`, standardGetRequestWithoutCookies)
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    const product = data.product.id
                    const parameter = data.parameter.id
                    const summary = data.summary
                    const segments = data.segments ?? []
                    let saveFeature = false
                    console.log(segments, 'segments')
                    if (typeof segments === 'undefined' || segments === null) {
                        saveFeature = true
                    } else if (segments.find((x) => x === id) == null) {
                        const ff = segments.find((x) => x === id)
                        console.log(ff, 'found segments')
                        saveFeature = true
                    }
                    if (saveFeature) {
                        console.log('Saving...')
                        const reqBody = {
                            product_id: parseInt(product),
                            parameter_id: parseInt(parameter),
                            summary: summary,
                            segments: (segments ?? []).push(id),
                        }
                        const reqJSON = JSON.stringify(reqBody)
                        const isPOST = (id ?? -1) <= 0
                        const requestOptions = isPOST
                            ? getPostParametersWithCookies(reqJSON)
                            : getPatchParametersWithCookies(reqJSON)

                        const fetchUrl = isPOST ? `${baseUrl}/features` : `${baseUrl}/features/${id}`
                        fetch(fetchUrl, requestOptions)
                            .then((response) => {
                                if (!response.ok) {
                                    setSnackbarNotAuthorizedErrorOpen(true)
                                    return null
                                }
                                return response.json()
                            })
                            .then((data) => {
                                if (data !== null){
                                    console.log(data)
                                    setSnackbarSuccessOpen(true)
                                    GetFeatures()
                                }
                            })
                            .catch(function (error) {
                                console.log(error)
                            })
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
        else {
            setSnackbarErrorOpen(true)
        }
    }
    const documentUrl = `./document?id=${document}`
    const articleUrl = `./article?id=${article}`

    const [isSuccessfullySaved, setIsSuccessfullySaved] = React.useState(false)
    const [isMessageUnauthorized, setIsMessageUnauthorized] = React.useState(false)

    const [backdropVisible, setBackdropVisible] = React.useState(false);
    const backdropClose = () => {
        setBackdropVisible(false);
    };
    const backdropOpen = () => {
        setBackdropVisible(true);
    };

    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = React.useState(false)
    const [snackbarErrorOpen, setSnackbarErrorOpen] = React.useState(false)
    const [snackbarNotAuthorizedErrorOpen, setSnackbarNotAuthorizedErrorOpen] = React.useState(false)

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
                        <Link underline="hover" color="inherit" href="/document-list">
                            Документы
                        </Link>
                        <Link underline="hover" color="inherit" href={documentUrl}>
                            {documentName}
                        </Link>
                        <Link underline="hover" color="inherit" href={articleUrl}>
                            ст. {articleNumber}
                        </Link>
                        <Typography key="3" color="text.primary">
                            п. {number}
                        </Typography>
                    </Breadcrumbs>
                    <h2>Документ</h2>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="segments_number">
                                Номер абзаца
                            </InputLabel>
                            <Input
                                id="segments_number"
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
                                Текст абзаца
                            </InputLabel>
                            <Input
                                id="article_text"
                                multiline
                                value={text}
                                onChange={(e) => {
                                    setText(e.target.value)
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
                        <Button onClick={saveSegment}>
                            Сохранить
                        </Button>
                        {isSuccessfullySaved && <MessageSuccessfullySaved />}
                        {isMessageUnauthorized && <MessageUnauthorized />}
                    </Grid>
                    <Grid item lg={12} md={12} sm={12}>
                        <h4>Характеристики</h4>
                        <CrudDataGrid
                            columns={columnsFeatures}
                            rows={rowsFeatures}
                            onCreateNewRecordHandler={onCreateNewRecordHandler}
                            onDeleteRecordHandler={onDeleteRecordHandler}
                            onEditRecordHandler={onEditRecordHandler}
                        />
                        <AddFeatureDialog
                            id="add-segment"
                            keepMounted
                            open={addFeatureDialogVisible}
                            value={''}
                            onClose={onSaveFeature}
                        />
                        <SnackbarSuccess open={snackbarSuccessOpen} onClose={() => { setSnackbarSuccessOpen(false)}}>
                            Характеристика успешно добавлена
                        </SnackbarSuccess>
                        <SnackbarError open={snackbarErrorOpen} onClose={() => { setSnackbarErrorOpen(false)}}>
                            Ошибка при добавлении характеристики
                        </SnackbarError>
                        <SnackbarError open={snackbarNotAuthorizedErrorOpen} onClose={() => { setSnackbarNotAuthorizedErrorOpen(false)}}>
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

export default Segment