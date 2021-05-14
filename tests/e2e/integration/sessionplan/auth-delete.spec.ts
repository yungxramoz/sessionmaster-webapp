describe('Delete sessionplan as authenticated user', () => {
  const deleteSelector = 'delete-' + Cypress.env('sessionplanName') + '-btn'
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

  it('cancels delete dialog', () => {
    cy.server()
    cy.route('api/sessionplans').as('getPlans')

    cy.route('DELETE', 'api/sessionplans/**').as('deletePlan')

    cy.visit('/sessionplan/manager')
    cy.wait('@getPlans')

    cy.get('[data-cy="' + deleteSelector + '"]').click()
    cy.get('[data-cy="cancel-delete-btn"]').click()
    cy.location('pathname').should('eq', '/sessionplan/manager')
  })

  it('delete sessionplan via manager', () => {
    cy.server()
    cy.route('api/sessionplans').as('getPlans')

    cy.route('DELETE', 'api/sessionplans/**').as('deletePlan')

    cy.visit('/sessionplan/manager')
    cy.wait('@getPlans')

    cy.get('[data-cy="' + deleteSelector + '"]').click()

    cy.get('[data-cy="confirm-delete-btn"]').click()
    cy.wait('@deletePlan')

    cy.get('[data-cy="' + deleteSelector + '"]').should('not.exist')
  })
})
