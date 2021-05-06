import React from 'react'
import {useEffect, useState} from 'react'

function Report5() {

    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
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

      const query = (e) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({date1: startDate, date2: endDate, account: account})
        };
        fetch('http://127.0.0.1:5000/getUserTransfersByDate', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data['result'])
                setTransfers(data['result'])
            });
      }

      const changeDate1 = (e) => {
          setStartDate(e.target.value)
          console.log(e.target.value)
      }

      const changeDate2 = (e) => {
        setEndDate(e.target.value)
        console.log(e.target.value)
    }

    const changeSelect = (e) => {
        setAccount(e.target.value)
        console.log(e.target.value)
    }

    return (
        <div>
            Fecha inicial
            <input onChange={changeDate1} type='Date'></input>
            <br/>
            Fecha final
            <input onChange={changeDate2} type='Date'></input>
            <br/>
            <select onChange={changeSelect}>
                {
                    accounts.map(a => {
                        return (
                            <option
                            value={a['cui']+','+ a['nombre']+','+ a['apellido']+','+a['email']+','+a['fecha_registro']+','+a['genero']+','+a['instituicion']+','+a['tipo_cuenta']+','+a['saldo']}>
                            {a['cui'] + ' - ' + a['nombre'] + ' ' + a['apellido'] + ', '+ a['instituicion']+ ', ' + a['tipo_cuenta']}
                            </option>
                        )
                    })
                }
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
                            </tr>
                            )
                        })
                    }
            </table>
        </div>
    )
}

export default Report5
