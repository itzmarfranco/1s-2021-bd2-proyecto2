import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom"
import UserTransfer from './UserTransfer'
import Report1 from './Report1'
import Report2 from './Report2'
import Report3 from './Report3'
import Report4 from './Report4'
import Report5 from './Report5'

function SistApp() {
    return (
        <Router>
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/transferir">Realizar transferencia</Link></li>
                <li><Link to="/reporte1">Reporte 1</Link></li>
                <li><Link to="/reporte2">Reporte 2</Link></li>
                <li><Link to="/reporte3">Reporte 3</Link></li>
                <li><Link to="/reporte4">Reporte 4</Link></li>
                <li><Link to="/reporte5">Reporte 5</Link></li>
            </ul>
            <Switch>
                <Route exact path="/">
                    Inicio
                </Route>
                <Route exact path="/transferir">
                    <UserTransfer></UserTransfer>
                </Route>
                <Route exact path="/reporte1">
                    <Report1></Report1>
                </Route>
                <Route exact path="/reporte2">
                    <Report2></Report2>
                </Route>
                <Route exact path="/reporte3">
                    <Report3></Report3>
                </Route>
                <Route exact path="/reporte4">
                    <Report4></Report4>
                </Route>
                <Route exact path="/reporte5">
                    <Report5></Report5>
                </Route>                
            </Switch>
        </Router>
    )
}

export default SistApp
