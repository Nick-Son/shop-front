import React, { Fragment } from 'react'
import Product from './Product'

function Wishlist({
  products,
  onRemoveProductFromWishlist
}) { 
  return (
    <div className='mb-3 wishlist'>
      <h2>Wishlist</h2>
      {
        products.map((product) => (
          <div key={ product._id } className="wishlist-item">
            <Product
              {...product}
              onRemoveFromWishlist={ () => {
                onRemoveProductFromWishlist(product._id)
              } }
            />
          </div>
        ))
      }
    </div>
  )
}

export default Wishlist