describe('Add board game to collection', () => {
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

  it('shows initialy a message to add board games', () => {
    cy.get('[data-cy="message-alert"]')
      .should('have.class', 'info')
      .contains('Start collecting your board games!')
  })

  it('adds board game', () => {
    cy.get('[data-cy="add-boardgame-btn"]').click()

    cy.get('[data-cy="add-content"]').should('be.visible')

    cy.get('[data-cy="search-boardgame-input"]')
      .type(Cypress.env('boardGameName'))
      .should('have.value', Cypress.env('boardGameName'))

    cy.get('[data-cy="search-boardgame-btn"]')
      .should('be.enabled')
      .click()
      .should('be.disabled')

    cy.get('[data-cy="boardgame-list"]', { timeout: 10000 })
      .should('not.be.empty')
      .children()
      .first()
      .contains(Cypress.env('boardGameName'))
      .click()

    cy.get('[data-cy="add-details-content"]').should('be.visible')

    cy.get('[data-cy="confirm-add-btn"]')
      .click()
      .should('be.disabled')

    cy.get('[data-cy="add-details-content"]', { timeout: 10000 }).should('not.be.visible')

    cy.get('[data-cy="message-alert"]')
      .should('have.class', 'success')
      .contains('Added "' + Cypress.env('boardGameName') + '" to your treasure!')

    cy.get('[data-cy="back-to-collection-btn"]').click()
    cy.get('[data-cy="add-content"]').should('not.be.visible')

    cy.get('.boardgame').should('have.length', 1)
  })

  it('does not display already added board games in search', () => {
    cy.get('[data-cy="add-boardgame-btn"]').click()

    cy.get('[data-cy="add-content"]').should('be.visible')

    cy.get('[data-cy="search-boardgame-input"]')
      .type(Cypress.env('boardGameName'))
      .should('have.value', Cypress.env('boardGameName'))

    cy.get('[data-cy="search-boardgame-btn"]')
      .should('be.enabled')
      .click()
      .should('be.disabled')

    cy.get('[data-cy="boardgame-list"]', { timeout: 10000 })
      .find('div.v-list-item__subtitle')
      .first()
      .should('not.have.text', Cypress.env('boardGameName'))
  })

  it('displays information that no board game was found', () => {
    cy.get('[data-cy="add-boardgame-btn"]').click()

    cy.get('[data-cy="add-content"]').should('be.visible')

    cy.get('[data-cy="search-boardgame-input"]')
      .type('This will not show any games')
      .should('have.value', 'This will not show any games')

    cy.get('[data-cy="search-boardgame-btn"]')
      .should('be.enabled')
      .click()
      .should('be.disabled')

    cy.get('[data-cy="message-alert"]')
      .should('have.class', 'info')
      .contains('No board game found')
  })
})
