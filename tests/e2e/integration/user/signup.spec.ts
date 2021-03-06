describe('Sign up user', () => {
  it('successfully register test user', () => {
    cy.server()
    cy.route('POST', '**/api/users/register').as('signedUp')

    cy.visit('/')
    cy.get('[data-cy="to-login-btn"]').click()
    cy.location('pathname').should('eq', '/login')

    cy.get('[data-cy="to-signup-link"]').click()
    cy.location('pathname').should('eq', '/signup')

    cy.get('[data-cy="firstname-input"]')
      .type(Cypress.env('firstname'))
      .should('have.value', Cypress.env('firstname'))

    cy.get('[data-cy="lastname-input"]')
      .type(Cypress.env('lastname'))
      .should('have.value', Cypress.env('lastname'))

    cy.get('[data-cy="username-input"]')
      .type(Cypress.env('username'))
      .should('have.value', Cypress.env('username'))

    cy.get('[data-cy="password-input"]')
      .type(Cypress.env('password'))
      .should('have.value', Cypress.env('password'))

    cy.get('[data-cy="confirmpassword-input"]')
      .type(Cypress.env('password'))
      .should('have.value', Cypress.env('password'))

    cy.get('[data-cy="signup-btn"]')
      .should('be.enabled')
      .click()
      .should('be.disabled')

    cy.wait('@signedUp')

    cy.location('pathname').should('eq', '/collection')
  })
})
