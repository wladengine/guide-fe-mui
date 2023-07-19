import React, {useEffect} from 'react'
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import css from './dashboard.module.css'
import ProductSegmentRow from "../../components/product-segment-row/ProductSegmentRow";
import {Backdrop, CircularProgress} from "@mui/material";
import {baseUrl, standardGetRequestWithoutCookies} from "../../globalConstants";
import Button from "@mui/material/Button";
import DownloadIcon from '@mui/icons-material/Download';

const Dashboard = () => {
    const [groups, setGroups] = React.useState(null)
    const [products, setProducts] = React.useState(null)
    const [foundFeatures, setFoundFeatures] = React.useState(null)
    const [filterParams, setFilterParams] = React.useState([])
    const [productParams, setProductParams] = React.useState([])
    const [collapsedMenuItems, setCollapsedMenuItems] = React.useState([])
    const [excelUrl, setExcelUrl] = React.useState(null)
    const [productDocumentsCache, setProductDocumentsCache] = React.useState({});

    useEffect(() => {
        fetch(`${baseUrl}/groups`, standardGetRequestWithoutCookies)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setGroups(data)
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
        setFilterParams([])
        setProductParams([])
    }, [])
    useEffect(() => {
        setExcelUrl(null)
        if (typeof productParams == 'undefined' || typeof filterParams == 'undefined') {
            console.log(`typeof productParams = ${typeof productParams}`)
            console.log(`typeof filterParams = ${typeof filterParams}`)
        } else if (filterParams == null || productParams == null) {
            console.log(`productParams = ${productParams}`)
            console.log(`filterParams = ${filterParams}`)
        } else {
            let urlDocumentFilters = ''
            let urlParamsFilters = ''
            let hasValidFilters = false
            if (typeof productParams != 'undefined' && productParams.length > 0) {
                hasValidFilters = true
                productParams.forEach((val, index) => {
                    urlDocumentFilters = urlDocumentFilters + `&product_id=${val}`
                    cacheDocumentsForProduct(val)
                })
            }
            if (typeof filterParams != 'undefined' && filterParams.length > 0) {
                hasValidFilters = true
                filterParams.forEach((val, index) => {
                    urlParamsFilters = urlParamsFilters + `&parameter_id=${val}`
                })
            }
            if (!hasValidFilters) {
                setFoundFeatures(null)
                return
            }

            let filters = `${urlDocumentFilters}${urlParamsFilters}`
            setExcelUrl(`${baseUrl}/features/stream?${filters}`)

            backdropOpen()

            fetch(`${baseUrl}/features?${filters}`, standardGetRequestWithoutCookies)
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    setFoundFeatures(data)
                })
                .catch(function (error) {
                    console.log(error)
                })
                .finally(() => backdropClose())
        }
    }, [filterParams, productParams])

    const cacheDocumentsForProduct = (productId) => {
        const cached = getDataFromProductDocumentsCache(productId)
        if (!cached) {
            fetch(`${baseUrl}/products/${productId}/documents`, standardGetRequestWithoutCookies)
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    addToProductDocumentsCache(productId, data)
                })
                .catch(function (error) {
                    console.log(error)
                })
                .finally(() => backdropClose())
        }
    }

    const addToProductDocumentsCache = (key, value) => {
        setProductDocumentsCache(prevCache => ({
            ...prevCache,
            [key]: value,
        }))
    }

    const getDataFromProductDocumentsCache = (key) => {
        return productDocumentsCache[key] || null
    }

    const isFilterParamsEmpty = () => !filterParams || filterParams.length === 0
    const updateFilterParams = (paramId) => {
        if (typeof filterParams == 'undefined') {
            console.log(`updateFilterParams(${filterParams}): typeof filterParams == 'undefined'`)
        } else if (filterParams == null) {
            console.log(`updateFilterParams(${filterParams}): filterParams == ${filterParams}`)
        } else if (typeof filterParams == 'number' && filterParams == paramId) {
            setFilterParams([])
        } else if (filterParams.includes(paramId)) {
            setFilterParams([...filterParams.filter((element) => element !== paramId)])
        } else {
            setFilterParams([...filterParams, paramId])
        }
    }
    const updateProductParams = (paramId) => {
        if (typeof productParams == 'undefined') {
            console.log(`updateProductParams(${productParams}): typeof productParams == 'undefined'`)
        } else if (productParams == null) {
            console.log(`updateProductParams(${productParams}): productParams == ${productParams}`)
        } else if (typeof productParams == 'number' && productParams == paramId) {
            setProductParams([])
        } else if (productParams.includes(paramId)) {
            setProductParams([...productParams.filter((element) => element !== paramId)])
        } else {
            setProductParams([...productParams, paramId])
        }
    }
    const updateCollapsedMenuItems = (paramId) => {
        if (typeof collapsedMenuItems == 'undefined') {
            console.log(`updateCollapsedMenuItems(${paramId}): typeof collapsedMenuItems == 'undefined'`)
        } else if (collapsedMenuItems == null) {
            console.log(`updateCollapsedMenuItems(${paramId}): collapsedMenuItems == ${collapsedMenuItems}`)
        } else if (typeof collapsedMenuItems == 'number' && collapsedMenuItems == paramId) {
            setCollapsedMenuItems([])
        } else if (collapsedMenuItems.includes(paramId)) {
            setCollapsedMenuItems([...collapsedMenuItems.filter((element) => element !== paramId)])
        } else {
            setCollapsedMenuItems([...collapsedMenuItems, paramId])
        }
    }

    const GetIsCollapsedMenuItem = (itemId) => {
        return collapsedMenuItems.includes(itemId);
    }

    const paramsFiltersRows =
        groups && groups
            .map((val, index) => {
                const filteredParams = val.parameters.sort((a, b) => a.id - b.id).map((val_p) => {
                    return (
                        <FormControlLabel
                            key={val_p.id}
                            label={val_p.name}
                            control={<Switch size={"small"} onClick={(e) => { updateFilterParams(val_p.id) }} />}
                            sx={{ pb: 0.75 }}
                        />
                    )
                })
                let prmId = `prm_${index}`;
                const isCollapsedMenuItem = GetIsCollapsedMenuItem(prmId);
                const boxContent =
                    isCollapsedMenuItem
                        ? <>
                            <Typography
                                style={{cursor: "pointer"}}
                                onClick={() => updateCollapsedMenuItems(prmId)}>скрыть</Typography>
                            {filteredParams}
                        </>
                        : <Typography
                            style={{cursor: "pointer"}}
                            onClick={() => updateCollapsedMenuItems(prmId)}>раскрыть</Typography>
                return (
                    <Box key={prmId} pt={2}>
                        <FormLabel component="legend">{val.name}</FormLabel>
                        {boxContent}
                    </Box>
                )
            })

    const productsList =
        products && products
            .map((val, index) => {
                return (
                    <FormControlLabel
                        key={index}
                        label={val.name}
                        control={<Switch size={"small"} onClick={(e) => { updateProductParams(val.id) }} />}
                        sx={{ pb: 0.75 }}
                    />
                )
            })

    const GetAllUniqueParametersNew = () =>
        groups && groups
            .map((v) => v.parameters)
            .flat()
            .filter(item => isFilterParamsEmpty() || filterParams.includes(item.id))
            .sort((a, b) => a.id - b.id)

    const foundFeaturesList =
        productParams.length > 0 && GetAllUniqueParametersNew()
            .map((val, index) =>
                <ProductSegmentRow
                    key={index}
                    val={val}
                    productParams={productParams}
                    foundFeatures={foundFeatures}
                    productDocumentsCache={productDocumentsCache}
                />
            )

    const selectedProductColumns =
        productParams.filter((x) => x > 0).length > 0 && products != null ? (
            productParams
                .filter((x) => x > 0)
                .map((val, index) => {
                    const value = products.find((x) => x.id == val)
                    return <th className={css.topContent} key={index}>{value.short_name}</th>
                })
        ) : (
            <td className={css.topContent}>
                <div className={'card'}>
                    <div className={'card-body'}>
                        <h4>Выберите инструмент</h4>
                    </div>
                </div>
            </td>
        )

    const productsFormGroup =
        GetIsCollapsedMenuItem('productList')
            ? <>
                <Typography
                    style={{cursor: "pointer"}}
                    onClick={() => updateCollapsedMenuItems('productList')}>скрыть -</Typography>
                <FormGroup>
                    {productsList}
                </FormGroup>
            </>
            : <>
                <Typography
                    style={{cursor: "pointer"}}
                    onClick={() => updateCollapsedMenuItems('productList')}>раскрыть +</Typography>
            </>

    const excelButton =
        <FormGroup sx={{pt: 5, pb: 5}}>
            <Button href={excelUrl} variant="contained" startIcon={<DownloadIcon />}>
                Скачать excel
            </Button>
        </FormGroup>

    const [backdropVisible, setBackdropVisible] = React.useState(false);
    const backdropClose = () => {
        setBackdropVisible(false);
    };
    const backdropOpen = () => {
        setBackdropVisible(true);
    };
    return (
        <Grid container spacing={2}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backdropVisible}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid item xs={3}>
                {excelUrl === null ? '' : excelButton }
                <b>Инструменты</b>
                {productsFormGroup}
                <br />
                <b>Характеристики</b>
                {paramsFiltersRows}
            </Grid>
            <Grid item xs={9}>
                <table>
                    <thead>
                    <tr>
                        <th></th>
                        {selectedProductColumns}
                    </tr>
                    </thead>
                    <tbody>{foundFeaturesList}</tbody>
                </table>
            </Grid>
        </Grid>
    )
}

export default Dashboard
