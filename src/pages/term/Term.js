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
    Typography, Backdrop, CircularProgress
} from "@mui/material";
import {
    CreateRounded,
} from "@mui/icons-material";
import MessageSuccessfullySaved from "../../components/message-succsessfully-saved/MessageSuccsessfullySaved";
import MessageUnauthorized from "../../components/message-unauthorized/MessageUnauthorized";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const Term = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [id, setId] = React.useState(searchParams.get('id'))

    const [authToken] = useContext(AuthContext)
    const baseUrl = 'http://487346.msk-kvm.ru:3333'

    useEffect(() => {
        fetch(`${baseUrl}/terms/${id}`, {
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
                setName(data.name)
                setDefinition(data.definition)
                setDocument({id: data.document.id, label: `${data.document.short_name} ${data.document.full_name}` })
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => {
        fetch(`${baseUrl}/documents`, {
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
                setDocuments(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])

    const [isSuccessfullySaved, setIsSuccessfullySaved] = React.useState(false)
    const [isMessageUnauthorized, setIsMessageUnauthorized] = React.useState(false)

    const saveTerm = () => {
        const reqBody = {
            name: name,
            definition: definition,
            document: parseInt(document.id),
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
        const fetchUrl = isPOST ? `${baseUrl}/terms` : `${baseUrl}/terms/${id}`
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
    const [definition, setDefinition] = React.useState('')
    const [document, setDocument] = React.useState('')
    const [documents, setDocuments] = React.useState(null)

    const [backdropVisible, setBackdropVisible] = React.useState(false);
    const backdropClose = () => {
        setBackdropVisible(false);
    };
    const backdropOpen = () => {
        setBackdropVisible(true);
    };

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
                .map((val) => ({id: val.id, label: `${val.short_name} ${val.full_name}`}))

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
                        <Link underline="hover" color="inherit" href="/term-list">
                            Глоссарий
                        </Link>
                        <Typography key="3" color="text.primary">
                            {name}
                        </Typography>
                    </Breadcrumbs>
                    <Typography variant="h5" color="text.primary">Инструмент</Typography>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="term_name">
                                Название
                            </InputLabel>
                            <Input
                                id="term_name"
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
                            <InputLabel htmlFor="term_definition">
                                Описание
                            </InputLabel>
                            <Input
                                id="term_definition"
                                value={definition}
                                onChange={(e) => {
                                    setDefinition(e.target.value)
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
                            <Autocomplete
                                value={document}
                                getOptionLabel={option => option.label}
                                onChange={(event, newValue) => {
                                    setDocument(newValue);
                                }}
                                id={'document'}
                                options={optionsDocuments}
                                renderInput={(params) => <TextField {...params} label={'Группа параметров'} />}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12}>
                        <Button onClick={saveTerm}>
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

export default Term
