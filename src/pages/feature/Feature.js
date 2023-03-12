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
    DialogActions,
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

// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     pt: 2,
//     px: 4,
//     pb: 3,
// };
// function ChildModal() {
//     const [open, setOpen] = React.useState(false);
//     const [article, setArticle] = React.useState('')
//     const [segment, setSegment] = React.useState('')
//
//     const [documents, setDocuments] = React.useState(null)
//     const [articles, setArticles] = React.useState(null)
//     const [segments, setSegments] = React.useState(null)
//     useEffect(() => {
//         fetch(`${baseUrl}/documents`, {
//             method: 'GET',
//             mode: 'cors',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             redirect: 'follow',
//             referrerPolicy: 'no-referrer',
//         })
//             .then((response) => {
//                 return response.json()
//             })
//             .then((data) => {
//                 setDocuments(data)
//             })
//             .catch(function (error) {
//                 console.log(error)
//             })
//     }, [])
//     const handleOpen = () => {
//         setOpen(true);
//     };
//     const handleClose = () => {
//         setOpen(false);
//     };
//     const optionsDocuments = () =>
//         documents && documents
//             .sort((a, b) => {
//                 const nameA = a.short_name.toUpperCase()
//                 const nameB = b.short_name.toUpperCase()
//                 if (nameA < nameB) {
//                     return -1
//                 }
//                 if (nameA > nameB) {
//                     return 1
//                 }
//                 return 0
//             })
//             .map((val) => ({id: val.id, label: val.short_name}))
//     const optionsArticles = () =>
//         articles && articles
//             .sort((a, b) => {
//                 const nameA = `ст. ${a.number} ${a.name}`
//                 const nameB = `ст. ${b.number} ${b.name}`
//                 if (nameA < nameB) {
//                     return -1
//                 }
//                 if (nameA > nameB) {
//                     return 1
//                 }
//                 return 0
//             })
//             .map((val) => ({id: val.id, label: `ст. ${val.number} ${val.name}`}))
//     const optionsSegments = () =>
//         segments && segments
//             .sort((a, b) => {
//                 const nameA = a.number.toUpperCase()
//                 const nameB = b.number.toUpperCase()
//                 if (nameA < nameB) {
//                     return -1
//                 }
//                 if (nameA > nameB) {
//                     return 1
//                 }
//                 return 0
//             })
//             .map((val) => ({id: val.id, label: `п. ${val.number}`}))
//
//
//     const onChangeDocument = (id) => {
//         setDocument(id)
//         GetArticles(id)
//     }
//     const onChangeArticle = (id) => {
//         setArticle(id)
//         GetSegments(id)
//     }
//
//
//     const GetArticles = (documentId) => {
//         setArticles(null)
//         if (documentId == null) {
//             documentId = document
//         }
//         fetch(`${baseUrl}/documents/${documentId}/articles`, {
//             method: 'GET',
//             mode: 'cors',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             redirect: 'follow',
//             referrerPolicy: 'no-referrer',
//         })
//             .then((response) => {
//                 return response.json()
//             })
//             .then((data) => {
//                 setArticles(data)
//                 setSegments(null)
//             })
//             .catch(function (error) {
//                 console.log(error)
//             })
//     }
//     const GetSegments = (articleId) => {
//         if (articleId == null) {
//             articleId = article
//         }
//         fetch(`${baseUrl}/articles/${articleId}/segments`, {
//             method: 'GET',
//             mode: 'cors',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             redirect: 'follow',
//             referrerPolicy: 'no-referrer',
//         })
//             .then((response) => {
//                 return response.json()
//             })
//             .then((data) => {
//                 setSegments(data)
//             })
//             .catch(function (error) {
//                 console.log(error)
//             })
//     }
//
//     const onSaveFeature = () => {
//         const segmentId = parseInt(segment)
//         console.log([...savedSegmentsIds, segmentId], 'savedSegmentsIds')
//         if (!savedSegmentsIds.includes(segmentId)) {
//             console.log('saving....')
//             const doc = documents.find((x) => x.id == document)
//             const art = articles.find((x) => x.id == article)
//             const seg = segments.find((x) => x.id == segmentId)
//             setSavedSegmentsIds([...savedSegmentsIds, seg.id])
//             const segmentExtended = {
//                 id: seg.id,
//                 number: seg.number,
//                 document: doc,
//                 article: art,
//             }
//             setSavedSegments([...savedSegments, segmentExtended])
//             handleClose()
//         }
//     }
//
//     return (
//         <Modal
//             open={open}
//             onClose={handleClose}
//             aria-labelledby="child-modal-title"
//             aria-describedby="child-modal-description"
//         >
//             <Box sx={{ ...style, width: 400 }}>
//                 <Stack>
//                     <AutocompleteCombobox
//                         id={'document'}
//                         label={'Документ'}
//                         onValueChanged={onChangeDocument}
//                         options={optionsDocuments}
//                     />
//                     <AutocompleteCombobox
//                         id={'article'}
//                         label={'Статья'}
//                         onValueChanged={onChangeArticle}
//                         options={optionsArticles}
//                     />
//                     <AutocompleteCombobox
//                         id={'segment'}
//                         label={'Пункт'}
//                         onValueChanged={(id) => {
//                             setSegment(id)
//                         }}
//                         options={optionsSegments}
//                     />
//                     <Button onClick={onSaveFeature}>
//                         Добавить
//                     </Button>
//                 </Stack>
//             </Box>
//         </Modal>
//     );
// }
const baseUrl = 'http://487346.msk-kvm.ru:3333'

