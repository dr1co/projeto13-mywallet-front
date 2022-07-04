import axios from 'axios';
import styled from 'styled-components';
import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import UserContext from '../contexts/UserContext.js';
import { IoExitOutline } from 'react-icons/io5';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import { ImCross } from 'react-icons/im';
import PurpleBG from './Background.js';
import Loader from './Loader.js';

export default function Home() {
    const [transactions, setTransactions] = useState([]);
    const { user } = useContext(UserContext);
    const [sum, setSum] = useState("0");
    const [message, setMessage] = useState("Carregando dados...");
    const [confirm, setConfirm] = useState("");

    function getTransactions() {
        const promise = axios.get("https://proj13-mywalletback-dr1co.herokuapp.com/transactions", { headers: {
            "Authentication": `Bearer ${user.token}`
        }});
        promise.then((res) => {
            setTransactions(res.data);
            if (res.data.length === 0) setMessage("Não há registros de entrada ou saída.");
            else calculateBalance();
        });
        promise.catch((err) => {
            switch (err.response.status) {
                case 422:
                    setMessage("Não foi possível carregar os dados: token inválido! Faça login novamente!");
                    break;
                case 404:
                    setMessage("Não foi possível carregar os dados: usuário não encontrado! Faça login novamente!");
                    break;
                default:
                    setMessage("Não foi possível carregar os dados: problemas no servidor. Tente novamente mais tarde ou culpe o Heroku :(");
            }
        });
        calculateBalance();
    }

    function calculateBalance() {
        let sum = 0;
        for (let i = 0 ; i < transactions.length ; i++) {
            if (transactions[i].type === "entrance") sum += Number(transactions[i].value);
            else sum -= Number(transactions[i].value);
        }
        setSum(sum.toFixed(2));
    }

    useEffect(() => getTransactions(), []);

    return (
        <Container>
            <PurpleBG />
            <Title name={user.name} />
            <History align={transactions.length > 0 ? "default" : "center"}>
                <NoContent display={transactions.length > 0 ? "none" : "flex"}>
                    {message}
                </NoContent>
                {transactions.map((t) => <Transaction transaction={t} setConfirm={setConfirm} />)}
                <Balance color={Number(sum) > 0 ? "#03AC00" : "#C70000"} display={transactions.length > 0 ? "flex" : "none"}> 
                    <h1> SALDO </h1>
                    <p> {sum} </p>
                </Balance>
            </History>
            <ButtonsPanel />
            <ModalDelete confirm={confirm} setConfirm={setConfirm} user={user} getTransactions={getTransactions} />
        </Container>
    )
}

function Transaction({ transaction, setConfirm }) {
    let navigate = useNavigate();

    return (
        <Element>
            <Date>{transaction.date}</Date>
            <h1 onClick={() => navigate(`/edit/${transaction._id}`)}>{transaction.name}</h1>
            <Value color={transaction.type === "entrance" ? "#03AC00" : "#C70000"}>{Number(transaction.value).toFixed(2)}</Value>
            <CrossIcon onClick={() => setConfirm(transaction._id)} />
        </Element>
    )
}

function Title({ name }) {
    return (
        <Header>
            <h1>Olá, {name}</h1>
            <StyledLink to="/">
                <ExitIcon />
            </StyledLink>
        </Header>
    )
}

function ModalDelete({ confirm, setConfirm, user, getTransactions }) {
    const [message, setMessage] = useState(`${user.name}, tem certeza que deseja remover essa transação?`);
    const [loading, setLoading] = useState(false);

    function deleteTransaction() {
        setLoading(true);
        const request = axios.delete(`https://proj13-mywalletback-dr1co.herokuapp.com/transactions/${confirm}`, {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        });
        request.then((res) => {
            setMessage("Removido com sucesso! Voltando...");
            setTimeout(() => {
                setConfirm("");
                getTransactions();
                setMessage(`${user.name}, tem certeza que deseja remover essa transação?`);
            }, 2000);
        });
        request.catch((err) => {
            setMessage("Não foi possível remover a transação. Faça login novamente!");
            setLoading(false);
            setTimeout(() => {
                setConfirm("");
                getTransactions();
                setMessage(`${user.name}, tem certeza que deseja remover essa transação?`);
            }, 2000);
        });
    }
    
    return (
        <>
            <Panel display={confirm !== "" ? "flex" : "none"} />
            <ModalBox display={confirm !== "" ? "flex" : "none"} color={loading ? "#763293" : "#A328D6"} >
                <h1> {message} </h1>
                <ModalButtons>
                    <YesButton onClick={deleteTransaction}> {loading ? <Loader /> : "Confirmar"} </YesButton>
                    <NoButton onClick={() => setConfirm("")}> {loading ? "" : "Não"} </NoButton>
                </ModalButtons>
            </ModalBox>
        </>
    )
}

