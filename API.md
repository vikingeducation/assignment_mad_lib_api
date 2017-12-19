### Title:   
Make a Maddie Lib Story    

### URL:    
`/api/v1`

### Endpoints:    
POST: `/maddie_libs?access_token=${token}`    
GET: `/nouns?access_token=${token}&count=x` (x being any number, default is 5)    
GET: `/nouns?access_token=${token}`    
GET: `/verbs?access_token=${token}&count=x` (x being any number, default is 5)    
GET: `/verbs?access_token=${token}`    
GET: `/adjectives?access_token=${token}&count=x` (x being any number, default is 5)    
GET: `/adjectives?access_token=${token}`    
GET: `/adverbs?access_token=${token}&count=x` (x being any number, default is 5)    
GET: `/adverbs?access_token=${token}`    

### Success Response:    
Code: 200   
Content: array of words or a text string (story)    

### Error Code: 500