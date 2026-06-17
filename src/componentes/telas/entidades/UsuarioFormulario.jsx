import { useContext } from "react";
import UsuarioContext from "./UsuarioContext";
import Alerta from "../../reutilizaveis/Alerta";
import { Button, Col, Form, FloatingLabel, Row } from "react-bootstrap";

function UsuarioFormulario() {
    const {
        objeto,
        handleChange,
        acaoCadastrar,
        alerta,
        remover,
        emailOriginal,
        admin,
        mostrarFormulario,
        voltar,
        usuarioLogado
    } = useContext(UsuarioContext);

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <h1 className="mb-4">{admin && mostrarFormulario ? "Editar usuário" : "Meu cadastro"}</h1>

                    <Alerta alerta={alerta} />

                    <Form onSubmit={acaoCadastrar}>
                        <Row>
                            <Col md={12}>
                                <FloatingLabel label="Nome" className="mb-3">
                                    <Form.Control
                                        name="nome"
                                        type="text"
                                        placeholder="Nome"
                                        value={objeto.nome}
                                        onChange={handleChange}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>

                            <Col md={6}>
                                <FloatingLabel label="E-mail" className="mb-3">
                                    <Form.Control
                                        name="email"
                                        type="email"
                                        placeholder="usuario@example.com"
                                        value={objeto.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>

                            <Col md={6}>
                                <FloatingLabel label="Telefone" className="mb-3">
                                    <Form.Control
                                        name="telefone"
                                        type="text"
                                        placeholder="(00) 00000-0000"
                                        value={objeto.telefone}
                                        onChange={handleChange}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>

                            <Col md={12}>
                                <FloatingLabel label="Senha" className="mb-3">
                                    <Form.Control
                                        name="senha"
                                        type="password"
                                        placeholder="Nova senha"
                                        value={objeto.senha}
                                        onChange={handleChange}
                                    />
                                </FloatingLabel>
                                <div className="text-muted mb-3">
                                    Deixe em branco para manter a senha atual.
                                </div>
                            </Col>

                            {admin && mostrarFormulario && (
                                <Col md={6}>
                                    <FloatingLabel label="Tipo" className="mb-3">
                                        <Form.Select
                                            name="tipo"
                                            value={objeto.tipo || ""}
                                            onChange={handleChange}
                                            disabled={emailOriginal === usuarioLogado?.email}
                                        >
                                            <option value="">Selecione</option>
                                            <option value="A">A</option>
                                            <option value="U">U</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            )}
                        </Row>

                        <div className="d-flex gap-2">
                            <Button variant="primary" type="submit">
                                Salvar alterações
                            </Button>
                            <Button
                                variant="danger"
                                type="button"
                                onClick={() => remover(emailOriginal || objeto.email)}
                            >
                                Excluir minha conta
                            </Button>
                            {admin && mostrarFormulario && (
                                <Button variant="secondary" type="button" onClick={voltar}>
                                    Voltar
                                </Button>
                            )}
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default UsuarioFormulario;
