import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {InputBase, Paper} from "@mui/material";

const Terms = () => {
    const baseUrl = 'http://487346.msk-kvm.ru:3333'

    const [terms, setTerms] = React.useState([])
    const [searchText, setSearchText] = React.useState('')
    const [btnSearchClick, setBtnSearchClick] = React.useState(0)
    useEffect(() => {
        let url = `${baseUrl}/terms?`
        if (searchText != null && searchText.length > 0) {
            url += 'q=' + searchText
        }
        fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setTerms(data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [btnSearchClick])

    const termsRows =
        terms == null
            ? null
            : terms.map((value, index) => {
                return (
                    <tr key={index}>
                        <td>{value.name}</td>
                        <td>
                            <b>{value.document.short_name}:</b> <br />
                            {value.definition}
                        </td>
                    </tr>
                )
            })

    return (
        <Grid container spacing={2}>
            <Grid item xs={11} className="ms-4">
                <h3>Глоссарий</h3>
                <Box
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
                >
                    <TextField
                        fullWidth
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Поиск"
                        inputProps={{ 'aria-label': 'Поиск' }}
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value)
                        }}
                    />
                    <IconButton
                        type="button"
                        sx={{ p: '10px' }}
                        aria-label="search"
                        onClick={(e) => {
                            setBtnSearchClick(btnSearchClick + 1)
                        }}
                    >
                        <SearchIcon />
                    </IconButton>
                </Box>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Описание</th>
                        </tr>
                    </thead>
                    <tbody>{termsRows}</tbody>
                </table>
            </Grid>
        </Grid>
    )
}

export default Terms
