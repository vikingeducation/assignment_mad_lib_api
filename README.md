# assignment_mad_lib_api
Serving up the madness with a Mad Lib API!

## Maddie Rajavasireddy

### Assignment Description:   
To build an API that serves parts of English speech and provides a Mad Lib creation service. While interacting with the API, a client should be able to ask the API for nouns, verbs, adverbs and adjectives. The user will then be able to submit words and their own "story" to the API and get back a resulting Mad Lib.    

User Login and Registration: 
----   
The first step to creating the API will be allowing users to register. This requires creation of a sign up form that will take the user's first name, last name, email and password.    
Now create a login form that creates a signed session ID and logins in the user when submitted. Use session and token authentication.    
Once the user is successfully logged in, show them their information and token. This means you'll need to generate that token during the user creation process.    

Designing the API:    
----
The application should provide the ability to get lists of each of the following parts of speech:    
Nouns   
Verbs   
Adverbs    
Adjectives    
The API should also allow the user (client) the ability to specify a number of each part of speech they'd like back in the response. So submitting a request without that parameter should default to say 5 words, but allow the user to specify a parameter to change the count of words returned.    
The API should take a story (text in the format that Sentencer expects to create a Mad Lib) and a list of words to be plugged into the placeholders of that text. Then the API should respond with the generated Mad Lib from the provided data.


#### Packages used:    
Express, Mongoose, Passport, Sentencer, Wordpos, md5, bcrypt, uuid, qs, lodash


### API Reference:
See the [API](/API.md/) page for details