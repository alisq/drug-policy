window.onload = function() {
    console.log('working');
    
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    
    /// SETUP FUNCTIONS ///
    
    var countryArray = [];
    var countryDomainArray = [];
    var countryIndex = [];
    
    var getPolicies = function() {
        d3.csv('data/nds_data_1.csv', function(data){
            
            var country;
            var policies;
            var currentCountry;
            var lastCountry;
            
            data.forEach(function(d, i){
                var currentCountry = d.Country;
                
                if (i > 0) {
                    var lastCountry = data[i-1].Country;
                };
                
                if (currentCountry === lastCountry) {
                    // if new policy is from same country as previous policy
                    var policy = newPolicy(d);
                    policies.push(policy);
                    country.policies = policies;
                    
                } else {
                    // last country is complete, push it to array;
                    if (i > 0) {
                        countryArray.push(country);
                        countryIndex.push(country.ISO);
                    };
                    
                    // create new country and policies;
                    country = new Object;
                    policies = [];
                    
                    country.name = d.Country;
                    country.continent = d.Continent;
                    country.ISO = d.ISO;
                    country.class = d.Classification;
                    country.GDP = d.GDP;
                    country.income = d['World Bank Income Group'];
                
                    var policy = newPolicy(d);
                    policies.push(policy);
                    country.policies = policies;
                };
            });
            
            // push last remaining country to array
            countryArray.push(country);
            countryIndex.push(country.ISO);
            
            getThemes();
        });
    };
    
    getPolicies();
    
    var getThemes = function(){
        d3.csv('data/nds_themes.csv', function(data){
            var country;
            var domains;
            var currentCountry;
            var lastCountry;
            
            data.forEach(function(d, i){
                var currentCountry = d.Country;
                
                if (i > 0) {
                    var lastCountry = data[i-1].Country;
                };
                
                if (currentCountry === lastCountry) {
                    // if new policy is from same country as previous policy
                    if (d.Domain == 'Health'){
                        domains.health.push(newTheme(d));
                    } else if (d.Domain == 'Peace and Security'){
                        domains.peace.push(newTheme(d));
                    } else if (d.Domain == 'Development'){
                        domains.development.push(newTheme(d));
                    } else if (d.Domain == 'Human Rights'){
                        domains.rights.push(newTheme(d));
                    } else if (d.Domain == 'Demand'){
                        domains.demand.push(newTheme(d));        
                    } else if (d.Domain == 'Supply'){
                        domains.supply.push(newTheme(d));
                    } else if (d.Domain == 'International Cooperation'){
                        domains.international.push(newTheme(d));
                    };
                    
                    country.domains = domains
                    
                } else {
                    // last country is complete, push it to array;
                    if (i > 0) {
                        countryDomainArray.push(country);
                    };
                    
                    // create new country and policies;
                    country = new Object;
                    domains = new Object;
                    
                    domains.health = [];
                    domains.peace = [];
                    domains.development = [];
                    domains.rights = [];
                    domains.demand = [];
                    domains.supply = [];
                    domains.international = [];
                    
                    country.name = d.Country;
                    country.ISO = d.ISO;
                    
                    if (d.Domain == 'Health'){
                        domains.health.push(newTheme(d));
                    } else if (d.Domain == 'Peace and Security'){
                        domains.peace.push(newTheme(d));
                    } else if (d.Domain == 'Development'){
                        domains.development.push(newTheme(d));
                    } else if (d.Domain == 'Human Rights'){
                        domains.rights.push(newTheme(d));
                    } else if (d.Domain == 'Demand'){
                        domains.demand.push(newTheme(d));        
                    } else if (d.Domain == 'Supply'){
                        domains.supply.push(newTheme(d));
                    } else if (d.Domain == 'International Cooperation'){
                        domains.international.push(newTheme(d));
                    };
                    
                    country.domains = domains;
                };
            });
            
            // push last remaining country to array
            countryDomainArray.push(country);
            joinData();
        });
    };
    
    var newTheme = function(d){
        var theme = new Object;
        theme.theme = d.Theme;
        theme.metrics = d.Metrics;
        theme.priorities = d.Priorities;
        
        theme.metrics = theme.metrics.split('~'); // split by metric delimiter
        theme.metrics.pop(); // last item is a blank space, remove
        
        $(theme.metrics).each(function(i){
            theme.metrics[i] = theme.metrics[i].split('{');
            if (theme.metrics[i].length == 2) { //if priorty includes page number
                theme.metrics[i][1] = theme.metrics[i][1].substring(0, theme.metrics[i][1].length - 2);
            } else {
                console.log("Formatting Issue");
                console.log(theme.metrics[i]);
            };
        });
        
        theme.priorities = theme.priorities.split('~'); // split by metric delimiter
        theme.priorities.pop(); // last item is a blank space, remove
        
        $(theme.priorities).each(function(i){
            theme.priorities[i] = theme.priorities[i].split('{');
            if (theme.priorities[i].length == 2) { //if priorty includes page number
                theme.priorities[i][1] = theme.priorities[i][1].substring(0, theme.priorities[i][1].length - 2);
            } else {
                console.log("Formatting Issue");
                console.log(theme.priorities[i]);
            };
        });
        
        return theme;
    }
    
    var newPolicy = function(d){
        var policy = new Object;
        policy.NDS_Name = d['NDS Name'];
        policy.NDS_Year = d['NDS Year'];
        policy.NDS_StartDate = d['NDS Start Date'];
        policy.NDS_EndDate = d['NDS End Date'];
        policy.NDS_Link = d['NDS Link'];
        policy.Lead_Agency_Name = d['Lead Agency Name'].split(';');
        policy.Lead_Agency_Type = d['Lead Agency Type'];
        policy.Supporting_Agencies = d['Supporting Agencies'].split(';');
        policy.Health_Priorities = cleanData(d['Health Priorities']);
        policy.Health_Metrics = cleanData(d['Health Metrics']);
        policy.Health_Rubric = cleanData(d['Health Rubric']);
        policy.Peace_Security_Priorities = cleanData(d['Peace & Security Priorities']);
        policy.Peace_Security_Metrics = cleanData(d['Peace & Security Metrics']);
        policy.Peace_Security_Rubric = d['Peace & Security Rubric'];
        policy.Development_Priorities = cleanData(d['Development Priorities']);
        policy.Development_Metrics = cleanData(d['Development Metrics']);
        policy.Development_Rubric = d['Development Rubric'];
        policy.Human_Rights_Priorities = cleanData(d['Human Rights Priorities']);
        policy.Human_Rights_Metrics = cleanData(d['Human Rights Metrics']);
        policy.Human_Rights_Rubric = d['Human Rights Rubric'];
        policy.Demand_Reduction_Priorities = cleanData(d['Demand Reduction Priorities']);
        policy.Demand_Reduction_Metrics = cleanData(d['Demand Reduction Metrics']);
        policy.Demand_Reduction_Rubric = d['Demand Reduction Rubric'];
        policy.Supply_Reduction_Priorities = cleanData(d['Supply Reduction Priorities']);
        policy.Supply_Reduction_Metrics = cleanData(d['Supply Reduction Metrics']);
        policy.Supply_Reduction_Rubric = d['Supply Reduction Rubric'];
        policy.International_Cooperation_Priorities = cleanData(d['International Cooperation Priorities']);
        policy.International_Cooperation_Metrics = cleanData(d['International Cooperation Metrics']);
        policy.International_Cooperation_Rubric = d['International Cooperation Rubric'];
        policy.Process_Indicators = d['Process Indicators'];
        policy.Priorities_Summary = d['Priorities Summary'];
        policy.Process_Indicators_Summary = d['Process Indicators Summary'];
        policy.Metrics_Summary = d['Metrics Summary'];
        policy.Number_of_Metrics = d['Number of Metrics'];
        policy.Total_Budget = d['Total Budget'].split(';');
        policy.Evaluation_Budget = d['Evaluation Budget'].split(';');
        policy.Relevant_Text = d['Relevant Text on Guidelines for Evaluation / Metrics / Indicators / Operationalization (Copy and Paste Text)'];
        policy.Relevant_Documents = d['Relevant Government documents outlining national drug policy '];
        policy.Additional_Notes = d['Additional Notes'];
        
        return policy;
    };
    
    var cleanData = function(data){
        data = data.split('~'); //split block of text by ~
        
        $(data).each(function(i){
            data[i] = data[i].split('{'); //split string at { to seperate page numbers
            if (data[i].length > 1){ // if line has page number
                data[i][1] = data[i][1].replace('}','');
            };
        });
        
        return data;
    };
    
    // JOIN DATA //
    
    var joinData = function(){
        $(countryDomainArray).each(function(i){
            var ISO = countryDomainArray[i].ISO;
            $(countryArray).each(function(k){
                if (ISO == countryArray[k].ISO) {
                    countryArray[k].domains = countryDomainArray[i].domains;
                };
            });
        });
        
        drawCountries();
    };
    
    /// DRAWING AND DATA APPENDING FUNCTIONS ///
    
    var svgWidth = windowWidth;
    var svgHeight = windowHeight;
    
    var countries;
    var projection;
    var path;
    
    var svg = d3.select('.map').append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);
    
    var drawCountries = function() {
        d3.json('maps/countries.json', function(error, response) {
            if (error) return console.error(error);
            
            countries = topojson.feature(response, response.objects.countries);

            projection = d3.geoWinkel3()
                .fitSize([svgWidth, svgHeight], countries);
            
            path = d3.geoPath()
                .projection(projection);

            svg.selectAll(".countries")
                .data(countries.features)
                .enter().append("path")
                .attr("class", function(d) {return "countries " + d.id;})
                .attr('data-iso-a2', function(d) {return d.properties.iso_a2;})
                .attr("d", path);
            
            linkData();
        });
    };
    
    var linkData = function() {
        $(countryIndex).each(function(i){
            var select = '.countries.' + countryIndex[i];
            $(select).addClass('active')
                .attr('data-index', i)
                .on('click', function(){
                    clearCountry();
                    var index = $(this).attr('data-index');
                    var country = countryArray[index];
                    var iso2 = $(this).attr('data-iso-a2').toLowerCase();
                    console.log(country);
                
                    $('h1').html('<span class="flag-icon flag-icon-'+iso2+'"></span>' + country.name);
                
                    // loop through each policy of country
                    $(country.policies).each(function(i){
                        var policy = country.policies[i];
                        
                        $(policy.Lead_Agency_Name).each(function(i){
                            $('.lead-agencies').append('<p>'+policy.Lead_Agency_Name[i]+'</p>');
                        });
                        $(policy.Supporting_Agencies).each(function(i){
                            $('.supporting-agencies').append('<p>'+policy.Supporting_Agencies[i]+'</p>');
                        });
                        $(policy.Total_Budget).each(function(i){
                            $('.total-budget').append('<p>'+policy.Total_Budget[i]+'</p>');
                        });
                        
                        $(policy.Health_Priorities).each(function(i){
                            var item = isData(policy.Health_Priorities[i]);
                            if (item != undefined){
                                $('.priorities-health').append(item);
                            };
                        });
                        $(policy.Peace_Security_Priorities).each(function(i){
                            var item = isData(policy.Peace_Security_Priorities[i]);
                            if (item != undefined){
                                $('.priorities-peace').append(item);
                            };
                        });
                        $(policy.Development_Priorities).each(function(i){
                            var item = isData(policy.Development_Priorities[i]);
                            if (item != undefined){
                                $('.priorities-development').append(item);
                            };
                        });
                        $(policy.Human_Rights_Priorities).each(function(i){
                            var item = isData(policy.Peace_Security_Priorities[i]);
                            if (item != undefined){
                                $('.priorities-rights').append(item);
                            };
                        });
                        $(policy.Demand_Reduction_Priorities).each(function(i){
                            var item = isData(policy.Demand_Reduction_Priorities[i]);
                            if (item != undefined){
                                $('.priorities-demand').append(item);
                            };
                        });
                        $(policy.Supply_Reduction_Priorities).each(function(i){
                            var item = isData(policy.Supply_Reduction_Priorities[i]);
                            if (item != undefined){
                                $('.priorities-supply').append(item);
                            };
                        });
                        $(policy.International_Cooperation_Priorities).each(function(i){
                            var item = isData(policy.International_Cooperation_Priorities[i]);
                            if (item != undefined){
                                $('.priorities-international').append(item);
                            };
                        });
                        
                        $(policy.Health_Metrics).each(function(i){
                            var item = isData(policy.Health_Metrics[i]);
                            if (item != undefined){
                                $('.metrics-health').append(item);
                            };
                        });
                        $(policy.Peace_Security_Metrics).each(function(i){
                            var item = isData(policy.Peace_Security_Metrics[i]);
                            if (item != undefined){
                                $('.metrics-peace').append(item);
                            };
                        });
                        $(policy.Development_Metrics).each(function(i){
                            var item = isData(policy.Development_Metrics[i]);
                            if (item != undefined){
                                $('.metrics-development').append(item);
                            };
                        });
                        $(policy.Human_Rights_Metrics).each(function(i){
                            var item = isData(policy.Human_Rights_Metrics[i]);
                            if (item != undefined){
                                $('.metrics-rights').append(item);
                            };
                        });
                        $(policy.Demand_Reduction_Metrics).each(function(i){
                            var item = isData(policy.Demand_Reduction_Metrics[i]);
                            if (item != undefined){
                                $('.metrics-demand').append(item);
                            };
                        });
                        $(policy.Supply_Reduction_Metrics).each(function(i){
                            var item = isData(policy.Supply_Reduction_Metrics[i]);
                            if (item != undefined){
                                $('.metrics-supply').append(item);
                            };
                        });
                        $(policy.International_Cooperation_Metrics).each(function(i){
                            var item = isData(policy.International_Cooperation_Metrics[i]);
                            if (item != undefined){
                                $('.metrics-international').append(item);
                            };
                        });
                    });
                });
        });
    };
    
    var clearCountry = function(){
        $('.lead-agencies p').remove();
        $('.supporting-agencies p').remove();
        $('.total-budget p').remove();
        
        $('.priorities-health li').remove();
        $('.priorities-peace li').remove();
        $('.priorities-development li').remove();
        $('.priorities-rights li').remove();
        $('.priorities-demand li').remove();
        $('.priorities-supply li').remove();
        $('.priorities-international li').remove();
        
        $('.metrics-health li').remove();
        $('.metrics-peace li').remove();
        $('.metrics-development li').remove();
        $('.metrics-rights li').remove();
        $('.metrics-demand li').remove();
        $('.metrics-supply li').remove();
        $('.metrics-international li').remove();
    };
    
    var isData = function(string){
        if ($.isArray(string)){
            if (string[0] != 'n/a' && string[0] != 'N/A' && string[0] != undefined && string[0] != ' ' && string[0] != 'N'){
                if (string[0].length > 4){
                    string = '<li>'+string[0]+'<span class="page-num">'+string[1]+'</span></li>';
                    return string;
                };
            } else {
                return undefined;
            };
        } else {
            if (string != 'n/a' && string != 'N/A' && string != undefined && string != ' ' && string != 'N'){
                if (string.length > 4){
                    string = '<li>'+string+'</li>';
                    return string;
                };
            } else {
                return undefined;
            };
        };
    };

    $('.income-button').click(function(){
        $(countryIndex).each(function(i){
            var select = '.countries.' + countryIndex[i];
            var income = countryArray[i].income;
            $(select).addClass(income);
        });
    });
    
};