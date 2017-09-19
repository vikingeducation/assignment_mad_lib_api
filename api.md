```js

//thoughts on API
/*
Listing

Your application should provide the ability to get lists of each of the following parts of speech:

Nouns
Verbs
Adverbs
Adjectives

Your API should also allow the user (client) the ability to specify a number of each part of speech they'd like back in the response. So submitting a request without that parameter should default to say 10 words, but allow the user to specify a parameter to change the count of words returned.

Creating

Create a Mad Lib from text (story) and a list of words

/madLibs get
user sends story and list of words
we give them {"string of MadLib"}
*/

//routes
  //allow query params
/nouns -> []
/verbs -> []
/adverbs -> []
/adjectives -> []
/madLibs
