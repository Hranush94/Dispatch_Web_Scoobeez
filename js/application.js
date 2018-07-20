// Scoobeez
var api_key = 'qNpala4OG$6m8oxK2qRpgR6B$npdxWgXGF5$QaNt9UQhfl$hMQH$FNBE7!SFU6Ax';

// Other
// var api_key = 'usFWXy5gvEZgspw6iqd2QvM3jL8BNo@eQE7L9d@FSYVhkooDOBFC3oFm7NYU8W5Z';
var domain = 'https://imsba.com/';
var apiv = 'api/v2/';
var loading = $('#loading').hide();
var website_data;
// type: info, alert, notice, success, error,
//new PNotify({text: 'Regular Notice', type:'error',addclass: 'translucent'});
// loading.show();
// loading.hide();

if (window.localStorage.getItem('token')) {
    var token = window.localStorage.getItem('token');

    if (window.localStorage.getItem('start')) {
        var start = window.localStorage.getItem('start');
        var end = window.localStorage.getItem('end');
    }

}

// Get Settings & Set Defaults
function login() {
    loading.show();
    var username = $('#login_username').val();
    var password = $('#login_password').val();

    if (username && password) {
        $.ajax({
            type: 'POST',
            url: domain + apiv + 'admin/login?key=' + api_key,
            dataType: "json",
            data: {username: username, password: password, login_type: 2},
            success: function (data) {
                loading.hide();
                window.localStorage.setItem("customer_id", data.id);
                window.localStorage.setItem("token", data.token);
                window.localStorage.setItem("customer_data", JSON.stringify(data));

                window.location = 'dashboard.html';
            },
            error: function (xhr, ajaxOptions, thrownError) {
                loading.hide();
                new PNotify({text: JSON.parse(xhr.responseText).error.message});
            }
        });
    } else {
        loading.hide();
        if (!username && !password) {
            $("#login_username").effect("shake");
            $("#login_password").effect("shake");
            new PNotify('All Fields are Required');
        } else if (!username) {
            $("#login_username").effect("shake");
            new PNotify('Username is Required');
        } else if (!password) {
            $("#login_password").effect("shake");
            new PNotify('Password is Required');
        }
    }
}

function reset_password() {
    loading.show();
    var phone = $('#forgot_phone').val();

    if (phone) {
        $.ajax({
            type: 'POST',
            url: domain + apiv + 'admin/password_reset?key=' + api_key,
            dataType: "json",
            data: {phone: phone, digits: '6'},
            success: function (data) {
                $('#reset').modal('hide');
                $('#reset2').modal('show');
                window.localStorage.setItem('phone', phone);
                loading.hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                loading.hide();
                new PNotify({text: JSON.parse(xhr.responseText).error.message});
            }
        });
    } else {
        loading.hide();
        if (!phone) {
            $("#forgot_phone").effect("shake");
            new PNotify('Phone Number is Required');
        }
    }

}

function verify_password() {
    loading.show();
    var code = $('#password_code').val();
    var phone = window.localStorage.getItem('phone');
    if (code) {
        $.ajax({
            type: 'POST',
            url: domain + apiv + 'admin/verify?key=' + api_key,
            dataType: "json",
            data: {phone: phone, code: code},
            success: function (data) {
                $('#reset2').modal('hide');
                $('#reset3').modal('show');
                window.localStorage.setItem('code', code);
                loading.hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                loading.hide();
                new PNotify({text: JSON.parse(xhr.responseText).error.message});
            }
        });

    } else {
        loading.hide();
        if (!code) {
            new PNotify('Code is Required');
        }
    }
}

function new_password() {
    loading.show();
    var new_password_1 = $('#new_password_1').val();
    var new_password_2 = $('#new_password_2').val();
    var phone = window.localStorage.getItem("phone");
    var code = window.localStorage.getItem("code");

    if (new_password_1 && new_password_2 && new_password_1 == new_password_2) {
        $.ajax({
            type: 'POST',
            url: domain + apiv + 'admin/password?key=' + api_key,
            dataType: "json",
            data: {phone: phone, code: code, password: new_password_1},
            success: function (data) {
                $('#reset3').modal('hide');
                new PNotify({text: 'Password Changed', type: 'success'});
                loading.hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                loading.hide();
                new PNotify({text: JSON.parse(xhr.responseText).error.message});
            }
        });
    } else {
        loading.hide();
        if (!new_password_1 && !new_password_2) {
            new PNotify('All Fields are Required');
        } else if (new_password_1 != new_password_2) {
            new PNotify('Passwords do not match');
        }
    }
}

function logout() {
    loading.show();
    localStorage.clear();
    window.location = 'index.html';
    loading.hide();
}

// Set Settings on Page Load - Save
function pull_info() {
    // Set Permissions
    website_data = JSON.parse(window.localStorage.getItem('website_data'));
    if (website_data) {
        $('#main_logo').attr('src', domain + website_data.logo);
        $('#main_icon').attr('src', domain + website_data.icon);

        if (website_data.hr != 1) {
            hideHR();
        }
    } else {
        settings();
    }

    $.ajax({
        type: 'GET',
        async: true,
        url: domain + apiv + 'workforce/permission?key=' + api_key,
        dataType: "json",
        headers: {"token": token},
        success: function (data) {
            window.localStorage.setItem("locationSites", JSON.stringify(data));
            // Set / Replace stuff with Branding

            var locations = '<option>Please Select Location</option>';
            $.each(data, function (index, value) {

                locations += '<option value="' + value.id + '">' + value.name + '</option>';

            });

            $('#setLocation').html(locations);

        },
        error: function (xhr, ajaxOptions, thrownError) {
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
            window.location = 'index.html';
            localStorage.clear();
        }
    });

    var site_id = window.localStorage.getItem('site_id');

    if (!site_id || site_id == 'null') {
        $('#left_menu_content').hide();
        $('#location_set').html('Please Select Location');
        $('#location_sites').modal('show');
    } else {
        var siteName = window.localStorage.getItem('site_name');
        $('#location_set').html(siteName);
        window.localStorage.setItem('date', today());
        window.localStorage.setItem('start', todaySearch() + ' 00:00:00 -800');
        window.localStorage.setItem('end', todaySearch() + ' 23:59:59 -800');

        if (website_data.hr == 1) {
            trackhour();
        }
    }

    getShifts();

}

