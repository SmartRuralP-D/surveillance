const Fileira = ({ props }) => {
    const entradas = Object.entries(props);
    return (
        <div className="container-md">
            <div className="row">
                {entradas.map(([chave, valor], index) => (
                    <div className="col" key={index}>
                        <h1>{valor.nome}</h1>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Fileira;