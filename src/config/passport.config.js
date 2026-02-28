const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const initializePassport = () => {
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });

          if (!user) {
            return done(null, false, {
              message: "Usuario no encontrado"
            });
          }

          const isValidPassword = bcrypt.compareSync(
            password,
            user.password
          );

          if (!isValidPassword) {
            return done(null, false, {
              message: "Contraseña incorrecta"
            });
          }

          return done(null, user);

        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
      },
      async (jwt_payload, done) => {
        try {
          const user = await User.findById(jwt_payload.id)
            .select("-password");

          if (!user) {
            return done(null, false);
          }

          return done(null, user);

        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};

module.exports = initializePassport;