function settings() {
    // Get Website Data
    $.ajax({
        type: 'GET',
        async: true,
        url: domain + apiv + 'website/settings?key=' + api_key,
        dataType: "json",
        success: function (data) {
            window.localStorage.setItem("website_data", JSON.stringify(data));

            $('#main_logo').attr('src', domain + data.logo);
            $('#main_icon').attr('src', domain + data.icon);

            if (data.hr != 1) {
                hideHR();
            }
            // Set / Replace stuff with Branding
        },
        error: function (xhr, ajaxOptions, thrownError) {
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });
}

function hideHR() {
    // $('#menu_item_drivers').hide();
    $('#menu_item_dispatcher').hide();
    $('#menu_item_assignment').hide();
    $('#menu_item_statistics').hide();
    $('#menu_item_rescue').hide();
    $('#menu_item_inspection').hide();
    $('#menu_item_inventory').hide();
    $('#menu_item_supplies').hide();
    $('#profileRescue').hide();
    $('#menu_item_delivery_report').hide();
    $('#menu_item_new_order').hide();
    $('#menu_item_hour_report').hide();
}

function trackhour() {
    var locationSites = JSON.parse(window.localStorage.getItem('locationSites'));
    var site_id = window.localStorage.getItem('site_id');

    var site_info;
    $.each(locationSites, function (index, location) {

        if (site_info) {
            return false;
        } else {
            $.each(location.sites, function (index, site) {
                if (site.id == site_id) {
                    site_info = site;
                }
            });
        }
    });

    var state = (site_info ? site_info.state : 'CA');

    if (state == "CA" || state == 'ca') {
        // console.log('PST');
        dt = new Date(moment().tz("America/Los_Angeles").format('YYYY-MM-DDTHH:mm:ss'));
    } else {
        // console.log('CST');

        dt = new Date(moment().tz("America/Chicago").format('YYYY-MM-DDTHH:mm:ss'));
    }

    // console.log(dt);

    // setInterval(function () {
    //
    //     var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    //     var old_hours =  dt.getHours();
    //     dt.setSeconds(dt.getSeconds() + 1);
    //     var new_hours =  dt.getHours();
    //     if(new_hours > old_hours){
    //         $('#bottom_reports').modal('show');
    //         run_by_hour();
    //     }
    //     //$('.search-query').val(time);
    // }, 1000);
}

// Shift & Driver Specific
function getShifts() {
    var site_id = window.localStorage.getItem('site_id');
    var start = window.localStorage.getItem('start');
    var end = window.localStorage.getItem('end');
    var date = window.localStorage.getItem("date");

    loading.show();
    // Maybe change this code to activate when drivers are clicked in menu?

    if (website_data.hr == 1) {
        setTimeout(function () {
            $.ajax({
                type: 'POST',
                url: domain + apiv + 'workforce/all_shifts?key=' + api_key,
                dataType: "json",
                data: {start: start, end: end, site_id: site_id, date: date},
                headers: {"token": token},
                success: function (data) {
                    window.localStorage.setItem('shifts', JSON.stringify(data));

                    var drivers = [];
                    $.each(data, function (index, value) {
                        if (value.crm_data) {
                            drivers.push(value.crm_data);
                        }
                    });
                    window.localStorage.setItem('drivers', JSON.stringify(drivers));

                    $('#driverList').html('<li><span class="lbl2">Please Re-Select Jobsite</span></a> </li>')
                    loading.hide();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    loading.hide();
                    new PNotify({text: JSON.parse(xhr.responseText).error.message});
                }
            });
        }, 200);
    } else {
        setTimeout(function () {
            $.ajax({
                type: 'GET',
                url: domain + apiv + 'dispatch/drivers?key=' + api_key,
                dataType: "json",
                headers: {"token": token},
                success: function (data) {
                    window.localStorage.setItem('drivers', JSON.stringify(data));

                    $('#driverList').html('<li><span class="lbl2">Please Refresh Driver List</span></a> </li>');
                    loading.hide();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    loading.hide();
                    new PNotify({text: JSON.parse(xhr.responseText).error.message});
                }
            });
        }, 200);
    }
}

function loadShifts() {

    if (website_data.hr == 1) {
        var shifts = JSON.parse(window.localStorage.getItem('shifts'));
        var driverList = '<div class="row search-drivers m-0"> <div class="col-md-12"> <div class="form-group"> <div class="form-control-wrapper form-control-icon-right"> <input type="text" onkeyup="searchDrivers(this)" id="searchDrivers" class="form-control form-control-lg" placeholder="Search"> <i class="search-drivers-icon font-icon-search"></i> </div> </div> </div> </div>';
        $.each(shifts, function (index, value) {
            if (value.crm_data) {

                if (value.clock_status == 0) {
                    var circleStatus = 'circle-grey';
                    var circleName = 'Clocked Out';
                } else {
                    var circleStatus = '';
                    var circleName = 'Clocked In';
                }

                driverList += '<li class="dropdown show opened-list accounts"> <a class="dropdown-toggle sublist-dropdown" href="javascropt:void(0);" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="font-icon fa fa-circle ' + circleStatus + '" aria-hidden="true"></i> <span class="lbl2" onclick="pullProfile(' + value.crm_data.id + ');" >' + value.crm_data.first_name + ' ' + value.crm_data.last_name + '</span><span class="opened-sub">Shift Time: ' + value.totalHours + ' Hours</span><span class="opened-sub">' + circleName + '</span> </a> <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink"> <a class="dropdown-item" href="#" data-toggle="modal" onclick="loadSchedule(' + value.id + ')" data-target="#view_schedule">View Schedule</a> <a class="dropdown-item" href="javascript:void(0)" onclick="loadReport(' + value.crm_data.id + ')">Reporting</a> <a class="dropdown-item" target="_blank" href="http://beezkeeper.com/hr/attendance/39/137/' + value.site_id + '/?id=' + value.crm_data.id + '">Attendance</a> <a class="dropdown-item" href="javascript:void(0)" onclick="pullProfile(' + value.crm_data.id + ')">Profile</a></div> </li>';
            }
        });

        $('#driverList').html(driverList);
    } else {
        var drivers = JSON.parse(window.localStorage.getItem('drivers'));
        var driverList = '<div class="row search-drivers m-0"> <div class="col-md-12"> <div class="form-group"> <div class="form-control-wrapper form-control-icon-right"> <input type="text" onkeyup="searchDrivers(this)" id="searchDrivers" class="form-control form-control-lg" placeholder="Search"> <i class="search-drivers-icon font-icon-search"></i> </div> </div> </div> </div>';
        $.each(drivers, function (index, value) {
            var circleStatus = 'circle-grey';
            var circleName = 'Clocked Out';

            driverList += '<li class="dropdown show opened-list accounts parent"> ' +
                '<a class="dropdown-toggle sublist-dropdown" href="javascropt:void(0);" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> ' +
                '<i class="font-icon fa fa-circle ' + circleStatus + '" aria-hidden="true"></i> ' +
                '<span class="lbl2" onclick="pullProfile(' + value.id + ');" >' + value.first_name + ' ' + value.last_name + '</span>' +
                '</a> ' +
                '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">' +
                '<a class="dropdown-item" href="javascript:void(0)" onclick="pullProfile(' + value.id + ')">Profile</a>' +
                '</div> ' +
                '<ul data-id="' + value.id + '" class="sortable" style="display: inherit; min-height: 25px; margin-left: 17px;">';

            $.each(value.orders, function (index, order) {
                var status = '';
                if (order.status == 0) {
                    status = 'In Progress';
                } else if (order.status == 1) {
                    status = 'Picking Up';
                } else if (order.status == 2) {
                    status = 'Picked Up';
                } else if (order.status == 3) {
                    status = 'Dropping Off';
                }
                driverList += '<li id="id_' + value.id + ',' + order.id + '" data-id="' + order.id + '" style="border-bottom: 1px solid #3d3d3d; padding-bottom: 5px; padding-top: 5px;"><span class="opened-sub">ID: ' + order.id + '</span><span class="opened-sub">' + order.service_location + '</span><span class="opened-sub">Status: ' + status + '</span></li>';
            });

            driverList += '</ul></li>';
        });

        $('#menu_item_drivers').height('calc(100vh - 150px)');

        $('#driverList').html(driverList);

        $('.sortable').sortable({
            connectWith: '.sortable',
            update: function (event, ui) {
                loading.show();
                var data = $(this).sortable('serialize');

                // console.log(data);
                // console.log($(this).data('id'));

                data += '&driver_id=' + $(this).data('id');

                $.ajax({
                    type: 'POST',
                    url: domain + apiv + 'dispatch/order?key=' + api_key,
                    dataType: "json",
                    data: data,
                    headers: {"token": token},
                    success: function (data) {
                        // new PNotify('Updated');
                        $('#resque').modal('hide');
                        loading.hide();
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        loading.hide();
                        new PNotify({text: JSON.parse(xhr.responseText).error.message});
                    }
                });
            }
        });

    }
}

function loadSchedule(id) {
    // id = shift->id;logs

    var shifts = JSON.parse(window.localStorage.getItem('shifts'));

    var shift;
    $.each(shifts, function (index, value) {
        if (value.id == id) {
            shift = value;
            return false;
        }
    });


    $('#scheduleName').html(shift.crm_data.first_name + ' ' + shift.crm_data.last_name);
    $('#scheduleScheduled').html(shift.scheduleScheduled);
    $('#scheduleActual').html(shift.scheduleActual);
    $('#scheduleLength').html(shift.scheduleLength + ' Hours');
    $('#scheduleLunch').html(shift.scheduleLunch);
    $('#scheduleActualLunch').html(shift.scheduleActualLunch);

}

function pullProfile(id) {
    setTimeout(function () {
        $('.dropdown-menu').removeClass('show');
    }, 1);
    var drivers = JSON.parse(window.localStorage.getItem("drivers"));
    var driver;
    $.each(drivers, function (index, value) {
        if (value.id == id) {
            driver = value;
            return false;
        }
    });

    $('#profileName').html(driver.first_name + ' ' + driver.last_name);
    $('#profileEmail').html(driver.email);
    $('#profilePhone').html(driver.phone);
    $('#profileRescue').attr('onclick', 'newRescue(' + id + ')');
    $('#profile').modal('show');
    find_driver(id);
}

// Rescues
function newRescue(id) {
    // $('#profile').modal('hide');
    $('#resque').modal('show');

    $('#rescueDriverID').val(id);

    var drivers = JSON.parse(window.localStorage.getItem("drivers"));
    var driver;
    var driverContent = '';
    $.each(drivers, function (index, value) {
        if (id == value.id) {
            driver = value;
        } else {
            driverContent += '<option value="' + value.id + '">' + value.first_name + ' ' + value.last_name + '</option>';
        }
    });

    $('#rescueDrivers').html(driverContent);
    $('#rescueName').html('Send Rescue for ' + driver.first_name + ' ' + driver.last_name);
    $('#submitRescueButton').attr('onclick', 'submitRescue()');
}

function submitRescue(id) {
    loading.show();

    var rescueData = {};

    rescueData.date = window.localStorage.getItem("date");
    rescueData.site_id = window.localStorage.getItem('site_id');

    rescueData.crm_account_id = $('#rescueDriverID').val();
    rescueData.packages = $('#rescuePackages').val();
    rescueData.time = $('#rescueTime').val();
    rescueData.rescuer = $('#rescueDrivers').find("option:selected").text();
    rescueData.rescuer_id = $('#rescueDrivers').val();

    // console.log(rescueData.rescuer_id);

    if (id) {
        $.ajax({
            type: 'POST',
            url: domain + apiv + 'dispatch/update_rescue?key=' + api_key,
            dataType: "json",
            data: rescueData,
            headers: {"token": token},
            success: function (data) {
                new PNotify('Updated');
                $('#resque').modal('hide');
                loading.hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                loading.hide();
                new PNotify({text: JSON.parse(xhr.responseText).error.message});
            }
        });
    } else {
        $.ajax({
            type: 'POST',
            url: domain + apiv + 'dispatch/rescue?key=' + api_key,
            dataType: "json",
            data: rescueData,
            headers: {"token": token},
            success: function (data) {
                new PNotify('Added');
                $('#resque').modal('hide');
                loading.hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                loading.hide();
                new PNotify({text: JSON.parse(xhr.responseText).error.message});
            }
        });
    }
}

function allRescues() {
    loading.show();
    $('#all_rescues').modal('show');
    var date = window.localStorage.getItem("date");
    var site_id = window.localStorage.getItem('site_id');

    $.ajax({
        type: 'GET',
        url: domain + apiv + 'dispatch/rescue?date=' + date + '&site_id=' + site_id + '&key=' + api_key,
        dataType: "json",
        headers: {"token": token},
        success: function (data) {
            window.localStorage.setItem('rescues', JSON.stringify(data));

            var rescueContent = '';

            $.each(data, function (index, value) {
                rescueContent += '<div class="row"> <div class="col-md-8"> <div class="row route-driver"> <div class="col-md-12"> <p>' + value.saved.first_name + ' ' + value.saved.last_name + '</p> </div> </div> </div> <div class="col-md-4"> <a href="javascript:void(0);" onclick="pullRescue(' + value.id + ')" class="btn btn-report">View Rescue</a> </div> </div> <div class="empty-xs-40 empty-md-10"></div>';
            });
            $('#rescueinsert').html(rescueContent);
            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });
}

function pullRescue(id) {
    // $('#profile').modal('hide');
    $('#all_rescues').modal('hide');
    $('#resque').modal('show');
    var rescues = JSON.parse(window.localStorage.getItem("rescues"));

    var rescue;
    $.each(rescues, function (index, value) {
        if (value.id == id) {
            rescue = value;
        }
    });

    var drivers = JSON.parse(window.localStorage.getItem("drivers"));
    var driver;
    var driverContent = '';
    $.each(drivers, function (index, value) {
        if (id == value.id) {
            driver = value;
        } else {

            if (rescue.rescuer_id == value.id) {
                var selected = 'selected';
            } else {
                var selected = '';
            }

            driverContent += '<option ' + selected + ' value="' + value.id + '">' + value.first_name + ' ' + value.last_name + '</option>';
        }
    });

    $('#rescuePackages').val(rescue.packages);
    $('#rescueTime').val(rescue.time);
    $('#rescueDriverID').val(rescue.crm_account_id);

    $('#rescueDrivers').html(driverContent);
    $('#rescueName').html('Send Rescue for ' + rescue.saved.first_name + ' ' + rescue.saved.last_name);
    $('#submitRescueButton').attr('onclick', 'submitRescue(' + id + ')');

}

// HR Reporting
function loadReport(id) {
    loading.show();
    $('#reporting').modal('show');
    var drivers = JSON.parse(window.localStorage.getItem('drivers'));
    var user = JSON.parse(window.localStorage.getItem("customer_data"));
    var driver;
    $.each(drivers, function (index, value) {
        if (id == value.id) {
            driver = value;
            return false;
        }
    });
    if (driver) {
        $('#reportDriverTitle').html('Report: ' + driver.first_name + ' ' + driver.last_name + ' By: ' + user.firstname + ' ' + user.lastname);
        $('#reportDriverId').val(driver.id);
    }

    var date = window.localStorage.getItem("date");
    var site_id = window.localStorage.getItem('site_id');
    $('#reportHRdate').val(date);
    $('#reportHRSite_id').val(site_id);

    var start = window.localStorage.getItem('start');
    var end = window.localStorage.getItem('end');

    $('#reportHRstart').val(start);
    $('#reportHRend').val(end);

    loading.hide();
}

function loadReasons(e) {

    var insertHRQuestions = '';
    if (e.val() == 1) {
        insertHRQuestions += '<div class="row"><div class="col-md-12">' +
            '<select id="HRreason" name="reason" onchange="loadquestions($(this));" class="select2">' +
            '<option>Please Select a Reason</option>' +
            '<option>Performance</option> ' +
            '<option>Harassment</option> ' +
            '<option>Insubordination</option> ' +
            '<option>Tardiness</option> ' +
            '<option>Rabbit Damage</option>' +
            '<option>Other</option></select> ' +
            '</div> ' +
            '</div>';
    } else if (e.val() == 2) {
        insertHRQuestions += '<div class="row"><div class="col-md-12"><span>Reason</span><br/><p class="form-control-static"><input type="text" class="form-control" name="reason" placeholder="Reason"> </div></div>';

        insertHRQuestions += '<div class="row"><div class="col-md-12">' +
            '<span>Was the DA called?</span><br/><select id="HRreason" name="was_da_called" class="select2"><option>Yes</option> ' +
            '<option>No</option></select> ' +
            '</div> ' +
            '</div>';

        insertHRQuestions += '<div class="row"><div class="col-md-12">' +
            '<span># of times called</span><br/><select id="mainReason" name="num_times_called" class="select2"><option>1</option> ' +
            '<option>2</option><option>2+</option></select> ' +
            '</div> ' +
            '</div>';
        insertHRQuestions += '<div class="row"><div class="col-md-12"><span>Time called</span><br/><p class="form-control-static"><input type="text" class="form-control" name="time_called" placeholder="Time Called"> </div></div>';

        insertHRQuestions += '<div class="row"><div class="col-md-12">' +
            '<span>Was the DA texted?</span><br/><select id="mainReason" name="was_da_texted" class="select2"><option>Yes</option> ' +
            '<option>No</option></select> ' +
            '</div> ' +
            '</div>';

        insertHRQuestions += '<div class="row"><div class="col-md-12"><span>Time Texted</span><br/><p class="form-control-static"><input type="text" class="form-control" name="time_texted"  placeholder="Time Texted"> </div></div>';
    } else if (e.val() == 3) {
        insertHRQuestions += '<div class="row"><div class="col-md-12"><span>Reason</span><br/><p class="form-control-static"><input type="text" class="form-control" name="reason" placeholder="Reason"> </div></div>';

        insertHRQuestions += '<div class="row"><div class="col-md-12">' +
            '<span>Was the DA called?</span><br/><select id="mainReason" name="was_da_called" class="select2"><option>DA was called by Dispatch</option> ' +
            '<option>DA called Dispatch</option></select> ' +
            '</div> ' +
            '</div>';

        insertHRQuestions += '<div class="row"><div class="col-md-12">' +
            '<span>Was a reason given?</span><br/><select id="mainReason" name="reason_given" class="select2"><option>Car break-down</option> ' +
            '<option>Babysitter</option><option>Family Emergency</option><option>Sick</option><option>Got in accident</option><option>Previous engagement</option><option>Other</option></select> ' +
            '</div> ' +
            '</div>';
        insertHRQuestions += '<div class="row"><div class="col-md-12">' +
            '<span>Was office notified?</span><br/><select id="mainReason" name="office_notified" class="select2"><option>Office was Called</option> ' +
            '<option>Office was sent a text</option><option>Ticket was submitted</option></select> ' +
            '</div> ' +
            '</div>';
        insertHRQuestions += '<div class="row"><div class="col-md-12">' +
            '<span>Did office notify dipatch?</span><br/><select id="mainReason" name="dispatch_notified" class="select2"><option>Yes</option> ' +
            '<option>No</option></select> ' +
            '</div> ' +
            '</div>';
    } else if (e.val() == 4) {
        insertHRQuestions += '<div class="row"><div class="col-md-12">' +
            '<span>Reason?</span><br/><select id="mainReason" name="reason" class="select2"><option>Over headcount</option> ' +
            '<option>Late</option><option>Not in uniform</option></select> ' +
            '</div> ' +
            '</div>';
    } else if (e.val() == 5) {

        insertHRQuestions += '<div class="row"><div class="col-md-12"><span>Route</span><br/><p class="form-control-static"><input type="text" class="form-control" name="route" placeholder="Route"> </div></div>';
        insertHRQuestions += '<div class="row"><div class="col-md-12"><span>Package count</span><br/><p class="form-control-static"><input type="text" class="form-control" name="package_count" placeholder="Package Count"> </div></div>';

        insertHRQuestions += '<div class="row"><div class="col-md-12"><span>Stop Count</span><br/><p class="form-control-static"><input type="text" class="form-control" name="stop_count" placeholder="Stop Count"> </div></div>';
        insertHRQuestions += '<div class="row"><div class="col-md-12"><span>DA action</span><br/><p class="form-control-static"><input type="text" class="form-control" name="da_action" placeholder="DA action"> </div></div>';
        insertHRQuestions += '<div class="row"><div class="col-md-12"><span>Location</span><br/><p class="form-control-static"><input type="text" class="form-control" name="location" placeholder="Location"> </div></div>';
        insertHRQuestions += '<div class="row"><div class="col-md-12">' +
            '<span>Reason</span><br/><select id="mainReason" name="reason" class="select2"><option>Going off route</option> ' +
            '<option>Extended lunch</option>' +
            '<option>Unknown stop time</option>' +
            '<option>Reckless Driving</option>' +
            '<option>Customer Service complaint</option>' +
            '<option>Marking Packages incorrectly</option>' +
            '<option>Rescue Refusal</option>' +
            '<option>Excessive personal phone usage</option>' +
            '<option>No sense of Urgency</option>' +
            '</select> ' +
            '</div> ' +
            '</div>';
    } else if (e.val() == 6) {
        insertHRQuestions += '<div class="row"><div class="col-md-12"><span>Amazon associate name</span><br/><p class="form-control-static"><input type="text" name="amazon_name" class="form-control" placeholder="Amazon associate name"> </div></div>';
        insertHRQuestions += '<div class="row"><div class="col-md-12"><span>Amazon associate email</span><br/><p class="form-control-static"><input type="text" class="form-control" name="amazon_email" placeholder="Amazon associate email"> </div></div>';

        insertHRQuestions += '<div class="row"><div class="col-md-12"><span>Stop Count</span><br/><p class="form-control-static"><input type="text" class="form-control" name="stop_count" placeholder="Stop Count"> </div></div>';
        insertHRQuestions += '<div class="row"><div class="col-md-12"><span>DA action</span><br/><p class="form-control-static"><input type="text" class="form-control" name="da_action" placeholder="DA action"> </div></div>';
        insertHRQuestions += '<div class="row"><div class="col-md-12"><span>Location</span><br/><p class="form-control-static"><input type="text" class="form-control" name="location" placeholder="Location"> </div></div>';
        insertHRQuestions += '<div class="row"><div class="col-md-12">' +
            '<span>Tier</span><br/><select id="mainReason" name="tier" class="select2">' +
            '<option>Tier 1</option> ' +
            '<option>Tier 2</option>' +
            '<option>Complaint</option>' +
            '</select> ' +
            '</div> ' +
            '</div>';
        insertHRQuestions += '<div class="row"><div class="col-md-12">' +
            '<span>Reason</span><br/><select id="mainReason" name="reason" class="select2">' +
            '<option>Leaving packages outside unattended</option>' +
            '<option>Loud music</option>' +
            '<option>Driving hazard on site</option>' +
            '<option>Leaving tote bags outside gaylord</option>' +
            '<option>SALT package</option>' +
            '<option>Urine bottle</option>' +
            '<option>Going off route</option>' +
            '<option>Marking packages missing</option>' +
            '<option>Uniform</option>' +
            '<option>Professionalism</option>' +
            '<option>Safety Vest</option>' +
            '<option>Not sorting</option>' +
            '<option>Inapproprite comments</option>' +
            '<option>Mishandling packages</option>' +
            '<option>Concessions</option>' +
            '<option>Not calling TOC</option>' +
            '<option>Not calling Cx</option>' +
            '<option>Bulk drops to Apartment</option>' +
            '<option>Cx confrontation</option>' +
            '<option>Other</option>' +
            '</select> ' +
            '</div> ' +
            '</div>';
    }

    $('#insertHRQuestions').html(insertHRQuestions);
    $('#insertHRQuestions2').html('');
    $('#insertHRQuestions3').html('');
}

function loadquestions(e) {
    var insertHRQuestions2 = '';
    if (e.val() == 'Performance') {

        insertHRQuestions2 += '<div class="row"><div class="col-md-12">' +
            '<select name="sub_reason" onchange="loadinputs($(this));" class="select2">' +
            '<option>Please Select an Answer</option>' +
            '<option>Does not meet minimum hourly drop rate</option> ' +
            '<option>DPMO</option> ' +
            '</div> ' +
            '</div>';
    } else if (e.val() == 'Harassment') {
        insertHRQuestions2 += '<div class="row"><div class="col-md-12">' +
            '<select name="sub_reason" onchange="loadinputs($(this));" class="select2">' +
            '<option>Please Select an Answer</option>' +
            '<option>Verbal</option> ' +
            '<option>Sexual Harassment</option> ' +
            '</div> ' +
            '</div>';
    } else if (e.val() == 'Insubordination') {
        insertHRQuestions2 += '<div class="row"><div class="col-md-12">' +
            '<select name="sub_reason" onchange="loadinputs($(this));" class="select2">' +
            '<option>Please Select an Answer</option>' +
            '<option>On site</option> ' +
            '<option>Off site</option> ' +
            '<option>Phone</option> ' +
            '<option>Over Phone Text</option> ' +
            '<option>Refusal to clean Van</option> ' +
            '<option>Not following Dispatch directions</option> ' +
            '<option>Refusal of work</option> ' +
            '<option>Refusal to rescue</option> ' +
            '</div> ' +
            '</div>';
    } else if (e.val() == 'Tardiness') {
        insertHRQuestions2 += '<div class="row"><div class="col-md-12"><span>Time Arrived</span><br/><p class="form-control-static"><input type="text" class="form-control" name="time_arrived" placeholder="Time Arrived"> </div></div>';
    } else if (e.val() == 'Rabbit Damage') {
        insertHRQuestions2 += '<div class="row"><div class="col-md-12"><span>River TT #</span><br/><p class="form-control-static"><input type="text" class="form-control" name="river_tt_number" placeholder="River TT #"> </div></div>';
    } else if (e.val() == 'Other') {
        insertHRQuestions2 += '<div class="row"><div class="col-md-12"><span>Comments</span><br/><p class="form-control-static"><input type="text" class="form-control" name="comments" placeholder="Comments"> </div></div>';
    }

    $('#insertHRQuestions2').html(insertHRQuestions2);
}

function loadinputs(e) {
    var insertHRQuestions3 = '';
    if (e.val() == 'Does not meet minimum hourly drop rate') {
        insertHRQuestions3 += '<div class="row"><div class="col-md-12"><span>Package Count</span><br/><p class="form-control-static"><input type="text" class="form-control" name="Package Count" placeholder="Reason"> </div></div>';

        insertHRQuestions3 += '<div class="row"><div class="col-md-12"><span>Stop Count</span><br/><p class="form-control-static"><input type="text" class="form-control" name="Stop Count" placeholder="Reason"> </div></div>';

        insertHRQuestions3 += '<div class="row"><div class="col-md-12"><span>Route Length</span><br/><p class="form-control-static"><input type="text" class="form-control" name="Route Length" placeholder="Reason"> </div></div>';

        insertHRQuestions3 += '<div class="row"><div class="col-md-12"><span>Minimum Drop Rate</span><br/><p class="form-control-static"><input type="text" class="form-control" name="Minimum Drop Rate" placeholder="Reason"> </div></div>';

        insertHRQuestions3 += '<div class="row"><div class="col-md-12"><span>Actual Drop Rate</span><br/><p class="form-control-static"><input type="text" class="form-control" name="Actual Drop Rate" placeholder="Reason"> </div></div>';
    } else if (e.val() == 'DPMO') {
        insertHRQuestions3 += '<div class="row"><div class="col-md-12"><span>4 week Running DPMO</span><br/><p class="form-control-static"><input type="text" class="form-control" name="4 week Running DPMO" placeholder="Reason"> </div></div>';

        insertHRQuestions3 += '<div class="row"><div class="col-md-12"><span>DNR count</span><br/><p class="form-control-static"><input type="text" class="form-control" name="DNR count" placeholder="Reason"> </div></div>';

        insertHRQuestions3 += '<div class="row"><div class="col-md-12"><span>Total Packages Delivered</span><br/><p class="form-control-static"><input type="text" class="form-control" name="total packages delivered" placeholder="Reason"> </div></div>';

        insertHRQuestions3 += '<div class="row"><div class="col-md-12"><span>Current 7 day DPMO</span><br/><p class="form-control-static"><input type="text" class="form-control" name="Current 7 day DPMO" placeholder="Reason"> </div></div>';

        insertHRQuestions3 += '<div class="row"><div class="col-md-12"><span>DNR count</span><br/><p class="form-control-static"><input type="text" class="form-control" name="DNR count" placeholder="Reason"> </div></div>';

        insertHRQuestions3 += '<div class="row"><div class="col-md-12"><span>total packages delivered</span><br/><p class="form-control-static"><input type="text" class="form-control" name="total packages delivered" placeholder="Reason"> </div></div>';
    } else if (e.val() == 'Verbal' || e.val() == 'Sexual Harassment') {
        insertHRQuestions3 += '<div class="row"><div class="col-md-12"><span>Details</span><br/><p class="form-control-static"><input type="text" class="form-control" name="Harassment Details" placeholder="Reason"> </div></div>';
    } else {
        insertHRQuestions3 += '<div class="row"><div class="col-md-12"><span>Details</span><br/><p class="form-control-static"><input type="text" class="form-control" name="Harassment Details" placeholder="Reason"> </div></div>';
    }

    $('#insertHRQuestions3').html(insertHRQuestions3);
}

function submitHRReport() {
    loading.show();
    var hrReportForm = $('#hrReportForm').serializeArray();
    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/hr_report?key=' + api_key,
        dataType: "json",
        data: hrReportForm,
        headers: {"token": token},
        success: function (data) {
            new PNotify('Success');

            getShifts();

            // Temporary
            $('#reporting').modal('hide');

            $('#schedule_route').modal('hide');

            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });
}

// Supplies
function submitSupplies() {
    loading.show();
    var supplyData = {};

    supplyData.date = window.localStorage.getItem("date");
    supplyData.site_id = window.localStorage.getItem('site_id');

    supplyData.title = $('#suppliesTitle').val();
    supplyData.description = $('#suppliesDescription').val();

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/supplies?key=' + api_key,
        dataType: "json",
        data: supplyData,
        headers: {"token": token},
        success: function (data) {
            new PNotify('Supply Request Sent');
            $('#supplies').modal('hide');
            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });
}

