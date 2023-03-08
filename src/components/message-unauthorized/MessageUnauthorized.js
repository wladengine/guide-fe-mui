import {Alert, AlertTitle, Button} from "@mui/material";
import React from "react";

const MessageUnauthorized = () => {
    return (
        <Alert severity="error"
               action={
                   <Button href={'./#/login'} color="inherit" size="small">
                       Войти
                   </Button>
               }>
            <AlertTitle>Ошибка</AlertTitle>
            Пользователь не аутентифицирован. <br />
        </Alert>
    )
}

export default MessageUnauthorized