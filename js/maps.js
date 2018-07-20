var rendererOptions = {
    draggable: false,
    suppressMarkers: true,
    preserveViewport: true,

};
var polylineOptions = {
    strokeOpacity: 1,
    strokeWeight: 2,
    strokeColor: 'BLACK'
};
var staticRendererOptions = {
    draggable: false,
    suppressMarkers: true,
    preserveViewport: true,
    polylineOptions: polylineOptions

};


var site_id = window.localStorage.getItem('site_id');
var start = window.localStorage.getItem('start');
var end = window.localStorage.getItem('end');
var token = window.localStorage.getItem('token');
var users = JSON.parse(window.localStorage.getItem('drivers'));

var markerArray = [];
var map;
var map2;
var markers = [];
var infowindow;
var infowindowTime;
var geocoder;
var arrows = [];
var orders = [];
var location_history = [];
var orders_order = [];
var order_markers = [];
var clicked = false;
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
var directionsService = new google.maps.DirectionsService;
var staticDirectionsDisplay = new google.maps.DirectionsRenderer(staticRendererOptions);
var staticDirectionsService = new google.maps.DirectionsService;
var currentWindowText = '';

// Json Object
function myTaskClass(id) {

    $.each(markers, function (index,value) {
        if(value.id == id){
            driver_id = id;
            id = index;
        }
    });

//		console.log(id);

    this.id = id;
    this.addMarkers = function () {


        // $.ajax({
        //     type: 'POST',
        //     url: '<?=base_url();?>api/dispatch/orders?key=<?=$key;?>',
        //     dataType: "text",
        //     data: {crm_account_id:driver_id},
        //     success: function(data){
        //         if(data && data != 0){
        //             orders_order.push([markers[id].getPosition().lat(),markers[id].getPosition().lng()]);
        //
        //             var tasks = JSON.parse(data);
        //
        //             var count = 0;
        //             $.each(tasks, function (index,value) {
        //
        //                 var position = new google.maps.LatLng(value.location[1], value.location[0]);
        //
        //                 orders_order.push([value.location[1], value.location[0]]);
        //
        //                 if(value.type == 'pickup'){
        //                     var current_icon = 'http://imsba.com/files/media/website/137/media/1/Pickup_icon.png';
        //                 }else if (value.type == 'dropoff') {
        //                     var current_icon = 'http://imsba.com/files/media/website/137/media/1/Pickup_icon3.png';
        //                 }
        //
        //                 orders[count] = myMarker(current_icon, position, value);
        //
        //
        //
        //             });
        //             function myMarker(icon, position, value) {
        //
        //
        //                 marker = new google.maps.Marker({
        //                     position: position,
        //                     draggable: false,
        //                     id:value.id,
        //                     order_id:value.order_id,
        //                     //animation: google.maps.Animation.DROP,
        //                     map: map,
        //                     opacity: 0.6,
        //                     icon: icon
        //                 });
        //
        //                 var total_index = order_markers.push(marker) -1;
        //
        //
        //
        //                 google.maps.event.addListener(order_markers[total_index], 'click', function () {
        //                     //console.log(order_markers[value.id].id);
        //                     clicked = true;
        //
        //                     calculateAndDisplayRoute(staticDirectionsService, staticDirectionsDisplay);
        //                 });
        //
        //                 return marker;
        //
        //             }
        //         }else {
        //             alert('No Orders');
        //         }
        //     }
        // });


    }
    this.deleteMarkers = function (i) {
        if (i === -1) {
            currentMarkersList[0].setMap(null);
            currentMarkersList[1].setMap(null);
            currentMarkersList[2].setMap(null);
        }
        else currentMarkersList[i].setMap(null);

    }
}
// function giveTask(fromTask, toTask) {
//     //console.log(fromTask);
//     fromTask.deleteMarkers(-1);
//     toTask.deleteMarkers(-1);
//
//     var toTaskObj = JSON.parse(toTask.json);
//     var fromTaskObj = JSON.parse(fromTask.json);
// //	    console.log(toTaskObj);
//     toTaskObj.dropOffRecipients = fromTaskObj.dropOffRecipients;
//     toTaskObj.pickUpRecipients = fromTaskObj.pickUpRecipients;
//     toTaskObj.completionDetails.task = true;
//     fromTaskObj.completionDetails.task = false;
//
// //	    console.log(fromTaskObj);
//     fromTask = new myTaskClass(JSON.stringify(fromTaskObj));
//     toTask = new myTaskClass(JSON.stringify(toTaskObj));
//
// //	    console.log(fromTask);
//
//
//     fromTask.addMarkers();
//     toTask.addMarkers();
//
// }