// Scheduling & Reporting
function schedule_route() {
    $('#schedule_route').modal('show');

    schedule();

}

function schedule() {
    loading.show();
    var date = window.localStorage.getItem("date");
    var site_id = window.localStorage.getItem('site_id');

    $.ajax({
        type: 'GET',
        url: domain + apiv + 'dispatch/schedule?date=' + date + '&site_id=' + site_id + '&key=' + api_key,
        dataType: "json",
        headers: {"token": token},
        success: function (data) {
            window.localStorage.setItem('routes', JSON.stringify(data.routes));
            window.localStorage.setItem('schedules', JSON.stringify(data.schedules));

            populateScheduleRoutes();
            loading.hide();
            return true;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });
}

function populateScheduleRoutes() {

    // Driver Information
    var drivers = JSON.parse(window.localStorage.getItem('drivers'));
    var dispatcher_report = JSON.parse(window.localStorage.getItem('dispatcher_report'));
    //Schedule
    var schedules = JSON.parse(window.localStorage.getItem('schedules'));
    var scheduleContent = '<tr><td>Drivers</td> <td>EOS Start</td> <td>EOS End</td> <td>Wave</td> <td>Reports</td> </tr>';

    var routes = JSON.parse(window.localStorage.getItem('routes'));
    var routeContent = '<tr><td>Driver</td> <td style="width:10%;">Route</td> <td style="width:10%;">Route ID</td> <td style="width:10%;">SPR</td> <td style="width:10%;">Lenght</td> <td style="width:10%;">FPD</td> <td style="width:10%;">LPD</td><td style="width:10%;">LPA</td><td style="width:10%;">VAN</td><td style="width:10%;">Remove</td></tr>';

    var rtsContent = '<tr><td>Driver</td> <td>Link </td><td style="width:8%;">VAN</td> <td style="width:8%;">BC</td> <td style="width:8%;">FDD</td> <td style="width:8%;">RJ</td> <td style="width:8%;">UTL</td> <td style="width:8%;">UTA</td> <td style="width:8%;">OODT</td><td style="width:8%;">NSL</td><td style="width:8%;">MISS</td><td style="width:8%;">DMG</td></tr>';

    var deviceContent = '<tr><td style="width:20%;">Driver</td> <td style="width:20%;">IMEI</td><td style="width:20%;">MODEL</td><td style="width:20%;">PHONE</td> </tr>';
    var sortRoutes = [];
    var sortRTS = [];
    var sortSchedules = [];
    var sortDevices = [];
    $.each(drivers, function (index, driver) {

        var sch;
        var scheduleLine = '';
        $.each(schedules, function (index, schedule) {
            if (schedule.crm_account_id == driver.id) {
                sch = schedule;
                return false;
            }
        });

        if (sch) {
            var start = (sch.start ? sch.start : '');
            var end = (sch.end ? sch.end : '');
            var wave = (sch.wave ? sch.wave : '');
        } else {
            var start = '';
            var end = '';
            var wave = 0;
        }

        scheduleLine += '<div ><tr><td><p>' + driver.first_name + ' ' + driver.last_name + '</p></td>';

        scheduleLine += '<td><input type="text" name="user_' + driver.id + '[]" class="form-control" placeholder="EOS Start" value="' + start + '"></td>';
        scheduleLine += '<td><input type="text" name="user_' + driver.id + '[]" class="form-control" placeholder="EOS End" value="' + end + '"></td>';
        scheduleLine += '<td><select name="user_' + driver.id + '[]" class="select2">';



        scheduleLine += '<option ' + (wave == 1 ? 'selected' : '') + ' value="1">Wave 1</option>';
        if (dispatcher_report && dispatcher_report.wave2) {
            scheduleLine += '<option ' + (wave == 2 ? 'selected' : '') + ' value="2">Wave 2</option>';
        }
        if (dispatcher_report && dispatcher_report.wave3) {
            scheduleLine += '<option ' + (wave == 3 ? 'selected' : '') + ' value="3">Wave 3</option>';
        }
        if (dispatcher_report && dispatcher_report.wave4) {
            scheduleLine += '<option ' + (wave == 4 ? 'selected' : '') + ' value="4">Wave 4</option>';
        }

        scheduleLine += '</select></td>';
        scheduleLine += '<td><a href="#" onclick="loadReport(' + driver.id + ')" class="btn btn-report">Report</a></td>';
        scheduleLine += '</tr></div>';

        if (driver.removed != 1) {
            var route = '';
            var rts = '';
            var r;
            var device =  '';
            $.each(routes, function (index, routeValue) {
                if (routeValue.crm_account_id == driver.id) {
                    r = routeValue;
                }
            });

            if (r) {
                var mainroute = (r.route ? r.route : '');
                var route_id = (r.route_id ? r.route_id : '');
                var spr = (r.spr ? r.spr : '');
                var length = (r.route_length ? r.route_length : '');
                var fpd = (r.fpd ? r.fpd : '');
                var lpd = (r.lpd ? r.lpd : '');
                var lpa = (r.lpa ? r.lpa : '');
                var vehicle = (r.vehicle ? r.vehicle : r.license ? r.license : '');
                var bc = (r.bc && r.bc != 'null') ? r.bc : '';
                var fdd = (r.fdd && r.fdd != 'null') ? r.fdd : '';
                var rj = (r.rj && r.rj != 'null') ? r.rj : '';
                var utl = (r.utl && r.utl != 'null') ? r.utl : '';
                var uta = (r.uta && r.uta != 'null') ? r.uta : '';
                var oodt = (r.oodt && r.oodt != 'null') ? r.oodt : '';
                var nsl = (r.nsl && r.nsl != 'null') ? r.nsl : '';
                var miss = (r.miss && r.miss != 'null') ? r.miss : '';
                var dmg = (r.dmg && r.dmg != 'null') ? r.dmg : '';
                var rabbit = (JSON.parse(r.rabbit) && JSON.parse(r.rabbit) != 'null') ? JSON.parse(r.rabbit) : '';
                var imei = rabbit.imei?rabbit.imei:'';
                var model = rabbit.model? rabbit.model:'';
                var phone = rabbit.phone? rabbit.phone:'';

            } else {
                var mainroute = '';
                var route_id = '';
                var spr = '';
                var length = '';
                var fpd = '';
                var lpd = '';
                var lpa = '';
                var vehicle = '';
                var bc = '';
                var fdd = '';
                var rj = '';
                var utl = '';
                var uta = '';
                var oodt = '';
                var nsl = '';
                var miss = '';
                var dmg = '';
                var imei = '';
                var model = '';
                var phone = '';


            }
            route += '<tr id="remove_schedule_driver_' + driver.id + '"><td><p>' + driver.first_name + ' ' + driver.last_name + '</p></td>';
            route += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="Route" value="' + mainroute + '"></td>';
            route += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="ID" value="' + route_id + '"></td>';
            route += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="SPR" value="' + spr + '"></td>';
            route += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="Length" value="' + length + '"></td>';
            route += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="FPD" value="' + fpd + '"></td>';
            route += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="LPD" value="' + lpd + '"></td>';
            route += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="LPA" value="' + lpa + '"></td>';
            route += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="VAN" value="' + vehicle + '"></td>';
            route += '<td><a href="javascript:void(0);" onclick="removeReport(' + driver.id + ')" class="t-icon"><img src="img/tras.png" width="15"></a></td>';
            route += '</tr>';

            rts += '<tr id="remove_schedule_driver_' + driver.id + '"><td><p>' + driver.first_name + ' ' + driver.last_name + '</p></td>';
            rts += '<td><a target="blank" href="http://ops.scoobeez.com/fleet_management/list_license/?plate=' + vehicle + '"><img src="img/van.png"/></a></td>';
            rts += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="VAN" value="' + vehicle + '"></td>';
            rts += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="BC" value="' + bc + '"></td>';
            rts += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="FDD" value="' + fdd + '"></td>';
            rts += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="RJ" value="' + rj + '"></td>';
            rts += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="UTL" value="' + utl + '"></td>';
            rts += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="UTA" value="' + uta + '"></td>';
            rts += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="OODT" value="' + oodt + '"></td>';
            rts += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="NSL" value="' + nsl + '"></td>';
            rts += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="MISS" value="' + miss + '"></td>';
            rts += '<td><input type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="DMG" value="' + dmg + '"></td>';
            rts += '</tr>';

            device +='<tr id="remove_schedule_driver_' + driver.id + '"><td><p>' + driver.first_name + ' ' + driver.last_name + '</p></td>';
            device +='<td><input disabled type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="imei" value="'+ imei +'"/></td>';
            device +='<td><input disabled type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="model" value="'+ model +'"/></td>';
            device +='<td><input disabled type="text" class="form-control" name="user_' + driver.id + '[]" placeholder="phone" value="'+ phone +'"/></td></tr>';

            if (r) {
                sortRoutes.push({'route': r.route, 'html': route});
                sortRTS.push({'route': r.route, 'html': rts});
                sortSchedules.push({'route': r.route, 'html': scheduleLine});
                sortDevices.push({'route':r.route ,'html':device})
            } else {
                sortRoutes.push({'route': '', 'html': route});
                sortRTS.push({'route': '', 'html': rts});
                sortSchedules.push({'route': '', 'html': scheduleLine});
                sortDevices.push({'route':'','html':device})

            }
        }
    });

    var reA = /[^a-zA-Z]/g;
    var reN = /[^0-9]/g;

    function compare(a, b) {
        if (a.route) {
            var aA = a.route.replace(reA, "");
            var bA = b.route.replace(reA, "");
            if (aA === bA) {
                var aN = parseInt(a.route.replace(reN, ""), 10);
                var bN = parseInt(b.route.replace(reN, ""), 10);
                return aN === bN ? 0 : aN > bN ? 1 : -1;
            } else {
                return aA > bA ? 1 : -1;
            }
        }
    }

    sortRoutes.sort(compare);
    sortRTS.sort(compare);
    sortSchedules.sort(compare);
    sortDevices.sort(compare);

    var sorted_routes = '';
    var sorted_rts = '';
    var sorted_schedule = '';
    var sorted_device = '';
    $.each(sortRoutes, function (index, value) {
        sorted_routes += value.html;
    });
    $.each(sortRTS, function (index, value) {
        sorted_rts += value.html;
    });
    $.each(sortSchedules, function (index, value) {
        sorted_schedule += value.html;
    });
    $.each(sortDevices, function (index, value) {
        sorted_device += value.html;
    });

    var date = window.localStorage.getItem("date");
    var site_id = window.localStorage.getItem('site_id');

    $('#scheduleSiteID').val(site_id);
    $('#scheduleDate').val(date);
    $('#routeSiteID').val(site_id);
    $('#routeDate').val(date);
    $('#routeContent').html(routeContent + sorted_routes);
    $('#scheduleContent').html(scheduleContent + sorted_schedule);

    $('#rtsSiteID').val(site_id);
    $('#rtsDate').val(date);
    $('#rtsContent').html(rtsContent + sorted_rts);

    $('#deviceSiteID').val(site_id);
    $('#deviceDate').val(date);
    $('#deviceContent').html(deviceContent + sorted_device);

}

function submitScheduleReport() {
    loading.show();
    var scheduleReport = $('#scheduleReport').serializeArray();

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/schedule?key=' + api_key,
        dataType: "json",
        data: scheduleReport,
        headers: {"token": token},
        success: function (data) {
            new PNotify('Success');
            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });
}

function submitRouteAssignment() {
    loading.show();
    var routeReport = $('#routeReport').serializeArray();

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/routes?key=' + api_key,
        dataType: "json",
        data: routeReport,
        headers: {"token": token},
        success: function (data) {
            new PNotify('Success');
            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });
}

function submitRTSAssignment() {
    loading.show();
    var rtsReport = $('#rtsReport').serializeArray();

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/rts?key=' + api_key,
        dataType: "json",
        data: rtsReport,
        headers: {"token": token},
        success: function (data) {
            new PNotify('Success');
            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });
}

function submitDeviceReport() {
    loading.show();
    var deviceReport = $('#deviceReport').serializeArray();

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/rts?key=' + api_key,
        dataType: "json",
        data: deviceReport,
        headers: {"token": token},
        success: function (data) {
            new PNotify('Success');
            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });
}

function progress_statics() {
    $('#progress_statics').modal('show');

    loading.show();
    var date = window.localStorage.getItem("date");
    var site_id = window.localStorage.getItem('site_id');

    $.ajax({
        type: 'GET',
        url: domain + apiv + 'dispatch/progress_report?date=' + date + '&site_id=' + site_id + '&key=' + api_key,
        dataType: "json",
        headers: {"token": token},
        success: function (data) {
            $('#progressStatistics').html(data.html);
            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });


}

function run_by_hour() {
    loading.show();
    var date = window.localStorage.getItem("date");

    Promise.resolve(schedule()).then(hourly());


    $('#todayEOSLink').attr('href', 'http://dispatch.scoobeez.com/api/testing/eos?site_id=' + site_id + '&date=' + date);

    var users = JSON.parse(window.localStorage.getItem('drivers'));
}

function hourly() {
    var date = window.localStorage.getItem("date");
    var site_id = window.localStorage.getItem('site_id');

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/hourly?key=' + api_key,
        dataType: "json",
        headers: {"token": token},
        data: {date: date, site_id: site_id},
        success: function (data) {
            var completed_hourly_report = data.hourly;
            var removedHours = data.removedHours;

            var report_by_hour = '';
            var count = 8;
            var exists = 0;
            while (count < 24) {

                exists = 0;
                $.each(removedHours, function (index, value) {
                    if (count == value.hour) {
                        exists = 1;
                        return false;
                    }
                });

                var user_count = 0;
                var user_removed = []
                $.each(users, function (index, value) {
                    if (value.removed == 0) {
                        user_count++;
                    } else {
                        user_removed.push(value.crm_account_id);
                    }
                });

                if (exists != 1) {
                    var hour_count = 0;
                    $.each(completed_hourly_report, function (index, value) {

                        if (value.hour == count && value.spr && user_removed.indexOf(value.crm_account_id) == -1) {
                            hour_count++;
                        }
                    });

                    if (count > 12) {
                        var display_hours = count - 12 + 'pm';
                    } else if (count == 12) {
                        var display_hours = 12 + 'pm';
                    } else {
                        var display_hours = count + 'am';
                    }


                    if (hour_count >= user_count) {
                        report_by_hour += '<tr> <td class=""><a href="#"  class="t-icon"><img src="img/clock.png" width="16"> ' + display_hours + '</a></td> <td class=""><a href="javascript:void(0);" onclick="hourlyReport(' + count + ');" class="btn btn-report">Complete</a></td> <td class=""><a href="javascript:void(0);" onclick="removeHour(' + count + ')" class="t-icon"><img src="img/tras.png" width="15"></a></td> </tr>';
                    } else {
                        report_by_hour += '<tr> <td class=""><a href="#" class="t-icon"><img src="img/clock.png" width="16"> ' + display_hours + '</a></td> <td class=""><a href="javascript:void(0);" onclick="hourlyReport(' + count + ');" class="btn btn-report">Incomplete</a></td> <td class=""><a href="javascript:void(0);" onclick="removeHour(' + count + ')" class="t-icon"><img src="img/tras.png" width="15"></a></td> </tr>';
                    }
                }


                if (count < dt.getHours()) {
                    count++;
                } else {
                    break;
                }
            }
            $('#hourlyReport').html(report_by_hour);

            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });
}

function hourlyReport(count) {
    loading.show();
    $('#reports_complete').modal('show');
    var drivers = JSON.parse(window.localStorage.getItem('drivers'));
    var routes = JSON.parse(window.localStorage.getItem('routes'));
    if (count > 12) {
        var display_hours = count - 12 + 'pm';
    } else if (count == 12) {
        var display_hours = 12 + 'pm';
    } else {
        var display_hours = count + 'am';
    }

    $('#hourTitle').html(display_hours);

    var hourlyRouteReport = '<tr> <td width="35%"></td> <td>Route</td> <td>PKGs Delivered</td> <td>UPD Update</td> </tr> <tr>';
    var sortRoutes = [];
    $.each(drivers, function (index, driver) {

        if (driver.removed != 1) {
            var route = '';
            var r;
            $.each(routes, function (index, routeValue) {
                if (routeValue.crm_account_id == driver.id) {
                    r = routeValue;
                }
            });

            if (r) {
                var spr = r.route;
            } else {
                var spr = '';
            }

            route += '<td> <div class="row route-driver m-b-0 text-left"><div class="col-md-12"><p>' + driver.first_name + ' ' + driver.last_name + '</p> </div> </div> </td>';
            route += '<td><input disabled name="user_' + driver.id + '[]" class="form-control" type="text" value="' + spr + '"><input  name="user_' + driver.id + '[]" class="form-control" type="hidden" value="' + spr + '"></td> <td> <input name="user_' + driver.id + '[]" class="form-control" type="text" id="on_track_spr_' + driver.id + '" onchange="check_track(' + driver.id + ')" value=""> <input type="hidden" name="user_' + driver.id + '[]" id="track_spr_' + driver.id + '"> </td> <td><div id="on_track_' + driver.id + '"></div></td> </tr>';

            if (r) {
                sortRoutes.push({'route': r.route, 'html': route});
            } else {
                sortRoutes.push({'route': '', 'html': route});
            }
        }
    });

    var reA = /[^a-zA-Z]/g;
    var reN = /[^0-9]/g;

    function compare(a, b) {
        if(a.route) {
            var aA = a.route.replace(reA, "");
            var bA = b.route.replace(reA, "");
            if (aA === bA) {
                var aN = parseInt(a.route.replace(reN, ""), 10);
                var bN = parseInt(b.route.replace(reN, ""), 10);
                return aN === bN ? 0 : aN > bN ? 1 : -1;
            } else {
                return aA > bA ? 1 : -1;
            }
        }
    }

    sortRoutes.sort(compare);

    var sorted_routes = '';
    $.each(sortRoutes, function (index, value) {
        sorted_routes += value.html;
    });

    $('#hourlyRouteReport').html(hourlyRouteReport + sorted_routes);

    var date = window.localStorage.getItem("date");
    var site_id = window.localStorage.getItem('site_id');

    $('#hourHour').val(count);
    $('#hourSiteID').val(site_id);
    $('#hourDate').val(date);


    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/spr_report?key=' + api_key,
        dataType: "json",
        headers: {"token": token},
        data: {site_id: site_id, date: date, hour: count},
        success: function (data) {
            $.each(data, function (index, value) {
                var customer_id = value.crm_account_id;
                var spr = value.spr;
                $('#on_track_spr_' + customer_id).val(spr);
                check_track(customer_id);
            });

            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });

}

