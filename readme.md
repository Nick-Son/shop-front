# Shop-Front App

![](/docs/screen.png)
Deployed to:

https://shop-front.netlify.com/

*A simple shop front app, with authentication, built with React and Node

## Development Steps

**In the root folder, create 2 folders:**

```
/main-folder/api
/main-folder/web
```

- /api will be used for the backend
- /web will be used for the frontend

## API (/api)

**cd into api**
```
yarn init
```

add express
```
yarn add express
```

add body-parser
```
yarn add body-parser
```

**Create a server.js file**

add boiler plate code

```javascript
const express = require('express');
const bodyParser = require('body-parser');

const server = express();

// Middleware plugins
server.use(bodyParser.json())

// Routes

// Start the server
server.listen(7000, (error) => {
  if (error) {
    console.log('Error starting', error)
  }
  else {
    console.log('Server started at http://localhost:7000')
  }
})
```

**Add nodemon**
```
yarn add nodemon --dev
```

**Add scripts to package.json**
```javascript
  "scripts": {
    "dev": "nodemon server.js",
    "seed": "node models/seeds.js",
    "drop": "node models/drop.js"
  }
```

To start the server, run
```
yarn dev
```

To seed the database, run
```
yarn seed
```

**Create drop.js in /models**

```javascript
const Product = require('./Product')

Product.deleteMany()
  .then(() => {
    console.log('Deleted Products')
    process.exit()
  })
```

*this allows you to drop the database by running the following command:*
```
yarn drop
```


**Add mongoose**
```
yarn add mongoose
```

**Start MongoDB**

*(For Ubuntu)*
```
sudo service mongod start
```

**create a folder in api, called models**
```
/api/models
```

**Create an init.js**

add boilerplate code

*Note: change the name of the local database, eg: databasename*
```javascript
// /api/models/init.js

const mongoose = require('mongoose');

mongoose.Promise = global.Promise
// Connect to local database
mongoose.connect(
  'mongodb://localhost/*databasename*', // change *databasename* to an appropriate name
  { useMongoClient: true }
)
.then(() => {
  console.log('Successfully connected to DB')
})
.catch((error) => {
  console.error('Error connecting to MongoDB database', error)
})
// Use the Promise functionality built into Node.js
mongoose.Promise = global.Promise;

module.exports = mongoose;
```

### Creating models

**Created a 'Product' model**

```javascript
// api/models/Product.js

const mongoose = require('./init')

const Product = mongoose.model('Product', {
  brandName: String,
  name: String
})

module.exports = Product;
```

**Create seed.js and add seed data**
```javascript
const Product = require('./Product')

Product.create([
  {
    brandName: 'Apple',
    name: 'Macbook Pro'
  },
  {
    brandName: 'Lenovo',
    name: 'Carbon x1'
  },
  {
    brandName: 'Google',
    name: 'Chromebook'
  },
])
  .then((products) => {
    console.log('Created products', products)
  })
  .catch((products) => {
    console.error()
  })
```

**Create routes folder + products.js**

```javascript
// /api/routes/products.js

const express = require('express')
const Product = require('../models/Product')

const router = new express.Router()

router.get('/products', (req, res) => {
  Product.find()
    .then((products) => {
      res.json (products)
    })
    .catch((error) => {
      res.json({ error })
    })
})

module.exports = router;
```

add route for products to server.js
```javascript
// Routes
server.use([
  require('./routes/products')
])
```

## Authentication

*Using passport-local-mongoose*

https://github.com/saintedlama/passport-local-mongoose

**Add passport to project**
```
yarn add passport passport-local passport-local-mongoose
```

**Create User Model**
```javascript
// api/models/User.js

const mongoose = require('./init')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String
})

// Enhance using the devise-like library to add email/password to our library
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  usernameLowerCase: true, // ensure that all emails are lowercase
  session: false, // Disable sessions as we'll use JWT's
})

const User = mongoose.model('User', userSchema)

module.exports = User;
```

**Create an auth.js router**
```javascript
// api/routes/auth.js

const express = require('express')
const authMiddleware = require('../middleware/auth')

const router = new express.Router()

// registering
router.post('/auth/register', 
// middleware that handles the registration process
authMiddleware.register,
  (req, res) => {
    res.json({
      user: req.user
    })
  }
)
// json handler

module.exports = router;
```

**Create a middlewar folder & auth.js within**
```javascript
// api/middleware/auth.js

const User = require('../models/User')

function register(req, res, next) {
  // create a new user model
  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  })
  // create the user with the specified password
  User.register(user, req.body.password, (error, user) => {
    if (error) {
      // our register middleware failed
      next(error)
      return
    }

    // Store user so we can access it in our handler
    req.user = user
    // success
    next()
  })
}

module.exports = {
  register
}
```

**Add auth route to server.js**
```javascript
server.use([
  require('./routes/products'),
  require('./routes/auth')
])
```

**Add Sign In function to /routes/auth.js**
```javascript
// under register

// Sign In
router.post('/auth',
  authMiddleware.signIn,
  // json handler
  (req, res) => {
    res.json({
      user: req.user
    })
  }

)
```

***Add the following lines to middleware/auth.js**
```javascript
// at the top of the file
const passport = require('passport')

// after the imported plugins
passport.use(User.createStrategy())

// add to the module.exports
initialize: passport.initialize(),
signIn: passport.authenticate('local', {session: false})
```

**Add the following lines to server.js**
```javascript
const authMiddleware = require('./middleware/auth')

// middleware plugins
server.use(authMiddleware.initialize)
```

## Returning a JWT
https://jwt.io/

```
yarn add jsonwebtoken
```

# Frontend

**In root of the project, create a React app**
```
yarn create react-app web
```

