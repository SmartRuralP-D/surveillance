import '../assets/styles/MainPage.css';
import { useEffect, useState } from 'react';
import useLogout from '../scripts/logoutScript';
import firebaseService from '../firebase/fAuth';
import loadingGif from '../assets/imagens/loading.gif';
import HeaderOvonovo from '../components/HeaderOvonovo';
import HeaderOasis from '../components/HeaderOasis';
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

    const [unidadesProdutivasOvonovo, setUnidadesProdutivasOvonovo] = useState([]);
    const [unidadesProdutivasOasis, setUnidadesProdutivasOasis] = useState([]);

    const [idsAssetsOvonovo, setIdsAssetsOvonovo] = useState([]);
    const [idsAssetsOasis, setIdsAssetsOasis] = useState([]);

    const [idsDevicesOvonovo, setIdsDevicesOvonovo] = useState({});
    const [idsDevicesOasis, setIdsDevicesOasis] = useState({});

    const [telemetryDataOvonovo, setTelemetryDataOvonovo] = useState({});
    const [telemetryDataOasis, setTelemetryDataOasis] = useState({});


    //useLogout();

    //Requisição dos dados do firebase
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Dados do firebase
                const firebaseRootStructure = await firebaseService.getDatabaseInfo();
                setFirebaseData(firebaseRootStructure);

                const [idsAssetsOvonovo, idAssetsOasis] = getAssetIds(firebaseRootStructure);
                const { devicesOvonovo, devicesOasis } = getDeviceIds(firebaseRootStructure);

                const idsPropriedades = Object.keys(firebaseRootStructure.propriedades);
                setIdsPropriedades(idsPropriedades);

                setIdsAssetsOvonovo(idsAssetsOvonovo);
                setIdsAssetsOasis(idAssetsOasis);

                setIdsDevicesOvonovo(devicesOvonovo);
                setIdsDevicesOasis(devicesOasis);


                const unidadesProdutivasOvonovo = Object.entries(firebaseRootStructure.propriedades[idsPropriedades[0]].unidadesProdutivas);
                setUnidadesProdutivasOvonovo(unidadesProdutivasOvonovo);
                

                const unidadesProdutivasOasis = Object.entries(firebaseRootStructure.propriedades[idsPropriedades[1]].unidadesProdutivas);
                setUnidadesProdutivasOasis(unidadesProdutivasOasis);

                const token = await getThingsBoardJwt(firebaseRootStructure);
                setAuthToken(token);




                const fetchDevicesData = () => {
                    //extraindo do tb timeseries data dos sensores(devices)
                    const telemetryDataOvonovo = getDevicesTelemetry(devicesOvonovo, token);
                    const telemetryDataOasis = getDevicesTelemetry(devicesOasis, token);

                    setTelemetryDataOvonovo(telemetryDataOvonovo);
                    setTelemetryDataOasis(telemetryDataOasis);

                    console.log('Telemetry Data Ovonovo:', telemetryDataOvonovo);
                    console.log('Telemetry Data Oasis:', telemetryDataOasis);
                }
                // Chamar a função de telemetria inicialmente
                fetchDevicesData();

                const intervalId = setInterval(fetchDevicesData, 120000); // 120 segundos(funcionando)

                // Limpar intervalo quando o componente for desmontado
                return () => clearInterval(intervalId);

            } catch (err) {
                setError(err.message);
            }
        };
        fetchData();
    }, []);

    //----------------------

    //Tratamento de fetchData
    //retorna html de erro caso não consiga requisitar os dados
    if (error) {
        return <div>Erro: {error}</div>;
    }

    //retorna html de gif de carregamento enquanto o estado dos dados não atualiza
    if (!firebaseDataStructure) {
        return (
            <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                <img src={loadingGif} alt='Loading...' className='gif-image' />
            </div>);
    }
    //----------------------

console.log("unidadesProdutivasOvonovo: ", unidadesProdutivasOvonovo);
console.log("telemetryDataOvonovo",telemetryDataOvonovo);

    return (
        <div className='container-xl'>
            <HeaderOvonovo />
            {unidadesProdutivasOvonovo.map(unidadeProdutiva => <Card unidadeProdutiva={unidadeProdutiva} devicesTelemetry={telemetryDataOvonovo} />)}
            <HeaderOasis />
            
        </div>
    );
}

export default MainPage;
