describe('Cancel participation a session as authenticated user', () => {
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

  it('cancels participation', () => {
    cy.server()
    cy.route('POST', 'api/sessions/**/cancel').as('cancel')

    const sessionName = new Date().toDateString()

    cy.get('[data-cy="participate-checkbox"]')
      .should('be.checked')
      .parent() //workaround because vuetify sets the data attribute on a div
      .click()

    cy.get('[data-cy="session-progress-loading"]').should('be.visible')

    cy.wait('@cancel')

    cy.get('[data-cy="session-progress-loading"]').should('not.be.visible')
    cy.get('[data-cy="participate-checkbox"]').should('not.be.checked')
    cy.get('[data-cy="message-alert"]')
      .should('have.class', 'success')
      .contains(sessionName)

    cy.get('[data-cy="session-progress-loading"]').should('be.hidden')
    cy.get('[data-cy="session-title"]').contains(sessionName)
    cy.get('[data-cy="participants-subheader"]').should('not.be.visible')
    cy.get('[data-cy="participant-' + fullName + '-chip"]').should('not.exist')
    cy.get('[data-cy="no-participants-alert"]').should('be.visible')
  })
})
