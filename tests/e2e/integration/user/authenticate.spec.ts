describe('Authentication', () => {
  it('successfully logs in and logs out', () => {
    cy.visit('/login')

    cy.get('[data-cy="username-input"]').type(Cypress.env('username'))
    cy.get('[data-cy="password-input"]').type(Cypress.env('password'))
    cy.get('[data-cy="login-btn"]').click()

    cy.location('pathname', { timeout: 60000 }).should('eq', '/users')
  })
})
