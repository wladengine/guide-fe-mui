import React, { useEffect } from 'react';
import AutocompleteCombobox from "../../components/autocomplete-combobox/AutocompleteCombobox";
import Box from '@mui/material/Box';
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import ProductTimeline from "../../components/product-timeline/ProductTimeline";

const Market = () => {
    const [realms, setRealms] = React.useState(null)
    const [actors, setActors] = React.useState(null)
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
        if (realmsParams != -1 || actorsParams != -1 || sumParams != 10) {
            let urlRealmsFilters = ''
            if (realmsParams != -1) {
                urlRealmsFilters = `&realm_id=${realmsParams}`
            }
            let urlActorsFilters = ''
            if (actorsParams != -1) {
                urlActorsFilters = `&actor_id=${actorsParams}`
            }
            let urlSumParams = ''
            if (sumParams != 10) {
                urlSumParams = `&max=${sumsValues[sumParams]}`
            }
            let fetchUrl = `${baseUrl}/claims?${urlRealmsFilters}${urlActorsFilters}${urlSumParams}`
            console.log(fetchUrl)
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
        } else {
            setFoundClaims(null)
        }
    }, [realmsParams, actorsParams, sumParams])

    const sumsValues = [
        10_000_000, 50_000_000, 100_000_000, 250_000_000, 500_000_000, 1_000_000_000, 2_000_000_000,
        3_000_000_000, 5_000_000_000, 10_000_000_000,
    ]
    const sumsValuesText = [
        '10 ??????',
        '50 ??????',
        '100 ??????',
        '250 ??????',
        '500 ??????',
        '1 ????????',
        '2 ????????',
        '3 ????????',
        '5 ????????',
        '5 ????????',
    ]

    const realmsOptions =
        realms == null
            ? null
            : realms
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
        actors == null
            ? null
            : actors
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
        foundClaims == null
            ? null
            : foundClaims.map((val, index) => {
                return (
                    <Card key={index}>
                        <CardHeader
                            subheader={`[${val.product.short_name}] ${val.product.name}`}
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                {realmsParams == -1 ? val.realm.description : ''}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                ?????????????????????? ??????????: {val.fee.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {val.clause}
                            </Typography>
                        </CardContent>
                    </Card>
                )
            })
    const foundClaimsCount =
        foundClaims == null ? '???? ??????????????' : `?????????????? ??????????????????: ${foundClaims.length}`

    const sumParamsView =
        typeof sumParams == 'undefined' || typeof sumsValues[sumParams] == 'undefined'
            ? '??????????'
            : `???? ${sumsValuesText[sumParams]} ????????????`

    return (
        <>
            <div className={'CRow'}>
                <div className={'CCol'} xs={11}>
                    <Box mb={2}>
                        <AutocompleteCombobox
                            id={'realm'}
                            label={'???????????????? ?????????? ????????????????????????????'}
                            // showDebugInfo={true}
                            options={realmsOptions}
                            onValueChanged={setRealmsParams}
                        />
                    </Box>
                    <Box mb={2}>
                        <AutocompleteCombobox
                            id={'actor'}
                            label={'???????????????? ????????????????????????????-???????????????? ??????????'}
                            // showDebugInfo={true}
                            options={actorsOptions}
                            onValueChanged={setActorsParams}
                        />
                    </Box>
                    <Box mb={2}>
                        <Box>
                            <b htmlFor="customRange2" className="form-label">
                                ?????????????? ?????????? ????????????????????????????
                            </b>
                        </Box>
                        <Box>
                            <input
                                type="range"
                                className="form-range"
                                min="0"
                                max="10"
                                id="customRange2"
                                onChange={(e) => {
                                    setSumParams(e.target.value)
                                }}
                            />
                        </Box>
                        <Box>
                            <span>{sumParamsView}</span>
                        </Box>
                    </Box>
                </div>
            </div>
            <div className={'CRow'}>
                <Stack spacing={1}>
                    <b>{foundClaimsCount}</b>
                    {foundClaimsList}
                </Stack>
            </div>
        </>
    )
}

export default Market