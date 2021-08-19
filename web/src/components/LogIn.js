import { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

const LogIn = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();


    const login = e => {
        e.preventDefault();

    }
    return (
        <div className="login-page">
            <Row className="justify-content-md-center">
                <Col md={4}>
                    <Card className="content">
                        <form onSubmit={(e) => login(e)}>
                            <h3>Sign In</h3>

                            <div className="form-group">
                                <input type="text" className="form-control" onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                            </div>

                            <div className="form-group">
                                <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                            </div>

                            <div className="form-group">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                    <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block">Submit</button>
                            <p className="forgot-password text-end">
                                Forgot <a href="#">password?</a>
                            </p>
                        </form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default LogIn;