function AddSegmentDialog(props) {
    const { onClose, value: valueProp, open, ...other } = props;
    const [value, setValue] = React.useState(valueProp);
    const radioGroupRef = React.useRef(null);

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
        fetch(`${baseUrl}/documents`, {
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
        fetch(`${baseUrl}/documents/${documentId}/articles`, {
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
        fetch(`${baseUrl}/articles/${articleId}/segments`, {
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
                setSegments(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

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
            TransitionProps={{ onEntering: handleEntering }}
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
    const [open, setOpen] = React.useState(false);

    const [authToken] = useContext(AuthContext)

    useEffect(() => {
        fetch(`${baseUrl}/features/${id}`, {
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
        fetch(`${baseUrl}/parameters`, {
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
                setParameters(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => {
        fetch(`${baseUrl}/products`, {
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
        const requestOptions = {
            method: isPOST ? 'POST' : 'PATCH',
            headers: { 'Content-Type': 'application/javascript', token: authToken },
            body: reqJSON,
            redirect: 'follow',
        }
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
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    const deleteFeature = () => {
        console.log(authToken)
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/javascript', token: authToken },
            redirect: 'follow',
        }
        fetch(`${baseUrl}/features/${id}`, requestOptions)
            .then((response) => {
                console.log(response)
                if (!response.ok) {
                    if (response.status == '401') {
                        setIsMessageUnauthorized(true)
                    }
                    console.log(response)
                    console.log(response.status)
                    alert('Error while delete feature')
                    return null
                }
                return response.json()
            })
            .then((data) => {
                setIsSuccessfullySaved(true)
                afterDelete()
                setTimeout(setIsSuccessfullySaved, 5 * 1000, false)
                setTimeout(
                    () => {
                        window.location = `./#/features`
                    },
                    6 * 1000,
                    false,
                )
            })
            .catch(function (error) {
                console.log(error)
            })
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
        setOpen(true);
    }

    const handleClose = (newValue) => {
        setOpen(false);
    };

    return <Grid container>
        <Grid item lg={12} md={12} sm={12}>
            <Stack spacing={1}>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/admin">
                        Управление данными
                    </Link>
                    <Link underline="hover" color="inherit" href="/feature-list">
                        Документы
                    </Link>
                    <Typography key="3" color="text.primary">
                        {name}
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
                    renderInput={(params) => <TextField {...params} label={'Продукт'} />}
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
                        <Grid item xs={4}>
                            <Button
                                type="button"
                                className="btn btn-primary"
                                data-coreui-toggle="modal"
                                data-coreui-target="#staticBackdrop"
                            >
                                Удалить
                            </Button>
                            {/*<Modal*/}
                            {/*    className="modal fade"*/}
                            {/*    id="staticBackdrop"*/}
                            {/*    tabIndex="-1"*/}
                            {/*    aria-labelledby="staticBackdropLabel"*/}
                            {/*    aria-hidden="true"*/}
                            {/*    onClick={onDeleteButton}*/}
                            {/*>*/}
                            {/*    <div className="modal-dialog">*/}
                            {/*        <div className="modal-content">*/}
                            {/*            <div className="modal-header">*/}
                            {/*                <h5 className="modal-title" id="deleteModalLabel">*/}
                            {/*                    Удаление*/}
                            {/*                </h5>*/}
                            {/*                <button*/}
                            {/*                    type="button"*/}
                            {/*                    className="btn-close"*/}
                            {/*                    data-coreui-dismiss="modal"*/}
                            {/*                    aria-label="Close"*/}
                            {/*                ></button>*/}
                            {/*            </div>*/}
                            {/*            <div className="modal-body">*/}
                            {/*                Удалить всю характеристику? Данное действие будет невозможно*/}
                            {/*                отменить.*/}
                            {/*            </div>*/}
                            {/*            <div className="modal-footer">*/}
                            {/*                <button*/}
                            {/*                    type="button"*/}
                            {/*                    className="btn btn-secondary"*/}
                            {/*                    data-coreui-dismiss="modal"*/}
                            {/*                >*/}
                            {/*                    Отмена*/}
                            {/*                </button>*/}
                            {/*                <button*/}
                            {/*                    type="button"*/}
                            {/*                    className="btn btn-danger"*/}
                            {/*                    onClick={deleteFeature}*/}
                            {/*                >*/}
                            {/*                    Удалить*/}
                            {/*                </button>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</Modal>*/}
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
                />
                <AddSegmentDialog
                    id="add-segment"
                    keepMounted
                    open={open}
                    value={''}
                    onClose={onSaveFeature}
                />
            </Stack>
        </Grid>
    </Grid>
}

export default Feature