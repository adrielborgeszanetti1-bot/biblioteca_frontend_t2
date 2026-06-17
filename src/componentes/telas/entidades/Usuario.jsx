import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUsuariosAPI,
  getUsuarioPorEmailAPI,
  deleteUsuarioPorEmailAPI,
  alterarUsuarioAPI
} from '../../../servicos/UsuarioServico';

import Carregando from "../../reutilizaveis/Carregando";
import UsuarioContext from "./UsuarioContext";
import UsuarioTabela from "./UsuarioTabela";
import UsuarioFormulario from "./UsuarioFormulario";

import WithAuth from "../../../seguranca/WithAuth";
import { getUsuario, isAdmin, logout, gravaAutenticacao } from "../../../seguranca/Autenticacao";

function Usuario() {
    const usuarioLogado = getUsuario();
    const admin = isAdmin();
    const navigate = useNavigate();

    const estadoInicial = {
        nome: "",
        email: "",
        telefone: "",
        senha: ""
    };

    const [alerta, setAlerta] = useState({ status: "", message: "" });
    const [listaObjetos, setListaObjetos] = useState([]);
    const [objeto, setObjeto] = useState(estadoInicial);
    const [carregando, setCarregando] = useState(true);
    const [emailOriginal, setEmailOriginal] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        const carregar = async () => {
            try {
                setCarregando(true);

                if (admin) {
                    const dados = await getUsuariosAPI();
                    setListaObjetos(dados);
                    setMostrarFormulario(false);
                } else if (usuarioLogado?.email) {
                    const dados = await getUsuarioPorEmailAPI(usuarioLogado.email);
                    setObjeto({
                        nome: dados.nome || "",
                        email: dados.email || "",
                        telefone: dados.telefone || "",
                        senha: ""
                    });
                    setEmailOriginal(dados.email || usuarioLogado.email);
                }
            } catch (err) {
                setAlerta({
                    status: "error",
                    message: err.message || "Erro ao recuperar usuario"
                });
            } finally {
                setCarregando(false);
            }
        };

        carregar();
    }, [admin, usuarioLogado?.email]);

    const remover = async (email) => {
        if (!window.confirm("Deseja remover este usuario?")) {
            return;
        }

        try {
            const respostaAPI = await deleteUsuarioPorEmailAPI(email);
            setAlerta({
                status: respostaAPI.status,
                message: respostaAPI.message
            });

            if (email === usuarioLogado?.email) {
                logout();
                navigate("/login");
            } else if (admin) {
                const dados = await getUsuariosAPI();
                setListaObjetos(dados);
                setMostrarFormulario(false);
            } else {
                logout();
                navigate("/login");
            }
        } catch (err) {
            setAlerta({
                status: "error",
                message: err.message || "Erro ao remover usuario"
            });
        }
    };

    const acaoCadastrar = async (e) => {
        e.preventDefault();

        try {
            // Admins can edit other users including their tipo, but must not change their own tipo
            const payload = { ...objeto };
            if (admin && (emailOriginal === usuarioLogado?.email)) {
                // Prevent admin from changing their own privilege/type
                delete payload.tipo;
            }

            const respostaAPI = await alterarUsuarioAPI(payload, emailOriginal || objeto.email);
            setAlerta({
                status: respostaAPI.status,
                message: respostaAPI.message
            });

            if (respostaAPI.status === "success") {
                setObjeto({
                    nome: respostaAPI.objeto.nome || "",
                    email: respostaAPI.objeto.email || "",
                    telefone: respostaAPI.objeto.telefone || "",
                    senha: ""
                });
                setEmailOriginal(respostaAPI.objeto.email || emailOriginal || objeto.email);

                if (respostaAPI.token) {
                    gravaAutenticacao({
                        auth: true,
                        token: respostaAPI.token
                    });
                }

                if (admin) {
                    // refresh list and return to table view
                    const dados = await getUsuariosAPI();
                    setListaObjetos(dados);
                    setMostrarFormulario(false);
                }
            }
        } catch (err) {
            setAlerta({
                status: "error",
                message: err.message || "Erro ao processar a requisicao!"
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setObjeto({ ...objeto, [name]: value });
    };

    const valorContexto = admin
        ? {
            alerta,
            listaObjetos,
            remover,
            selecionar: (u) => {
                setObjeto({
                    nome: u.nome || "",
                    email: u.email || "",
                    telefone: u.telefone || "",
                    senha: "",
                    tipo: u.tipo || ""
                });
                setEmailOriginal(u.email || "");
                setMostrarFormulario(true);
            },
            mostrarFormulario,
            setMostrarFormulario,
            objeto,
            setObjeto,
            acaoCadastrar,
            handleChange,
            emailOriginal,
            usuarioLogado,
            voltar: () => {
                setObjeto(estadoInicial);
                setEmailOriginal("");
                setMostrarFormulario(false);
            },
            setListaObjetos,
            admin
        }
        : {
            alerta,
            objeto,
            remover,
            acaoCadastrar,
            handleChange,
            emailOriginal
        };

    return (
        <UsuarioContext.Provider value={valorContexto}>
            <Carregando carregando={carregando}>
                {admin ? (mostrarFormulario ? <UsuarioFormulario /> : <UsuarioTabela />) : <UsuarioFormulario />}
            </Carregando>
        </UsuarioContext.Provider>
    );
}

export default WithAuth(Usuario);
