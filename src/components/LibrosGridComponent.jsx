import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const LibrosGridComponente = ({ items }) => {
    const chunkArray = (arr, size) => {
        return arr.reduce((acc, _, i) =>
            i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc, []);
    };

    const navigate = useNavigate();

    const onClick = (libro) => {
        navigate('/libro/' + libro.id);
    };

    const rows = chunkArray(items, 3);

    return (
        <Container>
            {rows.map((row, i) => (
                <Row key={i} className="mb-3">
                    {row.map((item, j) => (
                        <Col key={j} sm={4}>
                            <div className="p-3 rounded text-center">
                                <Button className="libro-boton" onClick={() => { onClick(item) }}>{item.nombre}</Button>
                            </div>
                        </Col>
                    ))}
                </Row>
            ))}
        </Container>
    );
};

export default LibrosGridComponente;
