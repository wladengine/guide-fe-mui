import React, { useContext } from 'react'
import AuthContext from "../../components/auth-context/AuthContext";
import {
    Container,
    Stack,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Button,
    Typography,
    Divider, CircularProgress, Backdrop,
} from "@mui/material";
import {AccountCircle, Visibility, VisibilityOff} from "@mui/icons-material";
import {baseUrl, getPostParametersWithCookies} from "../../globalConstants";

const Login = () => {
    const [authToken, setAuthToken] = useContext(AuthContext)
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)
    const [backdropVisible, setBackdropVisible] = React.useState(false)

    const handleClickShowPassword = () =>
        setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const makeAuth = () => {
        backdropOpen()
        const requestOptions = getPostParametersWithCookies(`{ "Email": "${email}", "Pass": "${password}" }`)
        fetch(`${baseUrl}/login`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    alert('Error while auth')
                    return null
                }
            })
            .then((data) => {
                console.log(data, 'data')
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => { backdropClose() })
    }
    const backdropClose = () => {
        setBackdropVisible(false);
    };
    const backdropOpen = () => {
        setBackdropVisible(true);
    };

    return (
        <Container maxWidth="sm">
            <Stack spacing={2}>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={backdropVisible}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Typography variant="h5" color="text.primary">Вход на сайт</Typography>
                <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Имя пользователя</InputLabel>
                    <Divider />
                    <OutlinedInput
                        id="outlined-adornment-username"
                        type={'text'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {<AccountCircle />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Имя пользователя"
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    />
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Пароль"
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />
                </FormControl>
                <Button onClick={makeAuth}>Войти</Button>
            </Stack>
        </Container>
    )
}

export default Login
