import React from 'react'
import {useEffect, useState} from 'react'

function Report2() {
    const [banks, setBanks] = useState([]);
    const [bank, setBank] = useState('');
    const [transfers, setTransfers] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/getBankAccounts')
          .then(results => results.json())
          .then(data => {
            let c = data['result']
            setBanks(c)
          });
      }, []);

    const selectChange = (e) => {
        let bank = e.target.value.toString()
        setBank(bank)
    }

    const query = (e) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({bank1: bank})
        };
        fetch('http://127.0.0.1:5000/getBankTransfers', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data['result'])
                setTransfers(data['result'])
            });
    }

    return (
        <div>
            Seleccione un banco 
            <select onChange={selectChange}>
                {banks.map(c => {
                    return (<option
                        value={c['nombre']}>
                        {c['nombre'] + ' - ' + c['abreviacion']}
                        </option>)
                })}
            </select>
            <button onClick={query}>Consultar</button>
            <br/>
            <table>
                <tr>
                    <td>Fecha de operación</td>
                    <td>Tipo</td>
                    <td>Institución</td>
                    <td>Monto</td>
                </tr>
                {
                    transfers.map(t => {
                        return (
                            <tr>
                                <td>{t['fecha_operacion']}</td>
                                <td>{t['tipo']}</td>
                                <td>{t['instituicion1']}</td>
                                <td>{t['monto']}</td>
                            </tr>
                        )
                    })
                }
            </table>
        </div>
    )
}

export default Report2
