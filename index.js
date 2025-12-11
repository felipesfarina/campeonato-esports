import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host = "0.0.0.0";
const porta = 3000;
var listaEquipes = [];
var listaJogadores = [];

const server = express();

server.use(session({
    secret:"Minh4Ch4v3S3cr3t4",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}));

server.use(express.urlencoded({extended: true}));

server.use(cookieParser());

server.get("/login", (requisicao, resposta) => {
    resposta.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <title>Login</title>
                <style>
                    body {
                        background-color: #f0f2f5;
                    }
                    .login-box {
                        background-color: white;
                        border-radius: 10px;
                        padding: 40px;
                        margin-top: 100px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-5">
                            <div class="login-box">
                                <h2 class="text-center mb-4">Login</h2>
                                <form action='/login' method='POST'>
                                    <div class="mb-3">
                                        <label for="usuario" class="form-label">Usuário</label>
                                        <input type="text" class="form-control" id="usuario" name="usuario">
                                    </div> 
                                    <div class="mb-3">
                                        <label for="senha" class="form-label">Senha</label>
                                        <input type="password" class="form-control" id="senha" name="senha">
                                    </div>
                                    <div class="d-grid">
                                        <button class="btn btn-primary btn-lg" type="submit">Entrar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                    crossorigin="anonymous"></script>
            </body>
        </html>
    `);
});

server.post("/login", (requisicao, resposta) => {
    const {usuario, senha} = requisicao.body;

    if (usuario === "admin" && senha === "admin"){
        requisicao.session.dadosLogin= {
            nome: "Administrador", 
            logado: true
        };
        resposta.redirect("/");
    } else {
        resposta.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <title>Login</title>
                <style>
                    body {
                        background-color: #f0f2f5;
                    }
                    .login-box {
                        background-color: white;
                        border-radius: 10px;
                        padding: 40px;
                        margin-top: 100px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-5">
                            <div class="login-box">
                                <h2 class="text-center mb-4">Login</h2>
                                <form action='/login' method='POST'>
                                    <div class="mb-3">
                                        <label for="usuario" class="form-label">Usuário</label>
                                        <input type="text" class="form-control" id="usuario" name="usuario">
                                    </div>
                                    <div class="mb-3">
                                        <label for="senha" class="form-label">Senha</label>
                                        <input type="password" class="form-control" id="senha" name="senha">
                                    </div>
                                    <div class="alert alert-danger" role="alert">
                                        Usuário ou senha inválidos
                                    </div>
                                    <div class="d-grid">
                                        <button class="btn btn-primary btn-lg" type="submit">Entrar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                    crossorigin="anonymous"></script>
            </body>
        </html>
        `);
    }
    
});

server.get("/", verificarUsuarioLogado, (requisicao, resposta) => {
    let ultimoAcesso = requisicao.cookies?.ultimoAcesso;

    const data = new Date();
    resposta.cookie("ultimoAcesso",data.toLocaleString());
    resposta.setHeader("Content-Type", "text/html");
    resposta.write(`
        <DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <title>Campeonato de E-Sports</title>
                <style>
                    .navbar {
                        background-color: #0d6efd !important;
                    }
                    .navbar-brand, .nav-link {
                        color: white !important;
                        font-weight: 500;
                    }
                    .nav-link:hover {
                        color: #e0e0e0 !important;
                    }
                </style>
            </head>
            <body>
                <nav class="navbar navbar-expand-lg navbar-dark">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#"><img src="https://www.rw-designer.com/icon-image/21516-256x256x32.png" alt="LOL" height="30" class="me-2">Campeonato de E-Sports</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Cadastros
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="/cadastroEquipe">Equipes</a></li>
                            <li><a class="dropdown-item" href="/cadastroJogador">Jogadores</a></li>
                            <li><a class="dropdown-item" href="/listarEquipes">Listar Equipes</a></li>
                            <li><a class="dropdown-item" href="/listarJogadores">Listar Jogadores</a></li>
                        </ul>
                        </li>
                    </ul>
                    <ul class="navbar-nav">
                        <li class="nav-item">
                        <a class="nav-link" href="/logout">Sair</a>
                        </li>
                    </ul>
                    </div>
                </div>
                </nav>
                <div class="container mt-4">
                    <div class="alert alert-info">
                        <p class="mb-0">Último acesso: ${ultimoAcesso || "Primeiro acesso"}</p>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h2 class="card-title">Bem-vindo ao Sistema de Gerenciamento</h2>
                            <p class="card-text">Sistema para organização do Campeonato Amador de League of Legends</p>
                            <hr>
                    </div>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>
    `);

    
    resposta.end();
});

