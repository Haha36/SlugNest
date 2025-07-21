# What each folder does...

pages/
Will be used to represent each screen option for the landing page
This is how Next.js will handle routing. Each file inside becomes a route.
File: pages/index.js --> URL: / (Landing Page)
File: pages/add-house.js --> URL: /add-house
File: pages/listings.js --> URL: /listings
File: pages/saved.js --> URL: /saved

components/
Where reusable UI elements will live
Each one is its own .jsx file and will be imported into any page file
navBar --> visible on every page
listingCard --> one house card used for listings

styles/
Where base style files will live
