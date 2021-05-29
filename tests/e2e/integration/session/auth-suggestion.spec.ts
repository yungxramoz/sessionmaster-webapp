describe('Get suggestions by a session', () => {
  beforeEach(() => {
    //login before each test
    cy.server()
    cy.route('POST', '**/api/users/authenticate').as('auth')
    cy.route('api/sessions/*/boardgames').as('suggestions')
    cy.route('api/sessions/*').as('getSession')

    cy.visit('/login')

    cy.get('[data-cy="username-input"]').type(Cypress.env('username'))
    cy.get('[data-cy="password-input"]').type(Cypress.env('password'))
    cy.get('[data-cy="login-btn"]').click()

    cy.wait('@auth')

    cy.route('api/sessionplans').as('getPlans')

    cy.visit('/sessionplan/manager')
    cy.wait('@getPlans')

    cy.route('api/sessionplans/*').as('openPlan')

    const openSelector = 'open-' + Cypress.env('sessionplanName') + '-btn'

    cy.get('[data-cy="' + openSelector + '"]').click()
    cy.wait('@openPlan')

    cy.get('[data-cy="details-datepicker"]')
      .find('button.v-btn.v-btn--rounded:has(div.v-date-picker-table__events)')
      .first()
      .click()

    cy.wait('@suggestions')
    cy.wait('@getSession')
  })

  it('suggests games from the collection for one participant', () => {
    cy.get('[data-cy="suggestions-progress-loading"]').should('be.not.visible')

    cy.get('[data-cy="collection-suggestion-subheader"]').contains('In participants collection:')
    cy.get('[data-cy="other-suggestion-btn"]').should('be.enabled')
    cy.get('[data-cy="suggestion-content"]').should('be.not.visible')
    cy.get('[data-cy="collection-' + Cypress.env('boardGameName') + '"]').should('exist')
  })

  it('suggests other games playable for one participant', () => {
    cy.server()
    cy.route('api/boardgames/**').as('otherSuggestions')

    cy.get('[data-cy="other-suggestion-btn"]')
      .should('be.enabled')
      .click()
      .should('be.disabled')

    cy.wait('@otherSuggestions')

    cy.get('[data-cy="suggestion-content"]').should('be.visible')

    cy.get('[data-cy="back-to-sessionplan-btn"]')
      .should('be.visible')
      .click()

    cy.get('[data-cy="suggestion-content"]').should('not.be.visible')
  })
})
