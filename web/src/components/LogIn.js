import { useState, useContext } from "react";
import { Card, Col, Row, Alert, Button } from "react-bootstrap";
import { UserInfo } from "../App";
import api from './general/api';

const LogIn = () => {
    const { user, setUser } = useContext(UserInfo);

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [result, setResult] = useState(false);


    const login = async () => {

        if (!username || !password) return;
        const model = { username, password };

        try {
            let result = await api.post('users/login', model);
            switch (result.status) {
                case 200:
                    result.data = { ...result.data, user: username };
                    setUser(result.data);
                    localStorage.setItem('user', JSON.stringify(result.data));
                    window.location.href = result.data.role === "customer" ? '/request/customer' : '/request/expert';
                    break;
                default:
                    setResult({
                        status: 'err',
                        msg: result.data
                    });
                    break;
            }
        } catch (e) {
            if (e.response) {
                setResult({
                    status: 'err',
                    msg: e.response.data
                });
            }
        } finally {
            setTimeout(() => {
                setResult(false)
            }, 2500)
        }
    }

    return (
        <div className="login-page">
            <Row className="justify-content-md-center">
                <Col md={5}>
                    <Card className="content">
                        <form noValidate >
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

                            <button type="button" onClick={login} className="btn btn-primary btn-block">Submit</button>
                            <p className="forgot-password text-end">
                                Forgot <a href="#">password?</a>
                            </p>
                        </form>

                        <Alert show={result} className="mt-4" variant={result.status == "ok" ? "success" : "danger"}>
                            <p>{result.msg}</p>
                        </Alert>

                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default LogIn;