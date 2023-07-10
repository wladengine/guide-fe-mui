import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ProductSegmentItem from "../product-segment-item/ProductSegmentItem";
import Stack from "@mui/material/Stack";
import React from "react";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

const GetSegmentsByParam = (foundFeatures, paramId, productId) =>
    foundFeatures && foundFeatures
        .filter((elem) => elem.parameter.id === paramId && elem.product.id === productId && elem.segments)
        .map((x) => x.segments)
        .flat()

const DocsRow = ({short_name, full_name}) => {
    return (
        <>
            <Typography variant="body2" color="text.primary" style={{whiteSpace: "pre-line"}}>
                {short_name}
            </Typography>
            <Typography variant="body2" color="text.secondary" style={{whiteSpace: "pre-line"}}>
                {full_name}
            </Typography>
            <br />
        </>
    )
}

const getDocumentsByProduct = (productId, productDocumentsCache) => {
    const cached = productDocumentsCache[productId]
    if (cached){
        const docs = cached.map((doc, index) =>
            <DocsRow
                key={`prod_${productId}_doclist_${index}`}
                short_name={doc.short_name}
                full_name={doc.full_name}
            />
            )
        return docs
    }
    else {
        return ''
    }
}

const ProductSegmentRowData = ({index, productId, val, foundFeatures, productDocumentsCache}) => {
    const segments = GetSegmentsByParam(foundFeatures, val.id, productId);
    const segmentsList =
        segments == null || segments.length === 0 ? (
            <Card>
                <CardHeader subheader={'Нет данных'} />
                <CardContent>
                    {getDocumentsByProduct(productId, productDocumentsCache)}
                </CardContent>
            </Card>
        ) : (
            segments.map((val_seg, index) =>
                <ProductSegmentItem
                    key={`seg_${val_seg.id}_prod_${productId}_${index}`}
                    partNumber={val_seg.number}
                    articleNumber={val_seg.article.number}
                    documentNumber={val_seg.document.short_name}
                    text={val_seg.text}
                />
            )
        )

    return (
        <td key={`prod_${productId}_${index}`} style={{ width: `70%`, minWidth: 600, verticalAlign: "top", padding: 5 }}>
            <Stack spacing={1} style={{overflow: segments == null || segments.length == 0 ? 'auto' : 'inherit'}}>{segmentsList}</Stack>
        </td>
    )
}

export default ProductSegmentRowData