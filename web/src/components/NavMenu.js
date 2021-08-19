import { useContext, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserInfo } from '../App';
import './NavMenu.css';

const NavMenu = () => {

    const { user, setUser } = useContext(UserInfo);

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

    return (
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
                            <Link className="nav-link" to="/Register/expert">Become an Expert</Link>

                            {user.displayName ?
                                <NavDropdown title={`Welcome, ${user.displayName}`} id="navbarScrollingDropdown">
                                    <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                                    <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={signOut}>Sign out</NavDropdown.Item>
                                </NavDropdown> :
                                <>
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
    );
}

export default NavMenu;