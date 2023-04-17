import React, { useEffect } from 'react';
import {
    Grid, Box, Stack, Card, CardHeader, CardContent, Typography, CircularProgress, Backdrop, Slider
} from "@mui/material";
import AutocompleteCombobox from "../../components/autocomplete-combobox/AutocompleteCombobox";

const FoundClaimRecord = ({productName, realmName, feeName, clause}) => {
    return (
        <Card>
            <CardHeader
                subheader={productName}
            />
            <CardContent>
                <Typography variant="body1" color="text.secondary">
                    {realmName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Минимальная сумма: {feeName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {clause}
                </Typography>
            </CardContent>
        </Card>
    )
}

const Market = () => {
    const [realms, setRealms] = React.useState(null)
    const [actors, setActors] = React.useState(null)
    const [noFilterSelected, setNoFilterSelected] = React.useState(true)
    const [foundClaims, setFoundClaims] = React.useState(null)
    const [realmsParams, setRealmsParams] = React.useState(-1)
    const [actorsParams, setActorsParams] = React.useState(-1)
    const [sumParams, setSumParams] = React.useState(0)
    const baseUrl = 'http://487346.msk-kvm.ru:3333'

    useEffect(() => {
        fetch(`${baseUrl}/realms`, {
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
                setRealms(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => {
        fetch(`${baseUrl}/actors`, {
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
                setActors(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => {
        let realm_id = -1;
        let actor_id = -1;

        if (typeof realmsParams === "undefined" || realmsParams == null) {
            realm_id = -1;
        }
        else if (typeof realmsParams.id === "undefined" || realmsParams.id == null) {
            realm_id = -1;
        }
        else {
            realm_id = realmsParams.id
        }

        if (typeof actorsParams === "undefined" || actorsParams == null) {
            actor_id = -1;
        }
        else if (typeof actorsParams.id === "undefined" || actorsParams.id == null) {
            actor_id = -1;
        }
        else {
            actor_id = actorsParams.id
        }
        console.log(`realm_id=${realm_id}; actor_id=${actor_id} sumParams=${sumParams}`)
        if (realm_id !== -1 || actor_id !== -1 || sumParams != 10) {
            setNoFilterSelected(false)
            let urlRealmsFilters = ''
            if (realm_id !== -1) {
                urlRealmsFilters = `&realm_id=${realm_id}`
            }
            let urlActorsFilters = ''
            if (actor_id !== -1) {
                urlActorsFilters = `&actor_id=${actor_id}`
            }
            let urlSumParams = ''
            if (sumParams !== 10) {
                urlSumParams = `&max=${sumsValues[sumParams]}`
            }
            let fetchUrl = `${baseUrl}/claims?${urlRealmsFilters}${urlActorsFilters}${urlSumParams}`
            console.log(fetchUrl)
            backdropOpen()
            fetch(fetchUrl, {
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
                    setFoundClaims(data)
                })
                .catch(function (error) {
                    console.log(error)
                })
                .finally(() => { backdropClose() })
        } else {
            setFoundClaims(null)
            setNoFilterSelected(true)
        }
    }, [realmsParams, actorsParams, sumParams])

    const sumsValues = [
        10_000_000, 50_000_000, 100_000_000, 250_000_000, 500_000_000, 1_000_000_000, 2_000_000_000,
        3_000_000_000, 5_000_000_000, 10_000_000_000,
    ]
    const sumsValuesText = [
        '10 млн',
        '50 млн',
        '100 млн',
        '250 млн',
        '500 млн',
        '1 млрд',
        '2 млрд',
        '3 млрд',
        '5 млрд',
        '10 млрд',
    ]

    const realmsOptions =
        realms && realms
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
                .map((val) => {
                    return {id: val.id, label: val.description}
                })

    const actorsOptions =
        actors && actors
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
                .map((val) => {
                    return {id: val.id, label: val.name}
                })

    const foundClaimsList =
        foundClaims && foundClaims.map((val, index) => <FoundClaimRecord
            key={index}
            productName={`[${val.product.short_name}] ${val.product.name}`}
            realmName={realmsParams?.id !== -1 ? val.realm.description : ''}
            feeName={val.fee.name}
            clause={val.clause}
        />)
    const foundClaimsCount =
        foundClaims == null ? ( noFilterSelected ? 'не выбрано фильтров' : 'не найдено') : `найдено вариантов: ${foundClaims.length}`

    const sumParamsView =
        typeof sumParams == 'undefined' || typeof sumsValues[sumParams] == 'undefined'
            ? 'любой'
            : `от ${sumsValuesText[sumParams]} рублей`

    const getSumParamsView = (value) =>
        typeof value == 'undefined' || typeof sumsValues[value] == 'undefined'
        ? 'любой'
        : `от ${sumsValuesText[value]} рублей`
    const handleChange = (event, newValue) => {
        if (typeof newValue === 'number') {
            setSumParams(newValue);
        }
    }

    const [backdropVisible, setBackdropVisible] = React.useState(false);
    const backdropClose = () => { setBackdropVisible(false) }
    const backdropOpen = () => { setBackdropVisible(true) }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={backdropVisible}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Stack spacing={1}>
                    <Box mb={2}>
                        <AutocompleteCombobox
                            id={'realm'}
                            label={'Выберите сферу инвестирования'}
                            // showDebugInfo={true}
                            options={realmsOptions}
                            onValueChanged={setRealmsParams}
                        />
                    </Box>
                    <Box mb={2}>
                        <AutocompleteCombobox
                            id={'actor'}
                            label={'Выберите организационно-правовую форму'}
                            // showDebugInfo={true}
                            options={actorsOptions}
                            onValueChanged={setActorsParams}
                        />
                    </Box>
                    <Box mb={2}>
                        <Box>
                            <Typography variant="h6" color="text.secondary">
                                Укажите объём инвестирования
                            </Typography>
                        </Box>
                        <Box>
                            <Slider
                                value={sumParams}
                                min={0}
                                step={1}
                                max={10}
                                getAriaValueText={getSumParamsView}
                                valueLabelFormat={getSumParamsView}
                                onChange={handleChange}
                                valueLabelDisplay="auto"
                            />
                        </Box>
                        <Box>
                            <Typography variant="body1" color="text.secondary">{sumParamsView}</Typography>
                        </Box>
                    </Box>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Stack spacing={2}>
                    <Typography variant="h6" color="text.primary">{foundClaimsCount}</Typography>
                    {foundClaimsList}
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Market