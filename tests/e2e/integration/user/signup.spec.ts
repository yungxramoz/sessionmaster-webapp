describe('SignUp', () => {
  it('successfully register test user', () => {
    cy.visit('/')
    cy.get('[data-cy="to-login-btn"]').click()
    cy.location('pathname').should('eq', '/login')

    cy.get('[data-cy="to-signup-link"]').click()
    cy.location('pathname').should('eq', '/signup')
    cy.get('[data-cy="firstname-input"]').type(Cypress.env('firstname'))
    cy.get('[data-cy="lastname-input"]').type(Cypress.env('lastname'))
    cy.get('[data-cy="username-input"]').type(Cypress.env('username'))
    cy.get('[data-cy="password-input"]').type(Cypress.env('password'))
    cy.get('[data-cy="confirmpassword-input"]').type(Cypress.env('password'))
    cy.get('[data-cy="signup-btn"]').click()

    cy.location('pathname', { timeout: 60000 }).should('eq', '/users')
  })
})
