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
    chicken: poultry,
    fish: iconePeixe
};




const unidadeProdutiva = (unidadeProdutiva) => {
    return (
        <div className='container'>
            <h1 className='nome'>{unidadeProdutiva.nome}</h1>
            <img src={unidadeProdutiva.cultivo === 'chicken' ? poultry : iconePeixe}/>
                <div className='parametros'>

                </div>
        </div>
    )

}
export default unidadeProdutiva;