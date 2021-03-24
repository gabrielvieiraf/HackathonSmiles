module.exports = {
    AdminAccess: function(req, res, next){
        if(req.isAuthenticated()&& req.user.admin == 1){
            return next();
        }
        req.flash("error", "Somente usuários com perfil de administrador podem acessar esta página")
        res.redirect("/")
    },
    UserAccess: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "É preciso estar logado para acessar esta página")
        res.redirect("/")
        
    }
}