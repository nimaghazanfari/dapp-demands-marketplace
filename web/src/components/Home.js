import { Button, Col, Row } from 'react-bootstrap';

const Home = () => {
    return (
        <div className="home-page">
            <Row>
                <Col md={6}>
                    <div className="desc-part">
                        <p>
                            Find the perfect solution
                        </p>
                        <p>
                            For your requests
                        </p>
                    </div>
                    <Row>
                        <Col md={5} className="customer-part">
                            <div className="d-grid gap-2">
                                <Button variant="primary" size="lg">
                                    For Customers
                                </Button>
                            </div>
                        </Col>
                        <Col md={5} className="expert-part">
                            <div className="d-grid gap-2">
                                <Button variant="success" size="lg">
                                    For Experts
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col md={6}>

                    <img src="../coffee.jpg" />

                </Col>
            </Row>
        </div>
    )
}

export default Home;