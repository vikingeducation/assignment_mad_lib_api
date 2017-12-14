# assignment_mad_lib_api
by Aaron Saloff

### How To:

To use the API first register and get a token. When making a request, be sure to include an `access_token` parameter.

The base url is /api/v1/

#### GET /words

Acceptable word types are: nouns, verbs, adjectives, and adverbs.

To get a list of words: /words/:word_type

ex: /words/nouns

You can optionally add a COUNT parameter. The default return count is 10.

#### POST /madlibs

Parameters MUST include the following:

- TEXT: a string with injected `{{ stuff }}` tags. See [Sentencer](https://github.com/kylestetz/Sentencer) for details. In addition to the tags that Sentencer supports, you can also add `{{ verb }}` and `{{ adverb }}` tags.

- WORDS: a string of words to insert into the given text. Make sure there is at least one word type for each tag type or you will recieve a 400 response.

