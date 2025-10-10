import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function DedicatoriaComponent({ dedicatoria }) {
    return (
        <>
            <div>
                <div className="d-flex flex-column justify-content-center position-fixed top-0 w-100 header header-libro">
                    <h1>Dedicatoria</h1>
                </div>
                <div className='biblia-libro-container'>
                    <p>{dedicatoria?.contenido}</p>
                </div>
            </div>
        </>
    );
}

export default DedicatoriaComponent;