server.get("/cadastroEquipe", verificarUsuarioLogado,(requisicao,resposta) => {
    resposta.send(`
        <DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <title>Cadastro de Equipe</title>
            </head>
            <body>
                <div class="container">
                    <h1 class="text-center border m-3 p-3 text-white" style="background-color: #0d6efd;">Cadastro de Equipes</h1>
                    <form method="POST" action="/adicionarEquipe" class="row g-3 m-3 p-3 bg-light">
                            <div class="col-md-6">
                                <label for="nomeEquipe" class="form-label">Nome da Equipe</label>
                                <input type="text" class="form-control" id="nomeEquipe" name="nomeEquipe">
                            </div>
                            <div class="col-md-6">
                                <label for="nomeCapitao" class="form-label">Nome do Capitão</label>
                                <input type="text" class="form-control" id="nomeCapitao" name="nomeCapitao">
                            </div>
                            <div class="col-md-6">
                                <label for="telefone" class="form-label">Telefone/WhatsApp do Capitão</label>
                                <input type="text" class="form-control" id="telefone" name="telefone">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" type="submit">Cadastrar</button>
                                <a class="btn btn-secondary" href="/">Voltar</a>
                            </div>
                    </form>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>

    `);
})

server.post('/adicionarEquipe', verificarUsuarioLogado, (requisicao, resposta) => {
    const nomeEquipe = requisicao.body.nomeEquipe;
    const nomeCapitao = requisicao.body.nomeCapitao;
    const telefone = requisicao.body.telefone;

    if (nomeEquipe && nomeCapitao && telefone){

        listaEquipes.push({nomeEquipe, nomeCapitao, telefone});
        resposta.redirect("/listarEquipes");
    }
    else{

        let conteudo = `
        
        <DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <title>Cadastro de Equipe</title>
            </head>
            <body>
                <div class="container">
                    <h1 class="text-center border m-3 p-3 bg-light">Cadastro de Equipes</h1>
                    <form method="POST" action="/adicionarEquipe" class="row g-3 m-3 p-3 bg-light">
                            <div class="col-md-6">
                                <label for="nomeEquipe" class="form-label">Nome da Equipe</label>
                                <input type="text" class="form-control" id="nomeEquipe" name="nomeEquipe" value="${nomeEquipe}">
                            `;
        if (!nomeEquipe){
            conteudo += `
            <div>
                <p class="text-danger">Por favor, informe o nome da equipe</p>
            </div>
        `
        }

        conteudo += `</div>
                            <div class="col-md-6">
                                <label for="nomeCapitao" class="form-label">Nome do Capitão</label>
                                <input type="text" class="form-control" id="nomeCapitao" name="nomeCapitao" value="${nomeCapitao}">
                            `
        if (!nomeCapitao){
        
        conteudo += `
            <div>
                <p class="text-danger">Por favor, informe o nome do capitão</p>
            </div>
        `;
        }

        conteudo+= `</div>
                            <div class="col-md-6">
                                <label for="telefone" class="form-label">Telefone/WhatsApp do Capitão</label>
                                <input type="text" class="form-control" id="telefone" name="telefone" value="${telefone}">
                            `;
        if (!telefone){

            conteudo += `
                <div>
                    <p class="text-danger">Por favor, informe o telefone do capitão</p>
                </div>
            `;
        }

        conteudo += `</div>
                            <div class="col-12">
                                <button class="btn btn-primary" type="submit">Cadastrar</button>
                                <a class="btn btn-secondary" href="/">Voltar</a>
                            </div>
                    </form>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>
        
        `;

        resposta.send(conteudo);

    }

    });

server.get("/listarEquipes", verificarUsuarioLogado,(requisicao, resposta) => {
    let conteudo = `
        <DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <title>Lista de Equipes</title>
            </head>
            <body>
                <div class="container">
                    <h1 class="text-center border m-3 p-3 bg-light">Lista de Equipes</h1>
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Nome da Equipe</th>
                                <th>Nome do Capitão</th>
                                <th>Telefone/WhatsApp</th>
                            </tr>
                        </thead>
                        <tbody>`;
    for (let i = 0; i < listaEquipes.length; i++) {
        conteudo += `
            <tr>
                <td>${listaEquipes[i].nomeEquipe}</td>
                <td>${listaEquipes[i].nomeCapitao}</td>
                <td>${listaEquipes[i].telefone}</td>
            </tr>
        `;
    }
    conteudo+=`
                        </tbody>
                    </table>
                    <a class="btn btn-secondary" href="/cadastroEquipe">Voltar</a>
                    <a class="btn btn-primary" href="/">Menu</a>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>
    `
    resposta.send(conteudo);
});

