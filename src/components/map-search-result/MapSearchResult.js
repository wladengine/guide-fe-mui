import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import React from "react";

const MapSearchResult = ({regionName, foundationDescription, town, link}) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {regionName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {foundationDescription}
                </Typography>
                {
                    town && <Typography variant="body2" color="text.secondary">
                        {town}
                    </Typography>
                }
                {
                    link && <Typography variant="body2" color="text.secondary">
                        {link}
                    </Typography>
                }
            </CardContent>
        </Card>
    )
}

export default MapSearchResult;