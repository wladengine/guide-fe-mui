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
import Stack from "@mui/material/Stack";

const Dashboard = () => {
    const [groups, setGroups] = React.useState(null)
    const [products, setProducts] = React.useState(null)
    const [foundFeatures, setFoundFeatures] = React.useState(null)
    const [timelines, setTimelines] = React.useState([])
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
    useEffect(() => {
        fetch(`${baseUrl}/stages`, {
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
                setTimelines(data);
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])

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

    const GetTimelinesByProduct = (productId) => {
        const filtered = timelines.filter((t) => t.product.id == productId);
        //console.log(filtered);
        return filtered;
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
                            sx={{ pb: 0.75 }}
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
                        label={val.name}
                        control={<Switch size={"small"} onClick={(e) => { updateProductParams(val.id) }} />}
                        sx={{ pb: 0.75 }}
                    />
                )
            })

    const GetAllUniqueParameters = () => {
        const returnVal = foundFeatures == null
            ? null
            : foundFeatures.map((v) => v.parameter)
                .filter((item, pos, self) => self.findIndex(v => v.id === item.id) === pos);
        //console.log(returnVal, 'GetAllUniqueParameters');
        return returnVal;
    }

    const GetSegmentsByParam = (paramId, productId) => {
        const returnVal = foundFeatures == null
            ? null
            : foundFeatures
                .filter((elem) => elem.parameter.id == paramId && elem.product.id == productId)
                .map((x) => x.segments).flat();
        //console.log(returnVal, 'GetSegmentsByParam');
        return returnVal;
    }

    const foundFeaturesList =
        foundFeatures == null
            ? null
            : GetAllUniqueParameters().map((val, index) => {
                const rowHeader = (
                    <td style={{ width: '20%', verticalAlign: "top", padding: 5 }} key={val.id}>
                        <b>{val.name}</b>
                    </td>
                )
                const count = productParams.length
                //const ColWidth = `${(100 - 20) / count}%`
                const ColWidth = `70%`
                const documentList =
                    count == 0
                        ? null
                        : productParams
                            .filter((x) => x > 0)
                            .map((prod, index) => {
                                const id = `prod_${prod}_${index}`
                                //console.log(`val.product.id = ${val.id}, prod.id=${prod}`)
                                const segments = GetSegmentsByParam(val.id, prod);
                                const segmentsList =
                                    segments == null || segments.length == 0 ? (
                                        <Card>
                                            <CardHeader subheader={'Нет данных'} />
                                        </Card>
                                    ) : (
                                        segments.map((val_seg) => {
                                            //console.log(val_seg, 'val_seg');
                                            return (
                                                <Card key={val_seg.id}>
                                                    <CardHeader
                                                        subheader={`ч. ${val_seg.number}  
                                                        ст. ${val_seg.article.number} 
                                                        ${val_seg.document.short_name}`}
                                                    />
                                                    <CardContent>
                                                        <Typography variant="body2" color="text.secondary" style={{whiteSpace: "pre-line"}}>
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
                                        <Stack spacing={1}>{segmentsList}</Stack>
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
                    const data = GetTimelinesByProduct(val);
                    return (
                        <td key={index} style={{ verticalAlign: "top", padding: 5, minWidth: 450 }}>
                            <Card>
                                <CardContent>
                                    <ProductTimeline data={data} />
                                </CardContent>
                            </Card>
                        </td>
                    )
                })
        ) : ''

    const WrappedProductTimelines =
        productParams.filter((x) => x > 0).length > 0 && products != null ?
            <tfoot>
                <tr>
                    <td style={{ verticalAlign: "top", padding: 5 }}><b>Этапы исполнения</b></td>
                    {selectedProductTimelines}
                </tr>
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
