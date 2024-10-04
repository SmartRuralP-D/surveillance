import poultry from '../assets/imagens/smartrural_poultry_icon.png';
import iconePeixe from '../assets/imagens/smartrural_fish_icon.png';
import '../assets/styles/Card.css';
import { useState, useEffect } from 'react';

const Card = ({ unidadeProdutiva, devicesTelemetry }) => {
    const nome = unidadeProdutiva ? unidadeProdutiva.nome : 'N/A';
    const cultivo = unidadeProdutiva ? unidadeProdutiva.cultivo : 'N/A';

    const [telemetryValues, setTelemetryValues] = useState({});

    useEffect(() => {
        console.log("Devices telemetry: ", devicesTelemetry);
        if (devicesTelemetry && devicesTelemetry.length > 0) {
            const newTelemetryValues = {};

            devicesTelemetry.forEach(device => {
                Object.keys(device.data).forEach(key => {
                    if (!newTelemetryValues[key]) {
                        newTelemetryValues[key] = [];
                    }
                    newTelemetryValues[key].push(...device.data[key].map(entry => parseFloat(entry.value)));
                });
            });

            const calculatedAverages = {};
            Object.keys(newTelemetryValues).forEach(key => {
                const values = newTelemetryValues[key];
                const average = values.reduce((acc, val) => acc + val, 0) / values.length;
                calculatedAverages[key] = average.toFixed(3);
            });

            setTelemetryValues(calculatedAverages);
        }
    }, [unidadeProdutiva, devicesTelemetry]);

    const renderTelemetryData = () => {
        return Object.keys(telemetryValues).map(key => (
            <p key={key}>{key}: {telemetryValues[key]}</p>
        ));
    };

    return (
        <div className="card">
            <h1 className='header_card'>{nome}</h1>
            <div className='div_imagem'>
                <img className='imagem' src={cultivo === "chicken" ? poultry : iconePeixe} alt="icone frango/peixe" />
            </div>
            <div className="telemetria">
                <h3 className='header2_card'>Telemetria</h3>
                {renderTelemetryData()}
            </div>
        </div>
    );
}

export default Card;