function check_track(id) {
    var routes = JSON.parse(window.localStorage.getItem('routes'));

    var hour = $('#hourHour').val();
    var original_spr = 0;
    var route_info;
    $.each(routes, function (route_index, value) {
        if (value.crm_account_id == id) {
            original_spr = value.spr;
            route_info = value;
            return false;
        }
    });

    if (route_info) {
        var routeLength = route_info.route_length;
    } else {
        var routeLength = '00:00';
    }

    var last_hour = hour - 1;

    // Get Inputed SPR
    var new_spr = $('#on_track_spr_' + id).val();

    var route_length = conv_duration(routeLength);
    var deliveries_per_hour = original_spr / route_length;

    var delivered = 0;

    var date = window.localStorage.getItem("date");
    var site_id = window.localStorage.getItem('site_id');

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/last_hour?key=' + api_key,
        dataType: "json",
        headers: {"token": token},
        data: {site_id: site_id, date: date, hour: last_hour, crm_account_id: id},
        success: function (data) {
            if (data && data != 0) {
                var last_hour_spr = data.spr;

                delivered = new_spr - last_hour_spr;
                // delivered = last_hour_spr - new_spr;
            } else {
                delivered = new_spr;
                // delivered = original_spr - new_spr;
            }

            if (new_spr == 0) {
                $('#on_track_' + id).html('');
                // $('#on_track_'+id).html('<a onclick="startComment('+id+','+hour+');" href="javascript:void(0);" class="btn btn-report">Commented</a>');

                $('#track_spr_' + id).val('1');
            } else if (delivered >= deliveries_per_hour) {
                $('#on_track_' + id).html('<span style="color:green">On Track</span>');
                $('#track_spr_' + id).val('1');
                loading.hide();
            } else {

                var timePerPackage = 60 / deliveries_per_hour;
                var commentTime = (deliveries_per_hour - delivered) * timePerPackage;

                if (commentTime < 6) {
                    $('#on_track_' + id).html('<span style="color:red;">Off Track by ' + Math.ceil(commentTime) + ' mins</span>');
                } else {
                    $('#on_track_' + id).html('<select onchange="submitComment(' + id + ',' + hour + ',' + Math.ceil(commentTime) + ')" id="select_comment_' + id + '" class="select2"><option>Reason for Off Track</option><option>Late Departure</option> <option>Late Sortation</option> <option>Late Line Haul</option> <option>Safety Related Delay</option> <option>Delivery Address Not On Route</option> <option>Customer Reattempts</option> <option>Station Debrief</option> <option>Device Issues</option> <!--Scoobeez--> <option>DA Poor Performance</option> <option>Detour</option> <option>Long Lunch</option> <option>Long Break</option> </select>');

                    // <a onclick="startComment('+id+','+hour+','+deliveries_per_hour+','+delivered+');" href="javascript:void(0);" class="btn btn-report">Comment</a>
                }

                $('#track_spr_' + id).val('0');

                $.ajax({
                    type: 'POST',
                    url: domain + apiv + 'dispatch/comment?key=' + api_key,
                    dataType: "json",
                    headers: {"token": token},
                    data: {date: date, site_id: site_id, hour: hour, crm_account_id: id},
                    success: function (data) {
                        loading.hide();

                        // Finish this
                        $('#on_track_' + id).html('<a onclick="startComment(' + id + ',' + hour + ',' + deliveries_per_hour + ',' + delivered + ');" href="javascript:void(0);" style="border:2px solid green !important; border-bottom: solid 2px green !important;;" class="btn btn-report">Completed</a>');
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        loading.hide();
                    }
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });

}

function startComment(id, hour, deliveries_per_hour, delivered) {
    loading.show();
    $('#reports_comment').modal('show');
    $('#commentUser').val(id);
    $('#commentHour').val(hour);

    var timePerPackage = 60 / deliveries_per_hour;
    var commentTime = (deliveries_per_hour - delivered) * timePerPackage;

    $('#commentRequired').html('Required: ' + Math.round(deliveries_per_hour));
    $('#commentDelivered').html('Delivered: ' + Math.round(delivered));
    $('#commentTime').val(Math.round(commentTime));
    $('#commentDescription').val('');

    var date = window.localStorage.getItem("date");
    var site_id = window.localStorage.getItem('site_id');

    var drivers = JSON.parse(window.localStorage.getItem("drivers"));

    var user_data;
    $.each(drivers, function (index, driver) {
        if (driver.id == id) {
            user_data = driver;
        }
    });

    $('#commentTitle').html('Comment for: ' + user_data.first_name + ' ' + user_data.last_name);

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/comment?key=' + api_key,
        dataType: "json",
        headers: {"token": token},
        data: {date: date, site_id: site_id, hour: hour, crm_account_id: id},
        success: function (data) {
            loading.hide();
            $('#commentTime').val(data.time_lost);
            $('#commentDescription').val(data.amzl_cancelation);
            $('#comment_' + data.reason).prop('checked', true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
        }
    });
}

function submitComment(id, hour, commentTime) {
    loading.show();

    // submitComment('+id+','+hour+','+deliveries_per_hour+','+delivered+','+commentTime+')" id="#select_comment_'+id+'"

    var commentData = {};

//
// <option>Amazon</option>
//     <option>Scoobeez</option>
//     commentFault

    commentData.date = window.localStorage.getItem("date");
    commentData.site_id = window.localStorage.getItem('site_id');
    commentData.crm_account_id = id;
    commentData.explanation = $('#select_comment_' + id).val();
    commentData.time_lost = commentTime;
    commentData.hour = hour;


    if (commentData.explanation == 'Late Departure' || commentData.explanation == 'Late Sortation' || commentData.explanation == 'Late Line Haul' || commentData.explanation == 'Safety Related Delay' || commentData.explanation == 'Delivery Address Not On Route' || commentData.explanation == 'Customer Reattempts' || commentData.explanation == 'Station Debrief' || commentData.explanation == 'Device Issues') {
        commentData.reason = "Amazon";
    } else {
        commentData.reason = "Scoobeez";
    }

    // Redo Later - so it can replace with this, and update
    // commentData.amzl_cancelation = $('#commentDescription').val();

    if (commentData.explanation == 'Late Departure') {
        var r = confirm("Poor Staging\nRacks of the same route (#), were separated and found in different areas.\n\nDevice Updates\nNew Rabbit Device required update delayed use of Device to start route by " + commentTime + " minutes.");
    } else if (commentData.explanation == 'Late Sortation') {
        var r = confirm("Sorters\nLack of (sorting or loading) Associates delayed vans from being loaded by UTR start, delaying CPT by " + commentTime + " minutes.");
    } else if (commentData.explanation == 'Safety Related Delay') {
        var r = confirm("Road Construction\nSlowdown in traffic due to road construction requiring lower passing speeds and traffic flow. An Additional " + commentTime + " minutes were required to reach stop (#).\n\n" +
            "Parade / Sport Games / Events\nSlowdown in traffic due to street parade, requiring lower passing speeds and alternate navigation than Rabbit GPS. An Additional " + commentTime + " minutes were required to reach stop (#).\n\n" +
            "Van Organization\nShifting overflow packages and totes during driving resulted in lack of proper balance and footing to reach active tote.\n\n" +
            "Traffic\nLane closures due to vehicle accident on (Highway/street/etc) near (intersection) delayed Driver by " + commentTime + " minutes");
    } else if (commentData.explanation == 'Delivery Address Not On Route') {
        var r = confirm("TOC delay\nTOC was called after unsuccessful Customer call to locate address at stop (#). DA was delayed by " + commentTime + " minutes.\n\n" +
            "Customer delay\nCustomer was called to verify and locate incorrect address on label for stop (#). DA was delayed by " + commentTime + " minutes\n\n");
    } else if (commentData.explanation == 'Customer Reattempts') {
        var r = confirm("2nd Attempts\nRoute was completed at (time). 2nd attempts were made for (#) packages, stops (#’s).\n\n" +
            "Tier 2 Customer requested reattempt\nCustomer for stop (#) called Amazon support and asked for reattempt asap due to (time constraint/ business now open/ customer now home/ important package/ alternate address/etc).\n\n" +
            "Customer / TOC calls\nWith no access to (complex/gated residence) Stop (#), DA made a successful connection with the Customer and was asked to wait until the Customer came out to grant access.\n\nWith no access to (complex/gated residence) Stop (#), DA made a unsuccessful connection with the Customer. TOC was called and was asked to wait until the agent reached out to the Customer.\n\nDA made a successful connection with the Customer for stop (#) and was asked to deliver to an alternate nearby address (Address).\n\nWith no safe location at Stop (#), DA made a successful connection with the Customer and was asked to wait until the Customer came out to grab package.\n\nAfter gaining access to a secure apartment complex, Stop (#), DA was asked to attempt all deliveries to corresponding addresses by mail room before being able to deliver in bulk.\n\n" +
            "Underestimated Service Time\nDeliveries to different address, Stop #, but grouped together underestimated service time. An additional " + commentTime + " minutes were required to finish delivering.\n\n");
    } else if (commentData.explanation == 'Station Debrief') {
        var r = confirm("TLong debrief lines delayed Amazon RTS debrief by " + commentTime + " minutes.\n\n" +
            "Vans blocking entry to warehouse delayed RTS debrief by " + commentTime + " minutes\n\n");
    } else if (commentData.explanation == 'Device Issues') {
        var r = confirm("Charging\nRabbit device is plugged in, but not maintaining charging levels, a replacement device had to be delivered to the driver, resulting in a " + commentTime + " minute delay. River TT (#).\n\n" +
            "Device Restarts\nRabbit device malfunctioned and restarted after attempting to mark a delivery, resulting in a " + commentTime + " minute delay. River TT (#).\n\n" +
            "GPS\nAfter marking a successful delivery, Rabbit device malfunctioned and attempted to route DA back to station, " + commentTime + " minutes were required to reboot device and return to working order. River TT (#).\n\n When attempting to navigate to stop (#), device repeatedly logged out DA. (A replacement was delivered to DA causing a " + commentTime + " minute delay. River TT (#).\n\n");
    } else {
        var r = true;
    }

    if (r == true) {
        $.ajax({
            type: 'POST',
            url: domain + apiv + 'dispatch/save_comment?key=' + api_key,
            dataType: "json",
            headers: {"token": token},
            data: commentData,
            success: function (data) {
                loading.hide();
                $('#reports_comment').modal('hide');
                // Change this to Update.

                $('#on_track_' + commentData.crm_account_id).html('<input type="text" onchange="updateComment(' + id + ',' + hour + ');" class="form-control" id="select_amzl_cancelation_' + id + '" placeholder="Reason">');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                new PNotify({text: JSON.parse(xhr.responseText).error.message});
                loading.hide();
            }
        });
    } else {
        loading.hide();
    }
}

function updateComment(id, hour) {
    var commentData = {};
    commentData.date = window.localStorage.getItem("date");
    commentData.site_id = window.localStorage.getItem('site_id');
    commentData.crm_account_id = id;
    commentData.hour = hour;
    commentData.amzl_cancelation = $('#select_amzl_cancelation_' + id).val();

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/save_comment?key=' + api_key,
        dataType: "json",
        headers: {"token": token},
        data: commentData,
        success: function (data) {
            loading.hide();
            $('#reports_comment').modal('hide');
            // Change this to Update.
            $('#on_track_' + commentData.crm_account_id).html('<a onclick="startComment(' + id + ',' + hour + ');" href="javascript:void(0);" class="btn btn-report">Commented</a>');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
            loading.hide();
        }
    });
}

function submitHour() {
    loading.show();
    var hourSubmit = $('#hourSubmit').serializeArray();
    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/report?key=' + api_key,
        dataType: "json",
        data: hourSubmit,
        headers: {"token": token},
        success: function (data) {
            new PNotify('Success');
            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });

}

function completeDay() {
    loading.show();
    $('#complete_day').modal('show');

    var commentData = {};

    commentData.date = window.localStorage.getItem("date");
    commentData.site_id = window.localStorage.getItem('site_id');

    var drivers = JSON.parse(window.localStorage.getItem('drivers'));

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/comments?key=' + api_key,
        dataType: "json",
        data: commentData,
        headers: {"token": token},
        success: function (data) {
            loading.hide();
            var comment_obj = data;

            var comments = '<tr><td><span style="font-weight:bold;">Route ID</span></td><td><span style="font-weight:bold;">Driver</span></td><td><span style="color: #000; font-weight:bold;">Time Lost</span></td><td><span style="color: #000; font-weight:bold;">Reason</span></td><td style="width: 40%;"><span style="color: #000; font-weight:bold;">Description</span></td></tr>';
            var time_lost = 0;
            $.each(comment_obj, function (index, route) {
                $.each(drivers, function (index, user) {
                    if (route.crm_account_id == user.id) {
                        if (route.comments) {

                            var count = 0;
                            var LateDeparture = 0;
                            var LateDeparturec = '';
                            var LateSortation = 0;
                            var LateSortationc = '';
                            var LateLineHaul = 0;
                            var LateLineHaulc = '';
                            var SafetyRelatedDelay = 0;
                            var SafetyRelatedDelayc = '';
                            var DeliveryAddressNotOnRoute = 0;
                            var DeliveryAddressNotOnRoutec = '';
                            var CustomerReattempts = 0;
                            var CustomerReattemptsc = '';
                            var StationDebrief = 0;
                            var StationDebriefc = '';
                            var DeviceIssues = 0;
                            var DeviceIssuesc = '';

                            var total_comment_time_lost = 0;

                            $.each(route.comments, function (index, comment) {
                                if (comment.reason == "amazon" || comment.reason == "Amazon") {
                                    if (comment.explanation == 'Late Departure') {
                                        LateDeparture += parseInt(comment.time_lost);
                                        LateDeparturec += comment.amzl_cancelation + ', ';
                                        time_lost += parseInt(comment.time_lost);
                                        total_comment_time_lost += parseInt(comment.time_lost);
                                    }
                                    if (comment.explanation == 'Late Sortation') {
                                        LateSortation += parseInt(comment.time_lost);
                                        LateSortationc += comment.amzl_cancelation + ', ';
                                        time_lost += parseInt(comment.time_lost);
                                        total_comment_time_lost += parseInt(comment.time_lost);
                                    }
                                    if (comment.explanation == 'Late Line Haul') {
                                        LateLineHaul += parseInt(comment.time_lost);
                                        LateLineHaulc += comment.amzl_cancelation + ', ';
                                        time_lost += parseInt(comment.time_lost);
                                        total_comment_time_lost += parseInt(comment.time_lost);
                                    }
                                    if (comment.explanation == 'Safety Related Delay') {
                                        SafetyRelatedDelay += parseInt(comment.time_lost);
                                        SafetyRelatedDelayc += comment.amzl_cancelation + ', ';
                                        time_lost += parseInt(comment.time_lost);
                                        total_comment_time_lost += parseInt(comment.time_lost);
                                    }
                                    if (comment.explanation == 'Delivery Address Not On Route') {
                                        DeliveryAddressNotOnRoute += parseInt(comment.time_lost);
                                        DeliveryAddressNotOnRoutec += comment.amzl_cancelation + ', ';
                                        time_lost += parseInt(comment.time_lost);
                                        total_comment_time_lost += parseInt(comment.time_lost);
                                    }
                                    if (comment.explanation == 'Customer Reattempts') {
                                        CustomerReattempts += parseInt(comment.time_lost);
                                        CustomerReattemptsc += comment.amzl_cancelation + ', ';
                                        time_lost += parseInt(comment.time_lost);
                                        total_comment_time_lost += parseInt(comment.time_lost);
                                    }
                                    if (comment.explanation == 'Station Debrief') {
                                        StationDebrief += parseInt(comment.time_lost);
                                        StationDebriefc += comment.amzl_cancelation + ', ';
                                        time_lost += parseInt(comment.time_lost);
                                        total_comment_time_lost += parseInt(comment.time_lost);
                                    }
                                    if (comment.explanation == 'Device Issues') {
                                        DeviceIssues += parseInt(comment.time_lost);
                                        DeviceIssuesc += comment.amzl_cancelation + ', ';
                                        time_lost += parseInt(comment.time_lost);
                                        total_comment_time_lost += parseInt(comment.time_lost);
                                    }
                                }
                            });
                            if (LateDeparture > 0) {
                                if (count == 0) {
                                    var route_id = route.route_id;
                                    var driversName = user.first_name + ' ' + user.last_name
                                } else {
                                    var route_id = '';
                                    var driversName = '';
                                }
                                comments += '<tr><td><span style="color: #000">' + route_id + '</span></td><td><span style="color: #000">' + driversName + '</span></td><td><span style="color: #000;">' + LateDeparture + ' min</span></td><td><span style="color: #000;">Late Departure</span></td><td style="width: 40%;"><span style="color: #000;">' + LateDeparturec + '</span></td></tr>';
                                count++;
                            }
                            if (LateSortation > 0) {
                                if (count == 0) {
                                    var route_id = route.route_id;
                                    var driversName = user.first_name + ' ' + user.last_name
                                } else {
                                    var route_id = '';
                                    var driversName = '';
                                }
                                comments += '<tr><td><span style="color: #000">' + route_id + '</span></td><td><span style="color: #000">' + driversName + '</span></td><td><span style="color: #000;">' + LateSortation + ' min</span></td><td><span style="color: #000;">Late Sortation</span></td><td style="width: 40%;"><span style="color: #000;">' + LateSortationc + '</span></td></tr>';
                                count++;
                            }
                            if (LateLineHaul > 0) {
                                if (count == 0) {
                                    var route_id = route.route_id;
                                    var driversName = user.first_name + ' ' + user.last_name
                                } else {
                                    var route_id = '';
                                    var driversName = '';
                                }
                                comments += '<tr><td><span style="color: #000">' + route_id + '</span></td><td><span style="color: #000">' + driversName + '</span></td><td><span style="color: #000;">' + LateLineHaul + ' min</span></td><td><span style="color: #000;">Late Line Haul</span></td><td style="width: 40%;"><span style="color: #000;">' + LateLineHaulc + '</span></td></tr>';
                                count++;
                            }
                            if (SafetyRelatedDelay > 0) {
                                if (count == 0) {
                                    var route_id = route.route_id;
                                    var driversName = user.first_name + ' ' + user.last_name
                                } else {
                                    var route_id = '';
                                    var driversName = '';
                                }
                                comments += '<tr><td><span style="color: #000">' + route_id + '</span></td><td><span style="color: #000">' + driversName + '</span></td><td><span style="color: #000;">' + SafetyRelatedDelay + ' min</span></td><td><span style="color: #000;">Safety Related Delay</span></td><td style="width: 40%;"><span style="color: #000;">' + SafetyRelatedDelayc + '</span></td></tr>';
                                count++;
                            }
                            if (DeliveryAddressNotOnRoute > 0) {
                                if (count == 0) {
                                    var route_id = route.route_id;
                                    var driversName = user.first_name + ' ' + user.last_name
                                } else {
                                    var route_id = '';
                                    var driversName = '';
                                }
                                comments += '<tr><td><span style="color: #000">' + route_id + '</span></td><td><span style="color: #000">' + driversName + '</span></td><td><span style="color: #000;">' + DeliveryAddressNotOnRoute + ' min</span></td><td><span style="color: #000;">Delivery Address Not On Route</span></td><td style="width: 40%;"><span style="color: #000;">' + DeliveryAddressNotOnRoutec + '</span></td></tr>';
                                count++;
                            }
                            if (CustomerReattempts > 0) {
                                if (count == 0) {
                                    var route_id = route.route_id;
                                    var driversName = user.first_name + ' ' + user.last_name
                                } else {
                                    var route_id = '';
                                    var driversName = '';
                                }
                                comments += '<tr><td><span style="color: #000">' + route_id + '</span></td><td><span style="color: #000">' + driversName + '</span></td><td><span style="color: #000;">' + CustomerReattempts + ' min</span></td><td><span style="color: #000;">Customer Reattempts</span></td><td style="width: 40%;"><span style="color: #000;">' + CustomerReattemptsc + '</span></td></tr>';
                                count++;
                            }
                            if (StationDebrief > 0) {
                                if (count == 0) {
                                    var route_id = route.route_id;
                                    var driversName = user.first_name + ' ' + user.last_name
                                } else {
                                    var route_id = '';
                                    var driversName = '';
                                }
                                comments += '<tr><td><span style="color: #000">' + route_id + '</span></td><td><span style="color: #000">' + driversName + '</span></td><td><span style="color: #000;">' + StationDebrief + ' min</span></td><td><span style="color: #000;">Station Debrief</span></td><td style="width: 40%;"><span style="color: #000;">' + StationDebriefc + '</span></td></tr>';
                                count++;
                            }
                            if (DeviceIssues > 0) {
                                if (count == 0) {
                                    var route_id = route.route_id;
                                    var driversName = user.first_name + ' ' + user.last_name
                                } else {
                                    var route_id = '';
                                    var driversName = '';
                                }
                                comments += '<tr><td><span style="color: #000">' + route_id + '</span></td><td><span style="color: #000">' + driversName + '</span></td><td><span style="color: #000;">' + DeviceIssues + ' min</span></td><td><span style="color: #000;">Device Issues</span></td><td style="width: 40%;"><span style="color: #000;">' + DeviceIssuesc + '</span></td></tr>';
                                count++;
                            }

                            if (total_comment_time_lost > 0 && (LateDeparture > 0 || LateSortation > 0 || LateLineHaul > 0 || SafetyRelatedDelay > 0 || DeliveryAddressNotOnRoute > 0 || CustomerReattempts > 0 || StationDebrief > 0 || DeviceIssues > 0)) {
                                comments += '<tr><td><span style="color: #000">TOTAL:</span></td><td></td><td><span style="color: #000;">' + total_comment_time_lost + ' min</span></td><td><td></td></tr>';

                                comments += '<tr style="height: 30px;"><td></td><td></td><td></td><td><td></td></tr>';
                            }
                        }
                        return false;
                    }
                });
            });
            $('#combined_time_report').html(time_lost + ' min');
            $('#end_of_day_summary').html(comments);

        },
        error: function (xhr, ajaxOptions, thrownError) {
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
            loading.hide();
        }
    });
}

