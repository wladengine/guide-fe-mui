import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import PropTypes from "prop-types";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackbarError(props) {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        //setOpen(false)

        if (props.onClose) {
            props.onClose()
        }
    };

    return (
        <Snackbar open={props.open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {props.children}
            </Alert>
        </Snackbar>
    );
}

SnackbarError.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};