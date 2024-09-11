import '../assets/styles/MainPage.css';
import { useEffect, useState } from 'react';
import useLogout from '../scripts/logoutScript';
import firebaseService from '../firebase/fAuth';
import loadingGif from '../assets/imagens/loading.gif';

const MainPage = () => {
    const [firebaseDataStructure, setFirebaseData] = useState({});
    const [error, setError] = useState(null);

    const [authToken, setAuthToken] = useState('');
    const [dashboardIds, setDashboardIds] = useState([]); //não usar esses 3 states
    const [assetIds, setAssetIds] = useState([]);
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

                console.log(assetsOvonovo);
                console.log(assetsOasis);

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

                const [unidadeProdutivaOvonovo1, unidadeProdutivaOvonovo2, unidadeProdutivaOvonovo3] = attributesResponsesOvonovo;
                const [unidadeProdutivaOasis1, unidadeProdutivaOasis2, unidadeProdutivaOasis3] = attributesResponsesOasis;
                console.log(unidadeProdutivaOvonovo1,unidadeProdutivaOvonovo2);


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
            <div className='row'>
                <div className='col'>
                   {/* <Fileira props={data.propriedades} /> */}
                </div>
            </div>
        </div>
    );
}

export default MainPage;
