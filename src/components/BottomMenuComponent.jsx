import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { CircleFill } from 'react-bootstrap-icons';

const BottomMenuComponent = ({ onSelect, version, isOnline }) => {
    return (
        <Navbar fixed="bottom" bg="light" variant="light" className="border-top py-2">
            <Container className="d-flex justify-content-between align-items-center">
                {/* Menú de navegación */}
                <Nav className="gap-3">
                    <Nav.Link onClick={() => onSelect('/')} className="d-flex flex-column justify-content-between align-items-center">
                        <img src='https://biblia.comunidadmenorah.com/images/comunidadmenorahbiblia.png' width={40}></img>
                        <p>Biblia</p>
                    </Nav.Link>
                    <Nav.Link onClick={() => onSelect('/dedicatoria')} className="d-flex flex-column justify-content-between align-items-center">
                        <img src='https://biblia.comunidadmenorah.com/images/dedicatoria.png' width={40}></img>
                        <p>Dedicatoria</p>
                    </Nav.Link>
                    <Nav.Link onClick={() => onSelect('/glosario')} className="d-flex flex-column justify-content-between align-items-center">
                        <img src='https://biblia.comunidadmenorah.com/images/glosario.png' width={40}></img>
                        <p>Glosario</p>
                    </Nav.Link>
                </Nav>

                {/* Estado y versión */}
                <div className="d-flex align-items-center gap-3 text-muted small">
                    <span className='d-flex flex-column align-items-center'>
                        <CircleFill
                            size={20}
                            color={isOnline ? 'green' : 'red'}
                            className="me-1"
                        />
                        <p>{isOnline ? 'Online' : 'Offline'}</p>
                    </span>
                    <span>v{version}</span>
                </div>
            </Container>
        </Navbar>
    );
};

export default BottomMenuComponent;
