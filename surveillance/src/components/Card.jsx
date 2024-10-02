import poultry from '../assets/imagens/smartrural_poultry_icon.png';
import iconePeixe from '../assets/imagens/smartrural_fish_icon.png';
import '../assets/styles/Card.css';
import { useState } from 'react';

const Card = ( unidadeProdutiva, devicesTelemetry ) => {
    const nome= unidadeProdutiva.length > 0 ? unidadeProdutiva.nome : 'N/A';
    const cultivo = unidadeProdutiva.length > 0 ? unidadeProdutiva.cultivo : 'N/A';

    // parâmetros de telemetria
    console.log(devicesTelemetry);
    const [temperaturas, setTemperaturas] = useState([]);
    const humidades = [];

    console.log("valor: ", devicesTelemetry[nome].map(sensor => sensor.data.humidity.value))
    if (devicesTelemetry[nome] && devicesTelemetry[nome].length > 0) {
        console.log("valor: ", devicesTelemetry[nome].map(sensor => sensor.data.humidity.value))
        temperaturas = devicesTelemetry[nome].map(sensor => temperaturas.push(sensor.data.temperature.map(temp => temp.value))); //.temperature.map(temp => temp.value)
        setTemperaturas(temperaturas)
        humidades = devicesTelemetry[nome].map(sensor => humidades.push(sensor.data.humidity.value)); 
    }


    console.log("temperaturas: ", temperaturas);
    console.log("humidades: ", humidades);

    

    const mediaTemperatura = temperaturas.length > 0 ? temperaturas.reduce((acc, temp) => acc + temp, 0) / temperaturas.length : 'N/A';
    const mediaHumidade = humidades.length > 0 ? (humidades.reduce((acc, hum) => acc + hum, 0) / humidades.length).toFixed(3) : 'N/A';
    return (
        <div className="container card">
            <h1>{nome}</h1>
            <img className='imagem' src={cultivo === "chicken" ? poultry : iconePeixe} alt="icone frango/peixe" />
            <div className="telemetria">
                <h2>Telemetria</h2>
                {cultivo === "chicken" ? (
                    <>
                        <p>Temperatura média: {mediaTemperatura} °C</p>
                        <p>Umidade média: {mediaHumidade} %</p>
                    </>
                ) : (
                    <>
                        <p>Temperatura média: {mediaTemperatura} °C</p>
                        <p>do_con: {} % </p>
                        <p>PH: {} </p>
                        <p>lstm_do_concentration: {} % </p>
                        <p>lstm_do_saturation: {} % </p>
                        <p>rf_do_concentration {} % </p>
                        <p>rf_do_saturation {} % </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default Card;