function submitDay() {
    loading.show();
    var content = $('#send_comment_content').html();

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/send_comments?key=' + api_key,
        dataType: "json",
        headers: {"token": token},
        data: {content: content},
        success: function (data) {
            new PNotify('Sent');
            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
            loading.hide();
        }
    });
}

function removeHour(hour) {

    var r = confirm("Are you sure you would like to delete!");

    if (r == true) {
        loading.show();
        var date = window.localStorage.getItem("date");
        var site_id = window.localStorage.getItem('site_id');

        // Get Shift ID =

        $.ajax({
            type: 'POST',
            url: domain + apiv + 'dispatch/remove_hour?key=' + api_key,
            dataType: "json",
            headers: {"token": token},
            data: {date: date, site_id: site_id, hour: hour},
            success: function (data) {
                loading.hide();

                run_by_hour();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                loading.hide();
                new PNotify({text: JSON.parse(xhr.responseText).error.message});
            }
        });
    }
}

function removeReport(crm_account_id) {

    var r = confirm("Are you sure you would like to delete!");

    if (r == true) {
        loading.show();
        var date = window.localStorage.getItem("date");
        var site_id = window.localStorage.getItem('site_id');

        $.ajax({
            type: 'POST',
            url: domain + apiv + 'dispatch/remove_driver?key=' + api_key,
            dataType: "json",
            headers: {"token": token},
            data: {date: date, site_id: site_id, crm_account_id: crm_account_id},
            success: function (data) {
                loading.hide();
                getShifts();
                $('#remove_schedule_driver_' + crm_account_id + '').hide();
                new PNotify('Removed');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                loading.hide();
                new PNotify({text: JSON.parse(xhr.responseText).error.message});
            }
        });
    }
}

// Incident Report
function incident_reports() {
    loading.show();
    $('#incident_reports').modal('show');

    var date = window.localStorage.getItem("date");
    var site_id = window.localStorage.getItem('site_id');
    var drivers = JSON.parse(window.localStorage.getItem("drivers"));

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/incidents?key=' + api_key,
        dataType: "json",
        headers: {"token": token},
        data: {date: date, site_id: site_id},
        success: function (data) {

            var vehicleInspectionContent = '';

            $.each(data, function (index, inspection) {


                vehicleInspectionContent += ' <div class="row"> <div class="col-md-8"> <div class="row route-driver"> <div class="col-md-10"> <p>' + inspection.driver.first_name + ' ' + inspection.driver.last_name + '</p></div> </div> </div> <div class="col-md-4"><a href="javascript:void(0);" onclick="generate_incident(' + inspection.driver.id + ')" class="btn btn-report">Download PDF</a> </div> </div> <div class="empty-xs-40 empty-md-10"></div>';

            });


            loading.hide();
            $('#incidentReportsContent').html(vehicleInspectionContent);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
        }
    });
}

// Vehicle Inspections
function vehicle_inspections() {
    loading.show();
    $('#vehicle_inspections').modal('show');

    var date = window.localStorage.getItem("date");
    var site_id = window.localStorage.getItem('site_id');
    var drivers = JSON.parse(window.localStorage.getItem("drivers"));

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/inspections?key=' + api_key,
        dataType: "json",
        headers: {"token": token},
        data: {date: date, site_id: site_id},
        success: function (data) {

            var vehicleInspectionContent = '';
            $.each(drivers, function (index, driver) {

                var user_data;
                $.each(data, function (index, value) {
                    if (value.crm_account_id == driver.id) {
                        user_data = value;
                    }
                });

                if (user_data) {
                    vehicleInspectionContent += ' <div class="row"> <div class="col-md-8"> <div class="row route-driver"> <div class="col-md-10"> <p>' + driver.first_name + ' ' + driver.last_name + '</p></div> </div> </div> <div class="col-md-4"><a href="javascript:void(0);" onclick="inspections_view(' + user_data.id + ')" class="btn btn-report">View Inspections</a> </div> </div> <div class="empty-xs-40 empty-md-10"></div>';
                } else {
                    vehicleInspectionContent += ' <div class="row"> <div class="col-md-8"> <div class="row route-driver"> <div class="col-md-10"> <p>' + driver.first_name + ' ' + driver.last_name + '</p></div> </div> </div> <div class="col-md-4"><a href="javascript:void(0);" class="btn btn-report">No Inspection</a> </div> </div> <div class="empty-xs-40 empty-md-10"></div>';
                }
            });

            loading.hide();
            $('#vehicleInspectionContent').html(vehicleInspectionContent);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
        }
    });
}

function inspections_view(insepction_id) {
    loading.show();
    $('#inspections_view').modal('show');
    $('#inspection_content').html('<h2 style="margin-bottom: 20px; margin-top:20px; text-align:center;">Loading Vehicle Inspection....</h2>');
    $('#inspection_id').val(insepction_id);
    var date = window.localStorage.getItem("date");

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/inspection?key=' + api_key,
        dataType: "json",
        headers: {"token": token},
        data: {id: insepction_id, date: date},
        success: function (data) {
            var route_report = data.route_report;
            var user_info = data.driver;

            $('#inspection_milage').val(data.mileage);
            $('#inspection_notes').val(data.notes);

            if (data.tank == 0) {
                var tank = "Empty";
            } else if (data.tank == 1) {
                var tank = "Full";
            } else {
                var tank = data.tank;
            }

            var inspection_content = '<div class="row table-responsive" style="overflow-x: inherit !important;">' +
                '<div class="col-md-6">' +
                '<div class="row" style="border: 1px solid #e9ecef; border-bottom: none;">' +
                '<div class="col-md-8"> <h1 class="text-center yellow">Scoobeez</h1></div>' +
                '<div class="col-md-4 text-center"><img src="img/logo.jpg" width="60" alt=""></div></div>' +

                '<div class="row">' +
                '<table class="table table-bordered" style="margin-bottom: 0;"> ' +
                '<tbody><tr> ' +
                '<td colspan="1" class="bold" style="border-right: none;">DA\'S NNAME</td>' +
                '<td colspan="3" class="bold" style="border-left: none;">' + data.driver.first_name + ' ' + data.driver.last_name + '</td>' +
                '</tr>' +
                '<tr> ' +
                '<td colspan="1" class="bold" style="border-right: none;">License Plate #</td>' +
                '<td colspan="3" class="bold" style="border-left: none;">' + data.license + '</td> ' +
                '</tr> ' +
                '<tr> ' +
                '<td colspan="1" class="text-center bold">Beginning Fuel Tank</td> ' +
                '<td colspan="3" class="text-center bold">' + tank + '</td> ' +
                '</tr> ' +

                '<tr> ' +
                '<td colspan="3" rowspan="" headers="" class="text-center font-13 bold"> Please note "Yes/No" All of the Following</td>' +
                '</tr> ' +
                '<tr> ' +
                '<td colspan="" rowspan="" headers=""></td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13 bold">YES</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13 bold">NO</td> ' +
                '</tr>' +
                '<tr> ' +
                '<td colspan="" rowspan="" headers="" class="font-15">DA\'s Side Body Dents</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.driver_side_body_dents == 1 ? 'YES' : '') + '</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.driver_side_body_dents == 0 ? 'NO' : '') + '</td>' +
                '</tr> ' +

                '<tr> ' +
                '<td colspan="" rowspan="" headers="" class="font-15">DA\'s Side Mirror Damage</td>' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.driver_side_mirror_damage == 1 ? 'YES' : '') + '</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.driver_side_mirror_damage == 0 ? 'NO' : '') + '</td>' +
                '</tr> ' +

                '<tr> ' +
                '<td colspan="" rowspan="" headers="" class="font-15">Rear End Body Dents</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.rear_end_body_dents == 1 ? 'YES' : '') + '</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.rear_end_body_dents == 0 ? 'NO' : '') + '</td>' +
                '</tr> ' +

                '<tr> ' +
                '<td colspan="" rowspan="" headers="" class="font-15">Pass Side Body Dents</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.pass_side_body_dents == 1 ? 'YES' : '') + '</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.pass_side_body_dents == 0 ? 'NO' : '') + '</td>' +
                '</tr> ' +

                '<tr> ' +
                '<td colspan="" rowspan="" headers="" class="font-15">Pass Side Mirror Dents</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.pass_side_mirror_damage == 1 ? 'YES' : '') + '</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.pass_side_mirror_damage == 0 ? 'NO' : '') + '</td>' +
                '</tr> ' +

                '<tr> ' +
                '<td colspan="" rowspan="" headers="" class="font-15">Front Dents</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.frontend_dents == 1 ? 'YES' : '') + '</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.frontend_dents == 0 ? 'NO' : '') + '</td>' +
                '</tr> ' +

                '<tr> ' +
                '<td colspan="" rowspan="" headers="" class="font-15">Proper Tire Pressure</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.tire_pressure == 1 ? 'YES' : '') + '</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.tire_pressure == 0 ? 'NO' : '') + '</td>' +
                '</tr> ' +

                '<tr> ' +
                '<td colspan="" rowspan="" headers="" class="font-15">Clean Outside</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.clean == 1 ? 'YES' : '') + '</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.clean == 0 ? 'NO' : '') + '</td>' +
                '</tr> ' +

                '</tbody></table> ' +

                '<table class="table table-bordered tablenoborder"> ' +
                '<tbody>' +
                '<tr>' +
                '<td colspan="3" rowspan="" headers="" class="text-center bold" style="border-top:none;">' +
                'TC55 Yes No Questions ' +
                '</td> ' +
                '</tr> ' +

                '<tr> ' +
                '<td colspan="" rowspan="" headers="" class="font-15 red">Is there a cradle and a charger?</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13" style="width: 15%;">' + (data.cradle_charger == 1 ? 'YES' : 'NO') + '</td> ' +
                '<td colspan="1" rowspan="4" headers="" class="text-center"> <img src="http://23.250.125.234/~juantest/Scoobeez/img/phone.jpg" width="50%" class="imgmobile" alt=""> </td> ' +
                '</tr> ' +

                '<tr> ' +
                '<td colspan="" rowspan="" headers="" class="font-15 red">Are there any damages to the screen?</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.screen_damage == 1 ? 'YES' : 'NO') + '</td> ' +
                '</tr> ' +

                '<tr> ' +
                '<td colspan="" rowspan="" headers="" class="font-15 red">Any damages to the shell?</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.shell_damage == 1 ? 'YES' : 'NO') + '</td> ' +
                '</tr> ' +

                '<tr> ' +
                '<td colspan="" rowspan="" headers="" class="font-15 red">Is the scanner working?</td> ' +
                '<td colspan="" rowspan="" headers="" class="text-center font-13">' + (data.scanner == 1 ? 'YES' : 'NO') + '</td> ' +
                '</tr> ' +
                '</tbody></table> ' +
                '</div> ' +
                '</div> ' +

                '<div class="col-md-6" style="border: 1px solid #e9ecef;border-left: none;"> ' +
                '<div class="row"> ' +
                '<div class="col-md-12"> ' +
                '<h1 class="rabbit left">Rabbit #: ' + data.rabbit_number + '</h1> ' +
                '<h1 class="rabbit left">Route #: ' + data.route_number + '</h1> ' +
                '</div> ' +
                '</div> ' +

                '<div class="row">' +

                '<div class="row"> ' +
                '<div class="col-md-12"> ' +
                '<p class="titlemargin" style="text-align:center;"><strong>Smoking Is Prohibited Inside  the Vehicle</strong></p> ' +
                '</div> ' +
                '<div class="col-md-12 text-center"> ' +
                '<img src="data:image/png;base64, ' + data.picture + '" width="70%" alt=""> ' +
                '</div> ' +
                '</div> ' +
                '</div> ' +
                '</div> ' +
                '</div>';

            var route_value = '<table class="table"><tbody><tr>';


            if (route_report) {
                route_report.fpd = (route_report.fpd) ? route_report.fpd : '';
                route_report.lpd = (route_report.lpd) ? route_report.lpd : '';
                route_report.lpa = (route_report.lpa) ? route_report.lpa : '';
                route_report.bc = (route_report.bc) ? route_report.bc : '';
                route_report.fdd = (route_report.fdd) ? route_report.fdd : '';
                route_report.rj = (route_report.rj) ? route_report.rj : '';
                route_report.utl = (route_report.utl) ? route_report.utl : '';
                route_report.uta = (route_report.uta) ? route_report.uta : '';
                route_report.oodt = (route_report.oodt) ? route_report.oodt : '';
                route_report.nsl = (route_report.nsl) ? route_report.nsl : '';
                route_report.miss = (route_report.miss) ? route_report.miss : '';
                route_report.dmg = (route_report.dmg) ? route_report.dmg : '';
                route_value += '<td style="text-align: center;"><span>FPD</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_fpd" value="' + route_report.fpd + '" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>LPD</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_lpd" value="' + route_report.lpd + '" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>LPA</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_lpa" value="' + route_report.lpa + '" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>BC</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_bc" value="' + route_report.bc + '" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>FDD</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_fdd" value="' + route_report.fdd + '" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>RJ</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_rj" value="' + route_report.rj + '" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>UTL</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_utl" value="' + route_report.utl + '" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>UTA</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_uta" value="' + route_report.uta + '" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>OODT</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_oodt" value="' + route_report.oodt + '" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>NSL</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_nsl" value="' + route_report.nsl + '" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>MISS</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_miss" value="' + route_report.miss + '" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td></tr>';

                route_value += '<td style="text-align: center;"><span>DMG</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_dmg" value="' + route_report.dmg + '" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td></tr>';
            } else {
                route_value += '<td style="text-align: center;"><span>FPD</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_fpd" value="" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>LPD</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_lpd" value="" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>LPA</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_lpa" value="" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';


                route_value += '<td style="text-align: center;"><span>BC</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_bc" value="" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>FDD</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_fdd" value="" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>RJ</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_rj" value="" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>UTL</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_utl" value="" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>UTA</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_uta" value="" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>OODT</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_oodt" value="" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>NSL</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_nsl" value="" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td>';

                route_value += '<td style="text-align: center;"><span>MISS</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_miss" value="" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td></tr></tbody></table>';

                route_value += '<td style="text-align: center;"><span>DMG</span> <br><div class="form-group" style="margin-bottom: 0;"><input type="text" class="form-control" id="inspection_dmg" value="" name="user_' + user_info.id + '[]"  style="background: #f5f6f7;color: #adaeae;"></div></td></tr></tbody></table>';
            }

            inspection_content += route_value;


            $('#inspection_content').html(inspection_content);
            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
        }
    });

}

