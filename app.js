const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 9000;

const dotenv = require ("dotenv");
dotenv.config({path: "./config.env"});

const publicDirectoryPath = path.join(__dirname,'./public')
app.use(express.static(publicDirectoryPath))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối tới MongoDB
mongoose.connect(process.env.DATABASE_LOCAL)
.then(()=>{
    console.log("connect ok");
    
})
.catch((err)=>{
    console.error("connection failed: ", err);
})
.finally(()=>{
    console.log("run...")
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const Product = mongoose.model('Product', {
    ProductCode: String,
    ProductName: String,
	ProductData: String,
	ProductOriginPrice: String,
	Quantity: String,
	ProductStoreCode: String
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index'); // Render trang index.ejs
});

app.post('/api/products', async (req, res) => {
   const { ProductCode, ProductName, ProductData, ProductOriginPrice, Quantity, ProductStoreCode  } = req.body;
   const newProduct = new Product({
    ProductCode, ProductName, ProductData, ProductOriginPrice, Quantity, ProductStoreCode
  })
  
  try {
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Could not create product.' });
  }
});

app.delete('/api/products/:ProductCode', async (req, res) => {
    const productCode = req.params.productCode;
    
    try {
      await Product.deleteOne({ ProductCode: productCode });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Could not delete product.' });
    }
})

app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Could not fetch product.' });
    }
});
  
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
  

