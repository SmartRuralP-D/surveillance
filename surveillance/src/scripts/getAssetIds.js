const getAssetIds = (firebaseRootStructure) => {
    const assets = {};

    Object.values(firebaseRootStructure.propriedades).forEach(propriedade => {
        const tipo = propriedade.nome;
        assets[tipo] = [];

        Object.keys(propriedade.unidadesProdutivas).forEach(assetId => {
            assets[tipo].push(assetId);
        });
    });

    return assets;
}
export default getAssetIds;