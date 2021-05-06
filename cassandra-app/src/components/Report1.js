import React from 'react'
import {useEffect, useState} from 'react'

function Report1() {
    // get all users
    const [accounts, setAccounts] = useState([]);
    const [account, setAccount] = useState([]);
    const [transfers, setTransfers] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/getUserAccounts')
          .then(results => results.json())
          .then(data => {
            let c = data['result']
            setAccounts(c)
          });
      }, []);

    const select1Change = (e) => {
        let acc = e.target.value.toString().split(',')
        setAccount(acc)
        //console.log(acc)
    }

    const query = (e) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({account1: account})
        };
        fetch('http://127.0.0.1:5000/getUserTransfers', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data['result'])
                setTransfers(data['result'])
            });

    }

    return (
        <div>
            Seleccione cuenta 
            <select onChange={select1Change}>
                {accounts.map(c => {
                    return (<option
                        value={c['cui']+','+ c['nombre']+','+ c['apellido']+','+c['email']+','+c['fecha_registro']+','+c['genero']+','+c['instituicion']+','+c['tipo_cuenta']+','+c['saldo']}>
                        {c['cui'] + ' - ' + c['nombre'] + ' ' + c['apellido'] + ', '+ c['instituicion']+ ', ' + c['tipo_cuenta']}
                        </option>)
                })}
            </select>
            <button onClick={query}>Consultar</button>
            <br/>
            <table>
                <tr>
                    <td>Tipo</td>
                    <td>CUI</td>
                    <td>Nombre</td>
                    <td>Apellido</td>
                    <td>Email</td>
                    <td>Fecha de registro</td>
                    <td>Genero</td>
                    <td>Institución</td>
                    <td>Tipo de cuenta</td>
                    <td>Monto</td>
                </tr>
                {
                    transfers.map(t => {
                        return (<tr>
                                    <td>{t['tipo']}</td>
                                    <td>{t['cui2']}</td>
                                    <td>{t['nombre2']}</td>
                                    <td>{t['apellido2']}</td>
                                    <td>{t['email2']}</td>
                                    <td>{t['fecha_registro2']}</td>
                                    <td>{t['genero2']}</td>
                                    <td>{t['instituicion2']}</td>
                                    <td>{t['tipo_cuenta2']}</td>
                                    <td>{t['monto']}</td>
                                </tr>)
                    })
                }
            </table>
        </div>
    )
}

export default Report1
