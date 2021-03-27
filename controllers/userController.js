const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {v4} = require('uuid');

const jwtSign = (payload) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: 86400 //24h
  });
}

const postUser = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  User.findByUsername(username)
    .then(([rows]) => {
      if (rows.length > 0) {
        const existingUser = rows[0];
        const valid = bcrypt.compareSync(password, existingUser.password);
        if (!valid) {
          res.status(401).json({
            auth: false,
            message: "Wrong Password!"
          })
        } else {
          res.status(200).json({
            auth: true,
            token: jwtSign({id: existingUser.id})
          });
        }
      } else {
        const newUser = new User(
          v4(),
          username,
          hash
        );

        newUser.save()
          .then(() => {
            res.status(200).json({auth: true, token: jwtSign({id: newUser._id})});
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: true,
              message: "Internal Server Error"
            })
          })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: true,
        message: "Internal Server Error"
      })
    })
}

module.exports = {
  postUser,
}
