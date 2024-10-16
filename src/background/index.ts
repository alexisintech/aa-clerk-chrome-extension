import { createClerkClient } from "@clerk/chrome-extension/background"

const publishableKey = process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY

console.log("BACKGROUND WORKER", publishableKey)

if (!publishableKey) {
  throw new Error(
    "Please add the PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env.development file"
  )
}

// Use `createClerkClient()` to create a new Clerk instance
// and get a fresh token for the user
async function getToken() {
  console.log("GET TOKEN ATTEMPT")
  const clerk = await createClerkClient({
    publishableKey
  })
  return await clerk.session?.getToken()
}

// Create a listener to listen for messages from content scripts
// It must return true, in order to keep the connection open and send a response later.
// NOTE: A runtime listener cannot be async.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("REQUEST")
  // This example sends the token back to the content script
  // but you could also use the token to perform actions on behalf of the user
  getToken()
    .then((token) => sendResponse({ token }))
    .catch((error) => console.log("ERROR", JSON.stringify(error)))
  return true // REQUIRED: Indicates that the listener responds asynchronously.
})
