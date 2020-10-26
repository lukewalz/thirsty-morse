import React from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, CardImgOverlay
} from 'reactstrap';

function Widget(...props) {
    return (
        <Card className='dashCard'>
            <img top width="100%" src={props[0].image} alt="Card image cap" />
            <h5>{props[0].title}</h5>
        </Card>
    )
}

export default Widget