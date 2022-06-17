const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
  before(async () => Book.sequelize.sync());

  beforeEach(async () => {
    await Book.destroy({ where: {} });
  });

  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const response = await request(app).post('/books').send({
          title: "Harry Potter and the Order of the Phoenix",
          author: "J.K Rowling",
          genre: "Young Adult",
          ISBN: "HJ5LDJF",
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal('Harry Potter and the Order of the Phoenix');
        expect(newBookRecord.title).to.equal('Harry Potter and the Order of the Phoenix');
        expect(newBookRecord.author).to.equal('J.K Rowling');
        expect(newBookRecord.genre).to.equal('Young Adult');
        expect(newBookRecord.ISBN).to.equal('HJ5LDJF');
      });

      it('errors if either title or author is missing', async() => {
          const response = await request(app).post('/books').send({});
          const newBookRecord = await Book.findByPk(response.body.id, {
              raw: true,
          });

          expect(response.status).to.equal(400);
          expect(response.body.errors.length).to.equal(2);
          expect(newBookRecord).to.equal(null);
      });
    });
  });

  describe('with records in the database', () => {
    let books;

    beforeEach(async () => {
      books = await Promise.all([
        Book.create({
            title: "Harry Potter and the Order of the Phoenix",
            author: "J.K Rowling",
            genre: "Young Adult",
            ISBN: "HJ5LDJF",
        }),
        Book.create({ title: "Be Wild, Be Free", author: "Amber Fossey", genre: "Self Help", ISBN: "NS6OJSD" }),
        Book.create({ title: "Pride & Predjudice", author: "Jane Austen", genre: "Romance", ISBN: "PO9SFDY" }),
      ]);
    });

    describe('GET /books', () => {
      it('gets all book records', async () => {
        const response = await request(app).get('/books');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
          expect(book.genre).to.equal(expected.genre);
          expect(book.ISBN).to.equal(expected.ISBN);
        });
      });
    });

    describe('GET /books/:id', () => {
      it('gets book record by id', async () => {
        const book = books[0];
        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.author).to.equal(book.author);
        expect(response.body.genre).to.equal(book.genre);
        expect(response.body.ISBN).to.equal(book.ISBN);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).get('/books/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('PATCH /books/:id', () => {
      it('updates book details by id', async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ ISBN: 'AD3IKNM' });
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.ISBN).to.equal('AD3IKNM');
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app)
          .patch('/books/12345')
          .send({ ISBN: 'AD3IKNM' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('DELETE /books/:id', () => {
      it('deletes book record by id', async () => {
        const book = books[0];
        const response = await request(app).delete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).delete('/books/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
  });
});