import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
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
import {
    baseUrl,
    getPatchParametersWithCookies,
    getPostParametersWithCookies,
    standardGetRequestWithoutCookies
} from "../../globalConstants";
import {refreshAuthCookie} from "../../utils/CookiesProvider";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const Actor = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [id, setId] = React.useState(searchParams.get('id'))
    const [name, setName] = React.useState('')
    const [type, setType] = React.useState('')
    const types = [
        { id: 1, name: "Физическое лицо" },
        { id: 2, name: "Юридическое лицо" }
    ]

    useEffect(refreshAuthCookie, [])
    useEffect(() => {
        fetch(`${baseUrl}/actors/${id}`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setName(data.name)
                setType({id: data.type.id, label: data.type.name })
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])

    const [isSuccessfullySaved, setIsSuccessfullySaved] = React.useState(false)
    const [isMessageUnauthorized, setIsMessageUnauthorized] = React.useState(false)

    const saveActor = () => {
        const reqBody = {
            name: name,
            type: parseInt(type.id),
        }
        const reqJSON = JSON.stringify(reqBody)
        const isPOST = (id ?? -1) <= 0
        const requestOptions = isPOST
            ? getPostParametersWithCookies(reqJSON)
            : getPatchParametersWithCookies(reqJSON)

        backdropOpen()
        const fetchUrl = isPOST ? `${baseUrl}/actors` : `${baseUrl}/actors/${id}`
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

    const [backdropVisible, setBackdropVisible] = React.useState(false);
    const backdropClose = () => {
        setBackdropVisible(false);
    };
    const backdropOpen = () => {
        setBackdropVisible(true);
    };

    const optionsTypes =
        types === null ?
            [] :
            types.map((val) => ({id: val.id, label: val.name }))

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
                        <Link underline="hover" color="inherit" href="/actor-list">
                            Инвесторы
                        </Link>
                        <Typography key="3" color="text.primary">
                            {name}
                        </Typography>
                    </Breadcrumbs>
                    <Typography variant="h5" color="text.primary">Инвестор</Typography>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <Autocomplete
                                value={type}
                                getOptionLabel={option => option.label}
                                onChange={(event, newValue) => {
                                    setType(newValue);
                                }}
                                id={'document'}
                                options={optionsTypes}
                                renderInput={(params) => <TextField {...params} label={'Тип'} />}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="actor_type">
                                Название
                            </InputLabel>
                            <Input
                                id="actor_type"
                                value={name}
                                multiline
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
                        <Button onClick={saveActor}>
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

export default Actor