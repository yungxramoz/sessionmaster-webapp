describe('Authenticate user', () => {
  it('successfully logs in', () => {
    //login before each test
    cy.server()
    cy.route('POST', '**/api/users/authenticate').as('auth')
    cy.route('**/api/users/*').as('getProfile')

    cy.visit('/login')

    cy.get('[data-cy="username-input"]')
      .type(Cypress.env('username'))
      .should('have.value', Cypress.env('username'))

    cy.get('[data-cy="password-input"]')
      .type(Cypress.env('password'))
      .should('have.value', Cypress.env('password'))

    cy.get('[data-cy="login-btn"]')
      .click()
      .should('be.disabled')

    cy.wait('@auth')

    cy.location('pathname').should('eq', '/collection')
  }),
    it('shows error alert on wrong credentials', () => {
      //login before each test
      cy.server()
      cy.route('POST', '**/api/users/authenticate').as('auth')

      cy.visit('/login')

      cy.get('[data-cy="username-input"]')
        .type('123')
        .should('have.value', '123')

      cy.get('[data-cy="password-input"]')
        .type('123')
        .should('have.value', '123')

      cy.get('[data-cy="login-btn"]')
        .click()
        .should('be.disabled')

      cy.wait('@auth')

      cy.location('pathname').should('eq', '/login')

      cy.get('[data-cy="message-alert"]').should('have.class', 'error')
    })
})
