const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extend: false }));
app.use(express.json());
app.use(cors());
const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "FIPAG",
});

app.get("/", (req, res) => {
  let SQL =
    "INSERT INTO CredenciaisUserD (email,password) VALUES ('antonio@gmail.com','1234566')";

  db.query(SQL, (err, result) => {
    console.log(err);
  });
});

app.post("/registro", (req, res) => {
  const { nome } = req.body;
  const { email } = req.body;
  const { contacto } = req.body;
  const { mensagem } = req.body;

  let SQL =
    "INSERT INTO Usuario (nome,email,contacto,mensagem) VALUES (?,?,?,?)";

  db.query(SQL, [nome, email, contacto,mensagem], (err, result) => {
    console.log(err);
  });

  /*console.log(nome);*/
});

app.get("/listar", (req, res) => {
  let SQL = "SELECT * from Usuario";

  db.query(SQL, (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});




app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "SELECT * FROM CredenciaisUserD WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        res.send(err);
      }
      if (result.length == 0) {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          db.query(
            "INSERT INTO CredenciaisUserD (email, password) VALUES (?,?)",
            [email, hash],
            (error, response) => {
              if (err) {
                res.send(err);
              }

              res.send({ msg: "Usuário cadastrado com sucesso" });
            }
          );
        });
      } else {
        res.send({ msg: "Email já cadastrado" });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "SELECT * FROM CredenciaisUserD WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        res.send(err);
      }
      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (error) {
            res.send(error);
          }
          if (response) {
            res.send({ msg: "Usuário logado" });
          } else {
            res.send({ msg: "Senha incorreta" });
          }
        });
      } else {
        res.send({ msg: "Usuário não registrado!" });
      }
    }
  );
});


app.listen(21262, () => {
  console.log(`Express started at http://localhost:21262`);
});
