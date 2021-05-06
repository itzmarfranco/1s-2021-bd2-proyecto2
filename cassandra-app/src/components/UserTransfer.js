import React from 'react'
import {useEffect, useState} from 'react'

function UserTransfer() {

    const [accounts, setAccounts] = useState([]);
    const [account1, setAccount1] = useState([]);
    const [account2, setAccount2] = useState([]);
    const [amount, setAmount] = useState(0.0);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/getUserAccounts')
          .then(results => results.json())
          .then(data => {
            let c = data['result']
            setAccounts(c)
          });
      }, []);

    const select1Change = (e) => {
        setAccount1(e.target.value)
        console.log(e.target.value)
    }

    const select2Change = (e) => {
        setAccount2(e.target.value)
        console.log(e.target.value)
    }

    const onAmountChange = (e) => {
        setAmount(parseFloat(e.target.value))
        //console.log(e.target.value)
    }

    const transfer = (e) => {
        let balance1 = parseFloat(account1.split(',')[8])
        if(balance1 < amount){
            // error
            console.log(balance1)
            console.log(amount)
        }
        else{
            //transfer
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account1: account1, account2 : account2, amount: amount})
            };
            fetch('http://127.0.0.1:5000/transfer', requestOptions)
                .then(response => response.json())
                .then(data => console.log(data));
        
        }
        console.log('transfering from &'+ account1 + '& to &' + account2 + '& the amount of '+ amount)
    }

    return (
        <div>
            Fuente
            <select onChange={select1Change}>
                {accounts.map(c => {
                    return (<option
                        value={c['cui']+','+ c['nombre']+','+ c['apellido']+','+c['email']+','+c['fecha_registro']+','+c['genero']+','+c['instituicion']+','+c['tipo_cuenta']+','+c['saldo']}>
                        {c['cui'] + ' - ' + c['nombre'] + ' ' + c['apellido'] + ', '+ c['instituicion']+ ', ' + c['tipo_cuenta']}
                        </option>)
                })}
            </select>
            <br/>
            Destino
            <select onChange={select2Change}>
                {accounts.map(c => {
                    return (<option
                        value={c['cui']+','+ c['nombre']+','+ c['apellido']+','+c['email']+','+c['fecha_registro']+','+c['genero']+','+c['instituicion']+','+c['tipo_cuenta']+','+c['saldo']}>
                    {c['cui'] + ' - ' + c['nombre'] + ' ' + c['apellido'] + ', '+ c['instituicion']+ ', ' + c['tipo_cuenta']}</option>)
                })}
            </select>
            <br/>
            Monto
            <input onChange={onAmountChange} type='number'></input>
            <br/>
            <button onClick={transfer}>Tranferir</button>
        </div>
    )
}

export default UserTransfer
