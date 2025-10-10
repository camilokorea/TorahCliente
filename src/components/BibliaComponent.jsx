import React, { useState, useMemo, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import LibrosGridComponent from './LibrosGridComponent';
import '../App.css';

function BibliaComponent({ librosAntiguoTestamento, librosNuevoTestamento, testamentos }) {
    const [selectedTestamento, setSelectedTestamento] = useState(null);

    const switchTestamento = (testamento) => {
        setSelectedTestamento(testamento);
    };

    useEffect(() => {
        setSelectedTestamento(testamentos[0]);
    }, [testamentos]);


    return (
        <>
            <div className="d-flex justify-content-center position-fixed top-0 w-100 header">
                <ButtonGroup className='w-100 gap-3'>
                    {testamentos?.map((testamento, indexTestamento) => (
                        <Button className="w-50 testamento-boton" key={indexTestamento} onClick={() => switchTestamento(testamento)}>{testamento}</Button>
                    ))}
                </ButtonGroup>
            </div>
            <div className='biblia-container'>
                {
                    selectedTestamento == librosAntiguoTestamento[0]?.testamento ?
                        (
                            <LibrosGridComponent items={librosAntiguoTestamento} />
                        ) : (
                            <LibrosGridComponent items={librosNuevoTestamento} />
                        )
                }
            </div>
        </>
    );
}

export default BibliaComponent;
