const express = require('express');
const router = express.Router();
const helpers = require('./../helpers');
const h = helpers.registered;
var WordPOS = require('wordpos'),
  wordpos = new WordPOS();
var Sentencer = require('sentencer');

// Sentencer.configure({
//   actions: {
//     number: function() {
//       return Math.floor( Math.random() * 10 ) + 1;
//     }
//   }
// });

// ----------------------------------------
// Story
// ----------------------------------------
router.post('/', async (req, res, next) => {
  let story = req.body.sentence;
  let words = await wordpos.getPOS(story, console.log);
  let templated = await function(words) {
    let temp = story;
    for (let key in words) {
      if (key !== 'rest') {
        words[key].forEach(element => {
          temp.replace(element, `{{ ${key} }}`);
        });
      }
    }
    return temp;
  };
  let result = templated(words);
  //let templated = story.replace();
  console.log('=======================');
  console.log(result);
  console.log('=======================');
  res.status(200).json(result);
});

module.exports = router;
