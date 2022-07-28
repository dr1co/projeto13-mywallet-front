import axios from 'axios';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import UserContext from '../contexts/UserContext.js';
import { IoExitOutline } from 'react-icons/io5';
import PurpleBG from './Background.js';
import Loader from './Loader.js';

export default function NewEntrance() {
    const [entrance, setEntrance] = useState({
        date: dayjs().format("DD/MM"),
        name: "",
        value: "",
        type: "entrance"
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);
    let navigate = useNavigate();

    function sendEntrance() {
        if (entrance.name !== "" && entrance.value !== "" && entrance.type !== "" && Number(entrance.value) > 0) {
            setMessage("");
            setLoading(true);
            const request = axios.post("https://proj13-mywallet-dr1co.herokuapp.com/transactions", entrance, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });
            request.then((res) => {
                setMessage("Entrada cadastrada com sucesso! Redirecionando para a tela principal...")
                setTimeout(() => navigate("/home"), 3000);
            });
            request.catch((err) => {
                switch (err.response.status) {
                    case 404:
                        setMessage("Não foi possível cadastrar a entrada: usuário não encontrado! Faça login novamente!");
                        break;
                    default:
                        setMessage("Problema no servidor. Tente novamente mais tarde ou culpe o Heroku :(");
                }
                setLoading(false);
            });
        } else {
            setMessage(`Os campos acima são obrigatórios + "Valor" deve ser um número positivo`);
        }
    }

    return (
        <Container>
            <PurpleBG />
            <Header>
                <h1>Nova Entrada</h1>
                <StyledLink to="/home">
                    <ExitIcon />
                </StyledLink>
            </Header>
            <Input
                type="number"
                placeholder="Valor"
                value={entrance.value}
                onChange={(e) => setEntrance({...entrance, value: e.target.value})}
                borderColor={message && !entrance.value ? "#FF8E9D" : "transparent"}
                disabled={loading}
                opacity={loading ? "0.7" : "1"} />
            <Input
                type="text"
                placeholder="Descrição"
                value={entrance.name}
                onChange={(e) => setEntrance({...entrance, name: e.target.value})}
                borderColor={message && !entrance.name ? "#FF8E9D" : "transparent"}
                disabled={loading}
                opacity={loading ? "0.7" : "1"} />
            <AddButton
            onClick={sendEntrance}
            disabled={loading}
            bgcolor={loading ? "#763293" : "#A328D6"}
            cursor={loading ? "default" : "pointer"}>
                {loading ? <Loader /> : "Salvar Entrada"}
            </AddButton>
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
    opacity: ${props => props.opacity};

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
    background-color: ${props => props.bgcolor};
    border: 0 solid transparent;
    border-radius: 5px;
    font-size: 20px;
    font-weight: 700;
    color: #FFFFFF;
    cursor: ${props => props.cursor};
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