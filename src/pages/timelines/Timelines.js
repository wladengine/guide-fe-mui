import React, {useEffect} from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ProductTimeline from "../../components/product-timeline/ProductTimeline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import css from "../dashboard/dashboard.module.css";
import {baseUrl, standardGetRequestWithoutCookies} from "../../globalConstants";

const Timelines = () => {
    const [products, setProducts] = React.useState(null)
    const [timelines, setTimelines] = React.useState(null)
    const [productParams, setProductParams] = React.useState([])
    useEffect(() => {
        fetch(`${baseUrl}/stages`, standardGetRequestWithoutCookies)
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

    const productsList =
        products && products
            .map((val, index) =>
                <FormControlLabel
                    key={index}
                    label={val.name}
                    control={<Switch size={"small"} onClick={(e) => { updateProductParams(val.id) }} />}
                    sx={{ pb: 0.75 }}
                />
            )

    const productsFormGroup = (
        <FormGroup>
            {productsList}
        </FormGroup>
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

    const GetTimelinesByProduct = (productId) =>
        timelines
            .filter((t) => t.product.id == productId)
            .sort((a, b) => a.number - b.number)

    const selectedProductTimelines =
        productParams.filter((x) => x > 0).length > 0 && products != null ? (
            productParams
                .filter((x) => x > 0)
                .map((val, index) => {
                    const data = GetTimelinesByProduct(val);
                    return (
                        <td key={index} style={{ verticalAlign: "top", padding: 5, minWidth: 500 }}>
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
                {selectedProductTimelines}
            </tr>
            </tfoot> : ''

    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <b>Этапы исполнения</b>
                {productsFormGroup}
            </Grid>
            <Grid item xs={9}>
                <table>
                    <thead>
                    <tr>
                        {selectedProductColumns}
                    </tr>
                    </thead>
                    {WrappedProductTimelines}
                </table>
            </Grid>
        </Grid>
    )
}

export default Timelines