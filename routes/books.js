const express = require('express')
const router = express.Router()
const bookCtrl = require('../controllers/books')
const auth = require('../middlewares/auth')
const multer = require ('../middleware/multer-config')

