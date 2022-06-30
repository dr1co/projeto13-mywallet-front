import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';

import UserContext from '../contexts/UserContext.js';

export default function Login() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const { setUser } = useContext(UserContext);
    const localUser = JSON.parse(localStorage.getItem("MWLocalUser"));
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (localUser) {
            //request no axios aqui embaixo:
            /*
                setUser({
                    name: res.data.name,
                    email: res.data.email,
                    password: res.data.password,
                    token: res.data.token
                })
            */
        }
    }, []);

    async function login() {
        if (credentials.email !== "" && credentials.password !== "") {
            setMessage("");
            //request no axios aqui embaixo:
            /*
                const newUser = {
                    name: res.data.name,
                    email: res.data.email,
                    password: res.data.password,
                    token: res.data.token
                };
                localStorage.setItem("MWLocalUser", JSON.stringify(newUser.token));
                setUser(newUser);
            */
        } else {
            setMessage("Os campos acima são obrigatórios!");
        }
    }

    return (
        <Container>
            <Title>MyWallet</Title>
            <Input
                type="text"
                placeholder="E-mail"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                borderColor={message && !credentials.email ? "#FF8E9D" : "transparent"} />
            <Input
                type="password"
                placeholder="Senha"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                borderColor={message && !credentials.password ? "#FF8E9D" : "transparent"} />
            <LoginButton onClick={login}>Entrar</LoginButton>
            <StyledLink to="/register">
                <p>Primeira vez? Cadastre-se!</p>
            </StyledLink>
            <Warn> {message} </Warn>
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    background-color: #8C11BE;
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

    &::placeholder {
        color: #000000;
        opacity: 1;
    }
`;

const LoginButton = styled.button`
    width: 326px;
    height: 46px;
    margin: 6px auto;
    background-color: #A328D6;
    border: 0 solid transparent;
    border-radius: 5px;
    font-size: 20px;
    font-weight: 700;
    color: #FFFFFF;
    cursor: pointer;
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