Pins = new Mongo.Collection("pins");

Meteor.startup(function () {

  var cheerio = Meteor.npmRequire('cheerio');

  Meteor.methods({
    getTweets: function () {
      result = Meteor.http.get("https://twitter.com/Royal_Arse/status/538330380273979393");
      $ = cheerio.load(result.content);
      // var open = $('div.permalink-inner.permalink-tweet-container > div > div > p').text();
      var body = $('#stream-items-id > li:nth-child(n) > div > div > p').text();
      return body;
    }
  });


});
