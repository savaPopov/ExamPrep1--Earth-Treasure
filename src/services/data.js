//TODO replace with real data service according to exam description

const { Data } = require('../models/Data')

async function getAll() {

  return Data.find().lean()
}

async function getById(id) {
  return Data.findById(id).lean()

}

function getRecent() {
  return Data.find().sort({ $natural: -1 }).limit(3).lean()
}

async function create(data, authorId) {
  //TODO extract properties from view model 
  const record = new Data({
    name: data.name,
    category: data.category,
    color: data.color,
    image: data.image,
    location: data.location,
    formula: data.formula,
    description: data.description,
    author: authorId
  })
  await record.save()

  return record
}

async function update(id, data, userId) {
  const record = await Data.findById(id)

  if (!record) {
    throw new ReferenceError('Record not found!' + id)
  }

  if (record.author.toString() != userId) {
    throw new Error('Access Denied!')
  }

  record.name = data.name,
    record.category = data.category,
    record.color = data.color,
    record.image = data.image,
    record.location = data.location,
    record.formula = data.formula,
    record.description = data.description,


    await record.save()

  return record
}

async function likeStone(stoneId, userId) {
  const record = await Data.findById(stoneId)
  // console.log(record)
  if (!record) {
    throw new ReferenceError('Record not found!' + stoneId)
  }

  if (record.author.toString() == userId) {
    console.log('err1')
    throw new Error('Access Denied!')
  }

  if (record.likes.find(l => l.toString() == userId)) {
    console.log('err2')
    return
  }

  record.likes.push(userId)

  await record.save()

}

async function deleteById(id, userId) {
  const record = await Data.findById(id)

  if (!record) {
    throw new ReferenceError('Record not found!' + id)
  }

  if (record.author.toString() != userId) {
    throw new Error('Access Denied!')
  }

  await Data.findByIdAndDelete(id)


}

module.exports = {
  getAll,
  getById,
  update,
  deleteById,
  create,
  getRecent,
  likeStone
}