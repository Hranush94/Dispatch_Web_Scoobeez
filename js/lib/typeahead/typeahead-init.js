$(document).ready(function() {
    var countries = [
        "Nicholas Townsend", "Ryan Evon", "Jerimiah Figueroa", "Sean Curtiss", "Erickson Ramos", "Rebecca Jaramillo",
        "Dasia Hawkins", "Devon Jones", "Corey Brown", "Christopher Bradford", "Sarah Vader", "Brandi Miller", "Nicholas Townsend", "Bangladesh",
        "Ryan Evon", "Jerimiah Figueroana", "Sean Curtiss", "Erickson Ramos", "Rebecca Jaramillo", "Dasia Hawkins", "Burkina Faso", "Burma"
    ];

    var capitals = [
        "Abu Dhabi", "Abuja", "Accra", "Adamstown", "Addis Ababa", "Algiers", "Alofi", "Amman", "Amsterdam",
        "Andorra la Vella", "Ankara", "Antananarivo", "Apia", "Ashgabat", "Asmara", "Astana", "Asunción", "Athens",
        "Avarua", "Baghdad", "Baku", "Bamako", "Bandar Seri Begawan", "Bangkok", "Bangui", "Banjul", "Basseterre",
        "Beijing", "Beirut", "Belgrade", "Belmopan", "Berlin", "Bern", "Bishkek", "Bissau", "Bogotá", "Brasília",
        "Bratislava", "Brazzaville", "Bridgetown", "Brussels", "Bucharest", "Budapest", "Buenos Aires", "Bujumbura",
        "Cairo", "Canberra", "Caracas", "Castries", "Cayenne", "Charlotte Amalie", "Chisinau", "Cockburn Town",
        "Conakry", "Copenhagen", "Dakar", "Damascus", "Dhaka", "Dili", "Djibouti", "Dodoma", "Doha", "Douglas",
        "Dublin", "Dushanbe", "Edinburgh of the Seven Seas", "El Aaiún", "Episkopi Cantonment", "Flying Fish Cove",
        "Freetown", "Funafuti", "Gaborone", "George Town", "Georgetown", "Georgetown", "Gibraltar", "King Edward Point",
        "Guatemala City", "Gustavia", "Hagåtña", "Hamilton", "Hanga Roa", "Hanoi", "Harare", "Hargeisa", "Havana",
        "Helsinki", "Honiara", "Islamabad", "Jakarta", "Jamestown", "Jerusalem", "Juba", "Kabul", "Kampala",
        "Kathmandu", "Khartoum", "Kiev", "Kigali", "Kingston", "Kingston", "Kingstown", "Kinshasa", "Kuala Lumpur",
        "Kuwait City", "Libreville", "Lilongwe", "Lima", "Lisbon", "Ljubljana", "Lomé", "London", "Luanda", "Lusaka",
        "Luxembourg", "Madrid", "Majuro", "Malabo", "Malé", "Managua", "Manama", "Manila", "Maputo", "Marigot",
        "Maseru", "Mata-Utu", "Mbabane Lobamba", "Melekeok Ngerulmud", "Mexico City", "Minsk", "Mogadishu", "Monaco",
        "Monrovia", "Montevideo", "Moroni", "Moscow", "Muscat", "Nairobi", "Nassau", "Naypyidaw", "N'Djamena",
        "New Delhi", "Niamey", "Nicosia", "Nicosia", "Nouakchott", "Nouméa", "Nukuʻalofa", "Nuuk", "Oranjestad",
        "Oslo", "Ottawa", "Ouagadougou", "Pago Pago", "Palikir", "Panama City", "Papeete", "Paramaribo", "Paris",
        "Philipsburg", "Phnom Penh", "Plymouth Brades Estate", "Podgorica Cetinje", "Port Louis", "Port Moresby",
        "Port Vila", "Port-au-Prince", "Port of Spain", "Porto-Novo Cotonou", "Prague", "Praia", "Cape Town",
        "Pristina", "Pyongyang", "Quito", "Rabat", "Reykjavík", "Riga", "Riyadh", "Road Town", "Rome", "Roseau",
        "Saipan", "San José", "San Juan", "San Marino", "San Salvador", "Sana'a", "Santiago", "Santo Domingo",
        "São Tomé", "Sarajevo", "Seoul", "Singapore", "Skopje", "Sofia", "Sri Jayawardenepura Kotte", "St. George's",
        "St. Helier", "St. John's", "St. Peter Port", "St. Pierre", "Stanley", "Stepanakert", "Stockholm", "Sucre",
        "Sukhumi", "Suva", "Taipei", "Tallinn", "Tarawa Atoll", "Tashkent", "Tbilisi", "Tegucigalpa", "Tehran",
        "Thimphu", "Tirana", "Tiraspol", "Tokyo", "Tórshavn", "Tripoli", "Tskhinvali", "Tunis", "Ulan Bator", "Vaduz",
        "Valletta", "The Valley", "Vatican City", "Victoria", "Vienna", "Vientiane", "Vilnius", "Warsaw",
        "Washington, D.C.", "Wellington", "West Island", "Willemstad", "Windhoek", "Yamoussoukro", "Yaoundé", "Yaren",
        "Yerevan", "Zagreb"
    ];

    $.typeahead({
        input: "#typeahead-search-country-v1",
        order: "asc",
        minLength: 1,
        source: {
            data: countries
        }
    });

    $('#typeahead-search-country-v2').on('keyup', function() {
        if ($.trim($(this).val()) == '') {
            $('#result-container').text('No results matching');
        }
    });

    $.typeahead({
        input: "#typeahead-search-country-v2",
        order: "asc",
        minLength: 1,
        maxItem: 10,
        template: "{{display}} <small style='color:#999;'>{{group}}</small>",
        source: {
            country: {
                data: countries
            },
            capital: {
                data: capitals
            }
        },
        callback: {
            onResult: function (node, query, result, resultCount) {
                if (query === "")  {
                    $('#result-container').html('');

                    return;
                }

                var text = "";
                if (result.length > 0 && result.length < resultCount) {
                    text = "Showing <strong>" + result.length + "</strong> of <strong>" + resultCount + '</strong> elements matching "' + query + '"';
                } else if (result.length > 0) {
                    text = 'Showing <strong>' + result.length + '</strong> elements matching "' + query + '"';
                } else {
                    text = 'No results matching "' + query + '"';
                }
                $('#result-container').html(text);
            },
            onMouseEnter: function (node, a, item, event) {
                if (item.group === "country") {
                    $(a).append('<span class="flag-chart flag-' + item.display.replace(' ', '-').toLowerCase() + '"></span>')
                }
            },
            onMouseLeave: function (node, a, item, event) {
                $(a).find('.flag-chart').remove();
            }
        }
    });

    var words = [
        "aberdeen-angus", "Abominablement", "abaca", "aberrance", "abominant", "abachi", "aberrant", "abomination", "aback",
        "aberration", "abomination de la désolation", "abacus", "aberration chromatique", "abominé", "abadir",
        "aberration chromosomique", "abominer", "abaissant", "aberration optique", "abondamment", "abaisse",
        "aberration sphérique", "abondance", "abaissé", "aberré", "abondance de biens ne nuit pas", "abaisse-langue",
        "abet", "abondant", "abaissement", "abêti", "abondé", "abaisser", "abêtir", "abondement", "abaisseur", "abêtissant",
        "abonder", "abajoue", "Abêtissement", "abonnant", "abalone", "abeyance", "abonné", "abalourdir", "abgal",
        "abonnement", "abamectine", "ab hoc", "abonner", "abandon", "abhor", "abonnir", "abandon de caddie", "abhorrant",
        "aboral", "abandon de créance", "abhorré", "abord", "abandon de poste", "abhorrence", "abordable", "abandonnant",
        "abhorrent", "abordage", "abandonné", "abhorrer", "abordant", "abandonner", "abide", "abordé", "abandonnique",
        "abiding", "aborder", "abaque", "abidjanais", "aborder un vaisseau ennemi", "abase", "abidjanaise", "abords",
        "abasie", "abies", "aborigène", "abasourdi", "abies alba", "aboriginal", "abasourdir", "abies fraseri", "aborigine",
        "abasourdissant", "abies numidica", "abornement", "abat", "abiétacée", "aborner", "abatage", "ability", "abort",
        "abâtardi", "abîmant", "abortif", "abâtardir", "abîme", "abortion", "abâtardissant", "abîmé", "abortive", "abate",
        "abimer", "abot", "abatellement", "abîmer", "abouchant", "abatement", "abouché", "abat-faim",
        "abiogenèse", "aboucher", "abatis", "abiose", "aboulant", "abat-jour", "abiotique", "aboulé", "abator", "ABIR",
        "abouler", "abats", "ab irato", "aboulie", "abat-son", "abject", "aboulique", "Abattable", "Abjectement", "abound",
        "abattage", "abjection", "about", "abattant", "abjurant", "aboutage", "abatte", "Abjuration", "aboutant",
        "abattement", "abjuratoire", "abouté", "abattement fiscal", "abjure", "aboutement", "Abatteur", "abjuré", "abouter",
        "abattis", "abjurer", "about-face", "abattoir", "abkhaze", "abouti", "abattre", "ablactation", "aboutir", "abattu",
        "ablatant", "aboutissant", "abattue", "ablaté", "aboutissants", "Abat-vent", "ablatif", "aboutissement", "abat-voix",
        "ablation", "above", "abave", "ablatir", "aboveboard", "abaxial", "ablative", "Above the line", "abbasside",
        "ablativo", "aboyant", "abbatial", "ablaze", "aboyé", "abbatiale", "able", "aboyer", "abbatiat", "ablégat",
        "aboyeur", "abbaye", "ablégation", "Abracadabra", "Abbaye de Westminster", "ableret", "abracadabrant", "abbé",
        "ablet", "abracadabresque", "abbess", "ablette", "abradant", "abbesse", "ablier", "abrasant", "abbevillien",
        "abloquant", "abrasé", "abbey", "abloqué", "abraser", "abbot", "abluant", "abrasif", "abbreviation", "abluer",
        "abrasimètre", "abc", "ablution", "abrasion", "abcès", "ablutions", "abrasive", "Abcès dentaire", "ablutophobie",
        "abréaction", "ABD", "ably", "abréagir", "abdicate", "abnegation", "abreast", "abdication", "abnégation", "abrégé",
        "abdiquant", "abnormal", "abrégeant", "abdiqué", "abnormality", "abrégement", "abdiquer", "abnormally", "abrègement",
        "abdomen", "aboard", "abrégément", "abdominal", "abode", "abréger", "abdominaux", "aboi", "abreuvage", "abduct",
        "aboiement", "abreuvant", "abducteur", "abois", "abreuvé", "abduction", "aboli", "Abreuvement", "abductor", "abolir",
        "abreuver", "abécédaire", "abolish", "abreuvoir", "abée", "abolissant", "abréviatif", "abeillage", "abolissement",
        "abréviation", "abeille", "abolition", "abréviativement", "abeille charpentière", "abolitionism", "abréviature",
        "abeiller", "abolitionist", "abrévié", "abeillère", "abolitionnisme", "abri", "abélien", "Abolitionniste", "abribus",
        "abelisaurus", "abomasum", "abricot", "aber", "abominable", "abricotant", "abricoté", "abricoter", "abricotier",
        "abricotier du japon", "abricot sec", "abrictosaurus", "abri de jardin", "abridge", "abrier", "abri météorologique",
        "abri-sous-roche", "abritant", "abrité", "abriter", "abrivent", "abroad", "abrogate", "abrogatif", "abrogation",
        "abrogé", "abrogeable", "abrogeant", "abroger", "abronia graminea", "abrosaurus", "abrouti", "abroutir", "abrupt",
        "abruptement", "abruptly", "abruti", "abrutir", "abrutissant", "abrutissement", "abrutisseur", "ABS", "ABSA",
        "abscess", "abscissa", "abscisse", "abscission", "abscond", "absconder", "absconding", "abscons", "absconse",
        "abseil", "abseiling", "absence", "absent", "absentant", "absenté", "absentee", "absenteeism", "absentéisme",
        "absentéiste", "absenter", "absentia", "absidal", "abside", "absidial", "absidiole", "absinth", "absinthe",
        "absinthé", "absolu", "absoluité", "absolument", "absolute", "absolutely", "absolutif", "absolution", "absolutism",
        "absolutisme", "absolutist", "absolutiste", "absolutoire", "absolvant", "absolve", "absorb", "absorbable",
        "absorbant", "absorbé", "absorbement", "absorbent", "absorber", "absorbeur", "Absorbeur de vapeurs d'essence",
        "absorptiométrie", "absorption", "absorption intestinale", "absorption racinaire", "absorptivité", "absoudre",
        "absous", "absoute", "abstain", "abstème", "abstemious", "abstenant", "abstention", "abstentionnisme",
        "abstentionniste", "abstenu", "abstergent", "absterger", "abstersif", "abstersion", "abstinence", "abstinent",
        "abstracteur", "abstractif", "abstraction", "abstractivement", "abstraire", "abstrait", "abstraitement",
        "abstrayant", "abstrus", "abstruse", "absurd", "absurde", "absurdement", "absurdité", "absurdity", "abundance",
        "abundant", "abundantly", "abus", "abusant", "abus de bien social", "abus de biens sociaux", "abus de confiance",
        "abus de droit", "abus de faiblesse", "abus de langage", "abus de majorité", "abus de minorité", "abuse", "abusé",
        "abuser", "abuser d'une personne", "abuseur", "abusif", "abusive", "abusivement", "abusus", "abut", "abuter",
        "abutilon", "abutment", "abyme", "abysmal", "abyss", "abyssal", "abysse", "abyssin", "Abyssinian", "abyssinien", "abyssinienne"
    ];

    $('#words').typeahead({
        minLength: 0,
        maxItem: 10,
        order: "asc",
        hint: true,
        accent: true,
        searchOnFocus: true,
        backdrop: {
            "background-color": "#transparent",
            "opacity": "0.1",
            "filter": "alpha(opacity=10)"
        },
        source: words
    });

    var categories = {
        drivers: [
            "Nicholas Townsend", "Ryan Evon", "Jerimiah Figueroa", "Sean Curtiss", "Erickson Ramos", "Rebecca Jaramillo",
        "Dasia Hawkins", "Devon Jones", "Corey Brown", "Christopher Bradford", "Sarah Vader", "Brandi Miller", "Nicholas Townsend", "Bangladesh",
        "Ryan Evon", "Jerimiah Figueroana", "Sean Curtiss", "Erickson Ramos", "Rebecca Jaramillo", "Dasia Hawkins", "Burkina Faso", "Burma"
        ],
        address: [
            "123 St Street 115", "423 Avenua district", "145 glendale Ca", "583 st 873 ca",  "123 St Street 115", "423 Avenua district", "145 glendale Ca", "583 st 873 ca",
            "123 St Street 115", "423 Avenua district", "145 glendale Ca", "583 st 873 ca", "123 St Street 115", "423 Avenua district", "145 glendale Ca", "583 st 873 ca"
        ],
        "routes": [
            "Route 1", "Route 2", "Route 3", "Route 4", "Route A",
            "Route New", "Route ABDdfghijklm"
        ],
        
    };

    $('#categories').typeahead({
        minLength: 1,
        maxItem: 15,
        order: "asc",
        hint: true,
        group: [true, "{{group}}"],
        maxItemPerGroup: 5,
        dropdownFilter: "all categories",
        emptyTemplate: 'No result for "{{query}}"',
        source: {
            drivers: {
                data: categories.drivers
            },
            address: {
                data: categories.address
            },
            "routes": {
                data: categories['routes']
            },
            
        }
    });

    $('#users').typeahead({
        minLength: 1,
        order: "asc",
        dynamic: true,
        delay: 500,
        template: function (query, item) {
            var color = "#777";
            if (item.status === "owner") {
                color = "#ff1493";
            }

            return '<span class="row">' +
                '<span class="avatar">' +
                '<img src="{{avatar}}" width="32" height="32">' +
                "</span>" +
                '<span class="username">{{username}} <small style="color: ' + color + ';">({{status}})</small></span>' +
                '<span class="id">({{id}})</span>' +
                "</span>"
        },
        source: {
            user: {
                display: "username",
                href: "https://www.github.com/{{username}}",
                data: [{
                    "id": 415849,
                    "username": "an inserted user that is not inside the database",
                    "avatar": "https://avatars3.githubusercontent.com/u/415849",
                    "status":  "contributor"
                }],
                url: [{
                    type: "GET",
                    url: "http://themesanytime.com/startui/data/typeahead/users.php",

                    data: {
                        q: "{{query}}"
                    },
                    callback: {
                        done: function (data) {
                            for (var i = 0; i < data.data.user.length; i++) {
                                if (data.data.user[i].username === 'running-coder') {
                                    data.data.user[i].status = 'owner';
                                } else {
                                    data.data.user[i].status = 'contributor';
                                }
                            }
                            return data;
                        }
                    }
                }, "data.user"]
            },
            project: {
                display: "project",
                href: function (item) {
                    return '/' + item.project.replace(/\s+/g, '').toLowerCase() + '/documentation/'
                },
                url: [{
                    type: "GET",
                    url: "http://themesanytime.com/startui/data/typeahead/users.php",
                    data: {
                        q: "{{query}}"
                    }
                }, "data.project"],
                template: '<span>' +
                '<span class="project-logo">' +
                '<img src="{{image}}" width="32" height="32">' +
                '</span>' +
                '<span class="project-information">' +
                '<span class="project">{{project}} <small>{{version}}</small></span>' +
                '<ul>' +
                '<li>{{demo}} Demos</li>' +
                '<li>{{option}}+ Options</li>' +
                '<li>{{callback}}+ Callbacks</li>' +
                '</ul>' +
                '</span>' +
                '</span>'
            }
        },
        callback: {
            onClick: function (node, a, item, event) {
                // You can do a simple window.location of the item.href
                //alert(JSON.stringify(item));
            },
            onSendRequest: function (node, query) {
                console.log('request is sent, perhaps add a loading animation?')
            },
            onReceiveRequest: function (node, query) {
                console.log('request is received, stop the loading animation?')
            }
        }
    });

    function formatRepo (repo) {
        if (repo.loading) return repo.text;

        var markup = "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__avatar'><img src='" + repo.owner.avatar_url + "' /></div>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" + repo.full_name + "</div>";

        if (repo.description) {
            markup += "<div class='select2-result-repository__description'>" + repo.description + "</div>";
        }

        markup += "<div class='select2-result-repository__statistics'>" +
            "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> " + repo.forks_count + " Forks</div>" +
            "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> " + repo.stargazers_count + " Stars</div>" +
            "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> " + repo.watchers_count + " Watchers</div>" +
            "</div>" +
            "</div></div>";

        return markup;
    }

    function formatRepoSelection (repo) {
        return repo.full_name || repo.text;
    }

    $("#js-data-example-ajax").select2({
        ajax: {
            url: "https://api.github.com/search/repositories",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                console.log(params);

                return {
                    q: params.term, // search term
                    page: params.page
                };
            },
            processResults: function (data, params) {
                // parse the results into the format expected by Select2
                // since we are using custom formatting functions we do not need to
                // alter the remote JSON data, except to indicate that infinite
                // scrolling can be used
                params.page = params.page || 1;

                return {
                    results: data.items,
                    pagination: {
                        more: (params.page * 30) < data.total_count
                    }
                };
            },
            cache: false
        },
        escapeMarkup: function (markup) { return markup; },
        minimumInputLength: 1,
        templateResult: formatRepo,
        templateSelection: formatRepoSelection
    });
});
