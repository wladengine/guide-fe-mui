import {Alert, AlertTitle} from "@mui/material";
import React from "react";

const MessageSuccessfullySaved = () => {
    return (
        <Alert severity="success">
            <AlertTitle>Сохранено</AlertTitle>
        </Alert>
    )
}

export default MessageSuccessfullySaved