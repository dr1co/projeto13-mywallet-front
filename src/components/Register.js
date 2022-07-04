import axios from 'axios';
import styled from 'styled-components';
import { Link, useNavigate, } from 'react-router-dom';
import { useState, useContext } from 'react';

import UserContext from '../contexts/UserContext.js';
import PurpleBG from './Background.js';
import Loader from './Loader.js';

export default function Register() {
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: ""
    });
    const { setUser } = useContext(UserContext)
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    function register() {
        if (credentials.name !== "" && credentials.email !== "" && credentials.password !== "" && confirm !== "") {
            if (credentials.password === confirm) {
                setMessage("");
                setLoading(true);
                const request = axios.post("https://proj13-mywallet-dr1co.herokuapp.com/auth/signup", credentials);
                request.then((res) => {
                    const newUser = {
                        userId: res.data.userId,
                        name: res.data.name,
                        email: res.data.email,
                        password: res.data.password,
                        token: res.data.token
                    };
                    localStorage.setItem("MWLocalUser", JSON.stringify({ token: newUser.token }));
                    setUser(newUser);
                    setMessage("Cadastro efetuado com sucesso! Logando...");
                    setTimeout(() => navigate("/home"), 3000);
                })
                request.catch((err) => {
                    switch (err.response.status) {
                        case 401:
                            setMessage("Este e-mail está em uso. Favor utilizar outro!");
                            break;
                        default:
                            setMessage("Problema no servidor. Tente novamente mais tarde ou culpe o Heroku :(");
                    }
                    setLoading(false);
                });
            } else {
                setMessage("As senhas devem coincidir");
            }
        } else {
            setMessage("Os campos acima são obrigatórios!");
        }
    }

    return (
        <Container>
            <PurpleBG />
            <Title>MyWallet</Title>
            <Input
                type="text"
                placeholder="Nome"
                value={credentials.name}
                onChange={(e) => setCredentials({...credentials, name: e.target.value})}
                borderColor={message && !credentials.name ? "#FF8E9D" : "transparent"}
                disabled={loading}
                opacity={loading ? "0.7" : "1"} />
            <Input
                type="text"
                placeholder="E-mail"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                borderColor={message && !credentials.email ? "#FF8E9D" : "transparent"}
                disabled={loading}
                opacity={loading ? "0.7" : "1"} />
            <Input
                type="password"
                placeholder="Senha"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                borderColor={(message && !credentials.password) || message === "As senhas devem coincidir" ? "#FF8E9D" : "transparent"}
                disabled={loading}
                opacity={loading ? "0.7" : "1"} />
            <Input
                type="password"
                placeholder="Confirme a senha"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                borderColor={(message && !confirm) || message === "As senhas devem coincidir" ? "#FF8E9D" : "transparent"}
                disabled={loading}
                opacity={loading ? "0.7" : "1"} />
            <RegisterButton
            onClick={register}
            disabled={loading}
            bgcolor={loading ? "#763293" : "#A328D6"}
            cursor={loading ? "default" : "pointer"}>
                {loading ? <Loader /> : "Cadastrar"}
            </RegisterButton>
            <StyledLink to="/">
                <p>Já tem uma conta? Entre agora!</p>
            </StyledLink>
            <Warn> {message} </Warn>
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
`;

const Title = styled.h1`
    margin-bottom: 30px;
    font-family: 'Saira Stencil One', cursive;
    font-size: 32px;
    color: #FFFFFF;
`;

const Input = styled.input`
    width: 326px;
    height: 58px;
    margin: 6px auto;
    padding: 12px;
    background-color: #FFFFFF;
    border: 2px solid ${props => props.borderColor};
    border-radius: 5px;
    font-size: 20px;
    color: #000000;
    opacity: ${props => props.opacity};

    &::placeholder {
        color: #000000;
        opacity: 1;
    }
`;

const RegisterButton = styled.button`
    width: 326px;
    height: 46px;
    margin: 6px auto;
    background-color: ${props => props.bgcolor};
    border: 0 solid transparent;
    border-radius: 5px;
    font-size: 20px;
    font-weight: 700;
    color: #FFFFFF;
    cursor: ${props => props.cursor};
`;

const StyledLink = styled(Link)`
    text-decoration: none;

    p {
        font-size: 15px;
        font-weight: 700;
        color: #FFFFFF;
        text-align: center;
        margin-top: 30px;

        &:hover {
            text-decoration: underline;
            cursor: pointer;
        }
    }
`;

const Warn = styled.div`
    width: 326px;
    min-height: 20px;
    margin-top: 10px;
    font-size: 14px;
    font-weight: 700;
    color: #FF8E9D;
    text-align: center;
`;