describe('Update profile', () => {
  beforeEach(() => {
    //login before each test
    cy.visit('/login')
    cy.get('[data-cy="username-input"]').type(Cypress.env('username'))
    cy.get('[data-cy="password-input"]').type(Cypress.env('password'))
    cy.get('[data-cy="login-btn"]').click()
    cy.location('pathname', { timeout: 6000 }).should('eq', '/collection')

    cy.get('[data-cy="to-profile-btn"]').click()
    cy.location('pathname', { timeout: 2000 }).should('eq', '/profile')

    cy.get('[data-cy="edit-profile-tab"]').should('have.class', 'v-tab--active')
  })

  after(() => {
    // reset profile
    cy.get('[data-cy="firstname-input"]')
      .clear()
      .type(Cypress.env('firstname'))

    cy.get('[data-cy="lastname-input"]')
      .clear()
      .type(Cypress.env('lastname'))

    cy.get('[data-cy="username-input"]')
      .clear()
      .type(Cypress.env('username'))

    cy.get('[data-cy="update-profile-btn"]').click()
  })

  it('updates firstname', () => {
    cy.get('[data-cy="firstname-input"]')
      .type(' Updated')
      .should('have.value', Cypress.env('firstname') + ' Updated')

    cy.get('[data-cy="update-profile-btn"]')
      .should('be.enabled')
      .click()
      .should('be.disabled')

    cy.get('[data-cy="message-alert"]')
      .should('have.class', 'success')
      .contains('Successfully updated profile')
  })

  it('updates lastname', () => {
    cy.get('[data-cy="lastname-input"]')
      .type(' Updated')
      .should('have.value', Cypress.env('lastname') + ' Updated')

    cy.get('[data-cy="update-profile-btn"]')
      .should('be.enabled')
      .click()
      .should('be.disabled')

    cy.get('[data-cy="message-alert"]')
      .should('have.class', 'success')
      .contains('Successfully updated profile')
  })

  it('updates username', () => {
    cy.get('[data-cy="username-input"]')
      .type('_updated')
      .should('have.value', Cypress.env('username') + '_updated')

    cy.get('[data-cy="update-profile-btn"]')
      .should('be.enabled')
      .click()
      .should('be.disabled')

    cy.get('[data-cy="message-alert"]')
      .should('have.class', 'success')
      .contains('Successfully updated profile')
  })
})
