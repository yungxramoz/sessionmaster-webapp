describe('Open a session as authenticated user', () => {
  const fullName = Cypress.env('firstname') + ' ' + Cypress.env('lastname')

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

  it('opens an initial session', () => {
    cy.server()
    cy.route('api/sessions/**').as('getSession')

    const sessionName = new Date().toDateString()

    cy.get('[data-cy="select-session-alert"]').should('be.visible')
    cy.get('[data-cy="session-title"]').should('not.exist')
    cy.get('[data-cy="participate-checkbox"]').should('not.exist')
    cy.get('[data-cy="participants-subheader"]').should('not.exist')
    cy.get('[data-cy="participant-' + fullName + '-chip"]').should('not.exist')

    cy.get('[data-cy="details-datepicker"]')
      .find('button.v-btn.v-btn--rounded:has(div.v-date-picker-table__events)')
      .first()
      .click()

    //TODO causes error when timing of the response is faster then the check
    // cy.get('[data-cy="session-progress-loading"]').should('be.visible')

    cy.wait('@getSession')

    cy.get('[data-cy="session-progress-loading"]').should('be.hidden')
    cy.get('[data-cy="session-title"]').contains(sessionName)
    cy.get('[data-cy="participate-checkbox"]').should('not.be.checked')
    cy.get('[data-cy="participants-subheader"]').should('not.be.visible')
    cy.get('[data-cy="participant-' + fullName + '-chip"]').should('not.exist')
    cy.get('[data-cy="no-participants-alert"]').should('be.visible')
  })

  it('selects date without a session', () => {
    cy.get('[data-cy="select-session-alert"]').should('be.visible')

    cy.get('[data-cy="details-datepicker"]')
      .find('button.v-btn.v-btn--rounded:not(:has(div.v-date-picker-table__events))')
      .first()
      .click()

    cy.get('[data-cy="select-session-alert"]').should('be.visible')
    cy.get('[data-cy="session-title"]').should('not.exist')
    cy.get('[data-cy="participate-checkbox"]').should('not.exist')
    cy.get('[data-cy="participants-subheader"]').should('not.exist')
    cy.get('[data-cy="participant-' + fullName + '-chip"]').should('not.exist')
  })
})
