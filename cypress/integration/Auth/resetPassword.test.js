import ResetPasswordPage from "../../pages/ResetPassword"

context('Cypress Mailmunch - Reset Password Page Tests', () => {
  beforeEach(() => {
    cy.fixture("users.json").as("users");
  });

  it('Reset Password', () => {
    cy.visit('/users/password/new')

    const resetPasswordPageTestCases = new ResetPasswordPage()

    cy.fixture('users').then(users => {
      const { admin } = users
      resetPasswordPageTestCases.runTests({ ...admin })
    })
  })
})