function inspection_submit() {
    loading.show();
    var date = window.localStorage.getItem("date");
    var site_id = window.localStorage.getItem('site_id');

    var id = $('#inspection_id').val();
    var inspection_milage = $('#inspection_milage').val();
    var inspection_notes = $('#inspection_notes').val();

    var inspection_fpd = $('#inspection_fpd').val();
    var inspection_lpd = $('#inspection_lpd').val();
    var inspection_lpa = $('#inspection_lpa').val();
    var inspection_bc = $('#inspection_bc').val();
    var inspection_fdd = $('#inspection_fdd').val();
    var inspection_rj = $('#inspection_rj').val();
    var inspection_utl = $('#inspection_utl').val();
    var inspection_uta = $('#inspection_uta').val();
    var inspection_oodt = $('#inspection_oodt').val();
    var inspection_nsl = $('#inspection_nsl').val();
    var inspection_miss = $('#inspection_miss').val();
    var inspection_dmg = $('#inspection_dmg').val();

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/update_inspection?key=' + api_key,
        dataType: "text",
        data: {
            date: date,
            site_id: site_id,
            id: id,
            mileage: inspection_milage,
            notes: inspection_notes,
            fpd: inspection_fpd,
            lpd: inspection_lpd,
            lpa: inspection_lpa,
            bc: inspection_bc,
            fdd: inspection_fdd,
            rj: inspection_rj,
            utl: inspection_utl,
            uta: inspection_uta,
            oodt: inspection_oodt,
            nsl: inspection_nsl,
            miss: inspection_miss,
            dmg: inspection_dmg
        },
        headers: {"token": token},
        success: function (data) {

            $('#inspections_view').modal('hide');
            loading.hide();
            new PNotify('Updated Inspection');
        }
    });

}

// Vehicle Inventory
function inventory() {
var data_content=  '<tr >\n' +
    '        <th style="text-align:center ">License Plate</th>\n' +
    '    <th style="text-align:center ">Fuel Level</th>\n' +
    '    <th style="text-align:center ">Link</th>\n' +
    '\n' +
    '        </tr>\n';
    var zubie_data = JSON.parse(window.localStorage.getItem('zubie_data'));
    $.each(zubie_data,function (index,value) {
        data_content+='<tr><td>'+index+'</td><td>'+value.fuel_level+'%'+'</td>';
        data_content+='<td><a target="blank" href="http://ops.scoobeez.com/fleet_management/list_license/?plate=' + index + '"><img src="img/van.png"/></a></td></tr>';

    })
    $('#van_detail_content').append(data_content);
        $('#van_detail').modal('show');
    // var commentData = {};
    //
    // commentData.date = window.localStorage.getItem("date");
    // commentData.site_id = window.localStorage.getItem('site_id');
    //
    // $('#van_detail_content tbody').innerHTML=data;
    //
    // $.ajax({
    //     type: 'POST',
    //     url: domain + apiv + 'dispatch/inventory?key=' + api_key,
    //     dataType: "json",
    //     headers: {"token": token},
    //     data: commentData,
    //     success: function (data) {
    //         window.localStorage.setItem('vehicles', JSON.stringify(data));
    //         //circle-red
    //         //circle-yellow
    //         //circle-green
    //
    //         var vehicleListings = '';
    //         $.each(data, function (index, listing) {
    //
    //             if (listing.status == 0) {
    //                 var vehicleStatus = 'circle-red';
    //             } else if (listing.status == 1) {
    //                 var vehicleStatus = 'circle-green';
    //             } else if (listing.status == 2) {
    //                 var vehicleStatus = 'circle-yellow';
    //             } else if (listing.status == 3) {
    //                 var vehicleStatus = 'circle-red';
    //             } else {
    //                 var vehicleStatus = 'circle-green';
    //             }
    //
    //             // <span class="absolute-right"><img src="img/warning-yellow.png" width="20"></span>;
    //
    //             vehicleListings += '<div class="col-md-3"> <div class="inventory-box text-center"> <p><img src="img/inventory1.png" class="img-fluid"></p> <p><i class="fa fa-circle route-circle ' + vehicleStatus + '" aria-hidden="true"></i> <strong>' + listing.license_plate + '</strong></p> <p><a href="javascript:void(0);" onclick="inventory_view(' + listing.id + ');" data-toggle="modal" data-target="#view_inventory" class="btn btn-report width100">View Details</a></p> <div class="empty-xs-40 empty-md-0"></div> </div> </div>';
    //         });
    //
    //
    //         $('#vehicleListings').html(vehicleListings);
    //         loading.hide();
    //     },
    //     error: function (xhr, ajaxOptions, thrownError) {
    //         new PNotify({text: JSON.parse(xhr.responseText).error.message});
    //         loading.hide();
    //     }
    // });
}

function inventory_view(id) {
    var vehicles = JSON.parse(window.localStorage.getItem('vehicles'));
    $('#inventory').modal('hide');
    var vehicleInfo;
    $.each(vehicles, function (index, vehicle) {
        if (id == vehicle.id) {
            vehicleInfo = vehicle;
        }
    });

    if (vehicleInfo.status == 0) {
        var vehicleStatus = 'Inactive';
    } else if (vehicleInfo.status == 1) {
        var vehicleStatus = 'Active';
    } else if (vehicleInfo.status == 2) {
        var vehicleStatus = 'On Hold';
    } else if (vehicleInfo.status == 3) {
        var vehicleStatus = 'Other';
    } else {
        var vehicleStatus = '';
    }

    var noteContent = '';
    $.each(vehicleInfo.notes, function (index, note) {
        noteContent += '<p class="in-desc" id="viewInventory_description">' + note.note + '</p>';
    });

    $('#noteContent').append(noteContent);
    $('#vehicleNoteID').val(id);
    $('#viewInventory_title').html(vehicleInfo.license_plate);
    $('#viewInventory_status').html(vehicleStatus);
    $('#viewInventory_year').html(vehicleInfo.year);
    $('#viewInventory_make').html(vehicleInfo.make);
    $('#viewInventory_model').html(vehicleInfo.model);
    $('#viewInventory_milage').html(vehicleInfo.mileage);
    $('#viewInventory_description').html(vehicleInfo.description);
    $('#inventory_edit').attr('onclick', 'inventory_edit(' + id + ')');
}

function inventory_edit(id) {
    $('#edit_inventory').modal('show');
    var vehicles = JSON.parse(window.localStorage.getItem('vehicles'));

    var vehicleInfo;
    $.each(vehicles, function (index, vehicle) {
        if (id == vehicle.id) {
            vehicleInfo = vehicle;
        }
    });

    if (vehicleInfo.status == 0) {
        var vehicleStatus = 'Inactive';
    } else if (vehicleInfo.status == 1) {
        var vehicleStatus = 'Active';
    } else if (vehicleInfo.status == 2) {
        var vehicleStatus = 'On Hold';
    } else if (vehicleInfo.status == 3) {
        var vehicleStatus = 'Other';
    } else {
        var vehicleStatus = '';
    }

    var site_id = window.localStorage.getItem('site_id');
    var locationSites = JSON.parse(window.localStorage.getItem('locationSites'));

    var siteOptions = '';
    $.each(locationSites, function (index, locations) {
        $.each(locations.sites, function (index, site) {

            if (site.id == site_id) {
                var selected = 'selected';
            } else {
                var selected = '';
            }

            siteOptions += '<option ' + selected + ' value="' + site.id + '">' + site.name + '</option>';
        });
    });


    $('#vehicleEdit_site').html(siteOptions);

    $('#editVehicleInventoryID').val(id);
    $('#noteContent').append(noteContent);
    $('#vehicleNoteID').val(id);
    $('#vehicleEdit_license_place').html(vehicleInfo.license_plate);
    $('#vehicleEdit_status').val(vehicleStatus);
    $('#vehicleEdit_year').val(vehicleInfo.year);
    $('#vehicleEdit_make').val(vehicleInfo.make);
    $('#vehicleEdit_model').val(vehicleInfo.model);
    $('#vehicleEdit_milage').val(vehicleInfo.mileage);
    $('#vehicleEdit_description').val(vehicleInfo.description);
}

function insertVehicleNote() {
    loading.show();
    var note = $('#vehicleNote').val();
    var vehicle_id = $('#vehicleNoteID').val();

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/vehicle_note?key=' + api_key,
        dataType: "json",
        data: {vehicle_id: vehicle_id, note: note},
        headers: {"token": token},
        success: function (data) {
            new PNotify('Success');
            $('#inventory_note').modal('hide');
            loading.hide();

            inventory();
            inventory_view(vehicle_id);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });

}

function submit_inventory() {
    loading.show();
    var newInventory = $('#newInventory').serializeArray();

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/vehicle?key=' + api_key,
        dataType: "json",
        data: newInventory,
        headers: {"token": token},
        success: function (data) {
            new PNotify('Success');
            $('#add_inventory').modal('hide');
            loading.hide();

            inventory();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });
}

function update_inventory() {
    loading.show();
    var editInventory = $('#editInventory').serializeArray();

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/update_vehicle?key=' + api_key,
        dataType: "json",
        data: editInventory,
        headers: {"token": token},
        success: function (data) {
            new PNotify('Updated');
            $('#edit_inventory').modal('hide');
            $('#view_inventory').modal('hide');
            loading.hide();
            inventory();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });
}

// Dispatchers Report
function addWave() {

    // Current 1;
    var waveCount = $('#waveCount').val();
    var newCount = parseInt(waveCount) + parseInt(1);
    $('#waveCount').val(newCount);

    var waveContent = '';
    waveContent += '<div class="form-group row d-flex align-items-center"><label class="col-sm-4 form-control-label">Wave ' + newCount + ' Scheduled Start</label> <div class="col-sm-8"> <p class="form-control-static"><input type="text" class="form-control" id="wave' + newCount + '"></p> </div> </div> <div class="empty-xs-40 empty-md-0"></div>';

    waveContent += '<div class="form-group row d-flex align-items-center"> <label class="col-sm-4 form-control-label">Wave ' + newCount + ' Actual Start</label> <div class="col-sm-8"> <p class="form-control-static"><input type="text" class="form-control" id="wave' + newCount + '_actual_start"></p> </div> </div> <div class="empty-xs-40 empty-md-0"></div>';
    waveContent += '<div class="form-group row d-flex align-items-center"> <label class="col-sm-4 form-control-label">Wave ' + newCount + ' Actual End</label> <div class="col-sm-8"> <p class="form-control-static"><input type="text" class="form-control" id="wave' + newCount + '_actual_end"></p> </div> </div> <div class="empty-xs-40 empty-md-0"></div>';

    $('#insertWave').append(waveContent)
}

function pullDispatchersReport() {
    loading.show();
    var date = window.localStorage.getItem("date");
    var site_id = window.localStorage.getItem('site_id');

    $.ajax({
        type: 'GET',
        url: domain + apiv + 'dispatch/dispatcher_report?date=' + date + '&site_id=' + site_id + '&key=' + api_key,
        dataType: "json",
        headers: {"token": token},
        success: function (data) {

            window.localStorage.setItem('dispatcher_report', JSON.stringify(data));

            $('#routes_confirmed').val(data.routes_confirmed);
            $('#routes_assigned').val(data.routes_assigned);
            $('#ride_alongs').val(data.ride_alongs);
            $('#quick_coverages').val(data.quick_coverages);
            $('#dsp_late_cancelations').val(data.dsp_late_cancelations);
            $('#amzl_late_cancelations').val(data.amzl_late_cancelations);
            $('#vehicle_count').val(data.vehicle_count);
            $('#wave1').val(data.wave1);
            $('#wave1_actual_start').val(data.wave1_actual_start);
            $('#wave1_actual_end').val(data.wave1_actual_end);


            var waveContent = '';
            if (data.wave2) {
                var newCount = 2;
                waveContent += '<div class="form-group row d-flex align-items-center"><label class="col-sm-4 form-control-label">Wave ' + newCount + ' Scheduled Start</label> <div class="col-sm-8"> <p class="form-control-static"><input type="text" class="form-control" id="wave' + newCount + '" value="' + data.wave2 + '"></p> </div> </div> <div class="empty-xs-40 empty-md-0"></div>';

                waveContent += '<div class="form-group row d-flex align-items-center"> <label class="col-sm-4 form-control-label">Wave ' + newCount + ' Actual Start</label> <div class="col-sm-8"> <p class="form-control-static"><input type="text" class="form-control" id="wave' + newCount + '_actual_start" value="' + data.wave2_actual_start + '"></p> </div> </div> <div class="empty-xs-40 empty-md-0"></div>';
                waveContent += '<div class="form-group row d-flex align-items-center"> <label class="col-sm-4 form-control-label">Wave ' + newCount + ' Actual End</label> <div class="col-sm-8"> <p class="form-control-static"><input type="text" class="form-control" id="wave' + newCount + '_actual_end" value="' + data.wave2_actual_end + '"></p> </div> </div> <div class="empty-xs-40 empty-md-0"></div>';
            }
            $('#insertWave').append(waveContent);

            $('#dispatcherReportID').val(data.id);
            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });

}

function submitDispachersReport() {
    loading.show();

    var dispatcherData = {};

    var id = $('#dispatcherReportID').val();

    dispatcherData.type = 'dispatcher_report';
    dispatcherData.date = window.localStorage.getItem("date");
    dispatcherData.user_id = window.localStorage.getItem("customer_id");
    dispatcherData.site_id = window.localStorage.getItem('site_id');

    dispatcherData.routes_confirmed = $('#routes_confirmed').val();
    dispatcherData.routes_assigned = $('#routes_assigned').val();
    dispatcherData.quick_coverages = $('#quick_coverages').val();
    dispatcherData.dsp_late_cancelations = $('#dsp_late_cancelations').val();
    dispatcherData.amzl_late_cancelations = $('#amzl_late_cancelations').val();
    dispatcherData.vehicle_count = $('#vehicle_count').val();
    dispatcherData.wave1 = $('#wave1').val();
    dispatcherData.wave1_actual_start = $('#wave1_actual_start').val();
    dispatcherData.wave1_actual_end = $('#wave1_actual_end').val();

    if ($('#wave2').val()) {
        dispatcherData.wave2 = $('#wave2').val();
        dispatcherData.wave2_actual_start = $('#wave2_actual_start').val();
        dispatcherData.wave2_actual_end = $('#wave2_actual_end').val();
    }

    if (id) {
        dispatcherData.id = id;
    }

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/dispatcher_report?key=' + api_key,
        dataType: "json",
        data: dispatcherData,
        headers: {"token": token},
        success: function (data) {
            new PNotify('Updated');
            $('#dispatcher_reports').modal('hide');
            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });

}

// Delivery Report

function deliveryReport() {
    $('#deliveryReport').modal('show');
}

