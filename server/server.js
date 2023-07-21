const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const fs = require('fs')
const mongoose = require('mongoose')
const multer = require('multer');
const session = require('express-session')
const app = express();
const port = 3001;

//Express.js and CrossOriginResourceSharing use
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser());
app.use(cors());

//EJS view for admin page
app.set('view-engine', 'ejs');
app.use('/public', express.static('public'));

//Connection with DB
mongoose.connect('mongodb://root:root@localhost:27017/CarRentalWebApp?&authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(console.error);
//Model imports
const User = require("./models/User");
const Vehicle = require("./models/Vehicle");
const Reservation = require("./models/Reservation")

//Multer multimedia handling package to handle Vehicle Images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
})
const upload = multer({storage:storage});


//SERVER ADMIN FUNCTIONS AND ROUTES
app.use(session({
    secret: 'session-secret-that-can-be-hidden',
    resave: false,
    saveUninitialialized: false,
    cookie:{ expires: 600000 }
}))

//Function checking if user is logged in
var sessionCheck = (req,res,next) => {
    if(req.session.isAuth){
        next()
    } 
    else{
        res.redirect('/')
    }
}

app.get('/', (req,res) => {
    res.render('index.ejs', {
        session : req.session
    });
})
//Admin log in with username: root and password: 123
app.post('/login', (req,res) => {
    if(req.body.username == 'root' && req.body.password == '123'){
        req.session.isAuth = true
        res.redirect("/");
    }
})
app.get('/allUsers', sessionCheck, async (req, res) => {
    const users = await User.find();
    res.render('allUsers.ejs', {
        session: req.session,
        users: users,
        length: users.length
    })
})
app.get('/inactiveUsers', sessionCheck, async (req,res) => {
    const inactiveUsers = await User.find({role: ''})
    res.render('inactive.ejs', {
        session: req.session,
        users: inactiveUsers,
        length: inactiveUsers.length
    })
})
app.get('/reservations', sessionCheck, async (req,res) => {
    const reservations = await Reservation.find()
    res.render('reservations.ejs', {
        session: req.session,
        reservations: reservations,
        length: reservations.length
    })
})

//API ROUTES
app.get('/reservations/:username', async (req, res) => {
    try {
        const reservations = await Reservation.find({customer: req.params.username})
        if (reservations == null) {
            throw new Error('No reservation found')
        }
        else{
            res.status(201).json(reservations)
        }
    } catch (error) {
        console.log(error.message)
        res.status(422).send(error.message)
    }
})

app.get('/vehicle/all', async (req,res) => {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
})

app.get('/vehicleByReg/:reg', async (req,res) => {
    var filter = {regnumber: req.params.reg}
    try {
        const vehicle = await Vehicle.findOne(filter)
        if (vehicle === null) {
            throw new Error('No Vehicle Found')
            
        } else {
            res.status(201).json(vehicle)
        }
    } catch (error) {
        if(error.message === 'No Vehicle Found'){
            res.status(401).send(error.message)
        }
    }
    
})
//Account login from Front-End
app.post('/user/login', async (req, res) => {
    user = {
        "email": `${req.body.email}`,
        "password": `${req.body.password}`,
    }
    try {
        //Finding User with the same email and password
        resUser = await User.findOne({email: user.email, password: user.password})
        if(resUser === null){
            throw new Error('Access Denied: Wrong Credentials');
        }
        else if(resUser.role === ''){
            throw new Error('No Roles')
        }
        else{
           console.log(resUser); 
           res.status(201).json(resUser);
        }
    } catch (error) {
        console.log(error);
        if(error.message == 'No Roles'){
            res.status(401).send(error.message)
        }
        else{
            res.status(400).send(error.message);
        }
        
    }
    
    
})
//USER CRUD
app.post('/user/new', async (req,res) => {
    var username = req.body.username;
    var email = req.body.email;
        
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        country: req.body.country,
        city: req.body.city,
        address: req.body.address,
        email: email,
        username: username,
        password: req.body.password,
        role: ''
    })
    //Unnique Email and Username Validation and Error Handling
    try {
        const usernameExists = await User.findOne({ username: username });
        const emailExists = await User.findOne({ email: email });
        if(usernameExists && emailExists) {
            throw new Error("Username and email already exists");
        } else if(usernameExists) {
            throw new Error("Username already exists");
        } else if(emailExists) {
            throw new Error("Email already exists");
        } 
        const savedUser = await user.save();
        console.log('Succesful New User Request')
        res.status(201).json(savedUser);
    } catch (error) {
        if (error.message == "Username and email already exists") {
            console.log(error);
            res.status(422).send({"message": "Username and email already exists"});
        } else if(error.message == 'Username already exists'){
            console.log(error);
            res.status(422).send({"message": "Username already exists"});
        }else if(error.message == 'Email already exists') {
            console.log(error);
            res.status(422).send({"message": "Email already exists"});
        }     
    }
})
//Deleting User by Username
app.post('/user/deleteByUsername', async (req,res) => {
    try {
        const result = await User.findOneAndDelete({username: req.body.username});
        console.log(result)
        res.redirect('/allUsers');
    } catch (error) {
        console.log(error.message)
        res.redirect('/allUsers');
    }
    
    
})
//Updating user
app.post('/user/accept', async (req,res) => {
    const filter = {username: req.body.username}
    const update = {role: req.body.role}
    const result = await User.findOneAndUpdate(filter, update, {new: true})
    console.log(result.username)
    res.redirect('/inactiveUsers')
})

