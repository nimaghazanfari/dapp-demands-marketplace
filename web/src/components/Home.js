import { Button, Col, Row } from 'react-bootstrap';

const Home = () => {

    const customerHandler = () => {
        window.location.href = "/request/customer";
    }

    const expertHandler = () => {
        window.location.href = "/request/expert";
    }

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
                                <Button variant="primary" size="lg" onClick={customerHandler}>
                                    For Customers
                                </Button>
                            </div>
                        </Col>
                        <Col md={5} className="expert-part">
                            <div className="d-grid gap-2">
                                <Button variant="success" size="lg" onClick={expertHandler}>
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