function pullDeliveryReport() {
    $('#deliveryReport').modal('hide');
    $('#deliveryReportResults').modal('show');
    var devlieryReportMonth = $('#devlieryReportMonth').val();

    var deliveryRepResults = '';
    if (devlieryReportMonth == 'FEB-2017') {
        var deliveryRepResults = '<table cellspacing=0><tr><td style=min-width:50px>Period</td><td style=min-width:50px>02-01-17</td><td style=min-width:50px>to</td><td style=min-width:50px>02-28-17</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>AMZL</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>LOCATIONS</td><td style=min-width:50px>STATE</td><td style=min-width:50px>STATION ID</td><td style=min-width:50px></td><td style=min-width:50px>SAME DAY ROUTES</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>DELIVERIES</td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>WK5</td><td style=min-width:50px>WK6</td><td style=min-width:50px>WK7</td><td style=min-width:50px>WK8</td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px>Insurance cost at 32 cents a delivery</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Chicago</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH1</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Morton Grove</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH2</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Lisle</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH3</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Commerce</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA3</td><td style=min-width:50px></td><td style=min-width:50px>98</td><td style=min-width:50px>99</td><td style=min-width:50px>100</td><td style=min-width:50px>117</td><td style=min-width:50px>414</td><td style=min-width:50px></td><td style=min-width:50px>6,328</td><td style=min-width:50px>1,961.68</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Hawthorne</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA8</td><td style=min-width:50px></td><td style=min-width:50px>165</td><td style=min-width:50px>156</td><td style=min-width:50px>145</td><td style=min-width:50px>126</td><td style=min-width:50px>592</td><td style=min-width:50px></td><td style=min-width:50px>10,134</td><td style=min-width:50px>3,141.54</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Irvine</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA9</td><td style=min-width:50px></td><td style=min-width:50px>81</td><td style=min-width:50px>151</td><td style=min-width:50px>127</td><td style=min-width:50px>140</td><td style=min-width:50px>499</td><td style=min-width:50px></td><td style=min-width:50px>5,180</td><td style=min-width:50px>1,605.8</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>San Leandro</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF4</td><td style=min-width:50px></td><td style=min-width:50px>15</td><td style=min-width:50px>4</td><td style=min-width:50px>12</td><td style=min-width:50px>3</td><td style=min-width:50px>34</td><td style=min-width:50px></td><td style=min-width:50px>2,096</td><td style=min-width:50px>649.76</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>San Francisco</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF5</td><td style=min-width:50px></td><td style=min-width:50px>76</td><td style=min-width:50px>36</td><td style=min-width:50px>90</td><td style=min-width:50px>105</td><td style=min-width:50px>307</td><td style=min-width:50px></td><td style=min-width:50px>5,137</td><td style=min-width:50px>1,592.47</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Richmond</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF6</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Fort Worth</td><td style=min-width:50px>TX</td><td style=min-width:50px>DDA1</td><td style=min-width:50px></td><td style=min-width:50px>35</td><td style=min-width:50px>35</td><td style=min-width:50px>35</td><td style=min-width:50px>35</td><td style=min-width:50px>140</td><td style=min-width:50px></td><td style=min-width:50px>4,788</td><td style=min-width:50px>1,484.28</td></tr><tr><td style=min-width:50px>San Antonio</td><td style=min-width:50px>TX</td><td style=min-width:50px>SAT5</td><td style=min-width:50px></td><td style=min-width:50px>97</td><td style=min-width:50px>98</td><td style=min-width:50px>98</td><td style=min-width:50px>98</td><td style=min-width:50px>391</td><td style=min-width:50px></td><td style=min-width:50px>9,716</td><td style=min-width:50px>3,011.96</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>PRIME NOW</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>PACKAGES</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>DELIVERIES</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>WK5</td><td style=min-width:50px>WK6</td><td style=min-width:50px>WK7</td><td style=min-width:50px>WK8</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>IRVINE</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA4</td><td style=min-width:50px></td><td style=min-width:50px>718</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>1</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>719</td><td style=min-width:50px>222.89</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>SAN DIEGO</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA6</td><td style=min-width:50px></td><td style=min-width:50px>4,223</td><td style=min-width:50px>4,205</td><td style=min-width:50px>487</td><td style=min-width:50px>4,477</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>13,392</td><td style=min-width:50px>4,151.52</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>SACRAMENTO</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA9</td><td style=min-width:50px></td><td style=min-width:50px>3,106</td><td style=min-width:50px>3,054</td><td style=min-width:50px>182</td><td style=min-width:50px>2,887</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>9,229</td><td style=min-width:50px>2,860.99</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>66,719</td><td style=min-width:50px>20,682.89</td></tr></table>';
    } else if (devlieryReportMonth == 'MAR-2017') {
        var deliveryRepResults = '<table cellspacing=0><tr><td style=min-width:50px>Period</td><td style=min-width:50px>03-01-17</td><td style=min-width:50px>to</td><td style=min-width:50px>03-31-17</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>AMZL</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>LOCATIONS</td><td style=min-width:50px>STATE</td><td style=min-width:50px>STATION ID</td><td style=min-width:50px></td><td style=min-width:50px>SAME DAY ROUTES</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>WK9</td><td style=min-width:50px>WK10</td><td style=min-width:50px>WK11</td><td style=min-width:50px>WK12</td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td><td style=min-width:50px>DELIVERIES</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px>Insurance cost at 32 cents a delivery</td></tr><tr><td style=min-width:50px>Chicago</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH1</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Morton Grove</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH2</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Lisle</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH3</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Commerce</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA3</td><td style=min-width:50px></td><td style=min-width:50px>118</td><td style=min-width:50px>114</td><td style=min-width:50px>100</td><td style=min-width:50px>107</td><td style=min-width:50px>439</td><td style=min-width:50px></td><td style=min-width:50px>12,280</td><td style=min-width:50px>3,806.8</td></tr><tr><td style=min-width:50px>Hawthorne</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA8</td><td style=min-width:50px></td><td style=min-width:50px>109</td><td style=min-width:50px>97</td><td style=min-width:50px>90</td><td style=min-width:50px>99</td><td style=min-width:50px>395</td><td style=min-width:50px></td><td style=min-width:50px>10,040</td><td style=min-width:50px>3,112.4</td></tr><tr><td style=min-width:50px>Irvine</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA9</td><td style=min-width:50px></td><td style=min-width:50px>180</td><td style=min-width:50px>189</td><td style=min-width:50px>177</td><td style=min-width:50px>174</td><td style=min-width:50px>720</td><td style=min-width:50px></td><td style=min-width:50px>13,060</td><td style=min-width:50px>4,048.6</td></tr><tr><td style=min-width:50px>San Leandro</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF4</td><td style=min-width:50px></td><td style=min-width:50px>33</td><td style=min-width:50px>34</td><td style=min-width:50px>34</td><td style=min-width:50px>37</td><td style=min-width:50px>138</td><td style=min-width:50px></td><td style=min-width:50px>2,625</td><td style=min-width:50px>813.75</td></tr><tr><td style=min-width:50px>San Francisco</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF5</td><td style=min-width:50px></td><td style=min-width:50px>57</td><td style=min-width:50px>52</td><td style=min-width:50px>55</td><td style=min-width:50px>49</td><td style=min-width:50px>213</td><td style=min-width:50px></td><td style=min-width:50px>4,074</td><td style=min-width:50px>1,262.94</td></tr><tr><td style=min-width:50px>Richmond</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF6</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px>Fort Worth</td><td style=min-width:50px>TX</td><td style=min-width:50px>DDA1</td><td style=min-width:50px></td><td style=min-width:50px>35</td><td style=min-width:50px>35</td><td style=min-width:50px>35</td><td style=min-width:50px>35</td><td style=min-width:50px>140</td><td style=min-width:50px></td><td style=min-width:50px>6,520</td><td style=min-width:50px>2,021.2</td></tr><tr><td style=min-width:50px>San Antonio</td><td style=min-width:50px>TX</td><td style=min-width:50px>SAT5</td><td style=min-width:50px></td><td style=min-width:50px>99</td><td style=min-width:50px>100</td><td style=min-width:50px>99</td><td style=min-width:50px>100</td><td style=min-width:50px>398</td><td style=min-width:50px></td><td style=min-width:50px>9,650</td><td style=min-width:50px>2,991.5</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>PRIME NOW</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>PACKAGES</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>DELIVERIES</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>WK9</td><td style=min-width:50px>WK10</td><td style=min-width:50px>WK11</td><td style=min-width:50px>WK12</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>IRVINE</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA4</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>SAN DIEGO</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA6</td><td style=min-width:50px></td><td style=min-width:50px>4316</td><td style=min-width:50px>4,260</td><td style=min-width:50px>4,363</td><td style=min-width:50px>4,435</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>17,374</td><td style=min-width:50px>5,385.94</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>SACRAMENTO</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA9</td><td style=min-width:50px></td><td style=min-width:50px>2,687</td><td style=min-width:50px>2,700</td><td style=min-width:50px>2,548</td><td style=min-width:50px>2,572</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>10,507</td><td style=min-width:50px>3,257.17</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>86,130</td><td style=min-width:50px>26,700.3</td></tr></table>';
    } else if (devlieryReportMonth == 'APR-2017') {
        var deliveryRepResults = '<table cellspacing=0><tr><td style=min-width:50px>Period</td><td style=min-width:50px>04-01-17</td><td style=min-width:50px>to</td><td style=min-width:50px>04-30-17</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>AMZL</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>LOCATIONS</td><td style=min-width:50px>STATE</td><td style=min-width:50px>STATION ID</td><td style=min-width:50px></td><td style=min-width:50px>SAME DAY ROUTES</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>WK13</td><td style=min-width:50px>WK14</td><td style=min-width:50px>WK15</td><td style=min-width:50px>WK16</td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td><td style=min-width:50px>DELIVERIES</td><td style=min-width:50px>Insurance cost at 32 cents a delivery</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Chicago</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH1</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Morton Grove</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH2</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Lisle</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH3</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Commerce</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA3</td><td style=min-width:50px></td><td style=min-width:50px>102</td><td style=min-width:50px>106</td><td style=min-width:50px>124</td><td style=min-width:50px>121</td><td style=min-width:50px>453</td><td style=min-width:50px></td><td style=min-width:50px>12,226</td><td style=min-width:50px>3,790.06</td></tr><tr><td style=min-width:50px>Hawthorne</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA8</td><td style=min-width:50px></td><td style=min-width:50px>122</td><td style=min-width:50px>111</td><td style=min-width:50px>120</td><td style=min-width:50px>132</td><td style=min-width:50px>485</td><td style=min-width:50px></td><td style=min-width:50px>11,789</td><td style=min-width:50px>3,654.59</td></tr><tr><td style=min-width:50px>Irvine</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA9</td><td style=min-width:50px></td><td style=min-width:50px>174</td><td style=min-width:50px>135</td><td style=min-width:50px>97</td><td style=min-width:50px>68</td><td style=min-width:50px>474</td><td style=min-width:50px></td><td style=min-width:50px>15,691</td><td style=min-width:50px>4,864.21</td></tr><tr><td style=min-width:50px>San Leandro</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF4</td><td style=min-width:50px></td><td style=min-width:50px>27</td><td style=min-width:50px>25</td><td style=min-width:50px>28</td><td style=min-width:50px>30</td><td style=min-width:50px>110</td><td style=min-width:50px></td><td style=min-width:50px>2,821</td><td style=min-width:50px>874.51</td></tr><tr><td style=min-width:50px>San Francisco</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF5</td><td style=min-width:50px></td><td style=min-width:50px>42</td><td style=min-width:50px>40</td><td style=min-width:50px>41</td><td style=min-width:50px>77</td><td style=min-width:50px>200</td><td style=min-width:50px></td><td style=min-width:50px>5,466</td><td style=min-width:50px>1,694.46</td></tr><tr><td style=min-width:50px>Richmond</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF6</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px>Garland</td><td style=min-width:50px>TX</td><td style=min-width:50px>DDA2</td><td style=min-width:50px></td><td style=min-width:50px>30</td><td style=min-width:50px>25</td><td style=min-width:50px>32</td><td style=min-width:50px>34</td><td style=min-width:50px>121</td><td style=min-width:50px></td><td style=min-width:50px>12,460</td><td style=min-width:50px>3,862.6</td></tr><tr><td style=min-width:50px>Fort Worth</td><td style=min-width:50px>TX</td><td style=min-width:50px>DDA3</td><td style=min-width:50px></td><td style=min-width:50px>35</td><td style=min-width:50px>35</td><td style=min-width:50px>35</td><td style=min-width:50px>35</td><td style=min-width:50px>140</td><td style=min-width:50px></td><td style=min-width:50px>7,196</td><td style=min-width:50px>2,230.76</td></tr><tr><td style=min-width:50px>San Antonio</td><td style=min-width:50px>TX</td><td style=min-width:50px>SAT5</td><td style=min-width:50px></td><td style=min-width:50px>103</td><td style=min-width:50px>98</td><td style=min-width:50px>101</td><td style=min-width:50px>99</td><td style=min-width:50px>401</td><td style=min-width:50px></td><td style=min-width:50px>9,738</td><td style=min-width:50px>3,018.78</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>PRIME NOW</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>PACKAGES</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>DELIVERIES</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>WK13</td><td style=min-width:50px>WK14</td><td style=min-width:50px>WK15</td><td style=min-width:50px>WK16</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>IRVINE</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA4</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>SAN DIEGO</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA6</td><td style=min-width:50px></td><td style=min-width:50px>3947</td><td style=min-width:50px>3,242</td><td style=min-width:50px>2,753</td><td style=min-width:50px>3,736</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>13,678</td><td style=min-width:50px>4,240.18</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>SACRAMENTO</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA9</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>91,065</td><td style=min-width:50px>28,230.15</td></tr></table>';
    } else if (devlieryReportMonth == 'MAY-2017') {
        var deliveryRepResults = '<table cellspacing=0><tr><td style=min-width:50px>Period</td><td style=min-width:50px>05-01-17</td><td style=min-width:50px>to</td><td style=min-width:50px>05-31-17</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>AMZL</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>LOCATIONS</td><td style=min-width:50px>STATE</td><td style=min-width:50px>STATION ID</td><td style=min-width:50px></td><td style=min-width:50px>SAME DAY ROUTES</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>Insurance cost at 32 cents a delivery</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>WK18</td><td style=min-width:50px>WK19</td><td style=min-width:50px>WK20</td><td style=min-width:50px>WK21</td><td style=min-width:50px>WK22</td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td><td style=min-width:50px>DELIVERIES</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Chicago</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH1</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Morton Grove</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH2</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Lisle</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH3</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Commerce</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA3</td><td style=min-width:50px></td><td style=min-width:50px>108</td><td style=min-width:50px>126</td><td style=min-width:50px>123</td><td style=min-width:50px>122</td><td style=min-width:50px>65</td><td style=min-width:50px></td><td style=min-width:50px>544</td><td style=min-width:50px></td><td style=min-width:50px>16,162</td><td style=min-width:50px>5,010.22</td></tr><tr><td style=min-width:50px>Hawthorne</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA8</td><td style=min-width:50px></td><td style=min-width:50px>106</td><td style=min-width:50px>99</td><td style=min-width:50px>126</td><td style=min-width:50px>126</td><td style=min-width:50px>61</td><td style=min-width:50px></td><td style=min-width:50px>518</td><td style=min-width:50px></td><td style=min-width:50px>13,679</td><td style=min-width:50px>4,240.49</td></tr><tr><td style=min-width:50px>Irvine</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA9</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px>San Leandro</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF4</td><td style=min-width:50px></td><td style=min-width:50px>27</td><td style=min-width:50px>23</td><td style=min-width:50px>28</td><td style=min-width:50px>19</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>97</td><td style=min-width:50px></td><td style=min-width:50px>3,199</td><td style=min-width:50px>991.69</td></tr><tr><td style=min-width:50px>San Francisco</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF5</td><td style=min-width:50px></td><td style=min-width:50px>42</td><td style=min-width:50px>42</td><td style=min-width:50px>36</td><td style=min-width:50px>40</td><td style=min-width:50px>16</td><td style=min-width:50px></td><td style=min-width:50px>176</td><td style=min-width:50px></td><td style=min-width:50px>5,572</td><td style=min-width:50px>1,727.32</td></tr><tr><td style=min-width:50px>Richmond</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF6</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px>Austin</td><td style=min-width:50px>TX</td><td style=min-width:50px>DAU1</td><td style=min-width:50px></td><td style=min-width:50px>62</td><td style=min-width:50px>85</td><td style=min-width:50px>96</td><td style=min-width:50px>98</td><td style=min-width:50px>62</td><td style=min-width:50px></td><td style=min-width:50px>403</td><td style=min-width:50px></td><td style=min-width:50px>10,091</td><td style=min-width:50px>3,128.21</td></tr><tr><td style=min-width:50px>Garland</td><td style=min-width:50px>TX</td><td style=min-width:50px>DDA2</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px>Fort Worth</td><td style=min-width:50px>TX</td><td style=min-width:50px>DDA3</td><td style=min-width:50px></td><td style=min-width:50px>60</td><td style=min-width:50px>69</td><td style=min-width:50px>70</td><td style=min-width:50px>70</td><td style=min-width:50px>40</td><td style=min-width:50px></td><td style=min-width:50px>309</td><td style=min-width:50px></td><td style=min-width:50px>9,044</td><td style=min-width:50px>2,803.64</td></tr><tr><td style=min-width:50px>San Antonio</td><td style=min-width:50px>TX</td><td style=min-width:50px>SAT5</td><td style=min-width:50px></td><td style=min-width:50px>75</td><td style=min-width:50px>87</td><td style=min-width:50px>91</td><td style=min-width:50px>26</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>279</td><td style=min-width:50px></td><td style=min-width:50px>6,879</td><td style=min-width:50px>2,132.49</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>PRIME NOW</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>PACKAGES</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>DELIVERIES</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>WK18</td><td style=min-width:50px>WK19</td><td style=min-width:50px>WK20</td><td style=min-width:50px>WK21</td><td style=min-width:50px>WK22</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>IRVINE</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA4</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>SAN DIEGO</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA6</td><td style=min-width:50px></td><td style=min-width:50px>3312</td><td style=min-width:50px>3,191</td><td style=min-width:50px>3,627</td><td style=min-width:50px>3,350</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>13,480</td><td style=min-width:50px>4,178.8</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>SACRAMENTO</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA9</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>78,106</td><td style=min-width:50px>24,212.86</td></tr></table>';
    } else if (devlieryReportMonth == 'JUNE-2017') {
        var deliveryRepResults = '<table cellspacing=0><tr><td style=min-width:50px>Period</td><td style=min-width:50px>06-01-17</td><td style=min-width:50px>to</td><td style=min-width:50px>06-30-17</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>AMZL</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>LOCATIONS</td><td style=min-width:50px>STATE</td><td style=min-width:50px>STATION ID</td><td style=min-width:50px></td><td style=min-width:50px>SAME DAY ROUTES</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>WK23</td><td style=min-width:50px>WK24</td><td style=min-width:50px>WK25</td><td style=min-width:50px>WK26</td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td><td style=min-width:50px>DELIVERIES</td><td style=min-width:50px>Insurance cost at 32 cents a delivery</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Chicago</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH1</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Morton Grove</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH2</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Lisle</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH3</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Commerce</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA3</td><td style=min-width:50px></td><td style=min-width:50px>90</td><td style=min-width:50px>90</td><td style=min-width:50px>90</td><td style=min-width:50px>90</td><td style=min-width:50px></td><td style=min-width:50px>360</td><td style=min-width:50px></td><td style=min-width:50px>12,747</td><td style=min-width:50px>3,951.57</td></tr><tr><td style=min-width:50px>Hawthorne</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA8</td><td style=min-width:50px></td><td style=min-width:50px>90</td><td style=min-width:50px>90</td><td style=min-width:50px>90</td><td style=min-width:50px>90</td><td style=min-width:50px></td><td style=min-width:50px>360</td><td style=min-width:50px></td><td style=min-width:50px>10,181</td><td style=min-width:50px>3,156.11</td></tr><tr><td style=min-width:50px>Irvine</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA9</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px>San Leandro</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF4</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px>San Francisco</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF5</td><td style=min-width:50px></td><td style=min-width:50px>54</td><td style=min-width:50px>54</td><td style=min-width:50px>64</td><td style=min-width:50px>82</td><td style=min-width:50px></td><td style=min-width:50px>254</td><td style=min-width:50px></td><td style=min-width:50px>3,500</td><td style=min-width:50px>1,085</td></tr><tr><td style=min-width:50px>Richmond</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF6</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px>Austin</td><td style=min-width:50px>TX</td><td style=min-width:50px>DAU1</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px>Garland</td><td style=min-width:50px>TX</td><td style=min-width:50px>DDA2</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px>Fort Worth</td><td style=min-width:50px>TX</td><td style=min-width:50px>DDA3</td><td style=min-width:50px></td><td style=min-width:50px>59</td><td style=min-width:50px>70</td><td style=min-width:50px>70</td><td style=min-width:50px>71</td><td style=min-width:50px></td><td style=min-width:50px>270</td><td style=min-width:50px></td><td style=min-width:50px>7,790</td><td style=min-width:50px>2,414.9</td></tr><tr><td style=min-width:50px>San Antonio</td><td style=min-width:50px>TX</td><td style=min-width:50px>SAT5</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>PRIME NOW</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>PACKAGES</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>DELIVERIES</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>WK22</td><td style=min-width:50px>WK23</td><td style=min-width:50px>WK24</td><td style=min-width:50px>WK25</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>IRVINE</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA4</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>SAN DIEGO</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA6</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>SACRAMENTO</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA9</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>34,218</td><td style=min-width:50px>10,607.58</td></tr></table>';
    } else if (devlieryReportMonth == 'JULY-2017') {
        var deliveryRepResults = '<table cellspacing=0><tr><td style=min-width:50px>Period</td><td style=min-width:50px>07-01-17</td><td style=min-width:50px>to</td><td style=min-width:50px>07-31-17</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>AMZL</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>LOCATIONS</td><td style=min-width:50px>STATE</td><td style=min-width:50px>STATION ID</td><td style=min-width:50px></td><td style=min-width:50px>SAME DAY ROUTES</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>WK27</td><td style=min-width:50px>WK28</td><td style=min-width:50px>WK29</td><td style=min-width:50px>WK30</td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td><td style=min-width:50px>DELIVERIES</td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px>Insurance cost at 32 cents a delivery</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Chicago</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH1</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Morton Grove</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH2</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Lisle</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH3</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Commerce</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA3</td><td style=min-width:50px></td><td style=min-width:50px>126</td><td style=min-width:50px>126</td><td style=min-width:50px>126</td><td style=min-width:50px>126</td><td style=min-width:50px></td><td style=min-width:50px>504</td><td style=min-width:50px></td><td style=min-width:50px>13,875</td><td style=min-width:50px>4,301.25</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Hawthorne</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA8</td><td style=min-width:50px></td><td style=min-width:50px>126</td><td style=min-width:50px>126</td><td style=min-width:50px>126</td><td style=min-width:50px>126</td><td style=min-width:50px></td><td style=min-width:50px>504</td><td style=min-width:50px></td><td style=min-width:50px>11,067</td><td style=min-width:50px>3,430.77</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Irvine</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA9</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>San Leandro</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF4</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>San Francisco</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF5</td><td style=min-width:50px></td><td style=min-width:50px>56</td><td style=min-width:50px>56</td><td style=min-width:50px>56</td><td style=min-width:50px>56</td><td style=min-width:50px></td><td style=min-width:50px>224</td><td style=min-width:50px></td><td style=min-width:50px>7,200</td><td style=min-width:50px>2,232</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Richmond</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF6</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Austin</td><td style=min-width:50px>TX</td><td style=min-width:50px>DAU1</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Garland</td><td style=min-width:50px>TX</td><td style=min-width:50px>DDA2</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Fort Worth</td><td style=min-width:50px>TX</td><td style=min-width:50px>DDA3</td><td style=min-width:50px></td><td style=min-width:50px>70</td><td style=min-width:50px>70</td><td style=min-width:50px>55</td><td style=min-width:50px>55</td><td style=min-width:50px></td><td style=min-width:50px>250</td><td style=min-width:50px></td><td style=min-width:50px>5,115</td><td style=min-width:50px>1,585.65</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>San Antonio</td><td style=min-width:50px>TX</td><td style=min-width:50px>SAT5</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>PRIME NOW</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>PACKAGES</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>DELIVERIES</td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>WK27</td><td style=min-width:50px>WK28</td><td style=min-width:50px>WK29</td><td style=min-width:50px>WK30</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>IRVINE</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA4</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>SAN DIEGO</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA6</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>SACRAMENTO</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA9</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>37,257</td><td style=min-width:50px>11,549.67</td><td style=min-width:50px></td></tr></table>';
    } else if (devlieryReportMonth == 'AUG-2017') {
        var deliveryRepResults = '<table cellspacing="0"><tbody><tr><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px">Period</td><td style="min-width:50px">08-01-17</td><td style="min-width:50px">to</td><td style="min-width:50px">08-31-17</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px">AMZL</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px">LOCATIONS</td><td style="min-width:50px">STATE</td><td style="min-width:50px">STATION ID</td><td style="min-width:50px"></td><td style="min-width:50px">SAME DAY ROUTES</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px">WK31</td><td style="min-width:50px">WK32</td><td style="min-width:50px">WK33</td><td style="min-width:50px">WK34</td><td style="min-width:50px"></td><td style="min-width:50px">TOTAL</td><td style="min-width:50px"></td><td style="min-width:50px">DELIVERIES</td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px">TOTAL</td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px">Chicago</td><td style="min-width:50px">IL</td><td style="min-width:50px">DCH1</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px">Morton Grove</td><td style="min-width:50px">IL</td><td style="min-width:50px">DCH2</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px">Lisle</td><td style="min-width:50px">IL</td><td style="min-width:50px">DCH3</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px">Commerce</td><td style="min-width:50px">CA</td><td style="min-width:50px">DLA3</td><td style="min-width:50px"></td><td style="min-width:50px">90</td><td style="min-width:50px">126</td><td style="min-width:50px">126</td><td style="min-width:50px">216</td><td style="min-width:50px"></td><td style="min-width:50px">558</td><td style="min-width:50px"></td><td style="min-width:50px">18,747</td><td style="min-width:50px">5,811.57</td></tr><tr><td style="min-width:50px">Hawthorne</td><td style="min-width:50px">CA</td><td style="min-width:50px">DLA8</td><td style="min-width:50px"></td><td style="min-width:50px">90</td><td style="min-width:50px">126</td><td style="min-width:50px">126</td><td style="min-width:50px">216</td><td style="min-width:50px"></td><td style="min-width:50px">558</td><td style="min-width:50px"></td><td style="min-width:50px">13,181</td><td style="min-width:50px">4,086.11</td></tr><tr><td style="min-width:50px">Irvine</td><td style="min-width:50px">CA</td><td style="min-width:50px">DLA9</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td></tr><tr><td style="min-width:50px">San Leandro</td><td style="min-width:50px">CA</td><td style="min-width:50px">DSF4</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td></tr><tr><td style="min-width:50px">San Francisco</td><td style="min-width:50px">CA</td><td style="min-width:50px">DSF5</td><td style="min-width:50px"></td><td style="min-width:50px">25</td><td style="min-width:50px">30</td><td style="min-width:50px">16</td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px">71</td><td style="min-width:50px"></td><td style="min-width:50px">2,389</td><td style="min-width:50px">740.59</td></tr><tr><td style="min-width:50px">Richmond</td><td style="min-width:50px">CA</td><td style="min-width:50px">DSF6</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td></tr><tr><td style="min-width:50px">Austin</td><td style="min-width:50px">TX</td><td style="min-width:50px">DAU1</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px">Garland</td><td style="min-width:50px">TX</td><td style="min-width:50px">DDA2</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px">Fort Worth</td><td style="min-width:50px">TX</td><td style="min-width:50px">DDA3</td><td style="min-width:50px"></td><td style="min-width:50px">25</td><td style="min-width:50px">35</td><td style="min-width:50px">35</td><td style="min-width:50px">59</td><td style="min-width:50px"></td><td style="min-width:50px">154</td><td style="min-width:50px"></td><td style="min-width:50px">4,507</td><td style="min-width:50px">1,397.17</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px">San Antonio</td><td style="min-width:50px">TX</td><td style="min-width:50px">SAT5</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px">PRIME NOW</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px">PACKAGES</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px">DELIVERIES</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px">WK27</td><td style="min-width:50px">WK28</td><td style="min-width:50px">WK29</td><td style="min-width:50px">WK30</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px">TOTAL</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px">IRVINE</td><td style="min-width:50px">CA</td><td style="min-width:50px">UCA4</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px">SAN DIEGO</td><td style="min-width:50px">CA</td><td style="min-width:50px">UCA6</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td></tr><tr><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td></tr><tr><td style="min-width:50px">SACRAMENTO</td><td style="min-width:50px">CA</td><td style="min-width:50px">UCA9</td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px">0</td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px">0</td><td style="min-width:50px">0</td></tr><tr><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px"></td><td style="min-width:50px">38,824</td><td style="min-width:50px">12,035.44</td></tr></tbody></table>';
    } else if (devlieryReportMonth == 'SEP-2017') {
        var deliveryRepResults = '<table cellspacing=0><tr><td style=min-width:50px>Period</td><td style=min-width:50px>09-01-17</td><td style=min-width:50px>to</td><td style=min-width:50px>09-30-17</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>AMZL</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>LOCATIONS</td><td style=min-width:50px>STATE</td><td style=min-width:50px>STATION ID</td><td style=min-width:50px></td><td style=min-width:50px>SAME DAY ROUTES</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>WK31</td><td style=min-width:50px>WK32</td><td style=min-width:50px>WK33</td><td style=min-width:50px>WK34</td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td><td style=min-width:50px>DELIVERIES</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Chicago</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH1</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Morton Grove</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH2</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Lisle</td><td style=min-width:50px>IL</td><td style=min-width:50px>DCH3</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Commerce</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA3</td><td style=min-width:50px></td><td style=min-width:50px>4</td><td style=min-width:50px>4</td><td style=min-width:50px>4</td><td style=min-width:50px>4</td><td style=min-width:50px></td><td style=min-width:50px>16</td><td style=min-width:50px></td><td style=min-width:50px>600</td><td style=min-width:50px>186</td></tr><tr><td style=min-width:50px>Hawthorne</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA8</td><td style=min-width:50px></td><td style=min-width:50px>5</td><td style=min-width:50px>5</td><td style=min-width:50px>5</td><td style=min-width:50px>5</td><td style=min-width:50px></td><td style=min-width:50px>20</td><td style=min-width:50px></td><td style=min-width:50px>600</td><td style=min-width:50px>186</td></tr><tr><td style=min-width:50px>Irvine</td><td style=min-width:50px>CA</td><td style=min-width:50px>DLA9</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px>San Leandro</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF4</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px>San Francisco</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF5</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px>Richmond</td><td style=min-width:50px>CA</td><td style=min-width:50px>DSF6</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td></tr><tr><td style=min-width:50px>Austin</td><td style=min-width:50px>TX</td><td style=min-width:50px>DAU1</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Garland</td><td style=min-width:50px>TX</td><td style=min-width:50px>DDA2</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>Fort Worth</td><td style=min-width:50px>TX</td><td style=min-width:50px>DDA3</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>San Antonio</td><td style=min-width:50px>TX</td><td style=min-width:50px>SAT5</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>PRIME NOW</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>PACKAGES</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>DELIVERIES</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>WK27</td><td style=min-width:50px>WK28</td><td style=min-width:50px>WK29</td><td style=min-width:50px>WK30</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>TOTAL</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>IRVINE</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA4</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>SAN DIEGO</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA6</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px>SACRAMENTO</td><td style=min-width:50px>CA</td><td style=min-width:50px>UCA9</td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>0</td><td style=min-width:50px>0</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px>1,200</td><td style=min-width:50px>372</td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr><tr><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td><td style=min-width:50px></td></tr></table>';
    }

    $('#deliveryRepResults').html(deliveryRepResults.replace(/>0</g, '>-<'));
}


