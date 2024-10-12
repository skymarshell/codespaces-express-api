const express = require('express')
const app = express()
const port = 5000
const mysql = require('mysql')
const bodyParser = require('body-parser')



app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE",
  );
  next();
});

let con = mysql.createConnection(
  {
    host: "korawit.ddns.net",
    user: "webapp",
    password: "secret2024",
    database: "shop",
    port: "3307"
  }
)

con.connect((err) => {
  if (err) {
    console.log(err);
    throw (err)
  }
})



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/products', (req, res) => {
  con.query("SELECT * from products", (err, result) => {
    res.status(200).send(result)
  })
})

app.get('/api/products/:id', (req, res) => {
  const id = req.params.id
  con.query("SELECT * from products WHERE id = ?", [id], (err, result) => {
    if (err) {
      res.status(404).json("Error query.")
      console.log(err);
      return
    }
    if (result.length == 1) {
      res.status(200).json(result)
    } else {

      res.status(200).json({ msg: `Prouduct ID:${id} not found.` })
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