server.get("/cadastroJogador", verificarUsuarioLogado,(requisicao,resposta) => {
    let opcoesEquipes = "";
    for (let i = 0; i < listaEquipes.length; i++) {
        opcoesEquipes += `<option value="${listaEquipes[i].nomeEquipe}">${listaEquipes[i].nomeEquipe}</option>`;
    }

    resposta.send(`
        <DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <title>Cadastro de Jogador</title>
            </head>
            <body>
                <div class="container">
                    <h1 class="text-center border m-3 p-3 text-white" style="background-color: #0d6efd;">Cadastro de Jogadores</h1>
                    <form method="POST" action="/adicionarJogador" class="row g-3 m-3 p-3 bg-light">
                            <div class="col-md-6">
                                <label for="nomeJogador" class="form-label">Nome do Jogador</label>
                                <input type="text" class="form-control" id="nomeJogador" name="nomeJogador">
                            </div>
                            <div class="col-md-6">
                                <label for="nickname" class="form-label">Nickname In-Game</label>
                                <input type="text" class="form-control" id="nickname" name="nickname">
                            </div>
                            <div class="col-md-4">
                                <label for="funcao" class="form-label">Função</label>
                                <select class="form-select" id="funcao" name="funcao">
                                    <option selected disabled value="">Escolha uma função...</option>
                                    <option value="Top">Top</option>
                                    <option value="Jungle">Jungle</option>
                                    <option value="Mid">Mid</option>
                                    <option value="Atirador">Atirador</option>
                                    <option value="Suporte">Suporte</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label for="elo" class="form-label">Elo</label>
                                <select class="form-select" id="elo" name="elo">
                                    <option selected disabled value="">Escolha um elo...</option>
                                    <option value="Ferro">Ferro</option>
                                    <option value="Bronze">Bronze</option>
                                    <option value="Prata">Prata</option>
                                    <option value="Ouro">Ouro</option>
                                    <option value="Platina">Platina</option>
                                    <option value="Esmeralda">Esmeralda</option>
                                    <option value="Diamante">Diamante</option>
                                    <option value="Mestre">Mestre</option>
                                    <option value="Grão-Mestre">Grão-Mestre</option>
                                    <option value="Desafiante">Desafiante</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label for="genero" class="form-label">Gênero</label>
                                <select class="form-select" id="genero" name="genero">
                                    <option selected disabled value="">Escolha um gênero...</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="equipe" class="form-label">Equipe</label>
                                <select class="form-select" id="equipe" name="equipe">
                                    <option selected disabled value="">Escolha uma equipe...</option>
                                    ${opcoesEquipes}
                                </select>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" type="submit">Cadastrar</button>
                                <a class="btn btn-secondary" href="/">Voltar</a>
                            </div>
                    </form>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>

    `);
})

