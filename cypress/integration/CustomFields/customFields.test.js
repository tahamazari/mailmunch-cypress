import CustomFieldsPage from "../../pages/CustomFields"

context('Cypress Mailmunch - Custom Fields Page Tests', () => {
  beforeEach(() => {
    cy.login()
  });

  it('Custom Fields', () => {
    cy.visit('/sites')
    const customFieldsPageTestCases = new CustomFieldsPage()

    cy.fixture('users').then(users => {
      const { admin } = users
      customFieldsPageTestCases.runTests({ ...admin })
    })
  })
})