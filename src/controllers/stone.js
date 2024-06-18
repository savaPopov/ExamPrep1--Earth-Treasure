const { Router } = require('express');
const { create, getById, update, deleteById, likeStone } = require('../services/data');
const { body, validationResult } = require('express-validator');
const { isUser } = require('../middlewares/guards');
const { parseError } = require('../util');

const stoneRouter = Router()

stoneRouter.get('/create', isUser(), async (req, res) => {
  res.render('create')
})

stoneRouter.post('/create', isUser(),
  body('name').trim().isLength({ min: 2 }).withMessage('Name should be at least 2 charachters long'),
  body('category').trim().isLength({ min: 3 }).withMessage('Category must be at least 3 charachters long'),
  body('color').trim().isLength({ min: 2 }).withMessage('Color should be at least 2 charachters long'),
  body('formula').trim().isLength({ min: 3, max: 30 }).withMessage('Formula should be between 3 and 30 charachters'),
  body('location').trim().isLength({ min: 5, max: 15 }).withMessage('Location should be between 5 and 15 charachters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description should be at least 10 charachters long'),
  body('image').trim().isURL({ require_tld: false }).withMessage('Image must be a valid URL'),
  async (req, res) => {

    try {
      const validation = validationResult(req)

      if (validation.errors.length) {
        throw validation.errors
      }

      const result = await create(req.body, req.user._id)
      res.redirect('/catalog')
    } catch (err) {
      res.render('create', { data: req.body, errors: parseError(err).errors })
    }
  }
)

stoneRouter.get('/edit/:id', isUser(), async (req, res) => {
  const stone = await getById(req.params.id)


  if (!stone) {
    res.render('404')
  }

  const isOwner = req.user?._id == stone.author.toString()

  if (!isOwner) {
    res.redirect('/login')
    return;
  }

  res.render('edit', { data: stone })
})

stoneRouter.post('/edit/:id', isUser(),
  body('name').trim().isLength({ min: 2 }).withMessage('Name should be at least 2 charachters long'),
  body('category').trim().isLength({ min: 3 }).withMessage('Category must be at least 3 charachters long'),
  body('color').trim().isLength({ min: 2 }).withMessage('Color should be at least 2 charachters long'),
  body('formula').trim().isLength({ min: 3, max: 30 }).withMessage('Formula should be between 3 and 30 charachters'),
  body('location').trim().isLength({ min: 5, max: 15 }).withMessage('Location should be between 5 and 15 charachters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description should be at least 10 charachters long'),
  body('image').trim().isURL({ require_tld: false }).withMessage('Image must be a valid URL'),
  async (req, res) => {
    const stoneId = req.params.id
    const userId = req.user._id

    try {
      const validation = validationResult(req)

      if (validation.errors.length) {
        throw validation.errors
      }

      const result = await update(stoneId, req.body, req.user._id)
      res.redirect('/catalog/' + stoneId)
    } catch (err) {
      res.render('create', { data: req.body, errors: parseError(err).errors })
    }
  }
)

stoneRouter.get('/like/:id', isUser(), async (req, res) => {
  const stoneId = req.params.id
  const userId = req.user._id

  try {

    const result = await likeStone(stoneId, userId)
    res.redirect('/catalog/' + stoneId)
  } catch (err) {
    res.redirect('/')
  }
}
)

stoneRouter.get('/delete/:id', isUser(), async (req, res) => {
  const stoneId = req.params.id
  const userId = req.user._id

  try {

    const result = await deleteById(stoneId, userId)
    res.redirect('/')
  } catch (err) {
    res.redirect('/catalog/' + stoneId)
  }
}
)


module.exports = {
  stoneRouter
}