server.post('/adicionarJogador', verificarUsuarioLogado, (requisicao, resposta) => {
    const nomeJogador = requisicao.body.nomeJogador;
    const nickname = requisicao.body.nickname;
    const funcao = requisicao.body.funcao;
    const elo = requisicao.body.elo;
    const genero = requisicao.body.genero;
    const equipe = requisicao.body.equipe;

    if (nomeJogador && nickname && funcao && elo && genero && equipe){

        listaJogadores.push({nomeJogador, nickname, funcao, elo, genero, equipe});
        resposta.redirect("/listarJogadores");
    }
    else{

        let opcoesEquipes = "";
        for (let i = 0; i < listaEquipes.length; i++) {
            opcoesEquipes += `<option value="${listaEquipes[i].nomeEquipe}">${listaEquipes[i].nomeEquipe}</option>`;
        }

        let conteudo = `
        
        <DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <title>Cadastro de Jogador</title>
            </head>
            <body>
                <div class="container">
                    <h1 class="text-center border m-3 p-3 bg-light">Cadastro de Jogadores</h1>
                    <form method="POST" action="/adicionarJogador" class="row g-3 m-3 p-3 bg-light">
                            <div class="col-md-6">
                                <label for="nomeJogador" class="form-label">Nome do Jogador</label>
                                <input type="text" class="form-control" id="nomeJogador" name="nomeJogador" value="${nomeJogador}">
                            `;
        if (!nomeJogador){
            conteudo += `
            <div>
                <p class="text-danger">Por favor, informe o nome do jogador</p>
            </div>
        `
        }

        conteudo += `</div>
                            <div class="col-md-6">
                                <label for="nickname" class="form-label">Nickname In-Game</label>
                                <input type="text" class="form-control" id="nickname" name="nickname" value="${nickname}">
                            `
        if (!nickname){
        
        conteudo += `
            <div>
                <p class="text-danger">Por favor, informe o nickname do jogador</p>
            </div>
        `;
        }

        conteudo+= `</div>
                            <div class="col-md-4">
                                <label for="funcao" class="form-label">Função</label>
                                <select class="form-select" id="funcao" name="funcao" value="${funcao}">
                                    <option selected disabled value="">Escolha uma função...</option>
                                    <option value="Top">Top</option>
                                    <option value="Jungle">Jungle</option>
                                    <option value="Mid">Mid</option>
                                    <option value="Atirador">Atirador</option>
                                    <option value="Suporte">Suporte</option>
                                </select>
                            `;
        if (!funcao){

            conteudo += `
                <div>
                    <p class="text-danger">Por favor, informe a função do jogador</p>
                </div>
            `;
        }

        conteudo += `</div>
                            <div class="col-md-4">
                                <label for="elo" class="form-label">Elo</label>
                                <select class="form-select" id="elo" name="elo" value="${elo}">
                                    <option selected disabled value="">Escolha um elo...</option>
                                    <option value="Ferro">Ferro</option>
                                    <option value="Bronze">Bronze</option>
                                    <option value="Prata">Prata</option>
                                    <option value="Ouro">Ouro</option>
                                    <option value="Platina">Platina</option>
                                    <option value="Esmeralda">Esmeralda</option>
                                    <option value="Diamante">Diamante</option>
                                    <option value="Mestre">Mestre</option>
                                    <option value="Grão-Mestre">Grão-Mestre</option>
                                    <option value="Desafiante">Desafiante</option>
                                </select>
                            `;

        if (!elo){
            conteudo += `
            <div>
                <p class="text-danger">Por favor, informe o elo do jogador</p>
            </div>`
        }

        conteudo += `</div>
                            <div class="col-md-4">
                                <label for="genero" class="form-label">Gênero</label>
                                <select class="form-select" id="genero" name="genero" value="${genero}">
                                    <option selected disabled value="">Escolha um gênero...</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            `;
        if (!genero){
            conteudo += `
            <div>
                <p class="text-danger">Por favor, informe o gênero do jogador</p>
            </div>`
        }

        conteudo += `</div>
                            <div class="col-md-6">
                                <label for="equipe" class="form-label">Equipe</label>
                                <select class="form-select" id="equipe" name="equipe" value="${equipe}">
                                    <option selected disabled value="">Escolha uma equipe...</option>
                                    ${opcoesEquipes}
                                </select>
                            `;
        if (!equipe){
            conteudo += `
            <div>
                <p class="text-danger">Por favor, informe a equipe do jogador</p>
            </div>`
        }

        conteudo += `</div>
                            <div class="col-12">
                                <button class="btn btn-primary" type="submit">Cadastrar</button>
                                <a class="btn btn-secondary" href="/">Voltar</a>
                            </div>
                    </form>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>
        
        `;

        resposta.send(conteudo);

    }

    });

server.get("/listarJogadores", verificarUsuarioLogado,(requisicao, resposta) => {
    let conteudo = `
        <DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <title>Lista de Jogadores</title>
            </head>
            <body>
                <div class="container">
                    <h1 class="text-center border m-3 p-3 bg-light">Lista de Jogadores</h1>
    `;

    for (let i = 0; i < listaEquipes.length; i++) {
        conteudo += `
                    <h3 class="mt-4">${listaEquipes[i].nomeEquipe}</h3>
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Nome do Jogador</th>
                                <th>Nickname</th>
                                <th>Função</th>
                                <th>Elo</th>
                                <th>Gênero</th>
                            </tr>
                        </thead>
                        <tbody>`;
        
        for (let j = 0; j < listaJogadores.length; j++) {
            if (listaJogadores[j].equipe === listaEquipes[i].nomeEquipe) {
                conteudo += `
                    <tr>
                        <td>${listaJogadores[j].nomeJogador}</td>
                        <td>${listaJogadores[j].nickname}</td>
                        <td>${listaJogadores[j].funcao}</td>
                        <td>${listaJogadores[j].elo}</td>
                        <td>${listaJogadores[j].genero}</td>
                    </tr>
                `;
            }
        }
        
        conteudo += `
                        </tbody>
                    </table>
        `;
    }

    conteudo+=`
                    <a class="btn btn-secondary" href="/cadastroJogador">Voltar</a>
                    <a class="btn btn-primary" href="/">Menu</a>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>
    `
    resposta.send(conteudo);
});

server.get("/logout",(requisicao, resposta) =>{
    requisicao.session.destroy();
    resposta.redirect("/login");
});

function verificarUsuarioLogado(requisicao, resposta, proximo) {
    if (requisicao.session.dadosLogin?.logado){ 
        proximo();
    } else {
        resposta.redirect("/login");
    }
    
}

server.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`)
});
