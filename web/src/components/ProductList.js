import React, { Fragment } from 'react'
import Product from './Product'

function ProductList({
  products,
  productsInWishlist,
  editedProductID,
  onEditProduct,
  onAddProductToWishlist,
  onRemoveProductFromWishlist,
  renderEditForm
}) { 
  return (
    <div className='mb-3'>
      <h2>Products</h2>
      {
        products.map((product) => {
          {/* let inWishlist = false
          productsInWishlist.forEach((productInWishlist) => {
            if (productInWishlist._id === product._id) {
              inWishlist = true
            }
          } ) */}

          const inWishlist = !!productsInWishlist.find((productInWishlist) => {
            // Found a matching product
            // i.e this 'product' is in the wishlist
            return (productInWishlist._id === product._id)
          })

          const showAddToWishlist = !inWishlist
          const showRemoveFromWishlist = inWishlist

          return (
            <Fragment key={ product._id }>
              <Product
                {...product}
                onEdit={ () => {
                  onEditProduct(product._id)
                } }
                onAddToWishlist={ showAddToWishlist ? () => {
                  onAddProductToWishlist(product._id)
                } : null }
                onRemoveFromWishlist={ showRemoveFromWishlist ? () => {
                  onRemoveProductFromWishlist(product._id)
                } : null }
              />
              { editedProductID === product._id &&
                renderEditForm(product)
              }
            </Fragment>
          )
      })
      }
    </div>
  )
}

export default ProductList