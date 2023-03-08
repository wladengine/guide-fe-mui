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
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MessageSuccessfullySaved from "../../components/message-succsessfully-saved/MessageSuccsessfullySaved";
import MessageUnauthorized from "../../components/message-unauthorized/MessageUnauthorized";
import ru from 'date-fns/locale/ru';
import DatePickerRu from "../../components/date-picker-ru/DatePickerRu";

const Document = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [id, setId] = React.useState(searchParams.get('id'))
    const [articles, setArticles] = React.useState(null)

    const [authToken] = useContext(AuthContext)
    const baseUrl = 'http://487346.msk-kvm.ru:3333'

    useEffect(() => {
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
    useEffect(() => {
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
    }, [])

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
            body: reqJSON,
            redirect: 'follow',
        }
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
    const onCreateNewRecordHandler = () => {}
    const onDeleteRecordHandler = () => {}
    const onEditRecordHandler = () => {}

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
