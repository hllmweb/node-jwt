//index.js
//require("dotenv-safe").config({path: __dirname + '/.env'});
require('dotenv').config({path: __dirname + '/.env'});
const jwt = require('jsonwebtoken');
const http = require('http'); 
const express = require('express'); 
const app = express(); 
 
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.json({message: "Tudo ok por aqui!"});
})

// app.get('/clientes', (req, res, next) => { 
//     console.log("Retornou todos clientes!");
//     res.json([{id:1,nome:'hugo'}]);
// }) 

//função de verificação JWT para autenticação do usuário
function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
}

// rota protegida com JWT
app.get('/clientes', verifyJWT, (req, res, next) => { 
    console.log(`${req.userId}`)
    console.log("Retornou todos clientes!");
    res.json([{id:1,nome:'hugo'}]);
})


//authentication
app.post('/login', (req, res, next) => {
    //esse teste abaixo deve ser feito no seu banco de dados
    if(req.body.user === 'hugo' && req.body.password === '123'){
      //auth ok
      const id = 1; //esse id viria do banco de dados
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 300 // expires in 5min
      });
      return res.json({ auth: true, token: token });
    }
    
    res.status(500).json({message: 'Login inválido!'});
})


app.post('/logout', function(req, res) {
    res.end();
})

const server = http.createServer(app); 
server.listen(3000);
console.log("Servidor escutando na porta 3000...")