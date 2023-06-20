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
    Typography, CircularProgress, Backdrop, Autocomplete
} from "@mui/material";
import {
    CreateRounded,
} from "@mui/icons-material";
import MessageSuccessfullySaved from "../../components/message-succsessfully-saved/MessageSuccsessfullySaved";
import MessageUnauthorized from "../../components/message-unauthorized/MessageUnauthorized";
import TextField from "@mui/material/TextField";
import {baseUrl, standardGetRequestWithoutCookies} from "../../globalConstants";

const Stage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const id = searchParams.get('id')
    const param_product = searchParams.get('product') ?? -1

    const [number, setNumber] = React.useState('');
    const [name, setName] = React.useState('');
    const [dates, setDates] = React.useState('');
    const [productName, setProductName] = React.useState('')
    const [product, setProduct] = React.useState(param_product)

    const [authToken] = useContext(AuthContext)

    useEffect(() => {
        fetch(`${baseUrl}/stages/${id}`, standardGetRequestWithoutCookies)
            .then((response) => {
                if (!response.ok) {
                    GetProduct(product)
                    return null
                }
                return response.json()
            })
            .then((data) => {
                if (data !== null){
                    setNumber(data.number)
                    setName(data.name)
                    setDates(data.dates)
                    setProduct(data.product.id)
                    GetProduct(data.product.id)
                    GetDocuments()
                    setDocument({id: data.segment.document.id, label: data.segment.document.short_name})
                    GetArticles(data.segment.document.id)
                    setArticle({id: data.segment.article.id, label: `ст. ${data.segment.article.number} ${data.segment.article.name}`})
                    GetSegments(data.segment.article.id)
                    setSegment({id: data.segment.id, label: `п. ${data.segment.number}`})
                }
                else {
                    GetDocuments()
                }
            })
            .catch(function (error) {
                console.log(error)
            })
            //.finally(() => { console.debug(segment) })
    }, [])
    const GetDocuments = () => {
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
    }

    const GetProduct = (productId) => {
        fetch(`${baseUrl}/products/${productId}`, {
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
                setProductName(data.short_name)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const [document, setDocument] = React.useState(null)
    const [documents, setDocuments] = React.useState(null)
    const [article, setArticle] = React.useState(null)
    const [articles, setArticles] = React.useState(null)
    const [segment, setSegment] = React.useState(null)
    const [segments, setSegments] = React.useState(null)

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
        setArticle(null)
        setArticles(null)
        setSegments(null)
        setSegment(null)
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
        setSegments(null)
        setSegment(null)
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

    const [isSuccessfullySaved, setIsSuccessfullySaved] = React.useState(false)
    const [isMessageUnauthorized, setIsMessageUnauthorized] = React.useState(false)

    const saveStage = () => {
        const reqBody = {
            product_id: parseInt(product),
            segment_id: parseInt(segment.id),
            number: parseInt(number),
            name: name,
            dates: dates,
        }
        console.debug(reqBody)
        const reqJSON = JSON.stringify(reqBody)
        const isPOST = (id ?? -1) <= 0
        const requestOptions = {
            method: isPOST ? 'POST' : 'PATCH',
            headers: { 'Content-Type': 'application/javascript', token: authToken },
            body: reqJSON,
            redirect: 'follow',
        }
        backdropOpen()
        const fetchUrl = isPOST ? `${baseUrl}/stages` : `${baseUrl}/stages/${id}`
        fetch(fetchUrl, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    if (response.status == '401') {
                        setIsMessageUnauthorized(true)
                    }
                    return null
                }
                return response.json()
            })
            .then((data) => {
                if (data != null){
                    console.log(data)
                    setIsSuccessfullySaved(true)
                    setTimeout(setIsSuccessfullySaved, 5 * 1000, false)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => { backdropClose() })
    }

    const productUrl = `./product?id=${product}`

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
                        <Link underline="hover" color="inherit" href={productUrl}>
                            {productName}
                        </Link>
                        <Typography key="3" color="text.primary">
                            {parseInt(id) === -1 ? 'Новая запись' : 'Редактирование'}
                        </Typography>
                    </Breadcrumbs>
                    <Typography variant="h5" color="text.primary">Этап</Typography>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="stage_number">
                                Порядковый номер этапа
                            </InputLabel>
                            <Input
                                id="stage_number"
                                multiline
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
                            <InputLabel htmlFor="stage_name">
                                Название этапа
                            </InputLabel>
                            <Input
                                id="stage_name"
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
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="stage_dates">
                                Даты
                            </InputLabel>
                            <Input
                                id="stage_dates"
                                multiline
                                value={dates}
                                onChange={(e) => {
                                    setDates(e.target.value)
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
                        <Autocomplete
                            id={'document'}
                            value={document}
                            onChange={(event, newValue) => {
                                setDocument(newValue)
                                GetArticles(newValue.id)
                            }}
                            //onValueChanged={onChangeDocument}
                            options={optionsDocuments}
                            getOptionLabel={option => option.label}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => <TextField {...params} label={'Документ'} />}
                        />
                    </Grid>
                    <Grid item lg={12} md={12} sm={12}>
                        <Autocomplete
                            value={article}
                            getOptionLabel={option => option.label}
                            onChange={(event, newValue) => {
                                setArticle(newValue)
                                GetSegments(newValue.id)
                            }}
                            id={'article'}
                            options={optionsArticles}
                            renderInput={(params) => <TextField {...params} label={'Статья'} />}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            //onValueChanged={onChangeArticle}
                        />
                    </Grid>
                    <Grid item lg={12} md={12} sm={12}>
                        <Autocomplete
                            id={'segment'}
                            value={segment}
                            onChange={(event, newValue) => {
                                setSegment(newValue)
                            }}
                            // onValueChanged={(newVal) => {
                            //     setSegment(newVal.id)
                            // }}
                            options={optionsSegments}
                            getOptionLabel={option => option.label}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => <TextField {...params} label={'Пункт'} />}
                        />
                    </Grid>
                    <Grid item lg={12} md={12} sm={12}>
                        <Button onClick={saveStage}>
                            Сохранить
                        </Button>
                        {isSuccessfullySaved && <MessageSuccessfullySaved />}
                        {isMessageUnauthorized && <MessageUnauthorized />}
                    </Grid>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Stage