import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Alert, Button, Card, Col, Row, Table } from "react-bootstrap";
import ContractHelper from "./general/ContractHelper";
import api from './general/api';
import Web3 from "web3";

const RequestCustomer = () => {

    const [requests, setRequests] = useState([]);
    const [title, setTitle] = useState();
    const [desc, setDesc] = useState();
    const [ethers, setEthers] = useState();

    const reloadList = async () => {

        try {
            const result = await api.post('requests/all');
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

    useEffect(() => {

        //fetch data for customer 
        reloadList();

    }, []);


    const handleNewRequest = async () => {

        const contracts = await ContractHelper.init();
        const accounts = await ContractHelper.getAccounts();

        try {
            const escrow = await contracts.Escrow.deployed({gasLimit: 21000});

            const projectNumber = new Date().getTime();
            const value = Web3.utils.toWei(ethers);

            const tx = await escrow.deposit(projectNumber, {
                from: accounts[0],
                value: value
            });

            const model = {
                // customer_username: will be set
                requestId: projectNumber,
                tx: tx.tx,
                ethers: value,
                payer: accounts[0],
                open: 1,
                title,
                desc
            }

            const result = await api.post("requests/new", model);

            if (result.status == 200) {
                reloadList();
            }

        } catch (e) {
            console.log(e)
         }


    }

    const confirmPayment = async (requestId) => {

        const model = { requestId };
        try {

            const result = await api.post("requests/confirm", model);
            if (result.status == 200) {
                reloadList();
            }

        } catch (e) {

        }
    }

    return (
        <Row className="request-customer">
            <Col md={5} className="request-new">
                <h5>Create New Request</h5>
                <hr />
                <Card>
                    <Table>
                        <tbody>
                            <tr>
                                <td>
                                    <input className="form-control" type="text" placeholder="Enter a Title" onChange={e => setTitle(e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <textarea className="form-control" placeholder="Enter Full Description"
                                        cols="2" rows="5" onChange={e => setDesc(e.target.value)}>
                                    </textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span>
                                        How much Ethers will you pay?
                                    </span>
                                    <input className="form-control" type="text" placeholder="Example: 0.02" onChange={e => setEthers(e.target.value)} />

                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div>
                                        <Button variant="success" onClick={handleNewRequest}>
                                            <FontAwesomeIcon icon={faSave} />
                                            Send Request
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card>
            </Col>
            <Col md={7} className="request-part">
                <h5>My Requests</h5>
                <hr />
                {!requests.length ?
                    <Alert variant="secondary">No requests found!</Alert> :
                    requests.map((item, idx) =>
                        <Alert key={idx} variant={item.open === 1 ? "warning" : item.open === 2 ? "info" : item.open ===3 ? "danger" : "success"} className="request-item">
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
                                                {item.open === 1 ? "Open" : item.open === 2 ? "In Progress" : item.open === 3 ? "Done" : "Completed"}

                                                {item.open === 3 ?
                                                    <Button variant="primary" size="sm" className="float-end" onClick={() => confirmPayment(item.requestId)}>
                                                        <FontAwesomeIcon icon={faCheck} />
                                                        Confirm
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
        </Row>
    )
}

export default RequestCustomer;