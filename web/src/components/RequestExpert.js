import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Alert, Button, Card, Col, Row, Table } from "react-bootstrap";
import api from './general/api';
import Web3 from "web3";

const RequestExpert = () => {

    const [requests, setRequests] = useState([]);
    const [myRequests, setMyRequests] = useState([]);

    const reloadList = async () => {

        try {
            const result = await api.post('confirm/avails');
            if (result.status == 200) {
                const data = result.data.map(a => {
                    return {
                        ethers: a.ethers,
                        open: a.open,
                        requestId: a.requestId,
                        title: a.title,
                        desc: a.desc,
                        payer: a.payer
                    }
                })
                setRequests(data);
            }
        } catch (e) { }

    };

    const reloadMyList = async () => {

        try {
            const result = await api.post('confirm/mylist');
            if (result.status == 200) {
                const data = result.data.map(a => {
                    return {
                        ethers: a.ethers,
                        open: a.open,
                        requestId: a.requestId,
                        title: a.title,
                        desc: a.desc,
                        payer: a.payer
                    }
                })
                setMyRequests(data);
            }
        } catch (e) { }

    };

    useEffect(() => {

        //fetch all the available data for every expert 
        reloadList();
        //fetch personal data for current expert
        reloadMyList();

    }, []);

    const confirmDoing = async (requestId) => {

        const model = { requestId };
        try {

            const result = await api.post("confirm/doing", model);
            if (result.status == 200) {
                reloadList();
                reloadMyList();
            }

        } catch (e) {

        }
    }

    const confirmDone = async (requestId) => {

        const model = { requestId };
        try {

            const result = await api.post("confirm/done", model);
            if (result.status == 200) {
                reloadMyList();
            }

        } catch (e) {

        }
    }

    return (
        <Row className="request-expert">
            <Col md={6} className="request-part">
                <h5>My Doing List</h5>
                <hr />
                {!myRequests.length ?
                    <Alert variant="primary">Nothig to do!</Alert> :
                    myRequests.map((item, idx) =>
                        <Alert key={idx} variant={item.open === 1 ? "warning" : item.open === 2 ? "info" : item.open === 3 ? "danger" : "success"} className="request-item">
                            <Card>
                                <Table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                Title
                                            </td>
                                            <td>
                                                {item.title}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Payment wallet</td>
                                            <td>{item.payer}</td>
                                        </tr>
                                        <tr>
                                            <td>Payment amount</td>
                                            <td>{item.ethers} ({Web3.utils.fromWei(item.ethers)} ETH)</td>
                                        </tr>
                                        <tr>
                                            <td>Status</td>
                                            <td>
                                                {item.open === 1 ? "Open" : item.open === 2 ? "In Progress" : item.open === 3 ? "Done" : "Transfer Completed"}

                                                {item.open === 2 ?
                                                    <Button variant="warning" size="sm" className="float-end" onClick={() => confirmDone(item.requestId)}>
                                                        <FontAwesomeIcon icon={faSave} />
                                                        Finished
                                                    </Button>
                                                    : null
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Description</td>
                                            <td>
                                                <span>
                                                    {item.desc}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card>
                        </Alert>
                    )
                }
            </Col>
            <Col md={6} className="request-part">
                <h5>All Available Requests</h5>
                <hr />
                {!requests.length ?
                    <Alert variant="primary">Nothing new, please check later!</Alert> :
                    requests.map((item, idx) =>
                        <Alert key={idx} variant={item.open === 1 ? "info" : item.open === 2 ? "info" : "success"} className="request-item">
                            <Card>
                                <Table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                Title
                                            </td>
                                            <td>
                                                {item.title}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Payment wallet</td>
                                            <td>{item.payer}</td>
                                        </tr>
                                        <tr>
                                            <td>Payment amount</td>
                                            <td>{item.ethers} ({Web3.utils.fromWei(item.ethers)} ETH)</td>
                                        </tr>
                                        <tr>
                                            <td>Interested?</td>
                                            <td>
                                                <Button variant="primary" size="sm" onClick={() => confirmDoing(item.requestId)}>
                                                    <FontAwesomeIcon icon={faCheck} />
                                                    I'll do this
                                                </Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Description</td>
                                            <td>
                                                <span>
                                                    {item.desc}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card>
                        </Alert>
                    )
                }
            </Col>
        </Row>
    )
}

export default RequestExpert;