var map,
	lat = 560/2,
	lng = 1100/2,
	layerGroup;
var coordinate;

function initMap(){
	if (map != undefined) { map.remove(); }
	map = L.map('mapid', {
		minZoom: 1,
		maxZoom: 1,
		center: [lat/2, lng/2],
		zoom: 1,
		zoomControl: false,
		attributionControl: false,
		crs: L.CRS.Simple
	});
		
	var imageUrl = '/liangcang/images/map/bsy_map.png',
		imageBounds = [{lat:0,lng:0},{lat:lat,lng:lng}];
	L.imageOverlay(imageUrl, imageBounds).addTo(map);
	map.setMaxBounds(imageBounds);
	
	
	
	layerGroup = L.layerGroup().addTo(map);
	var marker = L.marker([51.5, 50]);
	layerGroup.addLayer(marker);
	
	// var popup = L.popup()
	map.on('click',function(e){
		layerGroup.clearLayers();
		layerGroup.addLayer(L.marker(e.latlng));
		coordinate = e.latlng;
		console.log(coordinate)
		// popup.setLatLng(e.latlng).setContent("You clicked the map at" + e.latlng.toString()).openOn(map)
	})
}