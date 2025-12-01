const express = require('express');
const employersRouter = require('./router/employersRouter.js');

const cookieParser = require('cookie-parser');
const { checkAuth } = require('./middleware/auth.js');

const path = require('path'); // 1. Importando 'path'

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(cookieParser());

//para a rota de proteção da pasta restrict posso me basear nesta rota de publico..
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages','index.html'));
});

app.use('/alunos',employersRouter);
app.use("/uploads", express.static(__dirname + "/restrict/uploads"));


app.use('/restrict', checkAuth, express.static(path.join(__dirname, 'restrict')));

app.get('/portal', checkAuth, (req, res) => {
    const role = req.user.role; // valor confirmado pelo backend

    let targetFile = '';

    if (role === 'aluno') {
        targetFile = 'portalAluno.html';
    } else if (role === 'empresa') {
        targetFile = 'portalEmpresa.html';
    } else if (role === 'gerente') {
        targetFile = 'portalGerente.html';
    } else {
        return res.status(403).send('Role inválida');
    }

    res.sendFile(path.join(__dirname, 'restrict', targetFile));
});


app.listen(PORT,()=>{
    console.log(`  server rodando em http://localhost:${PORT}`);
    console.log(`  API rodando em: http://localhost:${PORT}/alunos`);
})