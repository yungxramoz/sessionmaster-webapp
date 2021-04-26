describe('Logout', () => {
  beforeEach(() => {
    //login before each test
    cy.visit('/login')
    cy.get('[data-cy="username-input"]').type(Cypress.env('username'))
    cy.get('[data-cy="password-input"]').type(Cypress.env('password'))
    cy.get('[data-cy="login-btn"]').click()
  })

  it('cancels logout action', () => {
    cy.get('[data-cy="logout-btn"]').click()
    cy.get('[data-cy="cancel-logout-btn"]').click()
  })

  it('successfully logs out', () => {
    cy.get('[data-cy="logout-btn"]').click()
    cy.get('[data-cy="to-logout-btn"]')
      .click()
      .should('be.disabled')

    //wait for the fake loader to be completed (1500)
    cy.location('pathname', { timeout: 2000 }).should('eq', '/')
  })
})
