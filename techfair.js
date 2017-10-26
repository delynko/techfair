var jeffcoBoundary = L.geoJSON(jeffcoBoundary, {
    style: {
        "color": "#000000",
        fillOpacity: 0,
        "weight": 2,
    }
});

var map = L.map("map", {
    maxZoom: 18,
    layers: [jeffcoBoundary],
    zoomControl: false
}).setView([39.50, -105.21], 10);


migrationToJeffcoLayer = toLayer();
migrationFromJeffcoLayer = fromLayer();

var politicalLayer = L.geoJson(politics, {style: style});

var heatLatLong = [];

for (var l = 0; l < bark.features.length; l++) {
    var forHeat = [];
    forHeat.push(bark.features[l].geometry.coordinates[1]);
    forHeat.push(bark.features[l].geometry.coordinates[0]);
    heatLatLong.push(forHeat);
};

var heat = L.heatLayer(heatLatLong, {
    radius: 15,
    gradient: {
        0.4: "gray",
        0.65: "blue",
        1: "orange"
    }
});

var markers = L.markerClusterGroup();

var alcCrashes = L.geoJson(alco);

var park = L.geoJson(parks, {
    style: {
        fillColor: "#627D77",
        fillOpacity: 1,
        color: "#ffffff",
        opacity: 0
    }
});

var imp = L.geoJson(impervious, {
    style: {
        fillColor: "#000000",
        opacity: 0,
        fillOpacity: 1
    }
})

markers.addLayer(alcCrashes);



setTimeout(function(){
    park.addTo(map);
    $("#label").html("Parks and Open Space");
}, 1000);

setTimeout(function(){
    park.removeFrom(map);
    map.addLayer(politicalLayer);
    $("#label").html("Political Affiliation");
}, 15000);

setTimeout(function(){
    map.removeLayer(politicalLayer);
    migrationToJeffcoLayer.addTo(map);
    $("#label").html("Migration to Jeffco");
}, 30000);

setTimeout(function(){
    migrationToJeffcoLayer.destroy();
    migrationFromJeffcoLayer.addTo(map);
    $("#label").html("Migration from Jeffco");
}, 45000);

setTimeout(function(){
    migrationFromJeffcoLayer.destroy();
    heat.addTo(map);
    $("#label").html("Dog Barking Complaints");
}, 60000);

setTimeout(function(){
    heat.removeFrom(map);
    markers.addTo(map);
    $("#label").html("Alcohol-Related Crashes");
}, 75000);

setTimeout(function(){
    markers.removeFrom(map);
    imp.addTo(map);
    $("#label").html("Impervious Surface");
}, 90000);

setTimeout(function(){
    imp.removeFrom(map);
    var snakes = L.geoJson(stream, {
        onEachFeature: function(feature, layer){
            var latlngs = [];
            for (var i = 0; i < layer.feature.geometry.coordinates.length; i++){
                latlngs.push(new L.LatLng(layer.feature.geometry.coordinates[i][1], layer.feature.geometry.coordinates[i][0]))
            }
            var snakeLine = L.polyline(latlngs, {snakingSpeed: 25});
            snakeLine.addTo(map).snakeIn();
        }
    });
    $("#label").html("Streams and Rivers");
}, 105000);

setTimeout(function(){
    location.reload();
}, 120000);

function toLayer(){
    
    var toJeffcoData = [];

    for (var i = 0; i < toJeffco.features.length; i++) {
        var coords = [];
        var cor = {};
        if (toJeffco.features[i].properties.ToJeffcoFr > 250) {
            coords.push(toJeffco.features[i].geometry.coordinates[0]);
            coords.push(toJeffco.features[i].geometry.coordinates[1]);
            cor["from"] = coords;
            cor["to"] = [-105.280530,39.612187];
            cor["labels"] = [toJeffco.features[i].properties.NAMELSAD, ""];
            cor["color"] = "#ff0000";
            toJeffcoData.push(cor);
        }
    };

    var toLayer = new L.migrationLayer({
        map: map,
        data: toJeffcoData,
        pulseRadius:0,
        pulseBorderWidth:3,
        arcWidth:1,
        arcLabel:true,
        arcLabelFont:'10px sans-serif',
        }
    );

    return toLayer;
}
function fromLayer(){

    var fromJeffcoData = [];

    for (var i = 0; i < fromJeffco.features.length; i++) {
        var coords = [];
        var cor = {};
        if (fromJeffco.features[i].properties.FromJeffco > 250) {
            coords.push(fromJeffco.features[i].geometry.coordinates[0]);
            coords.push(fromJeffco.features[i].geometry.coordinates[1]);
            cor["from"] = [-105.280530,39.612187];
            cor["to"] = coords;
            cor["labels"] = ["", fromJeffco.features[i].properties.NAMELSAD];
            cor["color"] = "#00d7ee";
            fromJeffcoData.push(cor);
        }
    };

    var fromLayer = new L.migrationLayer({
        map: map,
        data: fromJeffcoData,
        pulseRadius:15,
        pulseBorderWidth:2,
        arcWidth:1,
        arcLabel:true,
        arcLabelFont:'10px sans-serif',
        }
    );

    return fromLayer; 
}
function getColor(d){
    return d > 35 ? '#D62F27' :
           d > 18 ? '#EB6E4B' :  
           d > 12  ? '#F7A474' :
           d > 1  ? '#FFF1E6' :
           d > 0  ? '#ffffff' :
           d > -1   ? '#EDF9FF' :
           d > -8  ? '#AEBDBC'  :
           d > -17   ? '#7B98BA' :
           d > -35   ? '#4575B5' :
                      '#ffffff';
}
function style(feature) {
    return {
        fillColor: getColor(feature.properties.DEM_Diff_P),
        weight: 1,
        opacity: 1,
        color: 'black',
//        dashArray: '3',
        fillOpacity: 1
    };
}

map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.boxZoom.disable();
map.keyboard.disable();
if (map.tap) map.tap.disable();
document.getElementById('map').style.cursor='default';

