var map, layer, animation;
var datasource,client, popup, searchInput, resultsPanel, searchInputLength, centerMapOnResults;

//The minimum number of characters needed in the search input before a search is performed.
var minSearchInputLength = 3;

//The number of ms between key strokes to wait before performing a search.
var keyStrokeDelay = 150;

function GetMap() {
  //Initialize a map instance.
  map = new atlas.Map("myMap", {
    center: [-89.630577, 20.970655], //Lighthouse Technologies
    zoom: 15,
    style: "grayscale_dark",
    view: "Auto",

    //Add authentication details for connecting to Azure Maps.
    authOptions: {
      //Use an Azure Maps key. Get an Azure Maps key at https://azure.com/maps. NOTE: The primary key should be used as the key.
      authType: "subscriptionKey",
      subscriptionKey: "4DnLkOO5PZ6U0_HG0rbm2O17tOIjxMHUpfZmBpl8XoE",
    },
  });

  //Store a reference to the Search Info Panel.
  resultsPanel = document.getElementById("results-panel");

  //Add key up event to the search box.
  searchInput = document.getElementById("search-input");
  searchInput.addEventListener("keyup", searchInputKeyup);

  //Create a popup which we can reuse for each result.
  popup = new atlas.Popup();

  //Wait until the map resources are ready.
  map.events.add("ready", function () {
    //Create a vector tile source and add it to the map.
    datasource = new atlas.source.VectorTileSource(null, {
      tiles: [
        "https://{azMapsDomain}/traffic/flow/tile/pbf?api-version=1.0&style=relative&zoom={z}&x={x}&y={y}",
      ],
      maxZoom: 22,
    });
    map.sources.add(datasource);

    //Common style options for traffic background colors.
    var trafficBackgroundOptions = {
      //The name of the data layer within the data source to pass into this rendering layer.
      sourceLayer: "Traffic flow",

      //Color the roads based on the level of traffic.
      strokeColor: [
        "step",
        ["get", "traffic_level"],
        "#6B0512", //Dark red
        0.01,
        "#EE2F53", //Red
        0.8,
        "orange", //Orange
        1,
        "#66CC99", //Green
      ],

      //Scale the width of roads based on the level of traffic.
      strokeWidth: ["interpolate", ["exponential", 2], ["zoom"], 12, 3, 17, 9],
    };

    //Create two line layer for the base traffic flow color. One layer for both direction traffic data, and one layer for single line traffic data.
    map.layers.add(
      [
        new atlas.layer.LineLayer(
          datasource,
          null,
          Object.assign(
            {
              //For traffic data that represents one side of the road, offset it.
              offset: [
                "interpolate",
                ["exponential", 2],
                ["zoom"],
                12,
                2,
                17,
                6,
              ],

              filter: ["==", ["get", "traffic_road_coverage"], "one_side"],
            },
            trafficBackgroundOptions
          )
        ),

        new atlas.layer.LineLayer(
          datasource,
          null,
          Object.assign(
            {
              filter: ["==", ["get", "traffic_road_coverage"], "full"],
            },
            trafficBackgroundOptions
          )
        ),
      ],
      "labels"
    );

    //Common style options for traffic flow dashed lines.
    var trafficFLowLineOptions = {
      sourceLayer: "Traffic flow",
      strokeColor: "black",

      //Scale the width of roads based on the level of traffic.
      strokeWidth: ["interpolate", ["exponential", 2], ["zoom"], 12, 1, 17, 4],
    };

    //Create an offset for the layers that has two directional traffic data.
    var offsetExp = ["interpolate", ["exponential", 2], ["zoom"], 12, 3, 17, 7];

    //Create line layers for the different levels of traffic flow.
    var oneSideSlowFlowLayer = new atlas.layer.LineLayer(
      datasource,
      null,
      Object.assign(
        {
          offset: offsetExp,
          filter: [
            "all",
            ["==", ["get", "traffic_road_coverage"], "one_side"],
            [">", ["get", "traffic_level"], 0],
            ["<=", ["get", "traffic_level"], 0.01],
          ],
        },
        trafficFLowLineOptions
      )
    );

    var slowFlowLayer = new atlas.layer.LineLayer(
      datasource,
      null,
      Object.assign(
        {
          filter: [
            "all",
            ["==", ["get", "traffic_road_coverage"], "full"],
            [">", ["get", "traffic_level"], 0],
            ["<=", ["get", "traffic_level"], 0.01],
          ],
        },
        trafficFLowLineOptions
      )
    );

    var oneSideMidFlowLayer = new atlas.layer.LineLayer(
      datasource,
      null,
      Object.assign(
        {
          offset: offsetExp,
          filter: [
            "all",
            ["==", ["get", "traffic_road_coverage"], "one_side"],
            [">", ["get", "traffic_level"], 0.01],
            ["<=", ["get", "traffic_level"], 0.8],
          ],
        },
        trafficFLowLineOptions
      )
    );

    var midFlowLayer = new atlas.layer.LineLayer(
      datasource,
      null,
      Object.assign(
        {
          filter: [
            "all",
            ["==", ["get", "traffic_road_coverage"], "full"],
            [">", ["get", "traffic_level"], 0.01],
            ["<=", ["get", "traffic_level"], 0.8],
          ],
        },
        trafficFLowLineOptions
      )
    );

    var oneSideFastFlowLayer = new atlas.layer.LineLayer(
      datasource,
      null,
      Object.assign(
        {
          offset: offsetExp,
          filter: [
            "all",
            ["==", ["get", "traffic_road_coverage"], "one_side"],
            [">", ["get", "traffic_level"], 0.8],
          ],
        },
        trafficFLowLineOptions
      )
    );

    var fastFlowLayer = new atlas.layer.LineLayer(
      datasource,
      null,
      Object.assign(
        {
          filter: [
            "all",
            ["==", ["get", "traffic_road_coverage"], "full"],
            [">", ["get", "traffic_level"], 0.8],
          ],
        },
        trafficFLowLineOptions
      )
    );

    //Add the layers below the labels to make the map clearer.
    map.layers.add(
      [
        oneSideSlowFlowLayer,
        slowFlowLayer,
        oneSideMidFlowLayer,
        midFlowLayer,
        oneSideFastFlowLayer,
        fastFlowLayer,
      ],
      "labels"
    );

    //Create a moving dashed line animation for each of the flow layers, but with different speedMultipliers.
    //Reverse the animation direction as it appears to ensure the correct flow directions for different side of the road for most countries (drive on the right side).
    var animationOptions = {
      gapLength: 2,
      dashLength: 2,
      duration: 2000,
      autoPlay: true,
      loop: true,
      reverse: true,
    };

    atlas.animations.flowingDashedLine(
      oneSideSlowFlowLayer,
      Object.assign({ speedMultiplier: 0.25 }, animationOptions)
    );
    atlas.animations.flowingDashedLine(
      slowFlowLayer,
      Object.assign({ speedMultiplier: 0.25 }, animationOptions)
    );
    atlas.animations.flowingDashedLine(
      oneSideMidFlowLayer,
      Object.assign({ speedMultiplier: 1 }, animationOptions)
    );
    atlas.animations.flowingDashedLine(
      midFlowLayer,
      Object.assign({ speedMultiplier: 1 }, animationOptions)
    );
    atlas.animations.flowingDashedLine(
      oneSideFastFlowLayer,
      Object.assign({ speedMultiplier: 4 }, animationOptions)
    );
    atlas.animations.flowingDashedLine(
      fastFlowLayer,
      Object.assign({ speedMultiplier: 4 }, animationOptions)
    );
    //Add the zoom control to the map.
    map.controls.add(new atlas.control.ZoomControl(), {
      position: "top-right",
    });

    //Create a data source and add it to the map.
    datasource = new atlas.source.DataSource();
    map.sources.add(datasource);

    //Add a layer for rendering the results.
    var searchLayer = new atlas.layer.SymbolLayer(datasource, null, {
      iconOptions: {
        image: "pin-round-darkblue",
        anchor: "center",
        allowOverlap: true,
      },
    });
    map.layers.add(searchLayer);
    //Add a click event to the search layer and show a popup when a result is clicked.
    map.events.add("click", searchLayer, function (e) {
      //Make sure the event occurred on a shape feature.
      if (e.shapes && e.shapes.length > 0) {
        showPopup(e.shapes[0]);
      }
    });
  });
}

