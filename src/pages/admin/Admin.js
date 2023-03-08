import * as React from 'react';
import Grid from '@mui/material/Grid';
import {Button, Stack} from "@mui/material";

export default function Admin() {
    return (
        <Grid container spacing={5}>
            <Grid item xs={12}>
                <Stack spacing={2}>
                    <h2>Управление данными</h2>
                    <Button href={'./document-list'}>Документы</Button>
                </Stack>
            </Grid>
        </Grid>
    );
}
