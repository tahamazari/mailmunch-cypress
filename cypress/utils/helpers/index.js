export const generateFakeEmail = () => {
  const domains = ["@gmail.com", "@yahoo.com", "@hotmail.com", "@mailmunch.com", "@facebook.com", "@stripe.com"]
  const randomUserName = (Math.random() + 1).toString(36).substring(2)
  const randomDomain = domains[Math.floor(Math.random() * 6)]

  return randomUserName + randomDomain
}

export const generateRandomString = () => {
  return (Math.random() + 1).toString(36).substring(2)
}

export const generateRandomName = () => {
  const cities = [
    "Lahore", "Karachi", "Islamabad", "Multan", "Quetta", "Peshawar",
    "London", "York", "Manchester", "Kent", "Leeds", "Oxford",
    "Mumbai", "Delhi", "Goa", "Chennai", "Amritser",
    "Cairo", "Istanbul", "Riyadh", "Dubai", "Kabul", "Dhaka"
  ]

  const adjective = [
    "illustrious", "clever", "brave", "profound", "friendly",
    "grumpy", "lucky", "polite", "smart", "wise", "generous",
    "archaic", "chatty", "funny", "honest", "kind"
  ]

  const units = [
    "meters", "kelvins", "acre", "newton", "hertz", "volts",
    "farad", "joul", "gram", "mole", "second", "mole"
  ]

  const randomCity =  cities[Math.floor(Math.random() * (cities.length))]
  const randomAdjective = adjective[Math.floor(Math.random() * (adjective.length))]
  const randomUnit = units[Math.floor(Math.random() * (units.length))]

  return `${randomAdjective}-${randomCity}-${randomUnit}`
}

export const generateRandomNumber = ({ ceiling }) => {
  return (Math.floor((Math.random() * ceiling)))
}

export const requestWithStubbedResponse = ({ fixture, alias, method = "POST", url = "http://localhost:4000/", opName = null }) => {
  const operationName = opName ? opName : alias
  cy.fixture(`${fixture}.json`).then((json) => {
    cy.intercept(method, url, (req) => {
      if (req.body.operationName === operationName){
        req.alias = alias
        req.reply({
          body: json
        })
      }
    })
  })
}