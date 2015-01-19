Meteor.startup(function () {

  var cheerio = Meteor.npmRequire('cheerio');

  Meteor.methods({
    getMenu: function () {
      var menu = {}
      result = Meteor.http.get("http://home/ccl/info/cclintra.nsf/Web%20Right%20Page?OpenPage");
      $ = cheerio.load(result.content);
      var menuLink = $('img[src*="menu"]').parent().find('map area').attr('href');
      var menuPage = Meteor.http.get('http'+ menuLink.split('https')[1]);
      $ = cheerio.load(result.menuPage);
      var tableRows = $('tr:not(.header)');
      debugger
      return body;
    }

  });

  Meteor.call('getMenu');

});