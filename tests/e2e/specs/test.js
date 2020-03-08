// https://docs.cypress.io/api/introduction/api.html

describe('Test loading images', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'Welcome to Your Vue.js App')
  })
})
