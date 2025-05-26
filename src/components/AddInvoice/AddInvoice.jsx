import React from 'react'
import "./AddInvoice.css"
const AddInvoice = () => {
  return (
    <div className='add-continer'>
        <button className='add-btn'>
            <img src="./plus.svg" alt="plus" />
            <p className='add-button-title'>New <span>Invoice</span></p>
        </button>
    </div>
  )
}

export default AddInvoice