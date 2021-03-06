describe('Delete user', () => {
  beforeEach(() => {
    //login before each test
    cy.server()
    cy.route('POST', '**/api/users/authenticate').as('auth')

    cy.visit('/login')

    cy.get('[data-cy="username-input"]').type(Cypress.env('username'))
    cy.get('[data-cy="password-input"]').type(Cypress.env('password'))
    cy.get('[data-cy="login-btn"]').click()

    cy.wait('@auth')

    cy.visit('/profile')
  })

  it('cancels delete dialog', () => {
    cy.get('[data-cy="delete-btn"]').click()
    cy.get('[data-cy="cancel-delete-btn"]').click()
    cy.location('pathname').should('eq', '/profile')
  })

  it('successfully deletes test user', () => {
    cy.get('[data-cy="delete-btn"]').click()

    cy.get('[data-cy="confirm-delete-btn"]')
      .click()
      .should('be.disabled')

    cy.location('pathname', { timeout: 6000 }).should('eq', '/')
  })
})
