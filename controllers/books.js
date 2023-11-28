const Book = require('../models/Book')

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books)
    })
    .catch((error) => {
      res.status(400).json({error})
    })
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then((book) => {
      res.status(200).json(book)
    })
    .catch((error) => {
      res.status(400).json({error})
    })
}

exports.bestRating = (req, res, next) => {}

exports.createBook = (req, res, next) => {}

exports.modifyBook = (req, res, next) => {}

exports.deleteBook = (req, res, next) => {}

exports.addRating = (req, res, next) => {}
