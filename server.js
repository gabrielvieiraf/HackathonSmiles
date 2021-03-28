
const express = require('express')
const app = express()
const port = newFunction()
const bodyParser = require('body-parser')
const db = require('./model/db.js')
const handlebars = require('express-handlebars')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
require('./config/auth.js')(passport)
const { AdminAccess, UserAccess } = require('./helpers/accessManager')
const nodemailer = require('nodemailer')
require("./config/auth.js")(passport)




//template engine
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('views engine', 'handlebars')


//body parser 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// arquivos estáticos
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views/images'));


//sessão
app.use(session({
    secret: "appDemo",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// middleware
app.use(function (req, res, next) {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
})

// criar perfil administrador

db.CriarAdministrador();

// rotas
// index
app.get('/', function (req, res) {
    res.render('../views/index.handlebars');
})


//home

app.get('/home', UserAccess, function (req, res) {
    res.render("../views/home.handlebars", { nome: req.user.nome, id: req.user._id });
})

// cadastro
app.get('/cadastro', function (req, res) {
    res.render("../views/cadastro.handlebars");
})
app.post('/cadastro', function (req, res) {
    var erros = []
    var nome = req.body.nome;
    var email = req.body.email;
    var nascimento = req.body.nascimento;
    var endereco = req.body.endereco;
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    var pais = req.body.pais;
    var telefone = req.body.telefone;
    var usuario = req.body.usuario;
    var senha1 = req.body.senha1;
    var senha2 = req.body.senha2;
    var senha = null;

    if (senha1 != senha2) {
        erros.push({ texto: "As senhas não coincidem" })
    }
    if ((erros.length) > 0) { //  se houver erro, vai ser enviado para a tela 
        res.render("../views/cadastro.handlebars", { erros: erros })
    } else {
        db.Usuario.findOne({ email: email }).then(function (perfil) {
            if (perfil) {
                req.flash("error", "Email já cadastrado")
                res.redirect("/cadastro")
            } else {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(senha1, salt, function (err, hash) {
                        if (err) {
                            req.flash("error", "Houve um erro durante o salvamento do usuário")
                            res.redirect("/")
                        }
                        senha = hash;
                        db.Criar(nome, email, nascimento, endereco, cidade, estado, pais, telefone, usuario, senha, 0)
                        req.flash("success", "Usuário cadastrado")
                        res.redirect('/login')
                    })
                })
            }
        }).catch(function (err) {
            req.flash("error", "Houve um erro interno")
            res.redirect("/")
        })
    }
})


//login
app.get('/login', function (req, res) {
    res.render("../views/login.handlebars");
})

app.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next)
})

// enviar senha

app.get('/senha', function (req, res) {
    res.render("../views/senha.handlebars");
})
app.post('/senha', function (req, res) {
    var email = req.body.email;
    var novaSenha = String(Math.floor(Math.random() * 65536));
    console.log("nova senha: " + novaSenha)

    const transporter = nodemailer.createTransport({
        //host: "",
        //port: 25,
        //secure: false, // true for 465, false for other ports
        service:'Hotmail',
        auth: {
            user: "chrystopher_bhack@hotmail.com",
            pass: "***********"
        },
        //tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
        from: 'chrystopher_bhack@hotmail.com',
        to: email,
        subject: 'App demo - Recuperação de senha',
        text: 'Você solicitou a recuperação de senha da Smiles, sua nova senha é: ' + novaSenha
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(novaSenha, salt, function (err, hash) {
                    if (err) {
                        req.flash("error", "Houve um erro durante o salvamento do usuário")
                        res.redirect("/")
                    }
                    senha = hash;
                    db.UpdatePorEmail(email, senha)
                    console.log('Email enviado: ' + info.response);
                    req.flash("success", "A nova senha foi enviada por email")
                    res.redirect('/login')
                })
            })
        }
    });
})

//logout
app.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
})


// Read
app.get('/read', AdminAccess, function (req, res) {
    //res.render("C:/Users/chrys/OneDrive/Área de Trabalho/CRUD/views/read.handlebars");
    db.LerTodos().then(function (readAll) {
        res.render("../views/read.handlebars", { dados1: readAll })
    })
})


// Read by name 
app.get('/search', AdminAccess, function (req, res) {
    res.render("../views/search.handlebars")
})
app.post('/search', function (req, res) {
    var LerNome = req.body.nome;
    res.redirect('/search/' + LerNome)
})
app.get('/search/:LerNome', function (req, res) {
    db.LerPorNome(req.params.LerNome).then(function (readByName) {
        res.render("../views/search.handlebars", { dados2: readByName })
    })
})




// Update
app.get('/update/:id', UserAccess, function (req, res) {
    db.LerPorId(req.params.id).then(function (readById) {
        res.render("../views/update.handlebars", { dados3: readById })
    })
})
app.post('/update', UserAccess, function (req, res) {

    var id = req.body.id;
    var nome = req.body.nome;
    var email = req.body.email;
    var nascimento = req.body.nascimento;
    var endereco = req.body.endereco;
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    var pais = req.body.pais;
    var telefone = req.body.telefone;
    var usuario = req.body.usuario;
    var senha = req.body.senha;

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(senha, salt, function (err, hash) {
            if (err) {
                req.flash("error", "Houve um erro durante o salvamento do usuário")
                res.redirect("/")
            }
            senha = hash;
            db.Update(id, nome, email, nascimento, endereco, cidade, estado, pais, telefone, usuario, senha, 0)
            req.flash("success", "Cadastro atualizado")
            res.redirect('/home')
        })
    })


})


// Delete
app.get('/delete/:id', AdminAccess, function (req, res) {
    db.Delete(req.params.id).then(function () {
        res.redirect('/read')
    })
})

///////////////////////////////HACKATHON////////////////////////////////////////////////////////

app.get('/planejar', function (req, res) {
    res.render("../views/planejar.handlebars");
})


app.get('/calcular', UserAccess, function (req, res) {
    res.render("../views/calcular.handlebars", { nome: req.user.nome, id: req.user._id });
})


app.get('/carteira', function (req, res) {
    res.render("../views/carteira.handlebars");
})

app.get('/deposito', function (req, res) {
    res.render("../views/deposito.handlebars");
})



////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
    console.log('server running on http://localhost:' + port)
    console.log(__dirname);
})

function newFunction() {
    return 8080;
}


