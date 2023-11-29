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

exports.createBook = (req, res, next) => {
    const object = JSON.parse(req.body.book)
    delete object.userId
    delete object.ratings.userId
    const book = new Book({
        ...object,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        ratings: [{userId: req.auth.userId, grade: `${object.ratings[0].grade}`}]
    })
    book.save()
    .then(() => {
      res.status(201).json({ message: 'Livre créé'})
    })
    .catch((error) => {
      res.status(400).json({error})
    })
}

exports.modifyBook = (req, res, next) => {}

exports.deleteBook = (req, res, next) => {}

exports.addRating = (req, res, next) => {}
