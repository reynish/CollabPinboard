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
  }
});

Template.hello.helpers({
  counter: function () {
    return Session.get("counter");
  }
});

Template.hello.events({
  'click button': function () {
    // increment the counter when button is clicked
    Session.set("counter", Session.get("counter") + 1);
  }
});

Template.pin.events({
  "click .toggleArchive": function () {
    Pins.update(this._id, {$set: {archived: !this.archived}});
  }
});

Template.pinNew.events({
  'submit .pin-new': function (event) {

    event.preventDefault();

    // increment the counter when button is clicked
    Session.set("counter", Session.get("counter") + 1);

    var text = event.target.text.value;

    Pins.insert({
      //id: Pins._makeNewID(),
      text: text,
      x: 30,
      y: 30,
      archived: false
    });

    // Clear form
    event.target.text.value = "";

    // Prevent default form submit
    return false;

  }
});

Template.pinboard.rendered = function () {

  var svg;

  var svgSize = [1280, 720];

  svg = d3.select('#Pinboard')
    .attr({
      width: svgSize[0],
      height: svgSize[1],
      viewBox: '0 0 ' + svgSize[0] + ' ' + svgSize[1],
      preserveAspectRatio: 'xMinYMin meet'
    });

  //function zoomed() {
  //  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  //}

  function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging", true);
  }

  function dragged(d) {
    d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
  }

  function dragended(d) {
    d3.select(this).classed("dragging", false);
    Pins.update(d._id, {$set: {x: d.x, y: d.y}});
  }

  var drag = d3.behavior.drag()
    .origin(function (d) {
      return d;
    })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

  function drawPins(update) {

    console.log();

    var data = Pins.find({archived: false}).fetch();
    var pins = svg.selectAll('.pin').data(
      data,
      function (d) {
        return d._id
      }
    );

    pins
      .transition()
      .duration(250)
      .attr({
        x: function (d) {
          return d.x
        },
        y: function (d) {
          return d.y
        }
      });

    pins
      .enter()
      .append('svg')
      .attr({
        class: 'pin',
        x: function (d) {
          return d.x
        },
        y: function (d) {
          return d.y
        }
      })
      .on({
        'mouseover': function (d) {
          d3.select(this).classed("mouseover", true);
        },
        'mouseout': function (d) {
          d3.select(this).classed("mouseover", false);
        }
      })
      .call(drag)
      .append('g')
      .attr({class: 'pin-g'})
      .append('text')
      .text(function (d) {
        return d.text
      });

    pins
      .exit()
      .remove();

  }

  Pins.find({archived: false}).observe({
    added: drawPins,
    changed: drawPins,
    removed: drawPins
  });

};
