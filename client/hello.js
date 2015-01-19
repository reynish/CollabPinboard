Pins = new Mongo.Collection("pins");
//var Circles = new Meteor.Collection('circles');

// counter starts at 0
// Session.setDefault("counter", 0);


Template.body.helpers({
  pins: function () {
    return Pins.find({archived: false});
  },
  archivedPins: function () {
    return Pins.find({archived: true});
  },
  images: function(){
    return Images.find();
  }
});

Template.pin.events({
  "click .toggleArchive": function () {
    Pins.update(this._id, {$set: {archived: !this.archived}});
  }
});

function CreatePin(type, data) {
  this.type = type;
  this.data = data;
  this.x = 50;
  this.y = 50;
  this.archived = false;
}

Template.pinNew.events({
  'submit .pin-new': function (event) {

    event.preventDefault();

    // increment the counter when button is clicked
    Session.set("counter", Session.get("counter") + 1);

    debugger;

    var text = event.target.text.value;

    Pins.insert(new CreatePin('text', text));

    // Clear form
    event.target.text.value = "";

    // Prevent default form submit
    return false;

  },
  'change input[type=file]': function () {
    var files = event.target.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
      FS.Utility.eachFile(event, function (file) {
        file.name = file.name.split(' ').join('_');
        Images.insert(file, function (err, fileObj) {
          Pins.insert({
            type: type,
            data: fileObj,
            x: 50,
            y: 50,
            archived: false
          });
        });
      });
    }
  }
});
