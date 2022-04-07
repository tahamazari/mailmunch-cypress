import ListsPage from "../../pages/Lists"

context('Cypress Mailmunch - Lists Page Tests', () => {
  beforeEach(() => {
    cy.exec("cd ../; cd ../; cd ../;")
    // cy.exec("cd ..")
    // cy.exec("cd ..")
    cy.exec("ls")
    cy.exec("cd mailmunch")
    cy.exec("cd docker")
    cy.exec("docker-compose run rails rails db:seed")

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