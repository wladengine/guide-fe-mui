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
    Typography,
    Modal,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions, Backdrop, CircularProgress,
} from "@mui/material";
import {
    CreateRounded,
} from "@mui/icons-material";
import MessageSuccessfullySaved from "../../components/message-succsessfully-saved/MessageSuccsessfullySaved";
import MessageUnauthorized from "../../components/message-unauthorized/MessageUnauthorized";
import AutocompleteCombobox from "../../components/autocomplete-combobox/AutocompleteCombobox";
import PropTypes from 'prop-types';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import DialogActionConfirmation from "../../components/dialog-action-confirmation/DialogActionConfirmation";
import {
    baseUrl,
    getPatchParametersWithCookies,
    getPostParametersWithCookies,
    standardGetRequestWithoutCookies
} from "../../globalConstants";

function AddSegmentDialog(props) {
    const { onClose, value: valueProp, open, ...other } = props;
    const [value, setValue] = React.useState(valueProp);

    React.useEffect(() => {
        if (!open) {
            setValue(valueProp);
        }
    }, [valueProp, open]);

    const [document, setDocument] = React.useState()
    const [article, setArticle] = React.useState('')
    const [segment, setSegment] = React.useState('')

    const [documents, setDocuments] = React.useState(null)
    const [articles, setArticles] = React.useState(null)
    const [segments, setSegments] = React.useState(null)
    useEffect(() => {
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
    }, [])

    const optionsDocuments =
        documents === null ?
            [] :
            documents
            .sort((a, b) => {
                const nameA = a.short_name.toUpperCase()
                const nameB = b.short_name.toUpperCase()
                if (nameA < nameB) {
                    return -1
                }
                if (nameA > nameB) {
                    return 1
                }
                return 0
            })
            .map((val) => ({id: val.id, label: val.short_name}))
    const optionsArticles =
        articles === null ?
            [] :
            articles
            .sort((a, b) => {
                const nameA = `ст. ${a.number} ${a.name}`
                const nameB = `ст. ${b.number} ${b.name}`
                if (nameA < nameB) {
                    return -1
                }
                if (nameA > nameB) {
                    return 1
                }
                return 0
            })
            .map((val) => ({id: val.id, label: `ст. ${val.number} ${val.name}`}))
    const optionsSegments =
        segments === null ?
            [] :
            segments
            .sort((a, b) => {
                const nameA = a.number.toUpperCase()
                const nameB = b.number.toUpperCase()
                if (nameA < nameB) {
                    return -1
                }
                if (nameA > nameB) {
                    return 1
                }
                return 0
            })
            .map((val) => ({id: val.id, label: `п. ${val.number}`}))

    const onChangeDocument = (doc) => {
        setDocument(doc.id)
        GetArticles(doc.id)
    }
    const onChangeArticle = (art) => {
        setArticle(art.id)
        GetSegments(art.id)
    }

    const GetArticles = (documentId) => {
        setArticles(null)
        if (documentId == null) {
            documentId = document
        }
        fetch(`${baseUrl}/documents/${documentId}/articles`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setArticles(data)
                setSegments(null)
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    const GetSegments = (articleId) => {
        if (articleId == null) {
            articleId = article
        }
        fetch(`${baseUrl}/articles/${articleId}/segments`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setSegments(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        const segmentId = parseInt(segment)

        const doc = documents.find((x) => x.id == document)
        const art = articles.find((x) => x.id == article)
        const seg = segments.find((x) => x.id == segmentId)

        const segmentExtended = {
                id: seg.id,
                number: seg.number,
                document: doc,
                article: art,
            }
        onClose(segmentId, segmentExtended);
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            open={open}
            {...other}
        >
            <DialogTitle>Выберите статью</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    <AutocompleteCombobox
                        id={'document'}
                        label={'Документ'}
                        onValueChanged={onChangeDocument}
                        options={optionsDocuments}
                    />
                    <AutocompleteCombobox
                        id={'article'}
                        label={'Статья'}
                        onValueChanged={onChangeArticle}
                        options={optionsArticles}
                    />
                    <AutocompleteCombobox
                        id={'segment'}
                        label={'Пункт'}
                        onValueChanged={(newVal) => {
                            setSegment(newVal.id)
                        }}
                        options={optionsSegments}
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

AddSegmentDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
};

const Feature = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [id, setId] = React.useState(searchParams.get('id'))
    const [savedSegmentsIds, setSavedSegmentsIds] = React.useState(null)
    const [savedSegments, setSavedSegments] = React.useState(null)
    const [parameters, setParameters] = React.useState(null)
    const [products, setProducts] = React.useState(null)
    const [addSegmentDialogVisible, setAddSegmentDialogVisible] = React.useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);

    const [authToken] = useContext(AuthContext)

    useEffect(() => {
        fetch(`${baseUrl}/features/${id}`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setProduct({id: data.product.id, label: data.product.name})
                setParameter({id: data.parameter.id, label: data.parameter.name})
                setSummary(data.summary)
                setSavedSegments(data.segments)
                if (typeof data.segments != 'undefined' && data.segments != null) {
                    const ids = data.segments.map((x) => {
                        return x.id
                    })
                    setSavedSegmentsIds(ids)
                } else {
                    setSavedSegments([])
                    setSavedSegmentsIds([])
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => {
        fetch(`${baseUrl}/parameters`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setParameters(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => {
        fetch(`${baseUrl}/products`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setProducts(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])

    const [isSuccessfullySaved, setIsSuccessfullySaved] = React.useState(false)
    const [isMessageUnauthorized, setIsMessageUnauthorized] = React.useState(false)
    const saveFeature = () => {
        console.log(authToken)
        const reqBody = {
            product_id: parseInt(product.id),
            parameter_id: parseInt(parameter.id),
            summary: summary,
            segments: savedSegmentsIds,
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
                    if (response.status == '401') {
                        setIsMessageUnauthorized(true)
                    }
                    console.log(response)
                    console.log(response.status)
                    alert('Error while save article')
                    return null
                }
                return response.json()
            })
            .then((data) => {
                console.log(data)
                setId(data.id)
                setIsSuccessfullySaved(true)
                setTimeout(setIsSuccessfullySaved, 5 * 1000, false)
                window.location = `./feature?id=${data.id}`
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    const deleteFeature = () => {
        closeDeleteDialog();
        backdropOpen();
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/javascript', token: authToken },
            redirect: 'follow',
        }
        fetch(`${baseUrl}/features/${id}`, requestOptions)
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
                    setTimeout(() => { window.location = `./feature-list` }, 6 * 1000, false)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => backdropClose())
    }

    const [product, setProduct] = React.useState(null)
    const [parameter, setParameter] = React.useState(null)
    const [summary, setSummary] = React.useState('')

    const onSaveFeature = (segmentId, segmentExtended) => {
        if (segmentId === undefined || segmentExtended === undefined){
            handleClose()
            return
        }
        console.log([...savedSegmentsIds, segmentId], 'savedSegmentsIds')
        if (!savedSegmentsIds.includes(segmentId)) {
            console.log('saving....')
            setSavedSegmentsIds([...savedSegmentsIds, segmentId])
            setSavedSegments([...savedSegments, segmentExtended])
            handleClose()
        }
    }
    const optionsProducts =
        products === null ?
            [] :
            products
            .sort((a, b) => {
                const nameA = a.name.toUpperCase()
                const nameB = b.name.toUpperCase()
                if (nameA < nameB) {
                    return -1
                }
                if (nameA > nameB) {
                    return 1
                }
                return 0
            })
            .map((val) => ({id: val.id, label: val.name}))
    const optionsParameters =
        parameters === null ?
            [] :
            parameters
            .sort((a, b) => {
                const nameA = a.name.toUpperCase()
                const nameB = b.name.toUpperCase()
                if (nameA < nameB) {
                    return -1
                }
                if (nameA > nameB) {
                    return 1
                }
                return 0
            })
            .map((val) => ({id: val.id, label: val.name}))

    const columnsSegments = [
        { field: 'document', headerName: 'Документ', width: 100 },
        { field: 'article', headerName: 'Статья', flex: 1 },
        { field: 'number', headerName: 'Пункт', width: 100 },
    ]

    const segmentTemplate = {
        id: -1,
        document: '',
        article: '',
        number: ''
    }

    const rowsSegments =
        savedSegments == null ?
            [segmentTemplate] :
            savedSegments
                .map((val) => Object.create(segmentTemplate, {
                    id: { value: val.id },
                    document: { value: val.document.short_name },
                    article: { value: `ст. ${val.article.number}. ${val.article.name}` },
                    number: { value: `п. ${val.number}` },
                }))

    const showAddSegmentDialog = () => {
        setAddSegmentDialogVisible(true);
    }
    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    }
    const handleClose = () => {
        setAddSegmentDialogVisible(false);
    };
    const closeDeleteDialog = () => {
        setDeleteDialogVisible(false);
    }
    const deleteSegment = (id) => {
        setSavedSegments(savedSegments.filter(item => item.id !== id))
        setSavedSegmentsIds(savedSegmentsIds.filter(item => item !== id))
    }

    const moveToSegment = (segment_id) => { window.location.href = `./segment?id=${segment_id}` }

    const [backdropVisible, setBackdropVisible] = React.useState(false);
    const backdropClose = () => {
        setBackdropVisible(false);
    };
    const backdropOpen = () => {
        setBackdropVisible(true);
    };

    return <Grid container>
        <Grid item lg={12} md={12} sm={12}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backdropVisible}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Stack spacing={1}>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/admin">
                        Управление данными
                    </Link>
                    <Link underline="hover" color="inherit" href="/feature-list">
                        Характеристики
                    </Link>
                    <Typography key="3" color="text.primary">
                        {id < 0 ? 'новая характеристика' : `${product?.label ?? ''} / ${parameter?.label ?? ''}`}
                    </Typography>
                </Breadcrumbs>
                <h2>Характеристика</h2>
                <Autocomplete
                    value={product}
                    getOptionLabel={option => option.label}
                    onChange={(event, newValue) => {
                        setProduct(newValue);
                    }}
                    id={'product'}
                    options={optionsProducts}
                    renderInput={(params) => <TextField {...params} label={'Инвест.инструмент'} />}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                <Autocomplete
                    value={parameter}
                    getOptionLabel={option => option.label}
                    onChange={(event, newValue) => {
                        setParameter(newValue);
                    }}
                    id={'parameter'}
                    options={optionsParameters}
                    renderInput={(params) => <TextField {...params} label={'Характеристика'} />}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                <FormControl fullWidth variant="standard">
                    <InputLabel htmlFor="feature_summary">
                        Описание характеристики
                    </InputLabel>
                    <Input
                        id="feature_summary"
                        multiline
                        value={summary}
                        onChange={(e) => {
                            setSummary(e.target.value)
                        }}
                        startAdornment={
                            <InputAdornment position="start">
                                <CreateRounded />
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <Grid container>
                    <Grid item xs={6}>
                        <Button onClick={saveFeature}>
                            Сохранить
                        </Button>
                    </Grid>
                    {
                        id > 0 &&
                        <Grid item xs={4} >
                            <Button onClick={showDeleteDialog}>
                                Удалить
                            </Button>
                            <DialogActionConfirmation
                                onOk={deleteFeature}
                                onCancel={closeDeleteDialog}
                                open={deleteDialogVisible}
                            >
                                Удалить всю характеристику? Данное действие будет невозможно отменить.
                            </DialogActionConfirmation>
                        </Grid>
                    }
                </Grid>
                {isSuccessfullySaved && <MessageSuccessfullySaved />}
                {isMessageUnauthorized && <MessageUnauthorized />}
                <h2>Пункты статей</h2>
                <CrudDataGrid
                    columns={columnsSegments}
                    rows={rowsSegments}
                    onCreateNewRecordHandler={showAddSegmentDialog}
                    onDeleteRecordHandler={deleteSegment}
                    onEditRecordHandler={moveToSegment}
                />
                <AddSegmentDialog
                    id="add-segment"
                    keepMounted
                    open={addSegmentDialogVisible}
                    value={''}
                    onClose={onSaveFeature}
                />
            </Stack>
        </Grid>
    </Grid>
}

export default Feature