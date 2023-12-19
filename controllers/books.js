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
  const book = new Book({
    ...object,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    ratings: [{ userId: req.auth.userId, grade: object.ratings[0].grade }],
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

exports.addRating = async (req, res, next) => {
  let totalScore = 0
  let updateAverageRating = 0

  const bookToUpdate = await Book.findOne({ _id: req.params.id })
  const ratingExist = bookToUpdate.ratings.find(bookRatings => bookRatings.userId === req.auth.userId)

  if (ratingExist) {
    res.status(401).json({ message: "Vous avez déjà noté ce livre" })
    return
  }

  try {
    const updateBook = await Book.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          ratings: {
            userId: req.auth.userId,
            grade: req.body.rating,
          },
        },
      },
      { new: true },
    )
    for (let i = 0; i < updateBook.ratings.length; i++) {
      totalScore += updateBook.ratings[i].grade
    }
    updateAverageRating = totalScore / updateBook.ratings.length
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { averageRating: updateAverageRating } },
      { new: true },
    )
    res.status(200).json(book)
  } catch (error) {
    res.status(400).json({ error })
  }
}