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
import {
    baseUrl,
    getPatchParametersWithCookies,
    getPostParametersWithCookies,
    standardGetRequestWithoutCookies
} from "../../globalConstants";
import {refreshAuthCookie} from "../../utils/CookiesProvider";

const Object = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [id, setId] = React.useState(searchParams.get('id'))

    useEffect(refreshAuthCookie, [])

    const [town, setTown] = React.useState('')
    const [link, setLink] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [region, setRegion] = React.useState('')
    const [regions, setRegions] = React.useState(null)
    const [foundation, setFoundation] = React.useState('')
    const [foundations, setFoundations] = React.useState(null)

    useEffect(() => {
        fetch(`${baseUrl}/objects/${id}`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setTown(data.town)
                setLink(data.link)
                setDescription(data.description)
                setRegion({id: data.region.id, label: data.region.name})
                setFoundation({id: data.foundation.id, label: data.foundation.description})
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => {
        fetch(`${baseUrl}/regions`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setRegions(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => {
        fetch(`${baseUrl}/foundations`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setFoundations(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])

    const [isSuccessfullySaved, setIsSuccessfullySaved] = React.useState(false)
    const [isMessageUnauthorized, setIsMessageUnauthorized] = React.useState(false)

    const saveObject = () => {
        const reqBody = {
            town: town,
            link: link,
            description: description,
            region_id: parseInt(region.id),
            foundation_id: parseInt(foundation.id),
        }
        const reqJSON = JSON.stringify(reqBody)
        const isPOST = (id ?? -1) <= 0
        const requestOptions = isPOST
            ? getPostParametersWithCookies(reqJSON)
            : getPatchParametersWithCookies(reqJSON)

        backdropOpen()
        const fetchUrl = isPOST ? `${baseUrl}/objects` : `${baseUrl}/objects/${id}`
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

    const [backdropVisible, setBackdropVisible] = React.useState(false);
    const backdropClose = () => {
        setBackdropVisible(false);
    };
    const backdropOpen = () => {
        setBackdropVisible(true);
    };

    const optionsRegions =
        regions === null ?
            [] :
            regions
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
    const optionsFoundations =
        foundations === null ?
            [] :
            foundations
                .sort((a, b) => {
                    const nameA = a.description.toUpperCase()
                    const nameB = b.description.toUpperCase()
                    if (nameA < nameB) {
                        return -1
                    }
                    if (nameA > nameB) {
                        return 1
                    }
                    return 0
                })
                .map((val) => ({id: val.id, label: val.description}))

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
                        <Link underline="hover" color="inherit" href="/object-list">
                            Объекты карты
                        </Link>
                        <Typography key="3" color="text.primary">
                            {parseInt(id) === -1 ? 'Новая запись' : 'Редактирование'}
                        </Typography>
                    </Breadcrumbs>
                    <Typography variant="h5" color="text.primary">Инструмент</Typography>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <Autocomplete
                                value={region}
                                getOptionLabel={option => option.label}
                                onChange={(event, newValue) => {
                                    setRegion(newValue);
                                }}
                                id={'group'}
                                options={optionsRegions}
                                renderInput={(params) => <TextField {...params} label={'Регион'} />}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <Autocomplete
                                value={foundation}
                                getOptionLabel={option => option.label}
                                onChange={(event, newValue) => {
                                    setFoundation(newValue);
                                }}
                                id={'realm'}
                                options={optionsFoundations}
                                renderInput={(params) => <TextField {...params} label={'Вид экономической зоны'} />}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="object_town">
                                Населённый пункт
                            </InputLabel>
                            <Input
                                id="object_town"
                                value={town}
                                onChange={(e) => {
                                    setTown(e.target.value)
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
                            <InputLabel htmlFor="object_link">
                                Ссылка
                            </InputLabel>
                            <Input
                                id="object_link"
                                value={link}
                                onChange={(e) => {
                                    setLink(e.target.value)
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
                            <InputLabel htmlFor="object_description">
                                Описание
                            </InputLabel>
                            <Input
                                id="object_description"
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
                        <Button onClick={saveObject}>
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

export default Object