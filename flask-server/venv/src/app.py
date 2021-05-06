from flask import Flask, request
from cassandra.cluster import Cluster
from cassandra.util import Date

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Cassandra API OK'

@app.route('/getUserTransfers', methods=['post'])
def getUsersTransfers():
    data = request.get_json()
    account1 = data['account1']
    print(account1)
    cui = account1[0]
    institucion = account1[6]
    tipo_cuenta = account1[7]
    cluster = Cluster(contact_points=['127.0.0.1'], port=9042)
    session = cluster.connect()
    session.execute('use sist2;')
    cqlCommand = f'''
    select * 
    from operaciones_cuentahabiente
    where cui1 =  \'{cui}\'
    and instituicion1 = \'{institucion}\'
    and tipo_cuenta1 = \'{tipo_cuenta}\'
    allow filtering ;
    '''
    result = session.execute(cqlCommand)
    rows = []

    for row in result:
        t = {
            'cui1': row.cui1,
            'nombre1': row.nombre1,
            'apellido1': row.apellido1,
            'email1': row.email1,
            'fecha_registro1': row.fecha_registro1.date().strftime("%d/%m/%Y"),
            'genero1': row.genero1,
            'instituicion1': row.instituicion1,
            'tipo_cuenta1': row.tipo_cuenta1,
            'fecha_operacion': row.fecha_operacion.date().strftime("%d/%m/%Y %H:%M:%S"),
            'cui2': row.cui2,
            'nombre2': row.nombre2,
            'apellido2': row.apellido2,
            'email2': row.email2,
            'fecha_registro2': row.fecha_registro2.date().strftime("%d/%m/%Y"),
            'genero2': row.genero2,
            'instituicion2': row.instituicion2,
            'tipo_cuenta2': row.tipo_cuenta2,
            'monto': row.monto,
            'tipo' : 'Débito'
        }
        rows.append(t)
    
    cqlCommand = f'''
    select * 
    from operaciones_cuentahabiente
    where cui2 =  \'{cui}\'
    and instituicion2 = \'{institucion}\'
    and tipo_cuenta2 = \'{tipo_cuenta}\'
    allow filtering ;
    '''
    result = session.execute(cqlCommand)
    for row in result:
        t = {
            'cui2': row.cui1,
            'nombre2': row.nombre1,
            'apellido2': row.apellido1,
            'email2': row.email1,
            'fecha_registro2': row.fecha_registro1.date().strftime("%d/%m/%Y"),
            'genero2': row.genero1,
            'instituicion2': row.instituicion1,
            'tipo_cuenta2': row.tipo_cuenta1,
            'fecha_operacion': row.fecha_operacion.date().strftime("%d/%m/%Y %H:%M:%S"),
            'cui1': row.cui2,
            'nombre1': row.nombre2,
            'apellido1': row.apellido2,
            'email1': row.email2,
            'fecha_registro1': row.fecha_registro2.date().strftime("%d/%m/%Y"),
            'genero1': row.genero2,
            'instituicion1': row.instituicion2,
            'tipo_cuenta1': row.tipo_cuenta2,
            'monto': row.monto,
            'tipo' : 'Crédito'
        }
        rows.append(t)
    
    return {'result': rows}

@app.route('/getUserAccounts')
def getUsers():
    cluster = Cluster(contact_points=['127.0.0.1'], port=9042)
    session = cluster.connect()
    session.execute('use sist2;')
    result = session.execute('select * from cuentahabientes;')
    rows = []

    for row in result:
        t = {
            'cui' : row.cui,
            'nombre' : row.nombre,
            'apellido' : row.apellido,
            'email' : row.email,
            'fecha_registro' : row.fecha_registro.date().strftime("%d/%m/%Y"),
            'genero' : row.genero,
            'instituicion' : row.instituicion,
            'tipo_cuenta' : row.tipo_cuenta,
            'saldo' : row.saldo,
        }
        rows.append(t)
    return {'result': rows}

