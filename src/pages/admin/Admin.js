import * as React from 'react';
import Grid from '@mui/material/Grid';
import {Button, Stack, Typography, Divider} from "@mui/material";

export default function Admin() {
    return (
        <Grid container spacing={5}>
            <Grid item xs={12}>
                <Stack spacing={2}>
                    <Typography variant="h5" color="text.primary">Управление данными</Typography>
                    <Typography variant="body2" color="text.secondary">Документы</Typography>
                    <Button href={'./document-list'}>Документы</Button>
                    <Divider />
                    <Typography variant="body2" color="text.secondary">Характеристики</Typography>
                    <Button href={'./product-list'}>Инструменты</Button>
                    <Button href={'./parameter-list'}>Параметры</Button>
                    <Button href={'./group-list'}>Группы параметров</Button>
                    <Button href={'./feature-list'}>Характеристики</Button>
                    <Divider />
                </Stack>
            </Grid>
        </Grid>
    );
}
