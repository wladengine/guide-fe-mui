import React from "react";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent, { timelineContentClasses } from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Typography from "@mui/material/Typography";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GppGoodIcon from '@mui/icons-material/GppGood';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";

const baseUrl = 'http://487346.msk-kvm.ru:3333'

const ProductTimeline = ({ data }) => {
    return (typeof data == 'undefined' || data == null || data.length == 0) ?
        <span>Нет данных</span> :
        <WrappedBasicTimeline items={data}/>;
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
    return items.map((item, index) => (
        <TimelineItem key={index}>
            <TimelineOppositeContent sx={{py: '12px', px: 2}}>
                <Typography variant="body1" component="b" color={'red'}>
                    {`ч ${item.segment.number} ст. ${item.segment.article.number} ${item.segment.document.short_name}`}
                </Typography>
                <Typography>{item.name}</Typography>
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
                {item.dates}
            </TimelineContent>
        </TimelineItem>
    ));
}

export default ProductTimeline