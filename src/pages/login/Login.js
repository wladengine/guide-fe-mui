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
    Divider,
} from "@mui/material";
import {AccountCircle, Visibility, VisibilityOff} from "@mui/icons-material";

const baseUrl = 'http://487346.msk-kvm.ru:3333'
// const baseUrl = 'http://487346.msk-kvm.ru:3333'

const Login = () => {
    const [authToken, setAuthToken] = useContext(AuthContext)
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)
    const handleClickShowPassword = () =>
        setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const makeAuth = () => {
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/javascript' },
            body: `{ "Email": "${email}", "Pass": "${password}" }`,
            redirect: 'follow',
        }
        fetch(`${baseUrl}/login`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    alert('Error while auth')
                    return null
                }

                const cookieHeader = response.headers//.get("Set-Cookie");
                console.log(cookieHeader, 'cookieHeader')

                // const cookies = cookieHeader.split(";").map(cookie => cookie.trim());
                //
                // console.log(cookies, 'cookies')
                // console.log(response.body, 'response')
                //return response.json()
            })
            .then((data) => {
                console.log(data, 'data')
                // setAuthToken(data.Token)
                // document.cookie = `authToken=${data.Token}`
                // console.log(authToken)
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    return (
        <Container maxWidth="sm">
            <Stack spacing={2}>
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
