import '../assets/styles/MainPage.css';
import { useEffect, useState } from 'react';
import useLogout from '../scripts/logoutScript';
import firebaseService from '../firebase/fAuth';
import loadingGif from '../assets/imagens/loading.gif';
import Fileira from '../components/headerUnidadeProdutiva';

const MainPage = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    //useLogout();

    //Requisição dos dados do firebase
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resultado = await firebaseService.getDatabaseInfo();
                console.log(resultado);
                setData(resultado);
                console.log(Object.entries(resultado.propriedades));
            }

            catch (err) {
                setError(err.message)
            }
        };
        fetchData();
    }, [])
//----------------------

    //Tratamento de fetchData
    //retorna html de erro caso não consiga requisitar os dados
    if (error) {
        return <div>Erro: {error}</div>;
    }

    //retorna html de gif de carregamento enquanto o estado dos dados não atualiza
    if (!data) {
        return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: "center", alignItems: 'center' }}>
            <img src={loadingGif} alt='Loading...' className='gif-image' />
        </div>);
    }
//----------------------




    return (
        <div className='container-xl text-center'>
            <Fileira props={data.propriedades}/>
        </div>
    );
}

export default MainPage;
