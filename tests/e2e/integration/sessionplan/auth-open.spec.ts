describe('Open sessionplans as authenticated user', () => {
  beforeEach(() => {
    //login before each test
    cy.server()
    cy.route('POST', '**/api/users/authenticate').as('auth')

    cy.visit('/login')

    cy.get('[data-cy="username-input"]').type(Cypress.env('username'))
    cy.get('[data-cy="password-input"]').type(Cypress.env('password'))
    cy.get('[data-cy="login-btn"]').click()

    cy.wait('@auth')
  })

  it('opens sessionplan via manager', () => {
    cy.server()
    cy.route('api/sessionplans').as('getPlans')

    cy.visit('/sessionplan/manager')
    cy.wait('@getPlans')

    cy.route('api/sessionplans/**').as('openPlan')

    const openSelector = 'open-' + Cypress.env('sessionplanName') + '-btn'

    cy.get('[data-cy="' + openSelector + '"]').click()
    cy.wait('@openPlan')

    cy.location('pathname').should('include', '/sessionplan/details/')
  })
})