//VEHICLE CRUD
app.post('/vehicle/new', upload.single('vehicleImage'), async (req,res) => {
    console.log(req.body.carmake)
    const vehicle = new Vehicle({
        vehicleImage: {
            data: fs.readFileSync("uploads/" + req.file.filename),
            contentType: "image/png"
        },
        carmake: req.body.carmake,
        model: req.body.model,
        enginetype: req.body.enginetype,
        enginesize: req.body.enginesize,
        seats: req.body.seats,
        availability: req.body.availability,
        stdprice: req.body.stdprice,
        regnumber: req.body.regnumber
    })

    try {
        console.log(req.file.filename)
        const existingReg = await Vehicle.findOne({regnumber: vehicle.regnumber})
        if(existingReg){
            throw new Error('Vehicle Registration Number already exists')
        }
        vehicle.save()
        res.status(201).json({"message": "Succesful Creation"})
    } catch (error) {
        console.log(error)
        res.status(422).send(error.message)
    }
})
app.post('/vehicle/update/:regnumber', async (req,res) => {
    var filters = {regnumber: req.params.regnumber};
    console.log(req.params.regnumber)
    var update = {
        enginetype: req.body.enginetype,
        enginesize: req.body.enginesize,
        seats: req.body.seats,
        availability: req.body.availability,
        stdprice: req.body.stdprice,
        regnumber: req.body.regnumber
    }
    try {
        const result = await Vehicle.findOneAndUpdate(filters, update)
        if(result == null){
            throw new Error('Vehicle did not update')
        }
        else{
            res.status(201).json(result)
        }
    } catch (error) {
        console.log(error.message)
        res.status(422).send(error.message)
    }   
})

app.post('/vehicle/delete/:regnumber', async (req,res) => {
    try {
        result = await Vehicle.findOneAndRemove({regnumber: req.params.regnumber});
        res.status(201).json(result);
    } catch (error) {
        console.log(error.message)
        res.status(422).send(error.message);
    }
})

//RESERVATION CRUD
app.post('/reservation/new', async (req,res) => {
    var regnumber = req.body.reservedvehicle
    const reservation = new Reservation({
        customer: req.body.customer,
        email: req.body.email,
        phonenum: req.body.phonenum,
        reservedvehicle: regnumber,
        fromdate: req.body.fromdate,
        todate: req.body.todate,
        price: req.body.price,
        status: req.body.result
    })

    try {
        var vehicle = await Vehicle.findOne({regnumber: regnumber})
        var existingReservation = await Reservation.findOne({reservedvehicle: regnumber, fromdate: reservation.fromdate, customer: reservation.customer, status: reservation.status})
        if(vehicle == null){
            throw new Error('Invalid vehicle')
        }
        else if(existingReservation !== null){
            throw new Error('Reservation of same vehicle by same customer with same starting date')
        }
        else{
            reservation.save();
            res.status(201).json(reservation);
        }
        
    } catch (error) {
        console.log(error.message)
        if(error.message === 'Invalid vehicle'){
            res.status(422).send(error.message);
        }
        else if(error.message === 'Reservation of same vehicle by same customer with same starting date'){
            res.status(424).send(error.message);
        }
        else res.status(404).send(error.message);
    }
})

app.post('/reservation/update', async (req,res) => {
    const customer = req.body.username;
    const reservedvehicle = req.body.reservedvehicle;
    const status = req.body.status;
    const filters = {customer: customer, reservedvehicle: reservedvehicle};
    const update = {status: status};
    
    try {
        const result = await Reservation.findOneAndUpdate(filters, update);
        if(result == null){
            throw new Error('No Reservation found');
        }
        else{
            res.status(201).redirect('/reservations');
        }
    } catch (error) {
        res.status(422).send(error.message)
    }
})

app.listen(port, () => console.log(`Server listening on port ${port}!`));