function plot_history(crm_id) {

	var token = window.localStorage.getItem('token');

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/location?key='+api_key,
        dataType: "json",
        data: {crm_account_id: crm_id},
        headers: {"token":token},
        success: function(data){
            var past = data;
            $.each(past, function(index,new_value) {
//
                var history_info = new google.maps.Marker({
                    position:  new google.maps.LatLng(new_value.lat, new_value.lng),
                    draggable: false,
                    id:new_value.id,
                    map: map,
                    icon: 'img/dot.png',

                });

                var location_index = location_history.push(history_info) -1;

                google.maps.event.addListener(location_history[location_index], 'click', function (e) {
                });
            });
        }
    });
}
function initialize(switch_sourse="Beezkeeper") {
    $.ajax({
        type: 'POST',
        url: 'https://zubie.vlohayk.com/zubie/vehicle_locations',
        dataType: "json",
        success: function (data) {
            window.localStorage.setItem("zubie_data",JSON.stringify(data))
        },

    });
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {lat: 34.1479130, lng: -118.2491390},
        styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
    });
    directionsDisplay.setMap(map);
    staticDirectionsDisplay.setMap(map);
    google.maps.event.addListener(map, 'click', function (event) {

        staticDirectionsDisplay.set('directions', null);
        directionsDisplay.set('directions', null);
        infowindow.setMap(null);
        infowindowTime.setMap(null);

        for (var i = 0; i < order_markers.length; i++) {
            order_markers[i].setMap(null);
        }

        for (var i = 0; i < arrows.length; i++) {
            arrows[i].setMap(null);
        }

        for (var i = 0; i < location_history.length; i++) {
            location_history[i].setMap(null);
        }
        arrows = [];
        orders = [];
        order_markers = [];
        orders_order = [];
        location_history = [];
        clicked = false;
    });

    infowindow = new google.maps.InfoWindow;
    infowindowTime = new google.maps.InfoWindow({ pixelOffset: new google.maps.Size(0,-50)});
    geocoder = new google.maps.Geocoder;

    var locationSites = JSON.parse(window.localStorage.getItem('locationSites'));
    var site_id =  window.localStorage.getItem('site_id');
    var site_info;
    $.each(locationSites, function (index,location) {

        if(site_info){
            return false;
        }else{
            $.each(location.sites, function (index, site) {
                if(site.id == site_id){
                    site_info = site;
                    find_address(site.address +' '+ site.city +' '+ site.state +', '+site.zip);
                    return false;
                }
            });
        }
    });


