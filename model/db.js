const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(function () {
    console.log("MongoDB connected")
}).catch(function (err) {
    console.log("Fail to connect on MongoDB")
})
////////////////////////////////////////////////////////////////////////////////////
const UsuarioSchema = mongoose.Schema({
    nome: {
        type: String, // tipo da variável
        require: false // se o registro é obrigatório ou não 
    },
    email: {
        type: String, // tipo da variável
        require: false // se o registro é obrigatório ou não 
    },
    nascimento: {
        type: String, // tipo da variável
        require: false // se o registro é obrigatório ou não 
    },
    endereco: {
        type: String, // tipo da variável
        require: false // se o registro é obrigatório ou não 
    },
    cidade: {
        type: String, // tipo da variável
        require: false // se o registro é obrigatório ou não 
    },
    estado: {
        type: String, // tipo da variável
        require: false // se o registro é obrigatório ou não 
    },
    pais: {
        type: String, // tipo da variável
        require: false // se o registro é obrigatório ou não 
    },
    telefone: {
        type: String, // tipo da variável
        require: false // se o registro é obrigatório ou não 
    },
    usuario: {
        type: String, // tipo da variável
        require: false // se o registro é obrigatório ou não 
    },
    senha: {
        type: String, // tipo da variável
        require: false // se o registro é obrigatório ou não 
    },
    admin: {
        type: Number, // tipo da variável
        require: false // se o registro é obrigatório ou não 
    }
})

mongoose.model('UsuarioCollection', UsuarioSchema)
const Usuario = mongoose.model('UsuarioCollection')

////////////////////////////////////////////////////////////////////////////////////
// criar usuário administrador

function CriarAdministrador() {
    Usuario.findOne({ email: 'admin' }).then(function (usuario) {
        if (usuario) {

        } else {
            var senha1 = 'admin'
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(senha1, salt, function (err, hash) {
                    if (err) {
                        req.flash("error", "Houve um erro durante o salvamento do usuário")
                    }
                    var senha = hash;
                    Criar('admin', 'admin', '', '', '', '', '', '', 'admin', senha, 1)
                })
            })
        }
    }).catch(function (err) {
        console.log("error", "Houve um erro interno " + err)
    })
}

// função create (INSERT)  
function Criar(nome, email, nascimento, endereco, cidade, estado, pais, telefone, usuario, senha, admin) {
    new Usuario({
        nome: nome,
        email: email,
        nascimento: nascimento,
        endereco: endereco,
        cidade: cidade,
        estado: estado,
        pais: pais,
        telefone: telefone,
        usuario: usuario,
        senha: senha,
        admin: admin
    }).save().then(function () {
        console.log("Usuário criado")
    }).catch(function (err) {
        console.log("Houve um erro ao registrar no banco de dados: " + err)
    })
}

// função read (SELECT)

function LerTodos() {
    return Usuario.find({}).lean()
}

function LerPorNome(findName) {
    return Usuario.find({ nome: findName }).lean()
}
function LerPorId(findId) {
    return Usuario.find({ _id: findId }).lean()
}


// função UPDATE by ID 

function Update(id, nome, email, nascimento, endereco, cidade, estado, pais, telefone, usuario, senha) {
    Usuario.findByIdAndUpdate(id, { nome: nome, email: email, nascimento: nascimento, endereco: endereco, cidade: cidade, estado: estado, pais: pais, telefone: telefone, usuario: usuario, senha: senha }, { new: true }, function (error) { });
}

function UpdatePorEmail(email, senha) {

    const filter = { email: email };
    const update = { senha: senha };

    // `doc` is the document _after_ `update` was applied because of
    // `new: true`
    Usuario.findOneAndUpdate(filter, update, { new: true }, function (error) { });


}


// função DELETE by ID (DROP) 

function Delete(DelId) {
    return Usuario.findByIdAndDelete(DelId)
}

// exportação de recursos para outros arquivos
module.exports = {
    Criar,
    LerTodos,
    LerPorNome,
    LerPorId,
    Delete,
    Update,
    CriarAdministrador,
    UpdatePorEmail,
    Usuario
}

