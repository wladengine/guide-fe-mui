import React, {useEffect} from 'react'
import css from './map.module.css'
import Box from "@mui/material/Box";
import AutocompleteCombobox from "../../components/autocomplete-combobox/AutocompleteCombobox";
import Stack from "@mui/material/Stack";
import MapSearchResult from "../../components/map-search-result/MapSearchResult";
import {baseUrl, standardGetRequestWithoutCookies} from "../../globalConstants";
import PlaceIcon from '@mui/icons-material/Place';
import { green, yellow } from '@mui/material/colors';
import {Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";

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
            return { id : val.id, label : val.description }
        });
}

const SearchBlock = () => {
    const [regions, setRegions] = React.useState(null)
    const [foundObjects, setFoundObjects] = React.useState(null)
    const [foundations, setFoundations] = React.useState(null)
    const [regionParams, setRegionParams] = React.useState(-1)
    const [foundationParams, setFoundationParams] = React.useState(-1)

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
    useEffect(() => {
        // if (regionParams == null && foundationParams != null) {
        //     setRegionParams({ id: -1 })
        // }
        // if (regionParams != null && foundationParams == null) {
        //     setFoundationParams({ id: -1 })
        // }
        if (regionParams === null && foundationParams === null) {
            setFoundObjects(null)
            console.log(`regionParams=${regionParams}, foundationParams=${foundationParams}; clearing found objects...`)
        }
        else {
            let hasFilters = false
            let urlRegionFilters = ''
            if (typeof regionParams !== "undefined" && regionParams !== null && typeof regionParams.id !== "undefined" && regionParams.id !== null && regionParams.id !== -1) {
                urlRegionFilters = `&region_id=${regionParams.id}`
                hasFilters = true
            }
            let urlFoundationFilters = ''
            if (typeof foundationParams !== "undefined" && foundationParams !== null && typeof foundationParams.id !== "undefined" && foundationParams.id !== null && foundationParams.id !== -1) {
                urlFoundationFilters = `&foundation_id=${foundationParams.id}`
                hasFilters = true
            }
            if (!hasFilters) {
                setFoundObjects(null)
                return
            }
            let fetchUrl = `${baseUrl}/objects?${urlRegionFilters}${urlFoundationFilters}`
            console.log(fetchUrl)
            fetch(fetchUrl, standardGetRequestWithoutCookies)
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    setFoundObjects(data)
                })
                .catch(function (error) {
                    console.log(error)
                })
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
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <nav aria-label="main mailbox folders">
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PlaceIcon color="primary"/>
                                </ListItemIcon>
                                <ListItemText primary="Оособые экономические зоны" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PlaceIcon  sx={{ color: yellow['A700'] }} />
                                </ListItemIcon>
                                <ListItemText primary="Территории опережающего развития" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PlaceIcon color="secondary" />
                                </ListItemIcon>
                                <ListItemText primary="Инновационные научно-технологические центры" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </nav>
            </Box>
            <SearchBlock />
        </>
    )
}

export default Map