if(switch_sourse == 'Beezkeeper'){
    $.each(users, function (index,value) {
        //console.log(value.id);

        if(value.online == 1){

            var position = new google.maps.LatLng(value.lat, value.lng);

            user_markers = new google.maps.Marker({
                position: position,
                draggable: false,
                id:value.id,
                //animation: google.maps.Animation.DROP,
                map: map,
                //icon: 'http://imsba.com/files/media/website/137/media/1/driver_icon2.png',
                icon:
            {labelOrigin: new google.maps.Point(11, 32),
                url: 'img/beez.png',
                size: new google.maps.Size(22, 26),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(11, 40)},
                 label : {text:value.first_name,color:'black'}
            });


            var new_index = markers.push(user_markers) -1;
//markernerna nkarum.kapuyntery,konkret useri vra click aneluc
            google.maps.event.addListener(markers[new_index], 'click', function (e) {
                //console.log(markers[value.id].id);
                if(clicked == false){
                    clicked = true;
                    new myTaskClass(markers[new_index].id).addMarkers();

                    plot_history(markers[new_index].id);
                }
            });

            google.maps.event.addListener(markers[new_index], 'rightclick', function (e) {
                $('#myModal').modal('show');
                pullProfile(markers[new_index].id);
            });

        }
    });

    setInterval(function() {
        $.ajax({
            type: 'POST',
            url: domain+apiv+'dispatch/locations?key='+api_key,
            dataType: "json",
            headers: {"token":token},
            data: {start:start, end:end, site_id:site_id},
            success: function(data){
				var users_data = data;
				$.each(users_data, function(index, value) {
					// cycle through the markers, if exists update, if not create
					var count = 0;
					$.each(markers, function (index, marker_value) {
						if (marker_value.id == value.id) {
							markers[index].setPosition(new google.maps.LatLng(value.lat, value.lng));
						}
						count += 1;
					});
					if (count == 0) {

						var position = new google.maps.LatLng(value.lat, value.lng);

						var goldStar = {
							path: 'M55.4143333,12.0315849 C55.0720667,11.8176226 54.7048667,11.6319623 54.3909333,11.3817736 C53.7506,10.8700755 53.1828,10.2576226 52.5062,9.80479245 C51.3536,9.03384906 50.1375333,8.358 48.9543333,7.63120755 C48.7322,7.49649057 48.5384,7.31875472 48.3582,7.06856604 C49.9754667,6.72328302 51.6142667,6.47649057 53.0128,7.56554717 C54.3807333,8.63083019 55.607,9.87271698 55.6523333,11.7689434 C55.573,11.8561132 55.4936667,11.943283 55.4143333,12.0315849 M53.5341333,26.5278113 C52.0551333,28.0096981 50.2112,27.768566 48.3956,27.5534717 C48.3718,27.5002642 48.348,27.4459245 48.3242,27.392717 C48.5066667,27.2455472 48.6778,27.0802642 48.875,26.958 C50.0899333,26.2063019 51.3354667,25.4998868 52.5186667,24.7029057 C53.1941333,24.2489434 53.7948,23.6749811 54.383,23.1078113 C54.7162,22.787434 55.0199333,22.5247925 55.6115333,22.6595094 C55.7203333,24.3813962 54.5972,25.4613962 53.5341333,26.5278113 M43.2548,25.4998868 C42.8479333,26.5561132 42.806,26.567434 41.7123333,26.3364906 C37.6334667,25.4761132 33.5602667,24.6089434 29.6729333,23.0342264 C28.9068,22.7240377 28.016,22.6787547 27.1750667,22.6142264 C26.4962,22.5610189 25.9907333,22.3595094 25.5102,21.8410189 C24.9979333,21.287434 24.7157333,20.7576226 24.7769333,19.9821509 C24.8132,19.5293208 24.8166,19.0730943 24.8120667,18.6157358 C24.8075333,18.1595094 24.7928,17.7021509 24.7928,17.2447925 C24.7928,16.187434 24.7928,15.1289434 24.7939333,14.0715849 C24.7950667,13.2746038 25.9023333,12.0089434 26.6934,12.0021509 C28.1769333,11.987434 29.5675333,11.5991321 30.9128,11.0364906 C34.2085333,9.65422642 37.7094,9.04969811 41.1706,8.29233962 C42.8581333,7.92328302 42.8751333,7.94479245 43.4622,9.57837736 C45.3752667,14.9104528 45.2925333,20.2198868 43.2548,25.4998868 M34.9202667,27.768566 C32.2626,27.7187547 29.6038,27.6576226 26.945,27.6236604 C26.5177333,27.6191321 26.2536667,27.4764906 26.0474,27.1119623 C25.7346,26.5583774 25.3866667,26.0240377 24.9968,25.3866792 C25.3232,25.3651698 25.5408,25.323283 25.7538667,25.3413962 C28.4002,25.5587547 31.0465333,25.7715849 33.6894667,26.0195094 C34.4272667,26.0896981 34.714,26.4429057 35.3407333,27.7266792 C35.19,27.7425283 35.0551333,27.7708302 34.9202667,27.768566 M26.2956,7.05498113 C26.3590667,6.95875472 26.5381333,6.89196226 26.6639333,6.89083019 C29.5040667,6.8489434 32.3453333,6.81950943 35.1843333,6.78781132 C35.2194667,6.78781132 35.2534667,6.82177358 35.3486667,6.87384906 C35.0381333,7.33460377 34.7389333,7.79649057 34.4204667,8.2425283 C34.357,8.32969811 34.221,8.39535849 34.1099333,8.4134717 C31.1621333,8.9070566 28.1984667,9.22177358 25.2042,9.18101887 C25.1690667,9.17988679 25.1362,9.14592453 25.0149333,9.08139623 C25.4410667,8.40101887 25.8558667,7.71950943 26.2956,7.05498113 M22.9239333,8.8934717 C22.848,9.03724528 22.6122667,9.19120755 22.4536,9.18781132 C20.2345333,9.13007547 18.0166,9.03724528 15.7975333,8.97158491 C15.2297333,8.95460377 15.1458667,8.65120755 15.2342667,8.18932075 C15.4643333,6.97913208 15.2093333,7.17724528 16.371,7.13196226 C18.6308667,7.04479245 20.8918667,6.98818868 23.1528667,6.92026415 C23.3376,6.91460377 23.5212,6.91913208 23.8385333,6.91913208 C23.4996667,7.66403774 23.2356,8.29007547 22.9239333,8.8934717 M23.2424,27.5829057 C20.8170667,27.5183774 18.3906,27.452717 15.9652667,27.3768679 C15.3521333,27.3564906 15.2784667,27.1844151 15.2104667,26.1723396 C15.1742,25.6391321 15.4688667,25.547434 15.8870667,25.5349811 C18.0846,25.4636604 20.281,25.3889434 22.4774,25.3300755 C22.6168,25.3255472 22.8355333,25.4093208 22.8876667,25.5157358 C23.205,26.1587547 23.4838,26.8198868 23.8022667,27.5330943 C23.5574667,27.5568679 23.3988,27.5863019 23.2424,27.5829057 M12.8916667,26.9489434 C12.1527333,26.9489434 11.4126667,26.8323396 10.6726,26.7598868 C10.6646667,26.6659245 10.6544667,26.5719623 10.6465333,26.478 C11.4206,26.3115849 12.1924,26.1247925 12.9732667,26.0025283 C13.1047333,25.9810189 13.2781333,26.2334717 13.4334,26.3602642 C13.2520667,26.5663019 13.0718667,26.9489434 12.8916667,26.9489434 M5.3788,26.4349811 C5.02746667,25.578 4.74526667,24.692717 4.44833333,23.8142264 C4.37353333,23.5923396 4.36673333,23.3466792 4.46306667,23.0478113 C4.60813333,23.2300755 4.794,23.3908302 4.8926,23.5957358 C5.74713333,25.3708302 6.81813333,26.928566 8.9794,27.5851698 C7.52646667,28.3051698 5.91713333,27.7470566 5.3788,26.4349811 M4.44493333,10.6946038 C4.74073333,9.81271698 5.0286,8.92516981 5.38106667,8.06479245 C5.91713333,6.75271698 7.58313333,6.18441509 9.01113333,6.94064151 C6.52686667,7.60743396 5.57826667,9.60215094 4.54126667,11.5096981 L4.34293333,11.4168679 C4.3758,11.1757358 4.369,10.9221509 4.44493333,10.6946038 M11.0046667,24.1583774 C9.78633333,24.6836604 8.602,25.218 7.3984,25.7013962 C6.89973333,25.9029057 6.64926667,25.5100755 6.4328,25.1353585 C5.372,23.2923396 4.692,21.3349811 4.62853333,19.1908302 C4.5594,16.8078113 4.40186667,14.4089434 5.21446667,12.107434 C5.55673333,11.1372453 6.0486,10.218 6.48833333,9.28177358 C6.6606,8.91271698 6.94846667,8.64667925 7.3814,8.82215094 C8.58386667,9.31233962 9.77386667,9.83422642 11.0126,10.3617736 C8.602,14.988566 8.63033333,19.5553585 11.0046667,24.1583774 M10.6669333,7.77271698 C11.3956667,7.69233962 12.1232667,7.60177358 12.8531333,7.53611321 C13.3178,7.49422642 13.4311333,7.86554717 13.3994,8.1870566 C13.3858,8.32177358 13.0072667,8.5470566 12.8316,8.51762264 C12.0938,8.38969811 11.3696,8.18366038 10.6408667,8.00479245 C10.6488,7.92781132 10.6578667,7.85083019 10.6669333,7.77271698 M57.2016,13.7783774 C57.1483333,12.227434 56.7505333,10.6900755 55.8869333,9.34290566 C54.2866667,6.84781132 51.9667333,5.67498113 49.0223333,5.65120755 C45.7515333,5.62630189 42.4796,5.55271698 39.2088,5.56516981 C38.2692667,5.56856604 37.5552667,5.4825283 37.0282667,4.53950943 C36.5477333,3.67686792 35.6739333,3.2670566 34.4737333,3.43120755 C34.7695333,4.15007547 35.0358667,4.79649057 35.3384667,5.53233962 C35.0630667,5.53233962 34.8534,5.5425283 34.6437333,5.53120755 C32.6955333,5.42818868 30.7439333,5.67498113 28.7889333,5.32856604 C27.914,5.17233962 26.9631333,5.49950943 26.0462667,5.50743396 C23.0905333,5.53120755 20.1359333,5.48932075 17.1813333,5.50630189 C14.0578667,5.52441509 10.9332667,5.54139623 7.81206667,5.63649057 C5.78453333,5.69762264 4.25453333,6.60328302 3.553,8.61611321 C3.33766667,9.23196226 3.09286667,9.84101887 2.94326667,10.4738491 C2.16353333,13.7500755 2.1896,17.0783774 2.38,20.4089434 C2.48993333,22.3323396 2.86846667,24.2081887 3.56886667,26.0115849 C4.27606667,27.8330943 5.74713333,28.8689434 7.69193333,28.8881887 C11.2154667,28.923283 14.7401333,28.9153585 18.2625333,28.9968679 C21.3112,29.0681887 24.3655333,28.7919623 27.4142,29.2006415 C28.2619333,29.3149811 29.1572667,29.0263019 30.0322,29.0059245 C31.6347333,28.968566 33.2395333,28.9934717 34.8443333,28.9957358 C34.9996,28.9957358 35.1548667,29.0229057 35.3146667,29.0364906 C35.0302,29.7361132 34.7672667,30.3802642 34.4748667,31.0957358 C35.8983333,31.247434 36.7234,30.588566 37.3206667,29.6013962 C37.6096667,29.1225283 37.9417333,28.9821509 38.4857333,28.9810189 C42.0738667,28.9742264 45.662,28.9730943 49.2478667,28.8746038 C51.0804667,28.8247925 52.8280667,28.3991321 54.2730667,27.1063019 C55.9651333,25.592717 56.9307333,23.6749811 57.0996,21.4810189 C57.2956667,18.9247925 57.2877333,16.3436604 57.2016,13.7783774',
							fillColor: 'black',
							fillOpacity: 0.8,
							//size: new google.maps.Size(10, 16),
							origin: new google.maps.Point(0, 0),
							// The anchor for this image is the base of the flagpole at (0, 32).
							anchor: new google.maps.Point(15, 0),
							scale: .5,
							rotation: parseInt(value.rotation)
						};

						user_markers = new google.maps.Marker({
							position: position,
							draggable: false,
							id: value.id,
							//animation: google.maps.Animation.DROP,
							map: map,
							//icon: 'http://imsba.com/files/media/website/137/media/1/driver_icon2.png',
							icon: goldStar
						});


						var new_index = markers.push(user_markers) - 1;

						google.maps.event.addListener(markers[new_index], 'click', function (e) {
							//console.log(markers[value.id].id);
							if (clicked == false) {
								clicked = true;
								new myTaskClass(markers[new_index].id).addMarkers();
							}
						});

						google.maps.event.addListener(markers[new_index], 'rightclick', function (e) {
							$('#myModal').modal('show');
							pullProfile(markers[new_index].id);
						});


					}
				});
            }
        });
    }, 8000);}
