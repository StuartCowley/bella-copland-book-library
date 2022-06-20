const {
    getAllItems,
    createItem,
    updateItem,
    getItemsById,
    deleteItem,
} = require('./helpers');

const getReaders = (_, res) => getAllItems(res, 'reader');

const createReader = (req, res) => createItem(res, 'reader', req.body);

const updateReader = (req, res) => updateItem(res, 'reader', req.body, req.params.id);

const getReaderById = (req, res) => getItemsById(res, 'reader', req.params.id);

const deleteReader = (req, res) => deleteItem(res, 'reader', req.params.id);

module.exports = {
    getReaders,
    createReader,
    updateReader,
    getReaderById,
    deleteReader,
};

