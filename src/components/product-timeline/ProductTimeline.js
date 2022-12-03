import React from "react";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent, { timelineContentClasses } from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import GetTimeline from "../../utils/productTimelineDataProvider/ProductTimelineDataProvider";
import Typography from "@mui/material/Typography";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GppGoodIcon from '@mui/icons-material/GppGood';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ProductTimeline = ({ productId }) => {
    const items = GetTimeline(productId);
    console.log(items)

    return (typeof items == 'undefined' || items === null) ? '' : <WrappedBasicTimeline items={items} />;
}

const WrappedBasicTimeline = ({ items }) => {
    return (
        <Timeline position="alternate">
            <TimelineItem>
                <TimelineOppositeContent />
                <TimelineSeparator>
                    <TimelineDot color="success">
                        <ExpandMoreIcon/>
                    </TimelineDot>
                    <TimelineConnector/>
                </TimelineSeparator>
                <TimelineContent />
            </TimelineItem>
            <BasicTimeLine items={items} />
            <TimelineItem>
                <TimelineOppositeContent />
                <TimelineSeparator>
                    <TimelineConnector/>
                    <TimelineDot color="success">
                        <GppGoodIcon/>
                    </TimelineDot>
                </TimelineSeparator>
                <TimelineContent />
            </TimelineItem>
        </Timeline>
    )
}

const BasicTimeLine = ({items}) => {
    return items.timeline.map((item, index) => (
        <TimelineItem key={index}>
            <TimelineOppositeContent sx={{py: '12px', px: 2}}>
                <Typography variant="h6" component="span">
                    {`ч ${item.segment.number} ст. ${item.segment.article.number} ${item.segment.article.document.short_name}`}
                </Typography>
                <Typography>{item.stageDescription}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineConnector/>
                <TimelineDot color="primary">
                    <BusinessCenterIcon/>
                </TimelineDot>
                <TimelineConnector/>
            </TimelineSeparator>
            <TimelineContent
                sx={{m: 'auto 0'}}
                variant="body2"
                color="text.secondary"
            >
                {item.termsDescription}
            </TimelineContent>
        </TimelineItem>
    ));
}

export default ProductTimeline