else if(switch_sourse == 'Zubie'){
    var zubie_data = JSON.parse(window.localStorage.getItem('zubie_data'));
$.each(zubie_data,function (index,value) {
    var position = new google.maps.LatLng(value.latitude, value.longitude);

    user_markers = new google.maps.Marker({
        position: position,
        draggable: false,
        id:value.id,
        map: map,
        icon:
            {labelOrigin: new google.maps.Point(20, 33),
                url: 'img/zoob.png',
                size: new google.maps.Size(35, 26),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(11, 40)},
        label : {text:index,color:'black'}
    });


    var new_index = markers.push(user_markers) -1;
    google.maps.event.addListener(markers[new_index], 'click', function (e) {
        $('#fuel_level').val(value.fuel_level+'%');
        $('#fuel_info').modal('show');

    });


})


}
else if(switch_sourse == 'Beezkeeper & Zubie'){
    $.each(users, function (index,value) {
        //console.log(value.id);

        if(value.online == 1){

            var position = new google.maps.LatLng(value.lat, value.lng);

            user_markers = new google.maps.Marker({
                position: position,
                draggable: false,
                id:value.id,
                //animation: google.maps.Animation.DROP,
                map: map,
                //icon: 'http://imsba.com/files/media/website/137/media/1/driver_icon2.png',
                icon:
                    {labelOrigin: new google.maps.Point(11, 32),
                        url: 'img/beez.png',
                        size: new google.maps.Size(22, 26),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(11, 40)},
                label : {text:value.first_name,color:'black'}
            });


            var new_index = markers.push(user_markers) -1;
//markernerna nkarum.kapuyntery,konkret useri vra click aneluc
            google.maps.event.addListener(markers[new_index], 'click', function (e) {
                //console.log(markers[value.id].id);
                if(clicked == false){
                    clicked = true;
                    new myTaskClass(markers[new_index].id).addMarkers();

                    plot_history(markers[new_index].id);
                }
            });

            google.maps.event.addListener(markers[new_index], 'rightclick', function (e) {
                $('#myModal').modal('show');
                pullProfile(markers[new_index].id);
            });

        }
    });

    setInterval(function() {
        $.ajax({
            type: 'POST',
            url: domain+apiv+'dispatch/locations?key='+api_key,
            dataType: "json",
            headers: {"token":token},
            data: {start:start, end:end, site_id:site_id},
            success: function(data){
                var users_data = data;
                $.each(users_data, function(index, value) {
                    // cycle through the markers, if exists update, if not create
                    var count = 0;
                    $.each(markers, function (index, marker_value) {
                        if (marker_value.id == value.id) {
                            markers[index].setPosition(new google.maps.LatLng(value.lat, value.lng));
                        }
                        count += 1;
                    });
                    if (count == 0) {

                        var position = new google.maps.LatLng(value.lat, value.lng);

                        var goldStar = {
                            path: 'M55.4143333,12.0315849 C55.0720667,11.8176226 54.7048667,11.6319623 54.3909333,11.3817736 C53.7506,10.8700755 53.1828,10.2576226 52.5062,9.80479245 C51.3536,9.03384906 50.1375333,8.358 48.9543333,7.63120755 C48.7322,7.49649057 48.5384,7.31875472 48.3582,7.06856604 C49.9754667,6.72328302 51.6142667,6.47649057 53.0128,7.56554717 C54.3807333,8.63083019 55.607,9.87271698 55.6523333,11.7689434 C55.573,11.8561132 55.4936667,11.943283 55.4143333,12.0315849 M53.5341333,26.5278113 C52.0551333,28.0096981 50.2112,27.768566 48.3956,27.5534717 C48.3718,27.5002642 48.348,27.4459245 48.3242,27.392717 C48.5066667,27.2455472 48.6778,27.0802642 48.875,26.958 C50.0899333,26.2063019 51.3354667,25.4998868 52.5186667,24.7029057 C53.1941333,24.2489434 53.7948,23.6749811 54.383,23.1078113 C54.7162,22.787434 55.0199333,22.5247925 55.6115333,22.6595094 C55.7203333,24.3813962 54.5972,25.4613962 53.5341333,26.5278113 M43.2548,25.4998868 C42.8479333,26.5561132 42.806,26.567434 41.7123333,26.3364906 C37.6334667,25.4761132 33.5602667,24.6089434 29.6729333,23.0342264 C28.9068,22.7240377 28.016,22.6787547 27.1750667,22.6142264 C26.4962,22.5610189 25.9907333,22.3595094 25.5102,21.8410189 C24.9979333,21.287434 24.7157333,20.7576226 24.7769333,19.9821509 C24.8132,19.5293208 24.8166,19.0730943 24.8120667,18.6157358 C24.8075333,18.1595094 24.7928,17.7021509 24.7928,17.2447925 C24.7928,16.187434 24.7928,15.1289434 24.7939333,14.0715849 C24.7950667,13.2746038 25.9023333,12.0089434 26.6934,12.0021509 C28.1769333,11.987434 29.5675333,11.5991321 30.9128,11.0364906 C34.2085333,9.65422642 37.7094,9.04969811 41.1706,8.29233962 C42.8581333,7.92328302 42.8751333,7.94479245 43.4622,9.57837736 C45.3752667,14.9104528 45.2925333,20.2198868 43.2548,25.4998868 M34.9202667,27.768566 C32.2626,27.7187547 29.6038,27.6576226 26.945,27.6236604 C26.5177333,27.6191321 26.2536667,27.4764906 26.0474,27.1119623 C25.7346,26.5583774 25.3866667,26.0240377 24.9968,25.3866792 C25.3232,25.3651698 25.5408,25.323283 25.7538667,25.3413962 C28.4002,25.5587547 31.0465333,25.7715849 33.6894667,26.0195094 C34.4272667,26.0896981 34.714,26.4429057 35.3407333,27.7266792 C35.19,27.7425283 35.0551333,27.7708302 34.9202667,27.768566 M26.2956,7.05498113 C26.3590667,6.95875472 26.5381333,6.89196226 26.6639333,6.89083019 C29.5040667,6.8489434 32.3453333,6.81950943 35.1843333,6.78781132 C35.2194667,6.78781132 35.2534667,6.82177358 35.3486667,6.87384906 C35.0381333,7.33460377 34.7389333,7.79649057 34.4204667,8.2425283 C34.357,8.32969811 34.221,8.39535849 34.1099333,8.4134717 C31.1621333,8.9070566 28.1984667,9.22177358 25.2042,9.18101887 C25.1690667,9.17988679 25.1362,9.14592453 25.0149333,9.08139623 C25.4410667,8.40101887 25.8558667,7.71950943 26.2956,7.05498113 M22.9239333,8.8934717 C22.848,9.03724528 22.6122667,9.19120755 22.4536,9.18781132 C20.2345333,9.13007547 18.0166,9.03724528 15.7975333,8.97158491 C15.2297333,8.95460377 15.1458667,8.65120755 15.2342667,8.18932075 C15.4643333,6.97913208 15.2093333,7.17724528 16.371,7.13196226 C18.6308667,7.04479245 20.8918667,6.98818868 23.1528667,6.92026415 C23.3376,6.91460377 23.5212,6.91913208 23.8385333,6.91913208 C23.4996667,7.66403774 23.2356,8.29007547 22.9239333,8.8934717 M23.2424,27.5829057 C20.8170667,27.5183774 18.3906,27.452717 15.9652667,27.3768679 C15.3521333,27.3564906 15.2784667,27.1844151 15.2104667,26.1723396 C15.1742,25.6391321 15.4688667,25.547434 15.8870667,25.5349811 C18.0846,25.4636604 20.281,25.3889434 22.4774,25.3300755 C22.6168,25.3255472 22.8355333,25.4093208 22.8876667,25.5157358 C23.205,26.1587547 23.4838,26.8198868 23.8022667,27.5330943 C23.5574667,27.5568679 23.3988,27.5863019 23.2424,27.5829057 M12.8916667,26.9489434 C12.1527333,26.9489434 11.4126667,26.8323396 10.6726,26.7598868 C10.6646667,26.6659245 10.6544667,26.5719623 10.6465333,26.478 C11.4206,26.3115849 12.1924,26.1247925 12.9732667,26.0025283 C13.1047333,25.9810189 13.2781333,26.2334717 13.4334,26.3602642 C13.2520667,26.5663019 13.0718667,26.9489434 12.8916667,26.9489434 M5.3788,26.4349811 C5.02746667,25.578 4.74526667,24.692717 4.44833333,23.8142264 C4.37353333,23.5923396 4.36673333,23.3466792 4.46306667,23.0478113 C4.60813333,23.2300755 4.794,23.3908302 4.8926,23.5957358 C5.74713333,25.3708302 6.81813333,26.928566 8.9794,27.5851698 C7.52646667,28.3051698 5.91713333,27.7470566 5.3788,26.4349811 M4.44493333,10.6946038 C4.74073333,9.81271698 5.0286,8.92516981 5.38106667,8.06479245 C5.91713333,6.75271698 7.58313333,6.18441509 9.01113333,6.94064151 C6.52686667,7.60743396 5.57826667,9.60215094 4.54126667,11.5096981 L4.34293333,11.4168679 C4.3758,11.1757358 4.369,10.9221509 4.44493333,10.6946038 M11.0046667,24.1583774 C9.78633333,24.6836604 8.602,25.218 7.3984,25.7013962 C6.89973333,25.9029057 6.64926667,25.5100755 6.4328,25.1353585 C5.372,23.2923396 4.692,21.3349811 4.62853333,19.1908302 C4.5594,16.8078113 4.40186667,14.4089434 5.21446667,12.107434 C5.55673333,11.1372453 6.0486,10.218 6.48833333,9.28177358 C6.6606,8.91271698 6.94846667,8.64667925 7.3814,8.82215094 C8.58386667,9.31233962 9.77386667,9.83422642 11.0126,10.3617736 C8.602,14.988566 8.63033333,19.5553585 11.0046667,24.1583774 M10.6669333,7.77271698 C11.3956667,7.69233962 12.1232667,7.60177358 12.8531333,7.53611321 C13.3178,7.49422642 13.4311333,7.86554717 13.3994,8.1870566 C13.3858,8.32177358 13.0072667,8.5470566 12.8316,8.51762264 C12.0938,8.38969811 11.3696,8.18366038 10.6408667,8.00479245 C10.6488,7.92781132 10.6578667,7.85083019 10.6669333,7.77271698 M57.2016,13.7783774 C57.1483333,12.227434 56.7505333,10.6900755 55.8869333,9.34290566 C54.2866667,6.84781132 51.9667333,5.67498113 49.0223333,5.65120755 C45.7515333,5.62630189 42.4796,5.55271698 39.2088,5.56516981 C38.2692667,5.56856604 37.5552667,5.4825283 37.0282667,4.53950943 C36.5477333,3.67686792 35.6739333,3.2670566 34.4737333,3.43120755 C34.7695333,4.15007547 35.0358667,4.79649057 35.3384667,5.53233962 C35.0630667,5.53233962 34.8534,5.5425283 34.6437333,5.53120755 C32.6955333,5.42818868 30.7439333,5.67498113 28.7889333,5.32856604 C27.914,5.17233962 26.9631333,5.49950943 26.0462667,5.50743396 C23.0905333,5.53120755 20.1359333,5.48932075 17.1813333,5.50630189 C14.0578667,5.52441509 10.9332667,5.54139623 7.81206667,5.63649057 C5.78453333,5.69762264 4.25453333,6.60328302 3.553,8.61611321 C3.33766667,9.23196226 3.09286667,9.84101887 2.94326667,10.4738491 C2.16353333,13.7500755 2.1896,17.0783774 2.38,20.4089434 C2.48993333,22.3323396 2.86846667,24.2081887 3.56886667,26.0115849 C4.27606667,27.8330943 5.74713333,28.8689434 7.69193333,28.8881887 C11.2154667,28.923283 14.7401333,28.9153585 18.2625333,28.9968679 C21.3112,29.0681887 24.3655333,28.7919623 27.4142,29.2006415 C28.2619333,29.3149811 29.1572667,29.0263019 30.0322,29.0059245 C31.6347333,28.968566 33.2395333,28.9934717 34.8443333,28.9957358 C34.9996,28.9957358 35.1548667,29.0229057 35.3146667,29.0364906 C35.0302,29.7361132 34.7672667,30.3802642 34.4748667,31.0957358 C35.8983333,31.247434 36.7234,30.588566 37.3206667,29.6013962 C37.6096667,29.1225283 37.9417333,28.9821509 38.4857333,28.9810189 C42.0738667,28.9742264 45.662,28.9730943 49.2478667,28.8746038 C51.0804667,28.8247925 52.8280667,28.3991321 54.2730667,27.1063019 C55.9651333,25.592717 56.9307333,23.6749811 57.0996,21.4810189 C57.2956667,18.9247925 57.2877333,16.3436604 57.2016,13.7783774',
                            fillColor: 'black',
                            fillOpacity: 0.8,
                            //size: new google.maps.Size(10, 16),
                            origin: new google.maps.Point(0, 0),
                            // The anchor for this image is the base of the flagpole at (0, 32).
                            anchor: new google.maps.Point(15, 0),
                            scale: .5,
                            rotation: parseInt(value.rotation)
                        };

                        user_markers = new google.maps.Marker({
                            position: position,
                            draggable: false,
                            id: value.id,
                            //animation: google.maps.Animation.DROP,
                            map: map,
                            //icon: 'http://imsba.com/files/media/website/137/media/1/driver_icon2.png',
                            icon: goldStar
                        });


                        var new_index = markers.push(user_markers) - 1;

                        google.maps.event.addListener(markers[new_index], 'click', function (e) {
                            //console.log(markers[value.id].id);
                            if (clicked == false) {
                                clicked = true;
                                new myTaskClass(markers[new_index].id).addMarkers();
                            }
                        });

                        google.maps.event.addListener(markers[new_index], 'rightclick', function (e) {
                            $('#myModal').modal('show');
                            pullProfile(markers[new_index].id);
                        });


                    }
                });
            }
        });
    }, 8000);
    var zubie_data = JSON.parse(window.localStorage.getItem('zubie_data'));
    $.each(zubie_data,function (index,value) {
        var position = new google.maps.LatLng(value.latitude, value.longitude);

        user_markers = new google.maps.Marker({
            position: position,
            draggable: false,
            id:value.id,
            map: map,
            icon:
                {labelOrigin: new google.maps.Point(20, 33),
                    url: 'img/zoob.png',
                    size: new google.maps.Size(35, 26),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(11, 40)},
            label : {text:index,color:'black'}
        });


        var new_index = markers.push(user_markers) -1;
        google.maps.event.addListener(markers[new_index], 'click', function (e) {
            $('#fuel_level').val(value.fuel_level+'%');
            $('#fuel_info').modal('show');

        });

    });}






}
// function calculateAndDisplayRoute(metDirectionsService, metDirectionsDisplay) {
//     first_order = new google.maps.LatLng(orders_order[0][0], orders_order[0][1]);
//     //second_order = new google.maps.LatLng(orders_order[1][0], orders_order[1][1]);
//     last_order = new google.maps.LatLng(orders_order[orders_order.length - 1][0], orders_order[orders_order.length - 1][1]);
//
//
//     google.maps.event.addListener(metDirectionsDisplay, 'directions_changed', function () {
//         //     console.log(directionsDisplay);
//         if (metDirectionsDisplay != null)
//             computeTotalDistance(metDirectionsDisplay.directions, first_order);
//
//     });
//
//     //console.log(getWayPoints());
//
//     metDirectionsService.route({
//         origin: first_order,
//         destination: last_order,
//         waypoints: getWayPoints(),
//         optimizeWaypoints: true,
//         travelMode: google.maps.TravelMode.DRIVING,
//         drivingOptions: {
//             departureTime: new Date(Date.now()),  // for the time N milliseconds from now.
//             trafficModel: "pessimistic"
//         }
//
//     }, function (response, status) {
//         //    console.log(response);
//         if (status === google.maps.DirectionsStatus.OK) {
//             metDirectionsDisplay.setDirections(response);
//
//             fx(response.routes[0]);
//
//         } else {
//             console.log('Directions request failed due to ' + status);
//         }
//     });
// }
// function fx(o){
//     if(o && o.legs){
//         for(l=0;l<o.legs.length;++l){
//             var leg=o.legs[l];
//             for(var s=0;s<leg.steps.length;++s){
//                 var step=leg.steps[s],
//                     a=(step.lat_lngs.length)?step.lat_lngs[0]:step.start_point,
//                     z=(step.lat_lngs.length)?step.lat_lngs[1]:step.end_point,
//                     dir=((Math.atan2(z.lng()-a.lng(),z.lat()-a.lat())*180)/Math.PI)+360,
//                     ico=Math.round((dir>360)?dir-360:dir);
//
//                 var goldStar = {
//                     path: 'M22.8,14.6l-9.3-9.3c-0.8-0.8-2.1-0.8-2.9,0l-9.3,9.3,c-0.8,0.8-1,2-0.2,2.8l0.3,0.4c0.8,0.7,1.6,0.8,2.3,0.1c2.3-2.3,4.6-4.6,6.9-6.9c0.8-0.8,2.1-0.8,2.9,0c2.3,2.3,4.6,4.6,6.9,6.9,c0.7,0.7,1.5,0.6,2.3-0.1l0.4-0.4C23.8,16.6,23.6,15.4,22.8,14.6L22.8,14.6z',
//                     fillColor: 'black',
//                     fillOpacity: 1,
//                     size: new google.maps.Size(24, 24),
//                     //origin: new google.maps.Point(0, 0),
//                     // The anchor for this image is the base of the flagpole at (0, 32).
//                     anchor: new google.maps.Point(12, 12),
//                     scale: .3,
//                     rotation:parseInt(ico)
//                 };
//                 var arrow =  new google.maps.Marker({
//                     position: a,
//                     icon: goldStar,
//                     map: map,
//                     title: Math.round((dir>360)?dir-360:dir)+'°'
//                 });
//                 arrows.push(arrow);
//             }
//         }
//     }
// }

