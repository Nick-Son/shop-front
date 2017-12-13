import React from 'react'

function improveMessage(message) {
  if (/ 401/.test(message)) {
    return 'Please check the entered values'
  } 
  else if (/ 400/.test(message)) {
    return 'Please check the entered values'
  }
  else if (/Network Error/i.test(message)) {
    return 'Cannot connect to the API server'
  }
}

function Error({
  error
}) {
  return (
    <p className="error-message">{ improveMessage(error.message) }</p>
  )
}

export default Error