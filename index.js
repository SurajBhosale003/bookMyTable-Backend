// System Imports --------------------------------
const express = require('express')
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express()
const port = 3000;
// DB Imports --------------------------------
const Review = require('./models/review.js');
const Order  = require('./models/order.js');
const Table = require('./models/table.js');
// DB Imports --------------------------------
app.use(cors());
app.use(express.json())
app.use(express.static('public'));

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Store uploaded images in 'uploads' directory
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Rename uploaded images with a timestamp
    }
  });
  const upload = multer({ storage: storage });



// Endpoints 

app.get('/',(req,res) => {
    res.send("from server hello ");
})
// tables ++++++++++++++++++++++

app.post('/api/addtables', async (req, res) => {
    try {
        // Extract tables data from the request body
        const tablesData = req.body;

        // Create an array to hold the promises for creating each table
        const createTablePromises = [];

        // Iterate over each table data and create a new table document
        for (const tableData of tablesData) {
            createTablePromises.push(Table.create(tableData));
        }

        // Execute all promises in parallel using Promise.all
        const createdTables = await Promise.all(createTablePromises);

        // Send a success response with the created tables data
        res.status(201).json(createdTables);
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error adding tables:', error);
        res.status(500).json({ error: 'Failed to add tables' });
    }
});


// get tables
app.get('/api/gettables', async (req, res) => {
    try {
        // Fetch all tables data from the database in ascending order of 'number'
        const allTables = await Table.find().sort({ number: 1 });

        // Send a success response with the fetched tables data
        res.status(200).json(allTables);
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error fetching tables:', error);
        res.status(500).json({ error: 'Failed to fetch tables' });
    }
});

// update single table
app.put('/api/updatetable/:number', async (req, res) => {
    try {
        const { number } = req.params;
        const { status } = req.body;

        // Find the table by its number
        const table = await Table.findOne({ number });

        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }
        if (status == "available")
        {
            console.log("seat is available , reserving ")
        }

        // Update the status of the table to "reserving"
        table.status = 'reserving';
        await table.save();
        console.log("seat is reserved ");
        // Return a success response with the updated table data
        res.status(200).json(table);
    } catch (error) {
        console.error('Error updating table status:', error);
        res.status(500).json({ error: 'Failed to update table status' });
    }
});


// Add Order-------------------------------------------------------------------------
app.post('/api/addorder', async (req, res) => {
    try {
        // Extract order data from the request body
        const { phoneNumber, dateTime, bill, info } = req.body;

        // Create a new order instance
        const newOrder = new Order({
            phoneNumber,
            dateTime,
            bill,
            info
        });

        // Save the new order to the database
        const savedOrder = await newOrder.save();

        // Send a success response with the saved order data
        res.status(201).json(savedOrder);
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// update order status 

app.put('/api/updateorderstatus/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      // Find the order by its ID
      const order = await Order.findByIdAndUpdate(id, { 'bill.status': status }, { new: true });
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Return a success response with the updated order data
      res.status(200).json(order);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

app.get('/api/getorders', async (req, res) => {
    try {
        // Fetch orders from the database sorted by dateTime in descending order
        const orders = await Order.find().sort({ dateTime: -1 });

        // Send a success response with the fetched orders data
        res.status(200).json(orders);
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// AddReviews to DB---------------------------------------------------------------------
const defaultImageCount = 5;

app.post('/api/reviews', upload.single('profile'), async (req, res) => {
    try {
        const { quote, author, email, designation, rating } = req.body;
        let image = '';

        // Check if image is uploaded, if not, set default image path
        if (req.file) {
            image = req.file.path;
        } else {
            // Generate random index for default image
            const defaultImageIndex = Math.floor(Math.random() * defaultImageCount) + 1;
            // Set default image path with random index
            image = `defaultProfile/default-image${defaultImageIndex}.jpg`;
        }

        const review = await Review.create({ quote, author, email, designation, rating, image });
        res.status(200).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GetReviews from DB---------------------------------------------------------------------
app.get('/api/reviews', async(req,res) => {

    try{
       const review = await Review.find({});
        res.status(200).json(review);
    }catch(e){
        res.status(500).json({message: message.e});  
    }

})

// GetTopReviews---------------------------------------------------------------------
app.get('/api/top-reviews', async (req, res) => {
    try {
      // Fetch top latest 6 reviews from the database
      const reviews = await Review.find().sort({ createdAt: -1 }).limit(6);

      // Send formatted JSON response
      res.status(200).json(reviews);
    } catch (error) {
     
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


// Endpoints---------------------------------------------------------------------

// Connection and start server with Express and Mongoose
mongoose.connect("mongodb+srv://surajranajitbhosale003:lU91lTbUhIc1mHA0@backenddb.owsku39.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB").then(()=>{
    console.log("MangoDB Database Has Been Connected");
    app.listen(port, ()=>{
        console.log('Connected to server listening on : '+port);
    })
})
.catch((err)=>{
    console.log("MangoDB Connection Error : " + err.message);
    process.exit(1);
})