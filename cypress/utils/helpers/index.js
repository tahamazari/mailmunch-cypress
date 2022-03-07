export const generateFakeEmail = () => {
  const domains = ["@gmail.com", "@yahoo.com", "@hotmail.com", "@mailmunch.com", "@facebook.com", "@stripe.com"]
  const randomUserName = (Math.random() + 1).toString(36).substring(2)
  const randomDomain = domains[Math.floor(Math.random() * 6)]

  return randomUserName + randomDomain
}

export const generateRandomString = () => {
  return (Math.random() + 1).toString(36).substring(2)
}