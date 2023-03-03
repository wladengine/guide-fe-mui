import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import React from "react";

const ProductSegmentItem = ({partNumber, articleNumber, documentNumber, text}) => {
    const part = typeof partNumber == 'undefined' ? '' : `ч.${partNumber}`
    const article = typeof articleNumber == 'undefined' ? '' : `ст.${articleNumber}`
    const document = typeof documentNumber == 'undefined' ? '' : documentNumber
    return (
        <Card>
            <CardHeader
                subheader={`${part} ${article} ${document}`}
                subheaderTypographyProps={{
                    fontWeight: 600
                }}
                sx={{
                    paddingBottom: 0
                }}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary" style={{whiteSpace: "pre-line"}}>
                    {text}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default ProductSegmentItem