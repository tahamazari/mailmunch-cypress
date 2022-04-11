import { generateRandomName, generateRandomNumber, interceptGqlRequest } from "../utils/helpers"

class ListsPage {
  constructor(){
    cy.intercept('POST', 'http://localhost:4000/', (req) => {
      if (req.body.operationName === 'UserSites'){
        req.alias = "UserSites"
      }
    })
    cy.wait('@UserSites')
    .its('response.body.data.sites').should('exist')
    .then(sites => {
      cy.visit(`/sites/${sites[0].id}/lists`)
    })
  }

  runTests(){
    this.verifyAtleastOneListExists()
    this.verifyPreventDeletingOnlyExistingList()
    this.verifySuccessfulCreateList()
    this.verifySuccessfulDoubleOptInUpdate()
    this.verifySuccessfulUpdateList()
    this.verifySuccessfulDeleteList()
  }


  verifyAtleastOneListExists(){
    interceptGqlRequest({ alias: "getSite", opName: "Site" })
    cy.wait('@getSite')
    .its("response.body.data.site.lists").its("length").should("be.gt", 0)
  }

  verifyPreventDeletingOnlyExistingList(){
    cy.get('[data-attribute="icon-list-delete-0"]').click()
    cy.get("[data-attribute='button-delete-list']").should('have.class', 'pointer-events-none')
    cy.contains("Discard").click()
  }

  verifySuccessfulCreateList(){
    interceptGqlRequest({ fixture: 'List/createList', alias: 'createList' })

    cy.get('[data-attribute="button-create-new-list"]').click()
    cy.get('[data-attribute="input-list-name"]').type(generateRandomName())
    cy.get('[data-attribute="button-upsert-list"]').click()

    cy.wait('@createList')
    .its("response.body.data.createList.success").should("eq", true) 
  }

  verifySuccessfulDeleteList(){
    interceptGqlRequest({ fixture: 'List/deleteListAndAssignNewList', alias: 'deleteListAndAssignNewList' })

    cy.get('[data-attribute="icon-list-delete-1"]').click()
    cy.get('[data-attribute="choose-new-list"]').click()
    cy.get('[data-attribute="choose-new-list"]').within(() => {
      cy.get('[class$=-MenuList]').children().eq(0).click()
    })
    cy.get("[data-attribute='button-delete-list']").click()

    cy.wait('@deleteListAndAssignNewList')
    .its("response.body.data.deleteListAndAssignNewList.success").should("eq", true)
  }

  verifySuccessfulDoubleOptInUpdate(){
    interceptGqlRequest({ fixture: 'List/updateList', alias: 'updateList' })

    cy.get("[data-attribute=toggle-list-opt-in-0]").click()
    
    cy.wait("@updateList")
    .its("response.body.data.updateList.success").should("eq", true)
  }

  verifySuccessfulUpdateList(){
    interceptGqlRequest({ fixture: 'List/updateList', alias: 'updateList' })

    cy.get('[data-attribute="icon-list-update-0"]').click()

    cy.get('[data-attribute="input-list-name"]').type("-updated")
    
    cy.get("[data-attribute='list-update-set-locale']").click()

    cy.get('[data-attribute="list-update-set-locale"]').within(() => {
      cy.get('[class$=-MenuList]').children().eq(generateRandomNumber({ ceiling: 15 })).click()
    })

    cy.get("[data-attribute='toggle-list-opt-in-form']").click()

    cy.get("body").then($body => {
      if($body.find(".ql-container").length){
        cy.get(".ql-container").type(generateRandomName())
        cy.get("[data-attribute='button-upsert-list']").click()
        cy.wait("@updateList")
        .its("response.body.data.updateList.success").should("eq", true)
      }
      else{
        cy.get("[data-attribute='button-upsert-list']").click()
        cy.wait("@updateList")
        .its("response.body.data.updateList.success").should("eq", true)
      }
    })
  }
}

export default ListsPage