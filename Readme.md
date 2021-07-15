```js

app.use((req, res, next)  => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});




let connection;
const handleDisconnect = () => {
    connection = mysql.createConnection({
        host: '',
        user: '',
        password: '',
        database: '',
        port: 1111
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
```