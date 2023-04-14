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
                    <Button href={'./term-list'}>Глоссарий</Button>
                    <Divider />
                    <Typography variant="body2" color="text.secondary">Характеристики</Typography>
                    <Button href={'./product-list'}>Инструменты</Button>
                    <Button href={'./parameter-list'}>Параметры</Button>
                    <Button href={'./group-list'}>Группы параметров</Button>
                    <Button href={'./feature-list'}>Характеристики</Button>
                    <Divider />
                    <Typography variant="body2" color="text.secondary">ИнвестМаркет</Typography>
                    <Button href={'./realm-list'}>Сферы для инвестирования</Button>
                    <Button href={'./actor-list'}>Инвесторы</Button>
                    <Button href={'./fee-list'}>Суммы</Button>
                    <Button href={'./claim-list'}>Данные для маркета</Button>
                    <Divider />
                    <Typography variant="body2" color="text.secondary">Карта</Typography>
                    <Divider />
                </Stack>
            </Grid>
        </Grid>
    );
}