// location to waypoint, later it can be list
// function getWayPoints() {
// //		console.log(orders_order);
//     var waypts = [];
//     //var count = 0;
//
//     for (var i = 0; i < orders_order.length - 1; i++) {
//         var location_value = new google.maps.LatLng(orders_order[i][0], orders_order[i][1]);
//
//         waypts.push({
//             location: location_value,
//             stopover: false
//         });
//     }
//
//
//     return waypts;
// }
// function geocodeLatLng(geocoder, map, infowindow, latlng, marker) {
//
//     geocoder.geocode({'location': latlng}, function (results, status) {
//         if (status === google.maps.GeocoderStatus.OK) {
//             //results can be detailed or general address
//             if (results[0]) {
//                 infowindow.setContent(results[0].formatted_address);
// //	                console.log(marker);
//                 infowindow.open(map, marker);
//             } else {
//                 console.log('No results found');
//             }
//         } else {
//             console.log('Geocoder failed due to: ' + status);
//         }
//     });
// }
// function computeTotalDistance(result, markerLocation) {
//     if (result != null) {
//
//         var total = 0;
//         var time = 0;
//         var from = 0;
//         var to = 0;
//         var myroute = result.routes[0];
//         for (var i = 0; i < myroute.legs.length; i++) {
//             total += myroute.legs[i].distance.value;
//             time += myroute.legs[i].duration.text;
//             from = myroute.legs[i].start_address;
//             to = myroute.legs[i].end_address;
//         }
//         //     console.log(time);
//         //                time = time.replace('hours', 'H');
//         //                time = time.replace('mins', 'M');
//         total = total * 0.621371 / 1000;
//
//
// //	        console.log(from + '\n' + to);
// //	        console.log(time);
// //	        console.log(Math.round(total) + " mi");
//
//         currentWindowText = Math.round(total) + " Mile" + time;
// //	        console.log(currentWindowText);
//
//
//         infowindowTime.setContent(Math.round(total) + " miles <br>" + time);
//         infowindowTime.setPosition(markerLocation);
//         infowindowTime.open(map);
//         return Math.round(total) + " mile, " + time;
//
//     }
// }
// function getNonZeroRandomNumber() {
//     var random = Math.floor(Math.random() * 199) - 99;
//     if (random == 0) return getNonZeroRandomNumber();
//     return random;
// }
function find_address(address) {
    console.log(address);

    var latlng = new google.maps.LatLng(34.1479130, -118.2491390);
    var mapOptions = {
        zoom: 18,
        center: latlng
    }
    // map2 = new google.maps.Map(document.getElementById('map_view'), mapOptions);


    geocoder.geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            //results can be detailed or general address
            if (results[0]) {
                map.setCenter(results[0].geometry.location);
                // var marker = new google.maps.Marker({
                //     map: map,
                //     position: results[0].geometry.location
                // });

            } else {
                console.log('No results found');
            }
        } else {
            console.log('Geocoder failed due to: ' + status);
        }
    });

}
function find_driver(id) {
    $.ajax({
        type: 'GET',
        url: domain+apiv+'users/location/'+id+'?crm_account_id='+id+'&key='+api_key,
        dataType: "json",
        headers: {"token":token},
        success: function(data){
            if(data.lat){
                // console.log('Got drivers Info');
                var lat = Number(data.lat);
                var lng = Number(data.lng);

                console.log(lat + ' ' + lng);

                map.setCenter({lat:lat, lng:lng});
                map.setZoom(20);
            }else{
                new PNotify('No Location Data for Driver');
            }
        }
    });

}

google.maps.event.addDomListener(window, 'load', initialize());
$('#switch-source-map li').on('click', function(event){
    event.preventDefault()
    var  switch_sourse =$(this).text();
    google.maps.event.addDomListener(window, 'load', initialize(switch_sourse));

});


