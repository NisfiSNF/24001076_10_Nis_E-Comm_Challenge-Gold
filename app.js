const express = require('express');
const sequelize = require('./db');
const User = require('./models/User')(sequelize);
const { Product } = require('./models');
const { Order } = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

sequelize.sync()
    .then(() => {
        console.log('Database synced');
    })
    .catch(err => console.error('Error syncing database:',err));

    app.post('/register', async (req,res) => {
        try {
          const { username, dob, city, email, password} = req.body;
          const hashedPassword = bcrypt.hashSync(password, 10);
          const user = await User.create({ username, dob, city, email, password: hashedPassword });
          res.status(201).json({ message: 'User successfully registered', user}); 
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    })

        .post('/login', async (req, res) => {
        try {
          const { email, password} = req.body;
          const user = await User.findOne({ where: {email}});
          if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
          }
          const isPasswordMatch = await bcrypt.compare(password, user.password);
          if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
          }
          const token = jwt.sign({ userId: user.id}, "1324354645N", { expiresIn: '1h'});
          res.json({ token });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ message: 'Server error' });
        } 
    })
        .get('/userinfo', verifyToken, async (req, res) => {
        try {
            const user = await User.findByPk(req.user.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ user });
        } catch (error) {
            console.error('Error fetching user info:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    function verifyToken(req, res, next) {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ message: 'Access Denied'});
        }
        try {
            const decoded = jwt.verify(token.split(" ")[1], "1324354645N");
            req.user = decoded;
            next();
        }   catch (error) {
            console.error('Error verifying token:', error);
            res.status(401).json({ message: 'Invalid Token' });
        }
    };

app.route("/products")
    .get(async (req, res) => {
        const products = await Product.findAll(); 
        return res.json({
            success: 1,
            data: products
        });
        
    })
    .post((req, res) => {
        const product = new Product;
        product.name = req.body.name;
        product.price = req.body.price;
        product.stock = req.body.stock;
        product.save().then(() => {
            return res.sendStatus([201]);
        })
        
    })
    .put(async (req, res) => {
        const product = await Product.findByPk(req.query.id);

        product.name = req.body.new_product_name;
        await product.save();

        res.send("Product updated");
    });

app.route("/orders")
    .get(async (req, res) => {
        const orders = await Order.findAll(); 
        return res.json({
            success: 1,
            data: orders
        });
        
    })
    .post((req, res) => {
        const order = new Order;
        order.name = req.body.name;
        order.quantity = req.body.quantity;
        order.total_price = req.body.total_price;
        order.eta = req.body.eta;
        order.status = req.body.status;
        order.save().then(() => {
            return res.sendStatus([201]);
        })
        
    })
    .put(async (req, res) => {
        const order = await Order.findByPk(req.query.id);

        order.status = req.body.new_order_status;
        await order.save();

        res.send("Order status updated");
    })

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });