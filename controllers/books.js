const Book = require('../models/Book')

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books)
    })
    .catch((error) => {
      res.status(400).json({ error })
    })
}

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      res.status(200).json(book)
    })
    .catch((error) => {
      res.status(400).json({ error })
    })
}

exports.bestRating = (req, res, next) => {
  Book.aggregate([{ $sort: { averageRating: -1 } }, { $limit: 3 }])
    .then((bestRated) => {
      res.status(200).json(bestRated)
    })
    .catch((error) => {
      res.status(400).json({ error })
    })
}

exports.createBook = (req, res, next) => {
  const object = JSON.parse(req.body.book)
  delete object.userId
  delete object.ratings.userId
  const book = new Book({
    ...object,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    ratings: [{ userId: req.auth.userId, grade: `${object.ratings[0].grade}` }],
  })
  book
    .save()
    .then(() => {
      res.status(201).json({ message: 'Livre créé' })
    })
    .catch((error) => {
      res.status(400).json({ error })
    })
}

exports.modifyBook = (req, res, next) => {
  let book
  if (req.file) {
    const object = JSON.parse(req.body.book)
    book = new Book({
      ...object,
      _id: req.params.id,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`,
    })
  } else {
    book = new Book({
      ...req.body,
      _id: req.params.id,
      userId: req.auth.userId,
    })
  }
  Book.updateOne({ _id: req.params.id }, book)
    .then(() => {
      res.status(200).json({ message: 'Livre modifié' })
    })
    .catch((error) => {
      res.status(400).json({ error })
    })
}

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ message: 'Livre supprimé' })
    })
    .catch((error) => {
      res.status(400).json({ error })
    })
}

exports.addRating = (req, res, next) => {
  const newRating = req.body
  let totalScore = 0
  let updateAverageRating = 0

  try {
    const updateBook = Book.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          ratings: {
            userId: newRating.userId,
            grade: newRating.rating,
          },
        },
      },
    )
      .then(() => {
        for (let i = 0; i < updateBook.ratings.length; i++) {
          totalScore += updateBook.ratings[i].grade
        }
        updateAverageRating = totalScore / (updateBook.ratings.length + 1)
        Book.findOneAndUpdate(
          { _id: req.params.id },
          { $set: { averageRating: updateAverageRating } },
        )
          .then((book) => {
            res.status(200).json(book)
          })
          .catch((error) => {
            res.status(400).json({ error })
          })
      })
      .catch((error) => {
        res.status(400).json({ error })
      })
  } catch (error) {
    res.status(400).json({ error })
  }
}
/* 
Book.aggregate([
  { $match: { _id: req.params.id } },
  { $set: {averageRating: $avg {ratings.grade}}}
]) */
