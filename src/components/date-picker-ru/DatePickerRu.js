import {DatePicker} from "@mui/x-date-pickers";
import React from "react";
import {Stack} from "@mui/material";

const DatePickerRu = ({ value, setValueHandler, labelText }) => {
    return (
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <DatePicker
                label={labelText}
                value={value}
                onChange={(newValue) => {
                    setValueHandler(newValue)
                }}
                format="dd.MM.yyyy"
            />
        </Stack>
    )
}

export default DatePickerRu