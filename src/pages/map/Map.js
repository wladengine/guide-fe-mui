import React, {useEffect} from 'react'
import css from './map.module.css'
import Box from "@mui/material/Box";
import AutocompleteCombobox from "../../components/autocomplete-combobox/AutocompleteCombobox";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MapSearchResult from "../../components/map-search-result/MapSearchResult";

function getRegionOptions(regions) {
    return regions && regions
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
            return {id : val.id, label : val.name}
        });
}

function getFoundationOptions(foundations) {
    return foundations && foundations
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
            return {id : val.id, label : val.description}
        });
}

const SearchBlock = () => {
    const baseUrl = 'http://487346.msk-kvm.ru:3333'
    const [regions, setRegions] = React.useState(null)
    const [foundObjects, setFoundObjects] = React.useState(null)
    const [foundations, setFoundations] = React.useState(null)
    const [regionParams, setRegionParams] = React.useState(-1)
    const [foundationParams, setFoundationParams] = React.useState(-1)

    useEffect(() => {
        fetch(`${baseUrl}/regions`, {
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
                setRegions(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => {
        fetch(`${baseUrl}/foundations`, {
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
                setFoundations(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => {
        if (regionParams == null && foundationParams != null) {
            setRegionParams(-1)
        }
        if (regionParams != null && foundationParams == null) {
            setFoundationParams(-1)
        }
        if (regionParams != -1 || foundationParams != -1) {
            let urlRegionFilters = ''
            if (regionParams != -1) {
                urlRegionFilters = `&region_id=${regionParams}`
            }
            let urlFoundationFilters = ''
            if (foundationParams != -1) {
                urlFoundationFilters = `&foundation_id=${foundationParams}`
            }

            let fetchUrl = `${baseUrl}/objects?${urlRegionFilters}${urlFoundationFilters}`
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
                    setFoundObjects(data)
                })
                .catch(function (error) {
                    console.log(error)
                })
        } else {
            setFoundObjects(null)
            console.log(`regionParams=${regionParams}, foundationParams=${foundationParams}; clearing found objects...`)
        }
    }, [regionParams, foundationParams])

    const regionOptions = getRegionOptions(regions)
    const foundationOptions = getFoundationOptions(foundations)

    const foundObjectsList =
        foundObjects && foundObjects.map((val, index) => {
            return (<MapSearchResult
                key={index}
                regionName={val.region.name}
                foundationDescription={val.foundation.description}
                town={val.town}
                link={val.link}
            />)
        })
    const foundObjectsCount =
        foundObjects == null ? 'не найдено' : `найдено вариантов: ${foundObjects.length}`

    return (
        <>
            <div>
                <Box mb={2}>
                    <AutocompleteCombobox
                        id={'region'}
                        label={'Выберите регион'}
                        // showDebugInfo={true}
                        options={regionOptions}
                        onValueChanged={setRegionParams}
                    />
                </Box>
                <Box mb={2}>
                    <AutocompleteCombobox
                        id={'foundation'}
                        label={'Выберите форму'}
                        // showDebugInfo={true}
                        options={foundationOptions}
                        onValueChanged={setFoundationParams}
                    />
                </Box>
            </div>
            <div>
                <Stack spacing={1}>
                    <b>{foundObjectsCount}</b>
                    {foundObjectsList}
                </Stack>
            </div>
        </>
    )
}

const Map = () => {
    return (
        <>
            <iframe src={'map.html'} className={css.map}></iframe>
            <SearchBlock />
        </>
    )
}

export default Map
