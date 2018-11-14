const User = require("./user"); //Requerimos el modelo de los usuarios
const express = require('express');
const router = express.Router();

//Middleware de sesion
const requireUser = async (req, res, next) => { //Middleware para requerir usuario(verifico que el usuario que esta guardado en la sesion existe)
  const userId = req.session.userId;
  if (userId) {
    const user = await User.findOne({ _id: userId });
    res.locals.user = user;
    next();
  } else {
    return res.redirect('/login');
  }
}

//Rutas
router.get('/',requireUser, async (req,res) => {
  const allUsers = await User.find({});
  res.render('index', {users: allUsers});
});

router.get('/login', (req,res) => {
  res.render('form', {action: '/login', button: 'Log in', link: 'Sign up'});
});

router.post('/login', async (req,res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.authenticate(email, password);
  if (user) {
    req.session.userId = user._id; // acá guardamos el id en la sesión
    return res.redirect('/');
  } else {
    res.render('form', {error: 'Wrong email or password. Try again!', action: '/login', button: 'Log in', link: 'Sign up'});
  }
});

router.get('/logout', (req,res) => {
  req.session.userId = undefined
  res.redirect('/login')
})

router.get('/register', (req,res) => {
  res.render('form', {action: '/register', button: 'Submit'});
});

router.post('/register',async (req,res) => {
  const user =  new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  await user.save();
  res.redirect('/');
});

module.exports = router;