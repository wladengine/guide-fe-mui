import React, { useEffect } from 'react'
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import ProductTimeline from "../../components/product-timeline/ProductTimeline";
import css from './dashboard.module.css'

const Dashboard = () => {
    const [groups, setGroups] = React.useState(null)
    const [products, setProducts] = React.useState(null)
    const [foundFeatures, setFoundFeatures] = React.useState(null)
    const [filterParams, setFilterParams] = React.useState([])
    const [productParams, setProductParams] = React.useState([])
    const baseUrl = 'http://487346.msk-kvm.ru:3333'

    useEffect(() => {
        fetch(`${baseUrl}/groups`, {
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
                setGroups(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])
    useEffect(() => {
        fetch(`${baseUrl}/products`, {
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
        console.log(
            `call filterFeatures(): productParams = ${typeof productParams}, filterParams = ${typeof filterParams}`,
        )
        if (typeof productParams == 'undefined' || typeof filterParams == 'undefined') {
            console.log(`typeof productParams = ${typeof productParams}`)
            console.log(`typeof filterParams = ${typeof filterParams}`)
        } else if (filterParams == null || productParams == null) {
            console.log(`productParams = ${productParams}`)
            console.log(`filterParams = ${filterParams}`)
        } else {
            console.log(`productParams = ${[...productParams]}`)
            let urlDocumentFilters = ''
            let urlParamsFilters = ''
            let hasValidFilters = false
            if (typeof productParams != 'undefined' && productParams.length > 0) {
                hasValidFilters = true
                productParams.forEach((val, index) => {
                    urlDocumentFilters = urlDocumentFilters + `&product_id=${val}`
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
            console.log(`${baseUrl}/features?${urlDocumentFilters}${urlParamsFilters}`)
            fetch(`${baseUrl}/features?${urlDocumentFilters}${urlParamsFilters}`, {
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
                    setFoundFeatures(data)
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
    }, [filterParams, productParams])

    const updateFilterParams = (paramId) => {
        console.log(
            `call updateFilterParams(${paramId}): filterParams = ${filterParams}, ${typeof filterParams}`,
        )
        if (typeof filterParams == 'undefined') {
            console.log(`updateFilterParams(${filterParams}): typeof filterParams == 'undefined'`)
        } else if (filterParams == null) {
            console.log(`updateFilterParams(${filterParams}): filterParams == ${filterParams}`)
        } else if (typeof filterParams == 'number' && filterParams == paramId) {
            setFilterParams([])
        } else if (filterParams.includes(paramId)) {
            setFilterParams([...filterParams.filter((element) => element !== paramId)])
            console.log(`updateFilterParams(${filterParams}): removed element`)
        } else {
            setFilterParams([...filterParams, paramId])
            console.log(
                `updateFilterParams(${filterParams}): added element. ${[...filterParams, paramId]}`,
            )
        }
    }
    const updateProductParams = (paramId) => {
        console.log('updateProductParams(', paramId)
        if (typeof productParams == 'undefined') {
            console.log(`updateProductParams(${productParams}): typeof productParams == 'undefined'`)
        } else if (productParams == null) {
            console.log(`updateProductParams(${productParams}): productParams == ${productParams}`)
        } else if (typeof productParams == 'number' && productParams == paramId) {
            setProductParams([])
        } else if (productParams.includes(paramId)) {
            setProductParams([...productParams.filter((element) => element !== paramId)])
            console.log(`updateProductParams(${productParams}): removed element`)
        } else {
            setProductParams([...productParams, paramId])
            console.log(
                `updateProductParams(${filterParams}): added element. ${[...productParams, paramId]}`,
            )
        }
    }

    const paramsFiltersRows =
        groups == null
            ? null
            : groups.map((val, index) => {
                const filteredParams = val.parameters.map((val_p, index_p) => {
                    return (
                        <FormControlLabel
                            key={val_p.id}
                            label={val_p.name}
                            control={<Switch size={"small"} onClick={(e) => { updateFilterParams(val_p.id) }} />}
                        />
                    )
                })
                return (
                    <Box key={`prm_${index}`} pt={2}>
                        <FormLabel component="legend">{val.name}</FormLabel>
                        {filteredParams}
                    </Box>
                )
            })

    const productsList =
        products == null
            ? null
            : products.map((val, index) => {
                return (
                    <FormControlLabel
                        key={index}
                        label={val.short_name}
                        control={<Switch size={"small"} onClick={(e) => { updateProductParams(val.id) }} />}
                    />
                )
            })

    const foundFeaturesList =
        foundFeatures == null
            ? null
            : foundFeatures.map((val, index) => {
                const rowHeader = (
                    <td style={{ width: '20%', verticalAlign: "top", padding: 5 }} key={val.id}>
                        <b>{val.parameter.name}</b>
                    </td>
                )
                const count = productParams.length
                //const ColWidth = `${(100 - 20) / count}%`
                const ColWidth = `70%`
                const documentList =
                    val.segments == null || count == 0
                        ? null
                        : productParams
                            .filter((x) => x > 0)
                            .map((prod, index) => {
                                const id = `prod_${prod}_${index}`
                                console.log(`val.product.id = ${val.product.id}, prod.id=${prod}`)
                                const segmentsList =
                                    val.product.id != prod ? (
                                        <Card>
                                            <CardHeader subheader={'Нет данных'} />
                                        </Card>
                                    ) : (
                                        val.segments.map((val_seg) => {
                                            return (
                                                <Card key={val_seg.id}>
                                                    <CardHeader
                                                        subheader={`${val_seg.document.short_name} 
                                                        ст. ${val_seg.article.number} 
                                                        п. ${val_seg.number}`}
                                                    />
                                                    <CardContent>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {val_seg.text}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })
                                    )
                                return (
                                    <td key={id} style={{ width: ColWidth, verticalAlign: "top", padding: 5 }}>
                                        <b>{prod.short_name}</b>
                                        {segmentsList}
                                    </td>
                                )
                            })
                return (
                    <tr key={index}>
                        {rowHeader}
                        {documentList}
                    </tr>
                )
            })

    const selectedProductColumns =
        productParams.filter((x) => x > 0).length > 0 && products != null ? (
            productParams
                .filter((x) => x > 0)
                .map((val, index) => {
                    const value = products.find((x) => x.id == val)
                    console.log(`finding product.id = ${val} = ${value}`)
                    return <th className={css.topContent} key={index}>{value.short_name}</th>
                })
        ) : (
            <td className={css.topContent}>
                <div className={'card'}>
                    <div className={'card-body'}>
                        <h4>Нет данных</h4>
                    </div>
                </div>
            </td>
        )

    const selectedProductTimelines =
        productParams.filter((x) => x > 0).length > 0 && products != null ? (
            productParams
                .filter((x) => x > 0)
                .map((val, index) => {
                    return (
                        <td key={index} style={{ verticalAlign: "top", padding: 5, minWidth: 450 }}>
                            <Card>
                                <CardContent>
                                    <ProductTimeline productId={val} />
                                </CardContent>
                            </Card>
                        </td>
                    )
                })
        ) : ''

    const WrappedProductTimelines =
        productParams.filter((x) => x > 0).length > 0 && products != null ?
            <tfoot>
                <td style={{ verticalAlign: "top", padding: 5 }}><b>Этапы исполнения</b></td>
                {selectedProductTimelines}
            </tfoot> : ''

    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <FormLabel component="legend">Инструменты</FormLabel>
                <FormGroup>
                    {productsList}
                </FormGroup>
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
                    {WrappedProductTimelines}
                </table>
            </Grid>
        </Grid>
    )
}

export default Dashboard