import * as React from 'react';
import Grid from '@mui/material/Grid';
import { Button } from "@mui/material";

export default function Admin() {
    return (
        <Grid container spacing={5}>
            <Grid item xs={12}>
                <Button href={'./document-list'}>Документы</Button>
            </Grid>
        </Grid>
    );
}
