# assignment_mad_lib_api
Serving up the madness with a Mad Lib API!

Chuck Michael's (https://github.com/chuckinabox/) Solution

Aquire Token from http:localhost:4000, after signuping up.

Access api with http://localhost:4000/api/v1/madlib?access_token=123ABCExample&story=This story needs a {{ noun }} {{ adjective }}&words=[computer, dry] will return "This story needs a computer dry"

Automatically get nouns, adjectives, adverbs, verbs entered with just the story parameter
http://...&story={{ noun }} {{ adjective }} {{ adverb }} {{ verb }}

Also get a list of words with the part of speech parameter pos
http://...&pos=noun

By default is 10 but with adding count, choice your own
http://...&pos=verb&count=40
