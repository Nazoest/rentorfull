require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const asyncHandler = require('express-async-handler');
const User = require('./models/User'); // Adjust the path as needed
const generateToken = require('./utils/generateToken');
const protect = require('./middleware/authmiddleware.js');
const Place=require('./models/Place')
const { v4: uuidv4 } = require('uuid');
const Image=require('./models/UploadImage')





//const authRoutes=require('./routes/authRoutes')


const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors( {
  credentials:true,
  origin:'http://localhost:3000'
} 
));
//app.use('/api',authRoutes)
app.get('/', (req, res) => {
    res.send('Welcome to the myJournal API!');
  });

app.post('/register',asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
  
    const userExists = await User.findOne({ email });
  
    if (userExists) {
      res.status(404);
      res.send('User already exists');
      throw new Error('User already exists');
      
    }
  
    //create a new user
    const user = await User.create({ name, email, password });
  
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  })
   );

app.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check if the user exist in db
  const user = await User.findOne({ email });

  //validate password
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userToken: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
})
)

app.get('/profile',protect,asyncHandler(async (req, res) => {
  //re.user set up in middleware

  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
})
)

app.post('/place',(req,res)=>{
  const{title,address,addedPhotos,description,price,
    perks,extraInfo,checkIn,checkOut,maxGuests}=req.body;
  const placeId = uuidv4();

  //why userData is used???
  const userData = {
    id:"6527d72a7fcc49259d6d56cd" // Assign a user ID here,
    // Other user-related properties
  };
  
  try{
  const PlaceDoc=Place.create({owner:userData.id,price,
    title,address,photos:addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests})
    res.status(201).json({_id: placeId,
      title,
      description});
}catch(error){
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
  
}
})

app.get('/place/:id',async(req,res)=>{
  const{id}=req.params;
  res.json(await Place.findById(id));
  
})

app.get('/places',async(req,res)=>{
  res.json(await Place.find())
})

app.delete('/place/:id', async (req, res) => {
  const placeId = req.params.id;

  try {
    const deletedPlace = await Place.findByIdAndDelete(placeId);

    if (!deletedPlace) {
      return res.status(404).json({ error: 'Place not found' });
    }

    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/upload',(req,res)=>{
  const{photos}=req.body
  try{
  const UploadDoc=Image.create({photos})
  alert('image created')
  }catch{error=>{res.json({error:'Problem posting image'})}}
  

  if(!photos){
    res.json("please select an image")
  }

})

app.get('/upload',async(req,res)=>{
  res.json(await Image.find())
})


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const dbName = ''; // Replace with your database name

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Check for MongoDB connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database');
});