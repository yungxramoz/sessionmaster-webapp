describe('Share sessionplan as authenticated user', () => {
  beforeEach(() => {
    //login before each test
    cy.server()
    cy.route('POST', '**/api/users/authenticate').as('auth')

    cy.visit('/login')

    cy.get('[data-cy="username-input"]').type(Cypress.env('username'))
    cy.get('[data-cy="password-input"]').type(Cypress.env('password'))
    cy.get('[data-cy="login-btn"]').click()

    cy.wait('@auth')

    cy.route('api/sessionplans').as('getPlans')

    cy.visit('/sessionplan/manager')
    cy.wait('@getPlans')

    cy.route('api/sessionplans/**').as('openPlan')

    const openSelector = 'open-' + Cypress.env('sessionplanName') + '-btn'

    cy.get('[data-cy="' + openSelector + '"]').click()
    cy.wait('@openPlan')
  })

  it('copies link in the share dialog', () => {
    cy.url().then(url => {
      cy.spy(window.navigator.clipboard, 'writeText').as('copy')
      cy.get('[data-cy="share-btn"]').click()

      cy.get('[data-cy="shared-link-input"]')
        .should('have.value', url)
        .should('have.attr', 'readonly')

      cy.get('.v-text-field__details').should('not.exist')
      cy.get('.mdi-check-circle .success--text').should('not.exist')

      cy.get('[data-cy="copy-link-btn"]')
        .click()
        .should('not.exist')

      cy.get('.v-text-field__details').should('exist')
      cy.get('.v-icon.mdi-check-circle.success--text').should('exist')
    })
  })
})
