const express = require('express');

const mongoose = require('mongoose');

const Product = require('./models/Product');

const app = express();

mongoose.connect('mongodb+srv://charmest:Montpellier34@thomas.gestkns.mongodb.net/?retryWrites=true&w=majority',
{
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// Met à disposition dans req.body tous les éléments de la requête au format json
// Manière plus ancienne : bodyParser
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// CREATION
app.post('/api/products', (req, res, next) => {
	delete req.body._id;
	const product = new Product({
		...req.body
	});
	product.save()
	.then((product) => res.status(201).json({product}))
	.catch(error => res.status(400).json({ error }));
});

// MISE A JOUR
app.put('/api/products/:id', (req, res, next) => {
	Product.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id })
	.then(() => res.status(200).json({ message: 'Modified!' }))
	.catch(error => res.status(400).json({ error }));
})

// SUPPRESSION
app.delete('/api/products/:id', (req, res, next) => {
	Product.deleteOne({ _id: req.params.id })
	.then(() => res.status(200).json({ message: 'Deleted!' }))
	.catch(error => res.status(400).json({ error }));
})

// LECTURE
app.get('/api/products/:id', (req, res, next) => {
	Product.findOne({ _id: req.params.id })
	.then((product) => res.status(200).json({product}))
	.catch(error => res.status(404).json({ error }));
});

// un middleware
app.get('/api/products', (req, res, next) => {
	Product.find()
	.then((products) => res.status(200).json({products}))
	.catch(error => res.status(400).json({ error }));
});

module.exports = app;