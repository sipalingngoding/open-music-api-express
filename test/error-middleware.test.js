const supertest  = require('supertest');

const app = require('../src')

describe('Test Error middleware', () => {
    it('should route not found',async () => {
        const response = await supertest(app)
            .get('/dsds')
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/route not found/i);
    });
});