window.onload = function() {
    console.log('working');
    
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    
    /// SETUP FUNCTIONS ///
    
    var countryArray = [];
    var countryIndex = [];
    
    var getData = function() {
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
                    
                    var policy = new Object;
                    policy.NDS_Name = d['NDS Name'];
                    policy.NDS_Year = d['NDS Year'];
                    policy.NDS_StartDate = d['NDS Start Date'];
                    policy.NDS_EndDate = d['NDS End Date'];
                    policy.NDS_Link = d['NDS Link'];
                    policy.Lead_Agency_Name = d['Lead Agency Name'].split(';');
                    policy.Lead_Agency_Type = d['Lead Agency Type'];
                    policy.Supporting_Agencies = d['Supporting Agencies'].split(';');
                    policy.Health_Priorities = d['Health Priorities'].split(';');
                    policy.Health_Metrics = d['Health Metrics'].split(';');
                    policy.Health_Rubric = d['Health Rubric'];
                    policy.Peace_Security_Priorities = d['Peace & Security Priorities'].split(';');
                    policy.Peace_Security_Metrics = d['Peace & Security Metrics'].split(';');
                    policy.Peace_Security_Rubric = d['Peace & Security Rubric'];
                    policy.Development_Priorities = d['Development Priorities'].split(';');
                    policy.Development_Metrics = d['Development Metrics'].split(';');
                    policy.Development_Rubric = d['Development Rubric'];
                    policy.Human_Rights_Priorities = d['Human Rights Priorities'].split(';');
                    policy.Human_Rights_Metrics = d['Human Rights Metrics'].split(';');
                    policy.Human_Rights_Rubric = d['Human Rights Rubric'];
                    policy.Demand_Reduction_Priorities = d['Demand Reduction Priorities'].split(';');
                    policy.Demand_Reduction_Metrics = d['Demand Reduction Metrics'].split(';');
                    policy.Demand_Reduction_Rubric = d['Demand Reduction Rubric'];
                    policy.Supply_Reduction_Priorities = d['Supply Reduction Priorities'].split(';');
                    policy.Supply_Reduction_Metrics = d['Supply Reduction Metrics'].split(';');
                    policy.Supply_Reduction_Rubric = d['Supply Reduction Rubric'];
                    policy.International_Cooperation_Priorities = d['International Cooperation Priorities'].split(';');
                    policy.International_Cooperation_Metrics = d['International Cooperation Metrics'].split(';');
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
                    
                    policies.push(policy);
                    
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
                
                    var policy = new Object;
                    policy.NDS_Name = d['NDS Name'];
                    policy.NDS_Year = d['NDS Year'];
                    policy.NDS_StartDate = d['NDS Start Date'];
                    policy.NDS_EndDate = d['NDS End Date'];
                    policy.NDS_Link = d['NDS Link'];
                    policy.Lead_Agency_Name = d['Lead Agency Name'].split(';');
                    policy.Lead_Agency_Type = d['Lead Agency Type'];
                    policy.Supporting_Agencies = d['Supporting Agencies'].split(';');
                    policy.Health_Priorities = d['Health Priorities'].split(';');
                    policy.Health_Metrics = d['Health Metrics'].split(';');
                    policy.Health_Rubric = d['Health Rubric'];
                    policy.Peace_Security_Priorities = d['Peace & Security Priorities'].split(';');
                    policy.Peace_Security_Metrics = d['Peace & Security Metrics'].split(';');
                    policy.Peace_Security_Rubric = d['Peace & Security Rubric'];
                    policy.Development_Priorities = d['Development Priorities'].split(';');
                    policy.Development_Metrics = d['Development Metrics'].split(';');
                    policy.Development_Rubric = d['Development Rubric'];
                    policy.Human_Rights_Priorities = d['Human Rights Priorities'].split(';');
                    policy.Human_Rights_Metrics = d['Human Rights Metrics'].split(';');
                    policy.Human_Rights_Rubric = d['Human Rights Rubric'];
                    policy.Demand_Reduction_Priorities = d['Demand Reduction Priorities'].split(';');
                    policy.Demand_Reduction_Metrics = d['Demand Reduction Metrics'].split(';');
                    policy.Demand_Reduction_Rubric = d['Demand Reduction Rubric'];
                    policy.Supply_Reduction_Priorities = d['Supply Reduction Priorities'].split(';');
                    policy.Supply_Reduction_Metrics = d['Supply Reduction Metrics'].split(';');
                    policy.Supply_Reduction_Rubric = d['Supply Reduction Rubric'];
                    policy.International_Cooperation_Priorities = d['International Cooperation Priorities'].split(';');
                    policy.International_Cooperation_Metrics = d['International Cooperation Metrics'].split(';');
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
                    
                    policies.push(policy);
                    country.policies = policies;
                };
            });
            
            // push last remaining country to array
            countryArray.push(country);
            countryIndex.push(country.ISO);
            
            drawCountries();
        });
    };
    
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
//                .on('mouseenter', function(d) {countryHover(d)})
//                .on('mouseout', countryHoverOut);
            
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
                    console.log(iso2);
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
                                $('.priorities-health').append('<li>'+item+'</li>');
                            };
                        });
                        $(policy.Peace_Security_Priorities).each(function(i){
                            var item = isData(policy.Peace_Security_Priorities[i]);
                            if (item != undefined){
                                $('.priorities-peace').append('<li>'+item+'</li>');
                            };
                        });
                        $(policy.Development_Priorities).each(function(i){
                            var item = isData(policy.Development_Priorities[i]);
                            if (item != undefined){
                                $('.priorities-development').append('<li>'+item+'</li>');
                            };
                        });
                        $(policy.Human_Rights_Priorities).each(function(i){
                            var item = isData(policy.Peace_Security_Priorities[i]);
                            if (item != undefined){
                                $('.priorities-rights').append('<li>'+item+'</li>');
                            };
                        });
                        $(policy.Demand_Reduction_Priorities).each(function(i){
                            var item = isData(policy.Demand_Reduction_Priorities[i]);
                            if (item != undefined){
                                $('.priorities-demand').append('<li>'+item+'</li>');
                            };
                        });
                        $(policy.Supply_Reduction_Priorities).each(function(i){
                            var item = isData(policy.Supply_Reduction_Priorities[i]);
                            if (item != undefined){
                                $('.priorities-supply').append('<li>'+item+'</li>');
                            };
                        });
                        $(policy.International_Cooperation_Priorities).each(function(i){
                            var item = isData(policy.International_Cooperation_Priorities[i]);
                            if (item != undefined){
                                $('.priorities-international').append('<li>'+item+'</li>');
                            };
                        });
                        
                        $(policy.Health_Metrics).each(function(i){
                            var item = isData(policy.Health_Metrics[i]);
                            if (item != undefined){
                                $('.metrics-health').append('<li>'+item+'</li>');
                            };
                        });
                        $(policy.Peace_Security_Metrics).each(function(i){
                            var item = isData(policy.Peace_Security_Metrics[i]);
                            if (item != undefined){
                                $('.metrics-peace').append('<li>'+item+'</li>');
                            };
                        });
                        $(policy.Development_Metrics).each(function(i){
                            var item = isData(policy.Development_Metrics[i]);
                            if (item != undefined){
                                $('.metrics-development').append('<li>'+item+'</li>');
                            };
                        });
                        $(policy.Human_Rights_Metrics).each(function(i){
                            var item = isData(policy.Human_Rights_Metrics[i]);
                            if (item != undefined){
                                $('.metrics-rights').append('<li>'+item+'</li>');
                            };
                        });
                        $(policy.Demand_Reduction_Metrics).each(function(i){
                            var item = isData(policy.Demand_Reduction_Metrics[i]);
                            if (item != undefined){
                                $('.metrics-demand').append('<li>'+item+'</li>');
                            };
                        });
                        $(policy.Supply_Reduction_Metrics).each(function(i){
                            var item = isData(policy.Demand_Reduction_Metrics[i]);
                            if (item != undefined){
                                $('.metrics-supply').append('<li>'+item+'</li>');
                            };
                        });
                        $(policy.International_Cooperation_Metrics).each(function(i){
                            var item = isData(policy.International_Cooperation_Metrics[i]);
                            if (item != undefined){
                                $('.metrics-international').append('<li>'+item+'</li>');
                            };
                        });
                    });
                });
        });
    };
    
    getData();
    
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
        if (string != 'n/a' && string != 'N/A' && string != undefined && string != ' ' && string != 'N'){
            if (string.length > 4){
                return string;
            };
        } else {
            return undefined;
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