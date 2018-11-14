const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //Encryptar contraseñas

const { Schema } = mongoose;
const UserSchema = new Schema ({
  name: String,
  email: String,
  password: String
})

UserSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

//Metodos de instancia
UserSchema.statics.authenticate = async (email, password) => {
  // buscamos el usuario utilizando el email
  const user = await mongoose.model("User").findOne({ email: email });
  if (user) {
    // si existe comparamos la contraseña
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) reject(err);
        resolve(result === true ? user : null);
      });
    });
    return user;
  }
  return null;
};

module.exports = mongoose.model('User', UserSchema);