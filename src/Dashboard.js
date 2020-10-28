import React from 'react'
import Widget from './components/Widget';
import { Container, Row, Col } from 'reactstrap'

import {
    Link
} from "react-router-dom";


function Dashboard() {

    return (
        <>
            <Container>
                <h1>My Dashboard</h1>
                <Row>
                    <Col>
                        <Link to="/games/college-football">
                            <Widget image='https://cdn.mybookie.ag/wp-content/uploads/NCAAF-logo-2018-1.png' />
                        </Link>
                    </Col>
                    <Col>
                        <Link to="/games/nfl">
                            <Widget image="https://static.www.nfl.com/image/upload/v1554321393/league/nvfr7ogywskqrfaiu38m.svg" />
                        </Link>
                    </Col>
                </Row>
                {/*
                <Row>
                    <Col>
                        <Widget image='https://cdn.freelogovectors.net/wp-content/uploads/2020/08/epl-premierleague-logo.png' />
                    </Col>
                    <Col>
                        <Link to="/games/nba">

                            <Widget image='https://upload.wikimedia.org/wikipedia/en/thumb/0/03/National_Basketball_Association_logo.svg/461px-National_Basketball_Association_logo.svg.png' />
                        </Link>
                    </Col>
                    <Col>
                        <Link to="/games/mlb">

                            <Widget image='https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/Major_League_Baseball_logo.svg/1280px-Major_League_Baseball_logo.svg.png' />
                        </Link>
                    </Col>
    </Row> */}


            </Container>
        </>
    )
}

export default Dashboard