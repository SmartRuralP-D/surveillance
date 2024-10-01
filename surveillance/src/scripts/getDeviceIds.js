const getDeviceIds = (firebaseRootStructure) => {
    //extraindo device ids
    let devicesOvonovo = {};
    let devicesOasis = {};

    console.log(Object.values(firebaseRootStructure.propriedades));

    Object.values(firebaseRootStructure.propriedades).forEach(propriedade => {
        if (propriedade.nome === 'ovonovo') {
            Object.values(propriedade.unidadesProdutivas).forEach(unidade => {
                if (!devicesOvonovo[unidade.nome]){devicesOvonovo[unidade.nome] = {};}
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
    
    return {devicesOvonovo, devicesOasis};
}
export default getDeviceIds;