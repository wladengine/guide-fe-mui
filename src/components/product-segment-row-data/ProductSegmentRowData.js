import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ProductSegmentItem from "../product-segment-item/ProductSegmentItem";
import Stack from "@mui/material/Stack";
import React from "react";

const GetSegmentsByParam = (foundFeatures, paramId, productId) =>
    foundFeatures && foundFeatures
        .filter((elem) => elem.parameter.id == paramId && elem.product.id == productId)
        .map((x) => x.segments)
        .flat()

const ProductSegmentRowData = ({index, productId, val, foundFeatures}) => {
    const segments = GetSegmentsByParam(foundFeatures, val.id, productId);
    const segmentsList =
        segments == null || segments.length == 0 ? (
            <Card>
                <CardHeader subheader={'Нет данных'} />
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