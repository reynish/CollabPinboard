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

  var saveTimeout;

  function zoomed(d) {
    d3.select(this).attr("transform", "scale(" + d3.event.scale + ")");
    d.scale = d3.event.scale;
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(function () {
      Pins.update(d._id, {$set: {scale: d.scale}});
    }, 25)
  }

  var zoom = d3.behavior.zoom()
    .scaleExtent([.5, 2])
    .on("zoom", zoomed);

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
      })
      .select('g.pin-g')
      .attr({
        transform: function (d) {
          var scale = d.scale ? d.scale : 1;
          return 'scale(' + scale + ')';
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
      .attr({
        class: 'pin-g',
        transform: function (d) {
          var scale = d.scale ? d.scale : 1;
          return 'scale(' + scale + ')';
        }
      })
      //.attr("transform", "translate(-50%,-50%)")
      .call(zoom)
      .each(function (d, i) {
        if (d.type === 'text') {
          d3.select(this).append('text')
            .text(function (d) {
              return d.data
            });
        }
        if (d.type === 'image') {
          d3.select(this).append('svg:image')
            .attr({
              width: 320,
              height: 320,
              "xlink:href": function (d) {
                var url = d.data.url();

                function checkUrl() {
                  if (url === null) {
                    setTimeout(checkUrl, 500)
                  }
                }

                checkUrl();
                return d.data.url();
              }
            });
        }
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
  Images.find().observe(function () {
    debugger
    drawPins()
  });
};
