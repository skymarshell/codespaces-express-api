const express = require('express')
const app = express()
const port = 5000
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')



app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

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

app.post('/api/addproduct', (req, res) => {
  const name = req.body.name
  const price = req.body.price
  const img = req.body.img
  const sql = `INSERT INTO products (name,price,img) VALUES ('${name}','${price}','${img}')`
  con.query(sql, (err, result) => {
    if (err) {
      console.log(err)
      return
    };
    con.query("SELECT * from products", (err, result) => {
      if (err) {
        console.log(err)
      }
      res.send(result)
    })

  })
}
)

app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id
  con.query(`DELETE FROM products WHERE id = ${id}`, (err, result) => {
    if (err) throw err;
    con.query("SELECT * from products", (err, result) => {
      if (err) {
        console.log(err)
      }
      res.send(result)
    })
  })
})

app.put('/api/updateproduct/:id',(req,res)=>{
  const id =req.params.id;
  const name=req.body.name;
  const price=req.body.price;
  const img=req.body.img;
  console.log(id,name,price,img)
  con.query(`UPDATE products SET name='${name}',price='${price}',img='${img}' WHERE id=${id}`,function(err,result,fields){
    if(err) throw res.status(400).send("Error, cannot update product");
    con.query("SELECT * FROM products",function(err,result,fields){
      if(err) throw res.status(400).send("No products found");
      console.log(result);
      res.send({products:result,status:"ok"});
    });
    });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


