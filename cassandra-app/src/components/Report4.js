import React from 'react'
import {useEffect, useState} from 'react'

function Report4() {
    const [banks, setBanks] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/getBankAccounts')
          .then(results => results.json())
          .then(data => {
            let c = data['result']
            setBanks(c)
          });
      }, []);

    return (
        <div>
            <table>
                <tr>
                    <td>Institución</td>
                    <td>Abreviatura</td>
                </tr>
                {
                    banks.map(b => {
                        return (
                            <tr>
                                <td>{b['nombre']}</td>
                                <td>{b['abreviacion']}</td>
                            </tr>
                        )
                    })
                }
            </table>
        </div>
    )
}

export default Report4
