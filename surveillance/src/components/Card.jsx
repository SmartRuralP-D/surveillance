import poultry from '../assets/imagens/smartrural_poultry_icon.png';
import iconePeixe from '../assets/imagens/smartrural_fish_icon.png';
import '../assets/styles/Card.css';

const Card = ( unidadeProdutiva, devicesTelemetry ) => {
    const nome = unidadeProdutiva.nome;
    const cultivo = unidadeProdutiva.cultivo;

    // parâmetros de telemetria
    console.log(devicesTelemetry);
    const temperaturas = Object.values(devicesTelemetry[nome]).map(sensor => sensor.data.temperature.value);
    const humidades = Object.values(devicesTelemetry[nome]).map(sensor => sensor.data.humidity.value);

    console.log("temperaturas: ", temperaturas);
    console.log("humidades: ", humidades);

    const oxigenios = Object.values(devicesTelemetry[nome]).map(sensor => sensor.data.oxigenio.value);

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