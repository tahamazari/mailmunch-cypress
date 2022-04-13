import { generateRandomString, interceptGqlRequest } from "../../utils/helpers"
import { data } from "./data"

class NewSubscriber {
  data = data
  iterable = 0

  updateUserData = () => {
    this.iterable += 1
    const newData = data.map(({ type, value }) => {
      if(type === "email"){
        let modifiedData = `${value.split("@")[0]}-${this.iterable}`
        return {type, value: [modifiedData, value.split("@")[1]].join("@")}
      }
      else if(type === "phoneNumber" || type === "zipCode"){
        let modifiedData = `${value}${this.iterable}`
        return {type, value: modifiedData}
      }
      else if(type === "website"){
        let modifiedData = `${value.split(".")[0]}-${this.iterable}`
        return {type, value: [modifiedData, value.split(".")[1]].join(".")}
      }
      return { type, value }
    })
    
    return newData
  }

  runTests(){
    this.verifyCreateNewSubscriber()
    this.verifyCreateNewSubscriber()
    this.verifyFieldValidation()
    this.verifyValidEmailField()
    this.verifyEmailFieldNotEmpty()
    this.verifySubscriberAlreadyExists()
  }

  insertDataCustomField = ({ dataAttribute, dataKey, customData = '' }) => {
    cy.get(`[data-attribute=dropdown-subscriber-upsert-add-custom-field]`).click()    
    cy.get(`[data-attribute=dropdown-item-subscriber-upsert-${dataAttribute}]`).click()
    cy.get(`[data-attribute=input-subscriber-upsert-${dataAttribute}]`)
    .type(customData ? customData : this.data.find(item => item.type === dataKey)?.value)
  }

  addListOrTag = ({ type, itemName, sendAutoResponders = false }) => {
    cy.get(`[data-attribute="select-subscriber-upsert-add-to-${type}"]`).click()
    cy.get(`[data-attribute="select-subscriber-upsert-add-to-${type}"]`).within(() => {
      cy.get('[class$=-MenuList]').children().contains(itemName).click()
    })
    if(sendAutoResponders && type === "list"){
      cy.get(`[data-attribute="button-subscriber-upsert-send-autoresponders-yes"]`).click()
    }
    else if(!sendAutoResponders && type === "list"){
      cy.get(`[data-attribute="button-subscriber-upsert-send-autoresponders-no"]`).click()
    }
  }

  populateCustomFields = () => {
    this.insertDataCustomField({ 
      dataAttribute: 'zip_code',
      dataKey: "zipCode"
    })

    this.insertDataCustomField({ 
      dataAttribute: 'company',
      dataKey: "company"
    })

    this.insertDataCustomField({ 
      dataAttribute: 'website',
      dataKey: "website"
    })

    this.insertDataCustomField({ 
      dataAttribute: 'phone_number',
      dataKey: "phoneNumber"
    })

    this.insertDataCustomField({ 
      dataAttribute: 'name',
      dataKey: "name"
    })
  }

  populateListAndTags = () => {
    this.addListOrTag({
      type: 'list', 
      itemName: 'Karachi', 
      sendAutoResponders: true
    })

    this.addListOrTag({
      type: 'list', 
      itemName: 'Lahore'
    })

    this.addListOrTag({
      type: 'tag', 
      itemName: 'Khyber'
    })

    this.addListOrTag({
      type: 'tag', 
      itemName: 'Sindh' 
    })

    this.addListOrTag({
      type: 'list', 
      itemName: 'Multan', 
      sendAutoResponders: true
    })
  }

  isCustomFieldValid = ({ dataAttribute, customData }) => {
    this.insertDataCustomField({ dataAttribute, customData })

    cy.get("[data-attribute=button-subscriber-upsert-save]").click()
    cy.get(`[data-attribute='tooltip-subscriber-upsert-${dataAttribute}']`).should("exist")
  }

  openCreateNewSubscriberModal = () => {
    cy.get("[data-attribute=dropdown-subscriber-create-new]").click()
    cy.get(`[data-attribute=dropdown-item-subscriber-create-new-addNewContact]`).click()
  }

  verifyFieldValidation = () => {
    this.openCreateNewSubscriberModal()
    this.isCustomFieldValid({ dataAttribute: 'zip_code', customData: generateRandomString() })
    this.isCustomFieldValid({ dataAttribute: 'website', customData: generateRandomString() })
    this.isCustomFieldValid({ dataAttribute: 'phone_number', customData: generateRandomString() })
    cy.get("[data-attribute=modal-close-subscriber-upsert]").click()
  }

  verifyValidEmailField = () => {
    this.openCreateNewSubscriberModal()
    cy.get('[data-attribute=input-subscriber-upsert-email]').type(generateRandomString())
    cy.get("[data-attribute=button-subscriber-upsert-save]").click()
    cy.get(`[data-attribute='tooltip-subscriber-upsert-email']`).should("exist")
    cy.get("[data-attribute=modal-close-subscriber-upsert]").click()
  }

  verifyEmailFieldNotEmpty = () => {
    this.openCreateNewSubscriberModal()
    cy.get("[data-attribute=button-subscriber-upsert-save]").click()
    cy.get(`[data-attribute='tooltip-subscriber-upsert-email']`).should("exist")
    cy.get("[data-attribute=modal-close-subscriber-upsert]").click()
  }

  verifyCreateNewSubscriber(){
    interceptGqlRequest({ alias: 'createSubscriber' })
    this.openCreateNewSubscriberModal()

    cy.get('[data-attribute=input-subscriber-upsert-first-name]').type(this.data[0].value)
    cy.get('[data-attribute=input-subscriber-upsert-last-name]').type(this.data[1].value)
    cy.get('[data-attribute=input-subscriber-upsert-email]').type(this.data[3].value)

    this.populateListAndTags()
    this.populateCustomFields()

    this.data = this.updateUserData()

    cy.get("[data-attribute=button-subscriber-upsert-save]").click()

    cy.wait('@createSubscriber')
    .its("response.body.data.createSubscriber.success").should("eq", true)
  }

  verifySubscriberAlreadyExists = () => {
    interceptGqlRequest({ alias: 'createSubscriber' })
    this.openCreateNewSubscriberModal()
    cy.get('[data-attribute=input-subscriber-upsert-email]').type("admin@mailmunch.com")
    cy.get("[data-attribute=button-subscriber-upsert-save]").click()

    cy.wait('@createSubscriber')
    .its("response.body.data.createSubscriber.success").should("eq", false)
  }
}

export default NewSubscriber