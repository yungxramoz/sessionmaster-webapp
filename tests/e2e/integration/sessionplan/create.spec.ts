describe('Create sessionplans as authenticated user', () => {
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
  })

  it('manager shows initialy a message to create sessionplans', () => {
    cy.server()
    cy.route('api/sessionplans').as('getPlans')

    cy.visit('/sessionplan/manager')
      .get('[data-cy="progress-loading"]')
      .should('exist')

    cy.wait('@getPlans')

    cy.get('[data-cy="progress-loading"]').should('not.exist')

    cy.get('[data-cy="message-alert"]')
      .should('have.class', 'info')
      .contains('Plan your next game session!')
  })

  it('opens wizard via manager', () => {
    cy.server()
    cy.route('api/sessionplans').as('getPlans')

    cy.visit('/sessionplan/manager')
    cy.wait('@getPlans')

    cy.get('[data-cy="add-sessionplan-btn"]')
      .should('exist')
      .click()

    cy.location('pathname').should('eq', '/sessionplan/wizard')
  })

  it('opens wizard via home page', () => {
    cy.visit('/')

    cy.get('[data-cy="add-sessionplan-btn"]')
      .should('exist')
      .click()

    cy.location('pathname').should('eq', '/sessionplan/wizard')
  })

  it('creates new sessionplan in wizard', () => {
    cy.server()
    cy.route('POST', '**/sessionplans').as('planCreated')

    cy.visit('/sessionplan/wizard')
    cy.location('pathname').should('eq', '/sessionplan/wizard')

    cy.get('[data-cy="name-input"]')
      .type(Cypress.env('sessionplanName'))
      .should('have.value', Cypress.env('sessionplanName'))

    cy.get('[data-cy="next-to-2-btn"]').click()

    //choose first and last possible dates
    cy.get('[data-cy="wizard-datepicker"]')
      .find('button.v-btn.v-btn--rounded:not(.v-btn--disabled)')
      .first()
      .click()

    cy.get('[data-cy="wizard-datepicker"]')
      .find('button.v-btn.v-btn--rounded:not(.v-btn--disabled)')
      .last()
      .click()

    cy.get('[data-cy="next-to-3-btn"]').click()

    cy.get('[data-cy="overview-name-text"]').contains('Name: ' + Cypress.env('sessionplanName'))

    //remove second date
    cy.get('[data-cy="date-list"]')
      .find('div.v-list-item__action > button.v-btn')
      .last()
      .should('be.enabled')
      .click()
    cy.get('[data-cy="date-list"]')
      .find('div.v-list-item__action > button.v-btn')
      .first()
      .should('be.disabled')

    cy.get('[data-cy="back-to-2-btn"]').click()

    //check removed date
    cy.get('[data-cy="wizard-datepicker"]')
      .find('button.v-btn.v-btn--rounded.v-btn--active')
      .should('have.length', 1)

    cy.get('[data-cy="next-to-3-btn"]').click()
    cy.get('[data-cy="create-btn"]').click()

    cy.wait('@planCreated')

    cy.location('pathname').should('include', '/sessionplan/details/')

    cy.get('[data-cy="details-datepicker"]')
      .find('.v-date-picker-table__events')
      .should('have.length', 1)

    //check that auth specific controls are available
    cy.get('[data-cy=to-manager-btn]').should('exist')
    cy.get('[data-cy=to-name-input]').should('not.exist')
  })
})
