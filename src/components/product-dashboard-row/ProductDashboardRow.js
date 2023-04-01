import {
    Grid,
    Stack
} from "@mui/material";
import * as React from 'react';
import Typography from "@mui/material/Typography";

const ProductDashboardRow = ({product, filteredFeatures}) => {
    const documentsData = filteredFeatures
        .map((v) => v.segments)
        .filter((s) => s !== undefined)
        .flat()
        .map(s => s.document)
        .filter((item, pos, self) => self.findIndex(v => v.id === item.id) === pos)

    console.log(documentsData)

    const documents = documentsData.map((d) => {
        return (
            <React.Fragment key={`prod${product.id}_${d.id}`}>
                <Typography variant="body2" color="text.primary" style={{whiteSpace: "pre-line"}}>
                    {d.short_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{whiteSpace: "pre-line"}}>
                    {d.full_name}
                </Typography>
            </React.Fragment>
        )
    })
    return (
        <Grid container>
            <Grid item xs={3}>
                <Typography variant="body2" color="text.primary" style={{whiteSpace: "pre-line"}}>
                    {product.short_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{whiteSpace: "pre-line"}}>
                    {product.name}
                </Typography>
            </Grid>
            <Grid xs={9}>
                <Stack spacing={1}>
                    {documents}
                </Stack>
            </Grid>
        </Grid>
    )
}

export default ProductDashboardRow