import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function GlosarioComponent({ glosario }) {
    return (
        <>
            <div>
                <div className="d-flex flex-column justify-content-center position-fixed top-0 w-100 header header-libro">
                    <h1>Glosario</h1>
                </div>
                <div className='biblia-libro-container'>
                    <p>{glosario?.contenido}</p>
                </div>
            </div>
        </>
    );
}

export default GlosarioComponent;