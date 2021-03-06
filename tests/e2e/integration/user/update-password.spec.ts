describe('Update user password', () => {
  beforeEach(() => {
    //login before each test
    cy.server()
    cy.route('POST', '**/api/users/authenticate').as('auth')
    cy.route('**/api/users/*').as('getProfile')

    cy.visit('/login')

    cy.get('[data-cy="username-input"]').type(Cypress.env('username'))
    cy.get('[data-cy="password-input"]').type(Cypress.env('password'))
    cy.get('[data-cy="login-btn"]').click()

    cy.wait('@auth')

    cy.visit('/profile')

    cy.wait('@getProfile')

    cy.get('[data-cy="edit-profile-tab"]').should('have.class', 'v-tab--active')
  })

  after(() => {
    // reset password
    cy.get('[data-cy="password-input"]').type(Cypress.env('password'))
    cy.get('[data-cy="confirmpassword-input"]').type(Cypress.env('password'))
    cy.get('[data-cy="update-password-btn"]').click()
  })

  it('updates password', () => {
    cy.get('[data-cy="edit-password-tab"]')
      .click()
      .should('have.class', 'v-tab--active')

    cy.get('[data-cy="password-input"]')
      .type(Cypress.env('password') + 'Updated')
      .should('have.value', Cypress.env('password') + 'Updated')

    cy.get('[data-cy="confirmpassword-input"]')
      .type(Cypress.env('password') + 'Updated')
      .should('have.value', Cypress.env('password') + 'Updated')

    cy.get('[data-cy="update-password-btn"]')
      .should('be.enabled')
      .click()
      .should('be.disabled')

    cy.get('[data-cy="message-alert"]')
      .should('have.class', 'success')
      .contains('Successfully updated password')

    cy.get('[data-cy="password-input"]').should('have.value', '')
    cy.get('[data-cy="confirmpassword-input"]').should('have.value', '')
  })
})
