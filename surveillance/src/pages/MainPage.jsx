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

const MainPage = () => {
    const [firebaseDataStructure, setFirebaseData] = useState({});
    const [authToken, setAuthToken] = useState('');
    const [error, setError] = useState(null);

    const [aov, setAov] = useState([]);
    const [aoa, setAoa] = useState([]);
    //useLogout();

    //Requisição dos dados do firebase
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Dados do firebase
                const firebaseRootStructure = await firebaseService.getDatabaseInfo();
                setFirebaseData(firebaseRootStructure);

                const [idsAssetsOvonovo, idAssetsOasis ]= getAssetIds(firebaseRootStructure);
                const {idsDevicesOvonovo, idsDevicesOasis} = getDeviceIds(firebaseRootStructure);
                console.log(idsAssetsOvonovo,idAssetsOasis);
                console.log(idsDevicesOvonovo,idsDevicesOasis);
                const token = await getThingsBoardJwt(firebaseRootStructure);
                setAuthToken(token);

                // Requisições para atributos dos assets
// desnecessário no momento ------------------------------------------------------------------------------------------------
                const attributeRequestsOvonovo = idsAssetsOvonovo.map(assetId =>
                    fetch(`https://thingsboard.cloud/api/plugins/telemetry/ASSET/${assetId}/values/attributes/SERVER_SCOPE`, {
                        headers: {
                            'accept': 'application/json',
                            'X-Authorization': `Bearer ${token}`
                        }
                    }).then(response => response.json())
                );

                const attributeRequestsOasis = idAssetsOasis.map(assetId =>
                    fetch(`https://thingsboard.cloud/api/plugins/telemetry/ASSET/${assetId}/values/attributes/SERVER_SCOPE`, {
                        headers: {
                            'accept': 'application/json',
                            'X-Authorization': `Bearer ${token}`
                        }
                    }).then(response => response.json())
                );

                const attributesResponsesOvonovo = await Promise.all(attributeRequestsOvonovo);
                const attributesResponsesOasis = await Promise.all(attributeRequestsOasis);
                console.log('atributos ovonovo:', attributesResponsesOvonovo);
                console.log('atributos oasis:', attributesResponsesOasis);
                setAov(attributesResponsesOvonovo);
                setAoa(attributesResponsesOasis);

                const [unidadeProdutivaOvonovo1, unidadeProdutivaOvonovo2, unidadeProdutivaOvonovo3] = attributesResponsesOvonovo;
                const [unidadeProdutivaOasis1, unidadeProdutivaOasis2, unidadeProdutivaOasis3] = attributesResponsesOasis;
                console.log('unidade produtiva ovonovo 1,2:', unidadeProdutivaOvonovo1, unidadeProdutivaOvonovo2);


                console.log('Attributes Ovonovo:', attributesResponsesOvonovo);
                console.log('Attributes Oasis:', attributesResponsesOasis);

                const upsOvonovo = attributesResponsesOvonovo.map(unit => {
                    // Para cada unidade produtiva, cria um objeto com as chaves e valores correspondentes
                    return unit.reduce((acc, curr) => {
                        acc[curr.key] = curr.value;
                        return acc;
                    }, {});
                });
                
                console.log(upsOvonovo);
               
//---------------------------------------------------------------------------------------------------------------------------

                //extraindo do tb timeseries data dos sensores(devices)
                const telemetryDataOvonovo = {};
                const telemetryDataOasis = {};
                console.log("c");
                console.log(idsDevicesOvonovo);
                
                // Função para fetch telemetry data de Ovonovo devices
                const fetchTelemetryForDevice = async (deviceId, unidade) => {
                  const response = await fetch(`https://thingsboard.cloud/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    }
                  });
                  const data = await response.json();
                  if (!telemetryDataOvonovo[unidade]) {
                    telemetryDataOvonovo[unidade] = [];
                  }
                  telemetryDataOvonovo[unidade].push({ deviceId, data });
                };
                
            // Função para fetch telemetry data de Oasis devices
                const fetchTelemetryForOasisDevice = async (deviceId, unidade) => {
                  const response = await fetch(`https://thingsboard.cloud/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    }
                  });
                  const data = await response.json();
                  if (!telemetryDataOasis[unidade]) {
                    telemetryDataOasis[unidade] = [];
                  }
                  telemetryDataOasis[unidade].push({ deviceId, data });
                };
                
                //define o procedimento para executar as duas funções nas respectivas unidades e devices
                const fetchAllTelemetryData = async () => {
                  for (const [unidade, deviceIds] of Object.entries(idsDevicesOvonovo)) {
                    const fetchPromises = deviceIds.map(deviceId => fetchTelemetryForDevice(deviceId, unidade));
                    await Promise.all(fetchPromises);
                  }
                
                  for (const [unidade, deviceIds] of Object.entries(idsDevicesOasis)) {
                    const fetchPromises = deviceIds.map(deviceId => fetchTelemetryForOasisDevice(deviceId, unidade));
                    await Promise.all(fetchPromises);
                  }
                };
                
                // chama o procedimento
                fetchAllTelemetryData().catch(console.error);

                console.log('Telemetry Data Ovonovo:', telemetryDataOvonovo);
                console.log('Telemetry Data Oasis:', telemetryDataOasis);


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




    return (
        <div className='container-xl'>
            <HeaderOvonovo />
            <div className='cards'>
                {aov.map((unidadeProdutiva, index) => (
                    <div className='card2'>
                        <Card key={index} unidadeProdutiva={unidadeProdutiva} />
                    </div>
                ))}
            </div>
            <p></p>
            <HeaderOasis />
            <div className='cards'>
                {aoa.map((unidadeProdutiva, index) => (
                    <div className='card2'>
                        <Card key={index} unidadeProdutiva={unidadeProdutiva} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
