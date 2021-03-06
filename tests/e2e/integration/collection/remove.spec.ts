describe('Remove board game from collection', () => {
  beforeEach(() => {
    //login before each test
    cy.server()
    cy.route('POST', '**/api/users/authenticate').as('auth')
    cy.route('**/api/users/*/boardgames').as('getCollection')

    cy.visit('/login')

    cy.get('[data-cy="username-input"]').type(Cypress.env('username'))
    cy.get('[data-cy="password-input"]').type(Cypress.env('password'))
    cy.get('[data-cy="login-btn"]').click()

    cy.wait('@auth')
    cy.wait('@getCollection')

    cy.location('pathname').should('eq', '/collection')

    cy.get('[data-cy="progress-loading"]').should('not.exist')
  })

  it('removes board game', () => {
    cy.get('.boardgame')
      .first()
      .click()

    cy.get('[data-cy="remove-details-content"]').should('be.visible')

    cy.get('[data-cy="confirm-remove-btn"]')
      .click()
      .should('be.disabled')

    cy.get('[data-cy="remove-details-content"]', { timeout: 10000 }).should('not.be.visible')

    cy.get('[data-cy="message-alert"]')
      .should('have.class', 'success')
      .contains('Removed "' + Cypress.env('boardGameName') + '" from your treasure!')

    cy.get('.boardgame').should('have.length', 0)
  })
})