function ButtonsPanel() {
    let navigate = useNavigate()

    return (
        <Buttons>
            <AddTransaction onClick={() => navigate("/add/entrance")}>
                <PlusIcon />
                <p> Nova <br /> entrada </p>
            </AddTransaction>
            <AddTransaction onClick={() => navigate("/add/exit")}>
                <MinusIcon />
                <p> Nova <br /> saída </p>
            </AddTransaction>
        </Buttons>
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

const Header = styled.div`
    width: 326px;
    margin-bottom: 24px;
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

const History = styled.div`
    width: 326px;
    height: 60%;
    padding: 8px 0;
    background: #FFFFFF;
    border: 0 solid transparent;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: ${props => props.align};
    align-items: center;
    overflow-x: scroll;
    position: relative;
`;

const NoContent = styled.p`
    font-size: 20px;
    color: #868686;
    text-align: center;
    display: ${props => props.display}
`;

const Balance = styled.div`
    width: 100%;
    min-height: 40px;
    padding: 0 10px;
    background: #FFFFFF;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    display: ${props => props.display};
    justify-content: space-between;
    align-items: center;
    position: sticky;
    bottom: -8px;
    left: 0;
    box-shadow: 0px -5px 5px rgba(0, 0, 0, 0.05);

    h1 {
        font-size: 17px;
        font-weight: 700;
    }

    p {
        font-size:17px;
        color: ${props => props.color};
    }
`;

const Buttons = styled.div`
    width: 326px;
    height: 114px;
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const AddTransaction = styled.button`
    width: 155px;
    height: 100%;
    background: #A328D6;
    border: 0 solid transparent;
    border-radius: 5px;
    position: relative;
    cursor: pointer;

    p {
        font-size: 17px;
        font-weight: 700;
        color: #FFFFFF;
        text-align: left;
        position: absolute;
        bottom: 12px;
        left: 12px;
    }
`;

const Element = styled.div`
    width: 100%;
    padding: 0 10px;
    margin: 10px auto;
    height: fit-content;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h1 {
        font-size: 16px;
        color: #000000;
        min-width: 145px;
        max-width: 145px;
        text-overflow: ellipsis;
        text-align: left;
        cursor: pointer;
    }
`;

const Date = styled.p`
    font-size: 16px;
    color: #C6C6C6;
`;

const Value = styled.p`
    font-size: 16px;
    color: ${props => props.color};
`;

const Panel = styled.div`
    width: 100%;
    height: 100%;
    background: #000000;
    opacity: 0.5;
    display: ${props => props.display};
    position: absolute;
    top: 0;
    left: 0;
`;

const ModalBox = styled.div`
    width: 248px;
    height: 210px;
    padding: 15px;
    background: ${props => props.color};
    border-radius: 12px;
    display: ${props => props.display};
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    h1 {
        font-size: 22px;
        font-weight: 500;
        color: #FFFFFF;
        text-align: center;
    }
`;

const ModalButtons = styled.div`
    width: 100%;
    height: 52px;
    display: flex;
    justify-content: space-around;
    align-items: center;
`;

const YesButton = styled.button`
    width: 95px;
    height: 100%;
    background: #03AC00;
    color: #FFFFFF;
    border: 0 solid transparent;
    border-radius: 5px;
    box-shadow: 5px 5px 2px rgba(0, 0, 0, 0.05);
    font-size: 18px;
    font-weight: 700;
`;

const NoButton = styled.button`
    width: 95px;
    height: 100%;
    background: #C70000;
    color: #FFFFFF;
    border: 0 solid transparent;
    border-radius: 5px;
    box-shadow: 5px 5px 2px rgba(0, 0, 0, 0.05);
    font-size: 18px;
    font-weight: 700;
`;

const CrossIcon = styled(ImCross)`
    font-size: 10px;
    color: #C6C6C6;
    cursor: pointer;
`;

const ExitIcon = styled(IoExitOutline)`
    font-size: 36px;
    color: #FFFFFF;
    cursor: pointer;
`;

const PlusIcon = styled(AiOutlinePlusCircle)`
    font-size: 24px;
    color: #FFFFFF;
    position: absolute;
    top: 12px;
    left: 12px;
`;

const MinusIcon = styled(AiOutlineMinusCircle)`
    font-size: 24px;
    color: #FFFFFF;
    position: absolute;
    top: 12px;
    left: 12px;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
`;