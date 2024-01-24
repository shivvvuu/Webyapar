import express  from 'express';
import session from 'express-session';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import Users from './backend/mongodb/models/Users.js';
import Image from './backend/mongodb/models/Imagedata.js'
import connectDB from './backend/connect.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const AdminID = 'ADMIN123'
const Password = 'ADMIN321'
const PORT = 8080
const MONGO_URL = 'mongodb+srv://jhodshivam5122:shivam5122@cluster0.0ep28ra.mongodb.net/?retryWrites=true&w=majority'

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/frontend',express.static(path.join(__dirname, 'frontend')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  },
}));
app.use('/js', express.static(path.join(__dirname, 'js'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  },
}));
app.use(session({
  secret:'keyboard cat',
  resave:false,
  saveUninitialized:true
}))


//Function for page authentication
const isAuthenticated = (req, res, next) => {
  if(req.session && req.session.user){
    //User is authenticated
    next();
  }else{
    //User is not authenticatd and get redirected to login page
    res.redirect('/login')
  }
}

// Admin Login
app.get('/admin', (req, res) => {
  const htmlfile = path.join(__dirname, 'frontend', 'templates', 'adminlogin.html')
  req.session.destroy((err)=>{
    console.log(err)
  })
  res.sendFile(htmlfile, (err) => {
    if(err){
        console.log(err)
    }
  });
});

// Verification of Admin
app.post('/admin', (req, res) => {
  console.log(req.body)
  const {userid, password} = req.body
  if(userid === AdminID && password === Password){
    req.session.user = {userid}
    res.redirect(302, '/admin-dashboard')
  }else{
    res.redirect('/admin')
  }
})

// Admin Dashboard
  app.get('/admin-dashboard',isAuthenticated, (req, res) => {
  const html = path.join(__dirname, 'frontend', 'templates', 'adminpage.html')
  res.sendFile(html, (err) => {
    console.log(err)
  })
})

// Admin view for Done or Delete Options
app.route('/admin-view')
.get((req, res) => {
  const html = path.join(__dirname, 'frontend', 'templates', 'adminview.html')
  res.sendFile(html, (err) => {
    console.log(err)
  })
})

//Fetch all data for admin view
app.get('/alluserdata', async(req, res) => {
  const data = await Image.find()
  res.send(data)
})

//User LoginPage route
app.route('/login') 
  .get((req, res) => {
  req.session.destroy((err) =>{
    console.log(err)
  })
  const html = path.join(__dirname, 'frontend', 'templates', 'userlogin.html')
  res.sendFile(html, (err) =>{
    console.log(err)
  })
})
  .post(async (req, res) => {
    const {userid, password} = req.body
    const users = await Users.find({
      userid
    });
    // console.log(users[0].userid);
    if(userid === users[0]?.userid && password === users[0]?.password){
      req.session.user = {userid}
      res.redirect('/user-dashboard')
    }else{
      res.redirect('/login')
    }
  })

//Image adding page for user 
app.route('/user-dashboard')
  .get((req, res) => {
    if(req.session.user){
      const html = path.join(__dirname, 'frontend', 'templates', 'useraddimage.html')
      res.sendFile(html, (err) => {
        console.log(err)
      })
    }else{
      res.redirect('/')
    }
  })


// Home

app.get('/', (req, res) => {
  res.redirect('/login')
})

// Create user
app.route('/create-user')
  .post(async (req, res) => {
  try {
      console.log('===================Here===========================')
      const {userid, password} = req.body
      const newUser = await Users.create({
          userid,
          password
      })
      res.status(200).redirect('/admin-dashboard')
  } catch (error) {
      res.status(500)
  } 
  })


//Upload image to Mongodb
app.post('/upload', async (req, res) => {
  try {
    console.log('========================here===============')
    if(req.body){
      const {name, img} = req.body
      const user = (req.session.user)['userid']
      const image = img
      // const image = img.split(',')[1]
      const newImage = await Image.create({
        userid:user,
        name,
        image:image.toString('base64'),
      })

    }else{
      console.log("BODY IS EMPTY")
    }
    res.status('ok')
    
  } catch (error) {
    console.log(`ERORR===============${error}`)
  }
})


//get Image
app.get('/getimage', async(req, res) => {
  const user = (req.session.user)['userid']
  const data = await Image.find({
    userid : user
  })
  res.send(data)
})

//get Users
app.get('/getuser', async(req, res) => {
  const data = await Image.distinct("userid")
  res.send(data)
})

//Deleting Image
app.get('/delete/:id',isAuthenticated, async (req, res) => {
  const id = req.params.id
  console.log(id)
  try {
    const rex = await Image.deleteOne({
      _id:id
    })
    res.redirect('/admin-view')
  } catch (error) {
    console.log(error)
  }
})

//Done Image
app.get('/done/:id',isAuthenticated, async(req, res) => {
  const id = req.params.id
  const filter = {_id:id}
  const update = {$set:{status:true}}
  try {
    const up = await Image.updateOne(filter, update)
    res.redirect('/admin-view')
  } catch (error) {
    console.log(error)
  }
})

const startServer = async () => {

    try {
        connectDB(MONGO_URL)
        app.listen(PORT, () => console.log('Server has started on port http://localhost:8080'))
    } catch (error) {
        console.log(error);
    }

}

startServer();
