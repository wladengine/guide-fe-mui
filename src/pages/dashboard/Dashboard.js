import React, { useEffect } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

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
                    const htmlId = `checkBoxParam_${val_p.id}`
                    return (
                        <div key={val_p.id} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id={htmlId}
                                onClick={(e) => {
                                    updateFilterParams(val_p.id)
                                }}
                            />
                            <label className="form-check-label" htmlFor={htmlId}>
                                {val_p.name}
                            </label>
                        </div>
                    )
                })
                return (
                    <div key={`prm_${index}`} className="ps-2 pb-2">
                        <b>{val.name}</b>
                        <>{filteredParams}</>
                    </div>
                )
            })

    const productsList =
        products == null
            ? null
            : products.map((val, index) => {
                const htmlId = `checkBoxProd_${val.id}`
                return (
                    <div key={index} className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id={htmlId}
                            onClick={(e) => {
                                updateProductParams(val.id)
                            }}
                        />
                        <label className="form-check-label" htmlFor={htmlId}>
                            {val.name}
                        </label>
                    </div>
                )
            })

    const foundFeaturesList =
        foundFeatures == null
            ? null
            : foundFeatures.map((val, index) => {
                const rowHeader = (
                    <td style={{ width: '20%' }} key={val.id}>
                        <h6>{val.parameter.name}</h6>
                    </td>
                )
                const count = productParams.length
                let ColWidth = `${(100 - 20) / count}%`
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
                                        <div className={'card mb-2'}>
                                            <div className={'card-body'}>
                                                <span>Нет данных</span>
                                            </div>
                                        </div>
                                    ) : (
                                        val.segments.map((val_seg, index) => {
                                            return (
                                                <div key={val_seg.id} className={'card mb-2'}>
                                                    <div className={'card-body'}>
                                                        <b href={`./#/show_segment?id=${val_seg.id}`}>
                                                            {val_seg.document.short_name} {`ст. ${val_seg.article.number}`},{' '}
                                                            {`п. ${val_seg.number}`}
                                                        </b>
                                                        <br />
                                                        <p>{val_seg.text}</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )
                                return (
                                    <td key={id} style={{ width: ColWidth }}>
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
                    return <th key={index}>{value.short_name}</th>
                })
        ) : (
            <td>
                <div className={'card'}>
                    <div className={'card-body'}>
                        <h4>Нет данных</h4>
                    </div>
                </div>
            </td>
        )

    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <div className="ps-2 pb-2">
                    <b>Инструменты</b>
                    <div className={'ps-2 pb-2'}>{productsList}</div>
                </div>
                <div className="ps-2 pb-2">
                    <b>Характеристики</b>
                    <>{paramsFiltersRows}</>
                </div>
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