function searchInputKeyup(e) {
  centerMapOnResults = false;
  if (searchInput.value.length >= minSearchInputLength) {
    if (e.keyCode === 13) {
      centerMapOnResults = true;
    }
    //Wait 100ms and see if the input length is unchanged before performing a search.
    //This will reduce the number of queries being made on each character typed.
    setTimeout(function () {
      if (searchInputLength == searchInput.value.length) {
        search();
      }
    }, keyStrokeDelay);
  } else {
    resultsPanel.innerHTML = "";
  }
  searchInputLength = searchInput.value.length;
}
function search() {
  //Remove any previous results from the map.
  datasource.clear();
  popup.close();
  resultsPanel.innerHTML = "";

  //Use MapControlCredential to share authentication between a map control and the service module.
  var pipeline = atlas.service.MapsURL.newPipeline(
    new atlas.service.MapControlCredential(map)
  );

  //Construct the SearchURL object
  var searchURL = new atlas.service.SearchURL(pipeline);

  var query = document.getElementById("search-input").value;
  searchURL
    .searchPOI(atlas.service.Aborter.timeout(10000), query, {
      lon: map.getCamera().center[0],
      lat: map.getCamera().center[1],
      maxFuzzyLevel: 4,
      view: "Auto",
    })
    .then((results) => {
      //Extract GeoJSON feature collection from the response and add it to the datasource
      var data = results.geojson.getFeatures();
      datasource.add(data);

      if (centerMapOnResults) {
        map.setCamera({
          bounds: data.bbox,
        });
      }
      console.log(data);
      //Create the HTML for the results list.
      var html = [];
      for (var i = 0; i < data.features.length; i++) {
        var r = data.features[i];
        html.push(
          "<li onclick=\"itemClicked('",
          r.id,
          "')\" onmouseover=\"itemHovered('",
          r.id,
          "')\">"
        );
        html.push('<div class="title">');
        if (r.properties.poi && r.properties.poi.name) {
          html.push(r.properties.poi.name);
        } else {
          html.push(r.properties.address.freeformAddress);
        }
        html.push(
          '</div><div class="info">',
          r.properties.type,
          ": ",
          r.properties.address.freeformAddress,
          "</div>"
        );
        if (r.properties.poi) {
          if (r.properties.phone) {
            html.push(
              '<div class="info">phone: ',
              r.properties.poi.phone,
              "</div>"
            );
          }
          if (r.properties.poi.url) {
            html.push(
              '<div class="info"><a href="http://',
              r.properties.poi.url,
              '">http://',
              r.properties.poi.url,
              "</a></div>"
            );
          }
        }
        html.push("</li>");
        resultsPanel.innerHTML = html.join("");
      }
    });
}
function itemHovered(id) {
  //Show a popup when hovering an item in the result list.
  var shape = datasource.getShapeById(id);
  showPopup(shape);
}
function itemClicked(id) {
  //Center the map over the clicked item from the result list.
  var shape = datasource.getShapeById(id);
  map.setCamera({
    center: shape.getCoordinates(),
    zoom: 17,
  });
}
function showPopup(shape) {
  var properties = shape.getProperties();
  //Create the HTML content of the POI to show in the popup.
  var html = ['<div class="poi-box">'];
  //Add a title section for the popup.
  html.push('<div class="poi-title-box"><b>');

  if (properties.poi && properties.poi.name) {
    html.push(properties.poi.name);
  } else {
    html.push(properties.address.freeformAddress);
  }
  html.push("</b></div>");
  //Create a container for the body of the content of the popup.
  html.push('<div class="poi-content-box">');
  html.push(
    '<div class="info location">',
    properties.address.freeformAddress,
    "</div>"
  );
  if (properties.poi) {
    if (properties.poi.phone) {
      html.push('<div class="info phone">', properties.phone, "</div>");
    }
    if (properties.poi.url) {
      html.push(
        '<div><a class="info website" href="http://',
        properties.poi.url,
        '">http://',
        properties.poi.url,
        "</a></div>"
      );
    }
  }
  html.push("</div></div>");
  popup.setOptions({
    position: shape.getCoordinates(),
    content: html.join(""),
  });
  popup.open(map);
}
