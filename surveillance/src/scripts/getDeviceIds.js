const getDeviceIds = (firebaseRootStructure) => {
    const devices = {};

    Object.values(firebaseRootStructure.propriedades).forEach(propriedade => {
        const tipo = propriedade.nome;
        devices[tipo] = {};

        Object.values(propriedade.unidadesProdutivas).forEach(unidade => {
            devices[tipo][unidade.nome] = Object.values(unidade.dispositivos);
        });
    });

    return devices;
}
export default getDeviceIds;