import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import React from "react";

const TermItem = ({name, definition, fz }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" color="text.primary">
                    {name}
                </Typography>
                <Typography variant="body1" color="text.primary">
                    {definition}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Источник: {fz}
                </Typography>
            </CardContent>
        </Card>
        /*
        <tr>
            <td>
                <b>{name}:</b> <br />
                {definition}
            </td>
            <td>{fz}</td>
        </tr>
         */
    )
}

export default TermItem