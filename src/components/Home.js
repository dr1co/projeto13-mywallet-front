import axios from 'axios';
import styled from 'styled-components';
import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import UserContext from '../contexts/UserContext.js';
import { IoExitOutline } from 'react-icons/io5';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import { ImCross } from 'react-icons/im';
import PurpleBG from './Background.js';

export default function Home() {
    const [transactions, setTransactions] = useState([]);
    const { user } = useContext(UserContext);

    let navigate = useNavigate();

    function getTransactions() {
        //axios aqui com `Bearer ${user.token}`
        /* 
            setTransactions(res.data);
            transaction = {
                _id: "",
                name: "",
                date: "",
                value: num,
                type: "entrance" || "exit"
            }
        */
        console.log("Passei pelo axios");
    }

    useEffect(() => getTransactions(), []);

    return (
        <Container>
            <PurpleBG />
            <Header>
                <h1>Olá, Fulano!</h1>
                <Link to="/">
                    <ExitIcon />
                </Link>
            </Header>
            <History align={transactions.length > 0 ? "default" : "center"}>
                <NoContent display={transactions.length > 0 ? "none" : "flex"}>
                    Não há registros de <br /> entrada ou saída
                </NoContent>
                {transactions.map((t) => <Transaction transaction={t} />)}
            </History>
            <Buttons>
                <AddTransaction onClick={() => console.log("oi")}>
                    <PlusIcon />
                    <p> Nova <br /> entrada </p>
                </AddTransaction>
                <AddTransaction onClick={() => console.log("xau")}>
                    <MinusIcon />
                    <p> Nova <br /> saída </p>
                </AddTransaction>
            </Buttons>
        </Container>
    )
}

function Transaction({ transaction }) {
    return (
        <Element>
            <Date>{transaction.date}</Date>
            <h1 onClick={() => console.log(`Editar ${transaction._id}`)}>{transaction.name}</h1>
            <Value color={transaction.type === "entrance" ? "#03AC00" : "#C70000"}>{transaction.value}</Value>
            <CrossIcon onClick={() => console.log(`Deletar ${transaction._id}`)} />
        </Element>
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
`;

const NoContent = styled.p`
    font-size: 20px;
    color: #868686;
    text-align: center;
    display: ${props => props.display}
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