@app.route('/getBankAccounts')
def getBankAccounts():
    cluster = Cluster(contact_points=['127.0.0.1'], port=9042)
    session = cluster.connect()
    session.execute('use sist2;')
    result = session.execute('select * from instituiciones;')
    rows = []

    for row in result:
        t = {
            'nombre' : row.nombre,
            'abreviacion' : row.abreviacion
        }
        rows.append(t)
    return {'result': rows}

@app.route('/transfer', methods=['POST'])
def transfer():
    data = request.get_json()
    account1 = data['account1'].split(',')
    account2 = data['account2'].split(',')
    cui1 = account1[0]
    nombre1 = account1[1]
    apellido1 = account1[2]
    email1 = account1[3]
    f1 = account1[4].split('/')
    fecha_registro1 = f'{f1[2]}-{f1[1]}-{f1[0]}'
    genero1 = account1[5]
    instituicion1 = account1[6]
    tipo_cuenta1 = account1[7]
    monto1 = account1[8]
    cui2 = account2[0]
    nombre2 = account2[1]
    apellido2 = account2[2]
    email2 = account2[3]
    f2 = account2[4].split('/')
    fecha_registro2 =  f'{f2[2]}-{f2[1]}-{f2[0]}'
    genero2 = account2[5]
    instituicion2 = account2[6]
    tipo_cuenta2 = account2[7]
    monto2 = account2[8]
    amount = data['amount']
    cluster = Cluster(contact_points=['127.0.0.1'], port=9042)
    session = cluster.connect()
    session.execute('use sist2;')
    cqlComand = f'''
    insert into operaciones_cuentahabiente(fecha_operacion,cui1,nombre1,apellido1,email1,fecha_registro1,genero1,instituicion1,tipo_cuenta1,
                                            cui2,nombre2,apellido2,email2,fecha_registro2,genero2,instituicion2,tipo_cuenta2,monto)
    values(toTimeStamp(now()),\'{cui1}\',\'{nombre1}\',\'{apellido1}\',\'{email1}\',\'{fecha_registro1}\',\'{genero1}\',\'{instituicion1}\',\'{tipo_cuenta1}\',\'{
            cui2}\',\'{nombre2}\',\'{apellido2}\',\'{email2}\',\'{fecha_registro2}\',\'{genero2}\',\'{instituicion2}\',\'{tipo_cuenta2}\',{amount});'''
    result = session.execute(cqlComand)
    #update accounts
    amount1 = float(monto1) - amount
    amount2 = float(monto2) + amount
    updateComand1 = f'''
        update cuentahabientes set saldo = {amount1}
        where cui = \'{cui1}\'
        and nombre = \'{nombre1}\'
        and apellido = \'{apellido1}\'
        and email = \'{email1}\'
        and fecha_registro = \'{fecha_registro1}\'
        and genero = \'{genero1}\'
        and instituicion = \'{instituicion1}\'
        and tipo_cuenta = \'{tipo_cuenta1}\';
    '''
    result1 = session.execute(updateComand1)

    updateComand2 = f'''
        update cuentahabientes set saldo = {amount2}
        where cui = \'{cui2}\'
        and nombre = \'{nombre2}\'
        and apellido = \'{apellido2}\'
        and email = \'{email2}\'
        and fecha_registro = \'{fecha_registro2}\'
        and genero = \'{genero2}\'
        and instituicion = \'{instituicion2}\'
        and tipo_cuenta = \'{tipo_cuenta2}\' ;
    '''
    result2 = session.execute(updateComand2)
    return {'result':'transfering'}

