import { useContext } from "react";
import UsuarioContext from "./UsuarioContext";
import Alerta from "../../reutilizaveis/Alerta";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";

function UsuarioTabela() {
    const {
        alerta,
        listaObjetos,
        remover,
        selecionar
    } = useContext(UsuarioContext);

    return (
        <div style={{ padding: "20px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Usuários Cadastrados</h1>
            </div>

            <Alerta alerta={alerta} />

            {listaObjetos.length === 0 && !alerta.message && (
                <h3 className="text-center mt-5">
                    Nenhum usuário encontrado
                </h3>
            )}

            {listaObjetos.length > 0 && (
                <Table striped bordered hover responsive className="mt-4">
                    <thead>
                        <tr>
                            <th style={{ width: "120px", textAlign: "center" }}>Ações</th>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Telefone</th>
                            <th>Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaObjetos.map((obj) => (
                            <tr key={obj.email}>
                                <td align="center">
                                    <Button
                                        variant="warning"
                                        onClick={() => selecionar(obj)}
                                        title="Editar usuário"
                                        className="me-2"
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => remover(obj.email)}
                                        title="Excluir usuário"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </td>
                                <td>{obj.nome}</td>
                                <td>{obj.email}</td>
                                <td>{obj.telefone}</td>
                                <td>{renderizarTipo(obj.tipo)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

function renderizarTipo(tipo) {
    const s = String(tipo || "").toUpperCase();

    let cor;

    switch (s) {
        case "A":
            cor = "danger";
            break;
        default:
            cor = "primary";
    }

    return (
        <Badge bg={cor}>
            {tipo}
        </Badge>
    );
}

export default UsuarioTabela;
