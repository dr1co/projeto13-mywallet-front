import axios from 'axios';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import UserContext from '../contexts/UserContext.js';
import { IoExitOutline } from 'react-icons/io5';
import PurpleBG from './Background.js';

export default function NewExit() {
    const [exit, setExit] = useState({
        date: dayjs().format("DD/MM"),
        name: "",
        value: "",
        type: "exit"
    });
    const [message, setMessage] = useState("");
    const { user } = useContext(UserContext);
    let navigate = useNavigate();

    function sendexit() {
        if (exit.name !== "" && exit.value !== "" && exit.type !== "") {
            setMessage("");
            const request = axios.post("https://proj13-mywalletback-dr1co.herokuapp.com/transactions", exit, {
                headers: {
                    "Authentication": `Bearer ${user.token}`
                }
            });
            request.then((res) => {
                setMessage("Saída cadastrada com sucesso! Redirecionando para a tela principal...")
                setTimeout(() => navigate("/home"), 3000);
            });
            request.catch((err) => {
                switch (err.response.status) {
                    case 404:
                        setMessage("Não foi possível cadastrar a saída: usuário não encontrado! Faça login novamente!");
                        break;
                    default:
                        setMessage("Problema no servidor. Tente novamente mais tarde ou culpe o Heroku :(");
                }
            });
        } else {
            setMessage(`Os campos acima são obrigatórios + "Valor" deve ser um número`);
        }
    }

    return (
        <Container>
            <PurpleBG />
            <Header>
                <h1>Nova Saída</h1>
                <StyledLink to="/home">
                    <ExitIcon />
                </StyledLink>
            </Header>
            <Input
                type="number"
                placeholder="Valor"
                value={exit.value}
                onChange={(e) => setExit({...exit, value: e.target.value})}
                borderColor={message && !exit.value ? "#FF8E9D" : "transparent"} />
            <Input
                type="text"
                placeholder="Descrição"
                value={exit.name}
                onChange={(e) => setExit({...exit, name: e.target.value})}
                borderColor={message && !exit.name ? "#FF8E9D" : "transparent"} />
            <AddButton onClick={() => sendexit()}> Salvar Saída </AddButton>
            <Warn>{message}</Warn>
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    margin: 25px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Header = styled.div`
    width: 326px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h1 {
        font-size: 26px;
        font-weight: 700;
        color: #FFFFFF;
        text-align: left;
    }
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

    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;

    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
        -webkit-appearance: none;
    }
    &::placeholder {
        color: #000000;
        opacity: 1;
    }
`;

const AddButton = styled.button`
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

const Warn = styled.div`
    width: 326px;
    min-height: 20px;
    margin-top: 10px;
    font-size: 14px;
    font-weight: 700;
    color: #FF8E9D;
    text-align: center;
`;

const ExitIcon = styled(IoExitOutline)`
    font-size: 36px;
    color: #FFFFFF;
    cursor: pointer;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
`;