const mongoose = require('mongoose')
require('../models/User')
require('../models/Data')//TODO import real  models


async function configDatabase() {
  //TODO set database name
  const connectionString = 'mongodb://127.0.0.1:27017/earth-treasure'
  await mongoose.connect(connectionString)

  console.log('Database Connected')
}

module.exports = {
  configDatabase
}
