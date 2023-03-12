import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import React from "react";

const DialogActionConfirmation = (props) => {
    const { onOk, onCancel, open, ...other } = props

    const handleOk = () => {
        onOk();
    };
    const handleCancel = () => {
        onCancel();
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            open={open}
            {...other}
        >
            <DialogTitle>Подтвердите действие</DialogTitle>
            <DialogContent dividers>
                {props.children}
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    Отмена
                </Button>
                <Button onClick={handleOk}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogActionConfirmation