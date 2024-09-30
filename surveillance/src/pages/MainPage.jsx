import '../assets/styles/MainPage.css';
import { useEffect, useState } from 'react';
import useLogout from '../scripts/logoutScript';
import firebaseService from '../firebase/fAuth';
import loadingGif from '../assets/imagens/loading.gif';
import HeaderOvonovo from '../components/HeaderOvonovo';
import HeaderOasis from '../components/HeaderOasis';
import Card from '../components/Card';

const MainPage = () => {
    const [firebaseDataStructure, setFirebaseData] = useState({});
    const [error, setError] = useState(null);

    const [authToken, setAuthToken] = useState('');
    const [dashboardIds, setDashboardIds] = useState([]); //não usar esses 3 states
    const [assetIds, setAssetIds] = useState([]);

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

                // Extraindo asset_ids
                const assetsOvonovo = [];
                const assetsOasis = [];

                Object.values(firebaseRootStructure.propriedades).forEach(propriedade => {
                    const tipo = propriedade.nome;

                    Object.keys(propriedade.unidadesProdutivas).forEach(assetId => {
                        if (tipo === 'ovonovo') {
                            assetsOvonovo.push(assetId);
                        } else if (tipo === 'oasis') {
                            assetsOasis.push(assetId);
                        }
                    });
                });

                console.log('assets ovonovo:', assetsOvonovo);
                console.log('assets oasis:', assetsOasis);

                const devicesOvonovo = {};
                const devicesOasis = {};


                Object.values(firebaseRootStructure.propriedades).forEach(propriedade => {
                    if (propriedade.nome === 'ovonovo') {
                      Object.values(propriedade.unidadesProdutivas).forEach(unidade => {
                        devicesOvonovo[unidade.nome] = Object.values(unidade.dispositivos);
                      });
                    } else if (propriedade.nome === 'oasis') {
                      Object.values(propriedade.unidadesProdutivas).forEach(unidade => {
                        devicesOasis[unidade.nome] = Object.values(unidade.dispositivos);
                      });
                    }
                  });
                  
                  console.log('Devices Ovonovo:', devicesOvonovo);
                  console.log('Devices Oasis:', devicesOasis);

                // Token JWT de autenticação do Thingsboard
                const corpo = {
                    username: firebaseRootStructure.thingsboardCredentials.username,
                    password: firebaseRootStructure.thingsboardCredentials.password
                };

                const authResponse = await fetch('https://thingsboard.cloud/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(corpo)
                });
                const authResult = await authResponse.json();
                const token = authResult.token;
                setAuthToken(token);

                // Requisições para atributos dos assets

                const attributeRequestsOvonovo = assetsOvonovo.map(assetId =>
                    fetch(`https://thingsboard.cloud/api/plugins/telemetry/ASSET/${assetId}/values/attributes/SERVER_SCOPE`, {
                        headers: {
                            'accept': 'application/json',
                            'X-Authorization': `Bearer ${token}`
                        }
                    }).then(response => response.json())
                );

                const attributeRequestsOasis = assetsOasis.map(assetId =>
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

                const telemetryDataOvonovo = {};
                const telemetryDataOasis = {};
                console.log(Object.entries(devicesOvonovo));
                
                // Function to fetch telemetry data for Ovonovo devices
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
                

                const fetchAllTelemetryData = async () => {
                  for (const [unidade, deviceIds] of Object.entries(devicesOvonovo)) {
                    const fetchPromises = deviceIds.map(deviceId => fetchTelemetryForDevice(deviceId, unidade));
                    await Promise.all(fetchPromises);
                  }
                
                  for (const [unidade, deviceIds] of Object.entries(devicesOasis)) {
                    const fetchPromises = deviceIds.map(deviceId => fetchTelemetryForOasisDevice(deviceId, unidade));
                    await Promise.all(fetchPromises);
                  }
                };
                
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
