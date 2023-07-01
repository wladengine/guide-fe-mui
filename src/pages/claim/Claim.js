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

const Claim = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [id, setId] = React.useState(searchParams.get('id'))

    const [authToken] = useContext(AuthContext)

    const [clause, setClause] = React.useState('')
    const [product, setProduct] = React.useState('')
    const [products, setProducts] = React.useState(null)
    const [realm, setRealm] = React.useState('')
    const [realms, setRealms] = React.useState(null)
    const [fee, setFee] = React.useState('')
    const [fees, setFees] = React.useState(null)

    useEffect(refreshAuthCookie, [])
    useEffect(() => {
        fetch(`${baseUrl}/claims/${id}`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setClause(data.clause)
                setProduct({id: data.product.id, label: data.product.short_name})
                setRealm({id: data.realm.id, label: data.realm.description})
                setFee({id: data.fee.id, label: data.fee.name})
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
    useEffect(() => {
        fetch(`${baseUrl}/realms`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setRealms(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => {
        fetch(`${baseUrl}/fees`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setFees(data.filter((v) => typeof v.name !== "undefined" ))
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])

    const [isSuccessfullySaved, setIsSuccessfullySaved] = React.useState(false)
    const [isMessageUnauthorized, setIsMessageUnauthorized] = React.useState(false)

    const saveClaim = () => {
        const reqBody = {
            clause: clause,
            product_id: parseInt(product.id),
            realm_id: parseInt(realm.id),
            fee_id: parseInt(fee.id),
        }
        const reqJSON = JSON.stringify(reqBody)
        const isPOST = (id ?? -1) <= 0
        const requestOptions = isPOST
            ? getPostParametersWithCookies(reqJSON)
            : getPatchParametersWithCookies(reqJSON)

        backdropOpen()
        const fetchUrl = isPOST ? `${baseUrl}/claims` : `${baseUrl}/claims/${id}`
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

    const optionsProducts =
        products === null ?
            [] :
            products
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
    const optionsRealms =
        realms === null ?
            [] :
            realms
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
    const optionsFees =
        fees === null ?
            [] :
            fees
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
                        <Link underline="hover" color="inherit" href="/claim-list">
                            Данные для маркета
                        </Link>
                        <Typography key="3" color="text.primary">
                            {parseInt(id) === -1 ? 'Новая запись' : 'Редактирование'}
                        </Typography>
                    </Breadcrumbs>
                    <Typography variant="h5" color="text.primary">Инструмент</Typography>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <Autocomplete
                                value={product}
                                getOptionLabel={option => option.label}
                                onChange={(event, newValue) => {
                                    setProduct(newValue);
                                }}
                                id={'group'}
                                options={optionsProducts}
                                renderInput={(params) => <TextField {...params} label={'Инструмент'} />}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <Autocomplete
                                value={realm}
                                getOptionLabel={option => option.label}
                                onChange={(event, newValue) => {
                                    setRealm(newValue);
                                }}
                                id={'realm'}
                                options={optionsRealms}
                                renderInput={(params) => <TextField {...params} label={'Сфера инвестирования'} />}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <Autocomplete
                                value={fee}
                                getOptionLabel={option => option.label}
                                onChange={(event, newValue) => {
                                    setFee(newValue);
                                }}
                                id={'fee'}
                                options={optionsFees}
                                renderInput={(params) => <TextField {...params} label={'Сумма'} />}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item lg={12} md={12} sm={12}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="claim_clause">
                                Примечание
                            </InputLabel>
                            <Input
                                id="claim_clause"
                                value={clause}
                                onChange={(e) => {
                                    setClause(e.target.value)
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
                        <Button onClick={saveClaim}>
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

export default Claim