@app.route('/getBankTransfers', methods=['post'])
def getBankTransfers():
    data = request.get_json()
    bank1 = data['bank1']
    bankName = bank1
    print(bankName)
    cluster = Cluster(contact_points=['127.0.0.1'], port=9042)
    session = cluster.connect()
    session.execute('use sist2;')
    cqlCommand = f'''
    select * 
    from operaciones_institucion
    where instituicion1 =  \'{bankName}\'
    allow filtering ;
    '''
    result = session.execute(cqlCommand)
    rows = []

    for row in result:
        t = {
            'fecha_operacion': row.fecha_operacion,
            'instituicion1': row.instituicion1,
            'instituicion2': row.instituicion2,
            'monto': row.monto,
            'tipo' : 'Débito'
        }
        rows.append(t)
    
    cqlCommand = f'''
    select * 
    from operaciones_institucion
    where instituicion2 =  \'{bankName}\'
    allow filtering ;
    '''
    result = session.execute(cqlCommand)
    for row in result:
        t = {
            'fecha_operacion': row.fecha_operacion,
            'instituicion2': row.instituicion1,
            'instituicion1': row.instituicion2,
            'monto': row.monto,
            'tipo' : 'Crédito'
        }
        rows.append(t)
    
    return {'result': rows}

@app.route('/getUserTransfersByDate', methods=['post'])
def getUserTransfersByDate():
    data = request.get_json()
    date1 = data['date1']
    date2 = data['date2']
    account = data['account'].split(',')
    print(account)
    cui = account[0]
    institucion = account[6]
    tipo_cuenta = account[7]
    cluster = Cluster(contact_points=['127.0.0.1'], port=9042)
    session = cluster.connect()
    session.execute('use sist2;')
    cqlCommand = f'''
    select * 
    from operaciones_cuentahabiente
    where cui1 = \'{cui}\'
    and instituicion1 = \'{institucion}\'
    and tipo_cuenta1 = \'{tipo_cuenta}\'
    and fecha_operacion >= \'{date1}\'
    and fecha_operacion <= \'{date2}\'
    allow filtering ;
    '''
    result = session.execute(cqlCommand)
    #print(cqlCommand)

    rows = []

    for row in result:
        t = {
            'cui2': row.cui1,
            'nombre2': row.nombre1,
            'apellido2': row.apellido1,
            'email2': row.email1,
            'fecha_registro2': row.fecha_registro1.date().strftime("%d/%m/%Y"),
            'genero2': row.genero1,
            'instituicion2': row.instituicion1,
            'tipo_cuenta2': row.tipo_cuenta1,
            'fecha_operacion': row.fecha_operacion.date().strftime("%d/%m/%Y %H:%M:%S"),
            'cui1': row.cui2,
            'nombre1': row.nombre2,
            'apellido1': row.apellido2,
            'email1': row.email2,
            'fecha_registro1': row.fecha_registro2.date().strftime("%d/%m/%Y"),
            'genero1': row.genero2,
            'instituicion1': row.instituicion2,
            'tipo_cuenta1': row.tipo_cuenta2,
            'monto': row.monto,
            'tipo' : 'Débito'
        }
        rows.append(t)
    
    cqlCommand = f'''
    select * 
    from operaciones_cuentahabiente
    where cui2 = \'{cui}\'
    and instituicion2 = \'{institucion}\'
    and tipo_cuenta2 = \'{tipo_cuenta}\'
    and fecha_operacion >= \'{date1}\'
    and fecha_operacion <= \'{date2}\'
    allow filtering ;
    '''
    result = session.execute(cqlCommand)
    #print(cqlCommand)

    for row in result:
        t = {
            'cui2': row.cui1,
            'nombre2': row.nombre1,
            'apellido2': row.apellido1,
            'email2': row.email1,
            'fecha_registro2': row.fecha_registro1.date().strftime("%d/%m/%Y"),
            'genero2': row.genero1,
            'instituicion2': row.instituicion1,
            'tipo_cuenta2': row.tipo_cuenta1,
            'fecha_operacion': row.fecha_operacion.date().strftime("%d/%m/%Y %H:%M:%S"),
            'cui1': row.cui2,
            'nombre1': row.nombre2,
            'apellido1': row.apellido2,
            'email1': row.email2,
            'fecha_registro1': row.fecha_registro2.date().strftime("%d/%m/%Y"),
            'genero1': row.genero2,
            'instituicion1': row.instituicion2,
            'tipo_cuenta1': row.tipo_cuenta2,
            'monto': row.monto,
            'tipo' : 'Crédito'
        }
        rows.append(t)

    return {'result': rows}