import {
    Grid, Link,
    Stack
} from "@mui/material";
import * as React from 'react';
import Typography from "@mui/material/Typography";
import {Download} from "@mui/icons-material";

const docs = {};

// Adding key-value pairs
docs["1"] = "115-fz.pdf";
docs["3"] = "473-fz.pdf";
docs["4"] = "224-fz.pdf";
docs["9"] = "69-fz.pdf";
docs["10"] = "116-fz.pdf";
docs["11"] = "1048-PP.pdf";
docs["12"] = "488-fz.pdf";
docs["13"] = "216-fz.pdf";
docs["14"] = "1863-PP.pdf";
docs["15"] = "794-PP.pdf";
docs["16"] = "779-PP.pdf";

const ProductDashboardRow = ({product, filteredFeatures}) => {
    const documentsData = filteredFeatures

    // console.log(documentsData)

    const documents = documentsData.map((d) => {
        return (
            <React.Fragment key={`prod${product.id}_${d.id}`}>
                <Typography variant="body2" color="text.primary" style={{whiteSpace: "pre-line"}}>
                    {d.short_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{whiteSpace: "pre-line"}}>
                    {d.full_name}
                </Typography>
                <Typography variant="body2" color="text.primary" style={{whiteSpace: "pre-line"}}>
                    <Link variant="body2" href={`/${docs[d.id]}`}>Скачать</Link>
                </Typography>
            </React.Fragment>
        )
    })
    return (
        <Grid container>
            <Grid item xs={3}>
                <Stack spacing={1}>
                    <Typography variant="body2" color="text.primary" style={{whiteSpace: "pre-line"}}>
                        {product.short_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{whiteSpace: "pre-line"}}>
                        {product.name}
                    </Typography>
                </Stack>
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