const express = require('express');
const mysql = require('mysql');

const app = express();

const PORT = process.env.PORT || 3500;

let connection;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//ruta get /
app.get('/', (req, res) => {
    res.send('Servidor en funcionamiento');
})

//ruta get /empleados/
app.get('/empleados/', (req, res) => {
    const sql = 'SELECT * FROM EMPLEADOS';
    connection.query(sql, (error, result) => {
        if(result.length > 0){
            const data = result.map(item => {
                return ({
                    id: item.id,
                    dni: item.dni ,
                    nombre: item.nombre,
                    apellido_paterno: item.apellido_paterno,
                    apellido_materno: item.apellido_materno ,
                    edad: item.edad,
                    localidad: item.localidad,
                    nacionalidad: item.nacionalidad 
                })
            })
            const info = {
                date_query: new Date().toLocaleString(),
                results: data
            }
            res.send(info);
        }else{
            res.send('No hay results');
        }
    });
})

//ruta get /empleados/:id
app.get('/empleados/:id', (req, res) =>{
    const {id} = req.params;
    const sql = `SELECT * FROM EMPLEADOS WHERE id = ${parseInt(id)}`;
    connection.query(sql, (error, result) => {
        if(result.length != 0){
            res.send(result);
        }else{
            res.send(`No existe un empleado con el id:  ${id}.`);
        }
    })
})

// se agrega handledisconnect para hacer el fix del connection lost

const handleDisconnect = () => {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'apiempleados',
        port: 3307
    });

    connection.connect(function (err) {
        if (err) {
            setTimeout(handleDisconnect, 1000);
        }
    });
    
    connection.on('error', function (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 
            handleDisconnect();                         
        } else {                                      
            throw err;                                 
        }
    });
}

try {
    handleDisconnect();
} catch (error) {
    console.log("-----------------------------------------------" + error)
}
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})