describe('Authentication', () => {
  it('successfully logs in and logs out', () => {
    cy.visit('/login')

    cy.get('[data-cy="username-input"]')
      .type(Cypress.env('username'))
      .should('have.value', Cypress.env('username'))

    cy.get('[data-cy="password-input"]')
      .type(Cypress.env('password'))
      .should('have.value', Cypress.env('password'))

    cy.get('[data-cy="login-btn"]')
      .click()
      .should('be.disabled')

    cy.location('pathname', { timeout: 60000 }).should('eq', '/users')
  })
})
