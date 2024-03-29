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
import SnackbarError from "../../components/snackbar-error/SnackbarError";
import {
    baseUrl,
    getPatchParametersWithCookies,
    getPostParametersWithCookies,
    standardGetRequestWithoutCookies
} from "../../globalConstants";
import {refreshAuthCookie} from "../../utils/CookiesProvider";

const Group = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [id, setId] = React.useState(searchParams.get('id'))
    const [name, setName] = React.useState('')
    const [order, setOrder] = React.useState('')

    useEffect(refreshAuthCookie, [])
    useEffect(() => {
        fetch(`${baseUrl}/groups/${id}`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setName(data.name)
                setOrder(data.order)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])

    const [isSuccessfullySaved, setIsSuccessfullySaved] = React.useState(false)
    const [isMessageUnauthorized, setIsMessageUnauthorized] = React.useState(false)

    const saveGroup = () => {
        const reqBody = {
            name: name,
            order: parseInt(order)
        }
        const reqJSON = JSON.stringify(reqBody)
        const isPOST = (id ?? -1) <= 0
        const requestOptions = isPOST
            ? getPostParametersWithCookies(reqJSON)
            : getPatchParametersWithCookies(reqJSON)

        backdropOpen()
        const fetchUrl = isPOST ? `${baseUrl}/groups` : `${baseUrl}/groups/${id}`
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
                        <Link underline="hover" color="inherit" href="/group-list">
                            Группы характеристик
                        </Link>
                        <Typography key="3" color="text.primary">
                            {name}
                        </Typography>
                    </Breadcrumbs>
                    <Typography variant="h5" color="text.primary">Инструмент</Typography>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="product_name">
                                Название инструмента
                            </InputLabel>
                            <Input
                                id="product_name"
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
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="group_order">
                                Порядок сортировки
                            </InputLabel>
                            <Input
                                id="group_order"
                                value={order}
                                onChange={(e) => {
                                    setOrder(e.target.value)
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
                        <Button onClick={saveGroup}>
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

export default Group