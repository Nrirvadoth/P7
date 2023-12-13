const express = require('express')
const router = express.Router()
const bookCtrl = require('../controllers/books')
const auth = require('../middlewares/auth')
const images = require('../middlewares/images')

router.get('/', bookCtrl.getAllBooks)
router.get('/bestrating', bookCtrl.bestRating)
router.get('/:id', bookCtrl.getOneBook)

router.post('/', auth, images.upload, images.optimize, bookCtrl.createBook)
router.put('/:id', auth, images.upload, images.optimize, bookCtrl.modifyBook)
router.delete('/:id', auth, bookCtrl.deleteBook)

router.post('/:id/rating', auth, bookCtrl.addRating)

module.exports = router
