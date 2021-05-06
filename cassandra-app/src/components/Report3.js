import React from 'react'
import {useEffect, useState} from 'react'

function Report3() {
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/getUserAccounts')
          .then(results => results.json())
          .then(data => {
            let c = data['result']
            setAccounts(c)
          });
      }, []);

    return (
        <div>
            <table>
                <tr>
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
                    accounts.map(a => {
                        return (
                            <tr>
                                <td>{a['cui']}</td>
                                <td>{a['nombre']}</td>
                                <td>{a['apellido']}</td>
                                <td>{a['email']}</td>
                                <td>{a['fecha_registro']}</td>
                                <td>{a['genero']}</td>
                                <td>{a['instituicion']}</td>
                                <td>{a['tipo_cuenta']}</td>
                                <td>{a['saldo']}</td>
                            </tr>
                        )
                    })
                }
            </table>
        </div>
    )
}

export default Report3
