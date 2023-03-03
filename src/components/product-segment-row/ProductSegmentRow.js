import ProductSegmentRowData from "../product-segment-row-data/ProductSegmentRowData";
import React from "react";

const ProductSegmentRow = ({val, productParams, foundFeatures}) => {
    const rowHeader = (
        <td style={{ width: '20%', verticalAlign: "top", padding: 5 }} key={val.id}>
            <b>{val.name}</b>
        </td>
    )
    const count = productParams.length
    const documentList =
        count > 0 && productParams
            .filter((x) => x > 0)
            .map((prod, index) =>
                <ProductSegmentRowData
                    index={index}
                    productId={prod}
                    val={val}
                    foundFeatures={foundFeatures}
                />)
    return (
        <tr>
            {rowHeader}
            {documentList}
        </tr>
    )
}

export default ProductSegmentRow