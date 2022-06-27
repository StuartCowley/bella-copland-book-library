const { expect } = require('chai');
const request = require('supertest');
const { Author } = require('../src/models');
const app = require('../src/app');

describe('/authors', () => {
    before(async () => Author.sequelize.sync());

    beforeEach(async () => {
      await Author.destroy({ where: {} });
    });

  describe('with no records in the database', () => {
    describe('POST /authors', () => {
      it('creates a new author in the database', async () => {
        const response = await request(app).post('/authors').send({
          author: 'Stephanie Myers',
        });
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.author).to.equal('Stephanie Myers');
        expect(newAuthorRecord.author).to.equal('Stephanie Myers');
      });

      it('cannot create a author if there is no author', async () => {
        const response = await request(app).post('/authors').send({});
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors.length).to.equal(1);
        expect(newAuthorRecord).to.equal(null);
      });

      it('cannot create an author if it is not unique', async () => {
        const response1 = await request(app)
          .post('/authors')
          .send({ author: 'Margaret Atwood' });

        const response2 = await request(app)
          .post('/authors')
          .send({ author: 'Margaret Atwood' });

        const newAuthorRecordOnFirstCall = await Author.findByPk(
          response1.body.id,
          {
            raw: true,
          }
        );

        const newAuthorRecordOnSecondCall = await Author.findByPk(
          response2.body.id,
          {
            raw: true,
          }
        );

        expect(response1.status).to.equal(201);
        expect(response2.status).to.equal(400);

        expect(response1.body.errors).to.equal(undefined);
        expect(response2.body.errors.length).to.equal(1);

        expect(newAuthorRecordOnFirstCall.author).to.equal('Margaret Atwood');
        expect(newAuthorRecordOnSecondCall).to.equal(null);
      });
    });
  });

  describe('with records in the database', () => {
    let authors;

    beforeEach(async () => {
      await Author.destroy({ where: {} });

      authors = await Promise.all([
        Author.create({
          author: 'Margaret Atwood',
        }),
        Author.create({
          author: 'Stephen King',
        }),
        Author.create({ 
            author: 'Jane Austen',
        }),
      ]);
    });

    describe('GET /authors', () => {
      it('gets all author records', async () => {
        const response = await request(app).get('/authors');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((author) => {
          const expected = authors.find((a) => a.id === author.id);

          expect(author.author).to.equal(expected.author);
        });
      });
    });

    describe('GET /authors/:id', () => {
      it('gets author record by id', async () => {
        const author = authors[0];
        const response = await request(app).get(`/authors/${author.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.author).to.equal(author.author);
      });

      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app).get('/authors/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found');
      });
    });

    describe('PATCH /authors/:id', () => {
      it('updates author details by id', async () => {
        const author = authors[0];
        const response = await request(app)
          .patch(`/authors/${author.id}`)
          .send({ author: 'Charles Dickins' });
        const updatedAuthorRecord = await Author.findByPk(author.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedAuthorRecord.author).to.equal('Charles Dickins');
      });

      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app)
          .patch('/authors/12345')
          .send({ author: 'Charles Dickins' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found');
      });
    });

    describe('DELETE /authors/:id', () => {
      it('deletes an author record by id', async () => {
        const author = authors[0];
        const response = await request(app).delete(`/authors/${author.id}`);
        const deletedAuthor = await Author.findByPk(author.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedAuthor).to.equal(null);
      });

      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app).delete('/authors/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found');
      });
    });
  });
});