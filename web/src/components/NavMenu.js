import { useContext, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserInfo } from '../App';
import './NavMenu.css';

const NavMenu = () => {

    const user = useContext(UserInfo);

    useEffect(() => {

    })

    return (
        <header>
            <Navbar expand="lg" variant="dark">
                <Container>
                    <Navbar.Brand href="/">
                        <img className="logo" src="../logo.PNG"/>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Link className="nav-link" to="/">Home</Link>
                            <Link className="nav-link" to="/test">Link</Link>
                        </Nav>
                    </Navbar.Collapse>
                    {user.isSignedIn ?
                        <Navbar.Collapse id="navbarScroll-end" className="justify-content-end">
                            <Nav
                                style={{ maxHeight: '100px' }}
                                navbarScroll
                            >
                                <NavDropdown title="Welcome" id="navbarScrollingDropdown">
                                    <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                                    <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action5">Sign out</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse> :
                        null
                    }
                </Container>
            </Navbar>
        </header>
    );
}

export default NavMenu;