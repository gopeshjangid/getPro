const mongoose = require('mongoose')
const role = mongoose.Schema({
  role: String,
   permissions:  [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'permission'
      }]
  
 
})

module.exports = mongoose.model('role', role)