// General Functions
function today() {
    var locationSites = JSON.parse(window.localStorage.getItem('locationSites'));
    var site_id = window.localStorage.getItem('site_id');

    var site_info;
    $.each(locationSites, function (index, location) {

        if (site_info) {
            return false;
        } else {
            $.each(location.sites, function (index, site) {
                if (site.id == site_id) {
                    site_info = site;
                }
            });
        }
    });

    var state = (site_info ? site_info.state : 'CA');

    if (state == "CA" || state == 'ca') {
        // console.log(moment().tz("America/Los_Angeles").format('MM-DD-YYYY HH:mm:ss z'));
        return moment().tz("America/Los_Angeles").format('MM-DD-YYYY');
    } else {
        // console.log(moment().tz("America/Chicago").format('MM-DD-YYYY HH:mm:ss z'));
        return moment().tz("America/Chicago").format('MM-DD-YYYY');
    }

    // var today = new Date();
    // var dd = today.getDate();
    // var mm = today.getMonth() + 1; //January is 0!
    //
    // var yyyy = today.getFullYear();
    // if (dd < 10) {
    //     dd = '0' + dd;
    // }
    // if (mm < 10) {
    //     mm = '0' + mm;
    // }
    // return today = mm + '-' + dd + '-' + yyyy;
}

function todaySearch() {
    // var today = new Date();
    // var dd = today.getDate();
    // var mm = today.getMonth() + 1; //January is 0!
    //
    // var yyyy = today.getFullYear();
    // if (dd < 10) {
    //     dd = '0' + dd;
    // }
    // if (mm < 10) {
    //     mm = '0' + mm;
    // }
    // return today = yyyy + '-' + mm + '-' + dd;


    var locationSites = JSON.parse(window.localStorage.getItem('locationSites'));
    var site_id = window.localStorage.getItem('site_id');

    var site_info;
    $.each(locationSites, function (index, location) {

        if (site_info) {
            return false;
        } else {
            $.each(location.sites, function (index, site) {
                if (site.id == site_id) {
                    site_info = site;
                }
            });
        }
    });

    var state = (site_info ? site_info.state : 'CA');

    if (state == "CA" || state == 'ca') {
        // console.log(moment().tz("America/Los_Angeles").format('YYYY-MM-DD HH:mm:ss z'));
        return moment().tz("America/Los_Angeles").format('YYYY-MM-DD');
    } else {
        // console.log(moment().tz("America/Chicago").format('YYYY-MM-DD HH:mm:ss z'));
        return moment().tz("America/Chicago").format('YYYY-MM-DD');
    }
}

function pullSites(e) {

    var locationSelected = e.val();

    console.log(locationSelected);

    // Set the sites dropdown
    var locationSites = JSON.parse(window.localStorage.getItem('locationSites'));

    var sites = '<option>Please Select Job Site</option>';
    $.each(locationSites, function (index, value) {

        if (locationSelected == value.id || locationSelected == value.name) {
            $.each(value.sites, function (newindex, newvalue) {
                sites += '<option value="' + newvalue.id + '">' + newvalue.name + '</option>';
            });
        }
        ;
    });


    $('#setSite').html(sites);

}

function set_site() {
    // Cant do ALL anymore
    var setSite = $('#setSite').val();
    var setSiteName = $('#setSite').find("option:selected").text();
    window.localStorage.setItem('site_id', setSite);
    window.localStorage.setItem('site_name', setSiteName);

    pull_info();

    $('#left_menu_content').show();
    $('#location_set').html(setSiteName);
    $('#location_sites').modal('hide');


    var locationSites = JSON.parse(window.localStorage.getItem('locationSites'));

    getShifts();
    var site_info;
    $.each(locationSites, function (index, location) {

        if (site_info) {
            return false;
        } else {
            $.each(location.sites, function (index, site) {
                if (site.id == setSite) {
                    site_info = site;
                    initialize();
                    setTimeout(function () {
                        find_address(site.address + ' ' + site.city + ' ' + site.state + ', ' + site.zip);
                    }, 500);
                    return false;
                }
            });
        }
    });
}

function searchDrivers(e) {
    var search = e.value.toLowerCase();
    $(".accounts").each(function () {
        if (search != '') {
            $(this).hide();
        }
        if ($(this).html().toLowerCase().indexOf(search) !== -1) {
            $(this).show()
        }
    });
}

function formatAMPM(datetime) {
    var date = new Date(datetime);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function conv_duration(current_length) {
    var split = current_length.split(':');
    var new_length = parseInt(split[0]) + (parseInt(split[1]) / 60);
    return new_length;
}

$('.modal').on('hidden.bs.modal', function (e) {
    if ($('.modal').hasClass('show')) {
        $('body').addClass('modal-open');
    }
});


// Drag & Drop

// Reported drivers
function reported_drivers() {
    $('#reported_drivers').modal('show');

    reported();
}

function reported() {

    var date = window.localStorage.getItem("date");
    var site_id = window.localStorage.getItem('site_id');

    loading.hide();
    $.ajax({
        type: 'GET',
        url: domain + apiv + 'dispatch/reported_drivers?date=' + date + '&site_id=' + site_id + '&key=' + api_key,
        dataType: "json",
        headers: {"token": token},
        success: function (data) {

            window.localStorage.setItem('reported_drivers', JSON.stringify(data));
            var html = '';
            var topics = {2: 'ncns', 3: "lmco", 4: "sent home"};
            $.each(data, function (index, value) {
                var topic = value.main_topic;
                var first_name = value.crm_account.first_name;
                var last_name = value.crm_account.last_name;
                var info = JSON.parse(value.data);
                var report_id = value.id;
                html += '<tr>';
                html += '<td style=min-width:50px>' + first_name + ' ' + last_name + '</td>';
                html += '<td style=min-width:50px>' + topics[topic] + '</td>';
                html += '<td style=min-width:50px>' + info.reason + '</td>';
                html += '<td><a href="#" onclick="un_report(' + report_id + ')" class="btn btn-report">Un-report</a></td>';
                html += '</tr>';
            });

            $('#reportedContent tbody').html(html);


            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });
}

function un_report(report_id) {
    var id = {report_id: report_id};

    $.ajax({
        type: 'POST',
        url: domain + apiv + 'dispatch/hr_unreport?key=' + api_key,
        dataType: "json",
        headers: {"token": token},
        data: id,
        success: function (data) {
            reported();
            loading.hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            loading.hide();
            reported();
            new PNotify({text: JSON.parse(xhr.responseText).error.message});
        }
    });
}