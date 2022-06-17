const { Book } = require('../models');

exports.create = (req, res) => {
    const newBook = req.body;

    Book
    .create(newBook)
    .then((newBookCreated) => res.status(201).json(newBookCreated))
    .catch((error) => {
        const errorMessages = error.errors.map((e) => e.message);

        return res.status(400).json({ errors: errorMessages });
    });
};

exports.findAll = async (req, res) => {
    const books = await Book.findAll();
    res.status(200).json(books);
};

exports.findByPk = async (req, res) => {
    const { id } = req.params;

    const book = await Book.findByPk(id);

    if(!book) {
        res.status(404).json({ error: 'The book could not be found.' });
    } else {
        res.status(200).json(book);
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const updateBook = req.body;

    const [ updatedRows ] = await Book.update(updateBook, {where: {id} });

    if(!updatedRows) {
        res.status(404).json({ error: 'The book could not be found.' });
    } else {
        res.status(200).json(updatedRows);
    }
};

exports.destroy = async (req, res) => {
    const { id } = req.params;
    
    const deletedRows = await Book.destroy({ where: { id }});

    if(!deletedRows) {
        res.status(404).json({ error: 'The book could not be found.' });
    } else {
    res.status(204).json(deletedRows);
    }
};






