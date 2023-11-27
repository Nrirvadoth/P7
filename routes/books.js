const express = require('express')
const router = express.Router()
const bookCtrl = require('../controllers/books')
const auth = require('../middlewares/auth')
const multer = require('../middleware/multer-config')

router.get('/', bookCtrl.getAllBooks)
router.get('/:id', bookCtrl.getOneBook)
router.get('/bestrating', bookCtrl.bestRating)

router.post('/', auth, multer, bookCtrl.createBook)
router.put('/:id', auth, multer, bookCtrl.modifyBook)
router.delete('/:id', auth, bookCtrl.deleteBook)

router.post('/:id/rating', auth, bookCtrl.addRating)

module.export = router
