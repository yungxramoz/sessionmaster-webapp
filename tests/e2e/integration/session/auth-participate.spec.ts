describe('Register to a session as authenticated user', () => {
  const fullName = Cypress.env('firstname') + ' ' + Cypress.env('lastname')

  beforeEach(() => {
    //login before each test
    cy.server()
    cy.route('POST', '**/api/users/authenticate').as('auth')
    cy.route('api/sessions/**').as('getSession')

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

    cy.get('[data-cy="details-datepicker"]')
      .find('button.v-btn.v-btn--rounded:has(div.v-date-picker-table__events)')
      .first()
      .click()

    cy.wait('@getSession')
  })

  it('registers to a session', () => {
    cy.server()
    cy.route('POST', 'api/sessions/**/register').as('register')
    cy.route('api/sessions/**/boardgames').as('suggestions')

    const sessionName = new Date().toDateString()

    cy.get('[data-cy="suggestions-progress-loading"]').should('be.not.visible')
    cy.get('[data-cy="collection-suggestion-subheader"]').should('be.not.visible')
    cy.get('[data-cy="other-suggestion-btn"]').should('be.not.visible')
    cy.get('[data-cy="suggestion-dialog"]').should('be.not.visible')

    cy.get('[data-cy="participate-checkbox"]')
      .should('not.be.checked')
      .parent() //workaround because vuetify sets the data attribute on a div
      .click()

    cy.get('[data-cy="session-progress-loading"]').should('be.visible')

    cy.wait('@register')

    cy.get('[data-cy="suggestions-progress-loading"]').should('be.visible')
    cy.get('[data-cy="other-suggestion-btn"]').should('be.disabled')

    cy.get('[data-cy="session-progress-loading"]').should('not.be.visible')
    cy.get('[data-cy="participate-checkbox"]').should('be.checked')

    cy.get('[data-cy="message-alert"]')
      .should('have.class', 'success')
      .contains(sessionName)

    cy.get('[data-cy="select-session-alert"]').should('be.not.visible')
    cy.get('[data-cy="session-progress-loading"]').should('be.hidden')
    cy.get('[data-cy="session-title"]').contains(sessionName)

    cy.get('[data-cy="participants-subheader"]').contains('1 Participants:')
    cy.get('[data-cy="participant-' + fullName + '-chip"]')
      .should('exist')
      .should('not.have.class', 'v-chip--outlined')
      .contains(fullName)
  })
})
