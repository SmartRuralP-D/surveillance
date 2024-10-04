import poultry from '../assets/imagens/smartrural_poultry_icon.png';
import iconePeixe from '../assets/imagens/smartrural_fish_icon.png';
import '../assets/styles/Card.css';
import { useState, useEffect } from 'react';

const Card = ({ unidadeProdutiva, devicesTelemetry }) => {
    const nome = unidadeProdutiva ? unidadeProdutiva.nome : 'N/A';
    const cultivo = unidadeProdutiva ? unidadeProdutiva.cultivo : 'N/A';

    const [telemetryValues, setTelemetryValues] = useState({});

    useEffect(() => {
        console.log("devicesTelemetry for ", nome, ": ", devicesTelemetry);
        if (devicesTelemetry && devicesTelemetry.length > 0) {
            const newTelemetryValues = {};
            devicesTelemetry.forEach(sensor => {
                Object.keys(sensor.data).forEach(key => {
                    if (!newTelemetryValues[key]) {
                        newTelemetryValues[key] = [];
                    }
                    newTelemetryValues[key].push(...sensor.data[key].map(item => item.value));
                });
            });
            setTelemetryValues(newTelemetryValues);
        }
    }, [unidadeProdutiva, devicesTelemetry]);

    const calcularMedia = (valores) => {
        const valoresNumericos = valores.map(valor => parseFloat(valor));
        return valoresNumericos.length > 0 ? (valoresNumericos.reduce((acumulador, valor) => acumulador + valor, 0) / valoresNumericos.length).toFixed(3) : 'N/A';
    };

    const renderTelemetryData = () => {
        return Object.keys(telemetryValues).map(key => (
            <p key={key}>{key}: {calcularMedia(telemetryValues[key])}</p>
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