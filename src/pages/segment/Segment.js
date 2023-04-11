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
    Typography
} from "@mui/material";
import {
    CreateRounded,
} from "@mui/icons-material";
import MessageSuccessfullySaved from "../../components/message-succsessfully-saved/MessageSuccsessfullySaved";
import MessageUnauthorized from "../../components/message-unauthorized/MessageUnauthorized";

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
    const [currentFeature, setCurrentFeature] = React.useState(null)
    const [featureAddingVisible, setFeatureAddingVisible] = React.useState(true)
    const [article, setArticle] = React.useState(param_article)
    const [authToken] = useContext(AuthContext)

    const baseUrl = 'http://487346.msk-kvm.ru:3333'

    useEffect(() => {
        fetch(`${baseUrl}/segments/${id}`, {
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
                setNumber(data.number)
                setText(data.text)
                setArticle(data.article.id)
                setDocument(data.document.id)
                setArticleNumber(data.number)
                setDocumentName(data.document.short_name)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => {
        fetch(`${baseUrl}/segments/${id}/features`, {
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
                setFeaturesData(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => {
        fetch('http://487346.msk-kvm.ru:3333/features', {
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
                setFeatures(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])

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
        { field: 'product', headerName: 'Продукт', flex: 1 },
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
        const requestOptions = {
            method: isPOST ? 'POST' : 'PATCH',
            headers: { 'Content-Type': 'application/javascript', token: authToken },
            body: reqJSON,
            redirect: 'follow',
        }
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
                //window.location = `./#/article?id=${article}`
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const onCreateNewRecordHandler = () => {}
    const onDeleteRecordHandler = () => {}
    const onEditRecordHandler = () => {}

    const optionsFeatures =
        features == null ? (
            <></>
        ) : (
            features.map((val, index) => {
                return (
                    <option key={index} value={val.id}>
                        {`[${val.product.short_name}] ${val.parameter.name}`}
                    </option>
                )
            })
        )

    const addFeature = () => {
        setFeatureAddingVisible(!featureAddingVisible)
    }

    const saveFeature = () => {
        if (currentFeature != null && currentFeature >= 0) {
            console.log(currentFeature, 'current feature')
            console.log(features, 'features')
            if (features != null) {
                const fff = features.find((x) => x.id == currentFeature)
                console.log(fff, 'fff')
            }
            fetch(`${baseUrl}/features/${currentFeature}`, {
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
                    const product = data.product.id
                    const parameter = data.parameter.id
                    const summary = data.summary
                    const segments = data.segments ?? []
                    let saveFeature = false
                    console.log(segments, 'segments')
                    if (typeof segments === 'undefined' || segments === null) {
                        console.log('Saving...')
                        saveFeature = true
                    } else if (segments.find((x) => x == id) == null) {
                        const ff = segments.find((x) => x == id)
                        console.log(ff, 'ff')
                        console.log('Saving...')
                        saveFeature = true
                    }
                    if (saveFeature) {
                        const reqBody = {
                            product_id: parseInt(product),
                            parameter_id: parseInt(parameter),
                            summary: summary,
                            segments: (segments ?? []).push(id),
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
                                    alert('Error while save article')
                                    return null
                                }
                                return response.json()
                            })
                            .then((data) => {
                                console.log(data)
                                window.location = `./#/feature-list`
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
    }
    const documentUrl = `./document?id=${document}`
    const articleUrl = `./article?id=${article}`

    const [isSuccessfullySaved, setIsSuccessfullySaved] = React.useState(false)
    const [isMessageUnauthorized, setIsMessageUnauthorized] = React.useState(false)

    return (
        <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12}>
                <Stack spacing={1}>
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

export default Segment