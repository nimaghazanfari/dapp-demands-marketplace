import { useContext, useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container, Button, Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserInfo } from '../App';
import Web3 from "web3";
import api from './general/api';
import './NavMenu.css';

const NavMenu = () => {

    const { user, setUser } = useContext(UserInfo);
    const [show, setShow] = useState(false);
    const [userEthers, setEthers] = useState();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const val = localStorage.getItem('user');
        if (val) {
            const obj = JSON.parse(val);
            setUser(obj);
        }
    }, [])

    const signOut = () => {
        localStorage.removeItem('user')
        setUser({});
        window.location.href = "/";
    }

    const openModal = async () => {

        try {

            const result = await api.post('users/wallet');
            setEthers(`${result.data.ethers}`);
            handleShow();

        } catch (e) {

        }
    }

    return (
        <>
            <header>
                <Navbar expand="lg" variant="dark">
                    <Container>
                        <Navbar.Brand href="/">
                            <img className="logo" src="../logo.PNG" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll" className="justify-content-end">
                            <Nav
                                style={{ maxHeight: '100px' }}
                                navbarScroll
                            >

                                {user.displayName ?
                                    <>
                                        {user.role !== "expert" ?
                                            <Link className="nav-link" to="/Register/expert">Become an Expert</Link>
                                            : null
                                        }
                                        <NavDropdown title={`Welcome, ${user.displayName}`} id="navbarScrollingDropdown">
                                            <NavDropdown.Item onClick={openModal}>Wallet [{user.wallet_short}]</NavDropdown.Item>
                                            <NavDropdown.Item href="#action4">Edit Profile</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item onClick={signOut}>Sign out</NavDropdown.Item>
                                        </NavDropdown>
                                    </> :
                                    <>
                                        <Link className="nav-link" to="/Register/expert">Become an Expert</Link>
                                        <Link className="nav-link" to="/sign-in">Sign In</Link>
                                        <Link className="nav-link" to="/register/customer">
                                            <Button variant="primary" size="sm">
                                                Join

                                            </Button>
                                        </Link>
                                    </>
                                }
                            </Nav>
                        </Navbar.Collapse>

                    </Container>
                </Navbar>
            </header>

            <Modal
                show={show}
                onHide={handleClose}
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>Personal Wallet Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table>
                        <tbody>
                            <tr>
                                <td>
                                    Holder
                                </td>
                                <td>
                                    {user.displayName}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Wallet
                                </td>
                                <td>
                                    {user.wallet}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Balance
                                </td>
                                <td>
                                    {userEthers} ({userEthers && Web3.utils.fromWei(userEthers)} ETH)
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NavMenu;