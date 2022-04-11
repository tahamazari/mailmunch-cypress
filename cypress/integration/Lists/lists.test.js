import ListsPage from "../../pages/Lists"

context('Cypress Mailmunch - Lists Page Tests', () => {
  beforeEach(() => {
    cy.login()
  });

  it('Lists', () => {
    cy.visit('/users/sign_in')
    const listsPageTestCases = new ListsPage()

    cy.fixture('users').then(users => {
      const { admin } = users
      listsPageTestCases.runTests({ ...admin })
    })
  })
})