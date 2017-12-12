import React, { Component, Fragment } from 'react';
import './App.css';
import logo from './face.png';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import SignInForm from './components/SignInForm'
import SignUpForm from './components/SignUpForm'
import ProductList from './components/ProductList'
import ProductForm from './components/ProductForm'
import Wishlist from './components/Wishlist'
import { signIn, signUp, signOutNow } from './api/auth'
import { getDecodedToken } from './api/token'
import { listProducts, createProduct, updateProduct } from './api/products'
import { listWishlist, addProductToWishlist, removeProductFromWishlist } from './api/wishlist'

class App extends Component {
  state = {
    decodedToken: getDecodedToken(), // Restore the previous signed in data
    products: null,
    editedProductID: null,
    wishlist: null
  }

  onSignIn = ({ email, password }) => {
    signIn({ email, password })
      .then((decodedToken) => {
        this.setState({ decodedToken })
      })
  }

  onSignUp = ({ email, password, firstName, lastName }) => {
    signUp({ email, password, firstName, lastName })
      .then((decodedToken) => {
        this.setState({ decodedToken })
      })
  }

  onSignOut = () => {
    signOutNow()
    this.setState({ decodedToken: null })
  }

  onCreateProduct = (productData) => {
    createProduct(productData)
      .then((newProduct) => {
        this.setState((prevState) => {
          // Append to existing products array
          const updatedProducts = prevState.products.concat(newProduct)
          return {
            products: updatedProducts
          }
        })
      })
  }

  onBeginEditingProduct = (newID) => {
    this.setState({ editedProductID: newID })
  }

  onUpdateEditedProduct = (productData) => {
    const { editedProductID } = this.state
    updateProduct(editedProductID, productData)
      .then((updatedProduct) => {
        this.setState((prevState) => {
          // Replace in existing products array
          const updatedProducts = prevState.products.map((product) => {
            if (product._id === updatedProduct._id) {
              return updatedProduct
            }
            else {
              return product
            }
          })
          return {
            products: updatedProducts,
            editedProductID: null,
          }
        })
      })
  }

  onAddProductToWishlist = (productID) => {
    addProductToWishlist(productID)
      .then((wishlist) => {
        this.setState({ wishlist })
      })
  }

  onRemoveProductFromWishlist = (productID) => {
    removeProductFromWishlist(productID)
      .then((wishlist) => {
        this.setState({ wishlist })
      })
  }

  render() {
    const { decodedToken, products, editedProductID, wishlist } = this.state
    const signedIn = !!decodedToken

    return (
      <Router>
        <div className="App">
        <Route path='/' exact render={ () => (
        <Fragment>
          <header className="App-header">
            <h1>Shop Front</h1>
          </header>
            <h2 className='mb-3'>Now Delivering The Goods</h2>
        </Fragment>

        )}  />

        <Route path='/signin' exact render={ () => (
          <Fragment>
            <h2>Sign In</h2>
                  <SignInForm
                    onSignIn={ this.onSignIn }
                  />
          </Fragment>
        )} />
          {
            signedIn ? (
              <div className='mb-3 login-info'>
              <p className="mb-3"><strong>Email:</strong></p>
              <p className="login-info-element mb-2">{ decodedToken.email }</p>
              <p className="mb-3"><strong>Signed in at:</strong></p>
              <p className="login-info-element mb-2">{ new Date(decodedToken.iat * 1000).toISOString() }</p>                <button onClick={ this.onSignOut }>
                  Sign Out
                </button>
              </div>
            ) : (
              <div>
                
                <h2>Sign Up</h2>
                <SignUpForm
                  onSignUp={ this.onSignUp }
                />
              </div>
            )
          }

          { products &&
            <ProductList
              products={ products }
              editedProductID={ editedProductID }
              onEditProduct={ this.onBeginEditingProduct }
              onAddProductToWishlist={ this.onAddProductToWishlist }
              onRemoveProductFromWishlist={ this.onRemoveProductFromWishlist }
              renderEditForm={ (product) => (
                <div className='ml-3'>
                  <ProductForm
                    initialProduct={ product }
                    submitTitle='Update Product'
                    onSubmit={ this.onUpdateEditedProduct }
                  />
                </div>
              ) }
            />
          }

          { signedIn &&
            <div className='mb-3'>
              <h2>Create Product</h2>
              <ProductForm
                submitTitle='Create Product'
                onSubmit={ this.onCreateProduct }
              />
            </div>
          }

          <Route path='/wishlist' exact render={ () => (
            <Fragment>
              { signedIn && wishlist &&
                <Wishlist
                  products={ wishlist.products }
                  onRemoveProductFromWishlist={ this.onRemoveProductFromWishlist }
                />
              }
            </Fragment>        
          )} />

          <img src={logo} className="footer-img pulse" alt="logo" />
          <div className="footer"><em>'I have no idea what I'm doing'</em>  -2017</div>
        </div>
      </Router>
    );
  }

  load() {
    const { decodedToken } = this.state
    if (decodedToken) {
      listProducts()
        .then((products) => {
          this.setState({ products })
        })
        .catch((error) => {
          console.error('error loading products', error)
        })
      
      listWishlist()
        .then((wishlist) => {
          this.setState({ wishlist })
        })
        .catch((error) => {
          console.error('error loading wishlist', error)
        })
    }
    else {
      this.setState({
        products: null,
        wishlist: null
      })
    }
  }

  // When this App first appears on screen
  componentDidMount() {
    this.load()
  }

  // When state changes
  componentDidUpdate(prevProps, prevState) {
    // If just signed in, signed up, or signed out,
    // then the token will have changed
    if (this.state.decodedToken !== prevState.decodedToken) {
      this.load()
    }
  }
}

export default App;
