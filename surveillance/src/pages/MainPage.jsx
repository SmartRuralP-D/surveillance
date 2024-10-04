import '../assets/styles/MainPage.css';
import { useEffect, useState } from 'react';
import firebaseService from '../firebase/fAuth';
import loadingGif from '../assets/imagens/loading.gif';
import Card from '../components/Card';
import getAssetIds from '../scripts/getAssetIds';
import getDeviceIds from '../scripts/getDeviceIds';
import getThingsBoardJwt from '../scripts/getThingsBoardJwt';
import getDevicesTelemetry from '../scripts/getDevicesTelemetry';

const MainPage = () => {
    const [firebaseDataStructure, setFirebaseData] = useState({});
    const [authToken, setAuthToken] = useState('');
    const [error, setError] = useState(null);

    const [idsPropriedades, setIdsPropriedades] = useState([]);
    const [idsAssets, setIdsAssets] = useState({});
    const [idsDevices, setIdsDevices] = useState({});
    const [telemetryData, setTelemetryData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const firebaseRootStructure = await firebaseService.getDatabaseInfo();
                setFirebaseData(firebaseRootStructure);

                const idsAssets = getAssetIds(firebaseRootStructure);
                const idsDevices = getDeviceIds(firebaseRootStructure);
                const idsPropriedades = Object.keys(firebaseRootStructure.propriedades);

                console.log("idsAssets: ", idsAssets);
                console.log("idsDevices", idsDevices);
                console.log("idsPropriedades: ", idsPropriedades);

                setIdsAssets(idsAssets);
                setIdsDevices(idsDevices);
                setIdsPropriedades(idsPropriedades);

                const token = await getThingsBoardJwt(firebaseRootStructure);
                setAuthToken(token);

                const fetchDevicesData = async () => {
                    const telemetryData = {};
                    for (const [tipo, devices] of Object.entries(idsDevices)) {
                        telemetryData[tipo] = await getDevicesTelemetry(devices, token);
                    }
                    console.log("Fetched telemetry data: ", telemetryData);
                    setTelemetryData(telemetryData);
                }

                await fetchDevicesData();

                const intervalId = setInterval(fetchDevicesData, 120000);

                return () => {
                    clearInterval(intervalId);
                    console.log("Interval cleared with ID:", intervalId);
                }

            } catch (err) {
                setError(err.message);
            }
        };
        fetchData();
    }, []);

    if (error) {
        return <div>Erro: {error}</div>;
    }

    if (!firebaseDataStructure) {
        return (
            <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                <img src={loadingGif} alt='Loading...' className='gif-image' />
            </div>
        );
    }

    console.log("idsPropriedades: ", idsPropriedades);
    console.log("telemetryData: ", telemetryData);

    const getTelemetryForUnit = (propriedade) => {
        const dados = [];
        const propriedadeNome = propriedade.nome;
        const unidadeNome = propriedade.unidadesProdutivas[idsAssets].nome;
        const propriedadeTelemetry = telemetryData[propriedadeNome][unidadeNome] || [];
        return dados.push(propriedadeTelemetry.map(sensor => sensor.data.do_con.map(element => element.value)));
    };



    return (
        <div className='container-xl'>
            <div className='cards'>
            {idsPropriedades.map((idProp, index) => (
                <div key={index} className={`cards_${idProp}`}>
                    {Object.values(firebaseDataStructure.propriedades[idProp].unidadesProdutivas).map((unidadeProdutiva, index) => (
                        <Card key={index} unidadeProdutiva={unidadeProdutiva} devicesTelemetry={telemetryData[firebaseDataStructure.propriedades[idProp].nome] || []} />
                    ))}
                </div>
            ))}
            </div>
        </div>
    );
}

export default MainPage;