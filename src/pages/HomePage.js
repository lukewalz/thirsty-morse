import React from 'react'
import Widget from '../components/Widget';
import { Container, Row, Col } from 'reactstrap'
import { connect } from "react-redux";
import {
    Link
} from "react-router-dom";


function HomePage({ user }) {
    return (
        <Container>
            <h1 style={{ textTransform: 'capitalize' }}>{user.username} Dashboard</h1>
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
                <Col>
                    <Link to="/games/nba">
                        <Widget image="https://www.pngkit.com/png/full/89-893116_nba-logo-transparent-png-new-nba-finals-logo.png" />
                    </Link>
                </Col>
            </Row>
        </Container>
    )
}


function mapStateToProps(state) {

    return {
        user: state.user,
    };
}

export default connect(mapStateToProps, null)(HomePage);