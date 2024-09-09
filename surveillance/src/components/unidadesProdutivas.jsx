import logoSmartFrangoBranco from '../assets/imagens/SmartRuralLogoGalinhaBranco.svg';
import logoSmartPeixeBranco from '../assets/imagens/smartrural_logo_named_white_peixe.svg';

import iconePadrao from '../assets/imagens/icone_unidade_produtiva_default.png';
import imagemOvonovo from '../assets/imagens/imagem_OvoNovo.png';
import imagemOasis from '../assets/imagens/imagem_Oasis.png';

import logoSmartFrangoPreto from '../assets/imagens/SmartruralLogoGalinha_preto.svg';
import logoSmartPeixePreto from '../assets/imagens/smartrural_logo.png';

import poultry from '../assets/imagens/smartrural_poultry_icon.png';
import iconePeixe from '../assets/imagens/smartrural_fish_icon.png';

const logoMap = {
    ovonovo: logoSmartFrangoBranco,
    oasis: logoSmartPeixeBranco,
    // possibilita adicionar mais tipos de propriedades e ícones sem mudar a lógica de exibição.
  };

const iconeMap = {
    chicken : poultry,
    fish : iconePeixe
};
  

const Exibicao = (dataStructure) =>{

    const getPropriedadesPorTipo = (nome) =>{
        return Object.values(dataStructure.propriedades).filter((propriedade) => propriedade.nome === nome);
    }

    const propriedadesOvonovo = getPropriedadesPorTipo('ovonovo');
    const propriedadesOasis = getPropriedadesPorTipo('oasis');

    const Header = (property) => {
        const tipo = property.nome;
        const imageSrc = logoMap[tipo] || iconePadrao; // Imagem padrão se o tipo não for encontrado

        return(
            <div className="container-md">
                <div className="horizontal-card">
                    <img className="card-image" src={imageSrc} alt={`logo-${tipo}`} />
                    <img className='card-image' src={tipo === 'ovonovo' ? imagemOvonovo : imagemOasis} alt={`imagem-${tipo}`}/>
                    <img className='card-image' src={tipo === 'ovonovo' ? logoSmartFrangoPreto : logoSmartPeixePreto} alt={`ilustração-${tipo}`}/>
                </div>
            </div>
        );
    }

    const Card = (unidadeProdutiva) => {
        const cultivo = unidadeProdutiva.cultivo;
        const iconSrc = iconeMap[cultivo] || iconePadrao;

        return(
            <div className='container-md'>
                <h1 className='nome'>{unidadeProdutiva.nome}</h1>
                    <div className='row'>
                        <img className='card-image' src={iconSrc} alt={`icone-${cultivo}`}/>
                        <div className='informacoes'>

                        </div>
                    </div>
            </div>
        )
    }

    return(
        <div className="container-md">
            <Header property = {propriedadesOvonovo[0]}/>
            <div className="row">
                
            </div>
        </div>
    );
};


export default Exibicao;