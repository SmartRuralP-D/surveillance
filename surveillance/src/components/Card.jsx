import poultry from '../assets/imagens/smartrural_poultry_icon.png';
import iconePeixe from '../assets/imagens/smartrural_fish_icon.png';
import '../assets/styles/Card.css';

const Card = (unidadeProdutiva) => {
    return(
        <div className="container card">
            <h1>{unidadeProdutiva.nome}</h1>
            <img className='imagem' src={unidadeProdutiva.cultivo === "chicken" ? poultry: iconePeixe} alt="icone frango/peixe"/>
            <div className="parametros">

            </div>
        </div>
    );
}
export default Card;