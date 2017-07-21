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
                    policy.Lead_Agency_Name = d['Lead Agency Name'];
                    policy.Lead_Agency_Type = d['Lead Agency Type'];
                    policy.Supporting_Agencies = d['Supporting Agencies'];
                    policy.Health_Priorities = d['Health Priorities'];
                    policy.Health_Metrics = d['Health Metrics'];
                    policy.Health_Rubric = d['Health Rubric'];
                    policy.Peace_Security_Priorities = d['Peace & Security Priorities'];
                    policy.Peace_Security_Metrics = d['Peace & Security Metrics'];
                    policy.Peace_Security_Rubric = d['Peace & Security Rubric'];
                    
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
                    policy.Lead_Agency_Name = d['Lead Agency Name'];
                    policy.Lead_Agency_Type = d['Lead Agency Type'];
                    policy.Supporting_Agencies = d['Supporting Agencies'];
                    policy.Health_Priorities = d['Health Priorities'];
                    policy.Health_Metrics = d['Health Metrics'];
                    policy.Health_Rubric = d['Health Rubric'];
                    policy.Peace_Security_Priorities = d['Peace & Security Priorities'];
                    policy.Peace_Security_Metrics = d['Peace & Security Metrics'];
                    policy.Peace_Security_Rubric = d['Peace & Security Rubric'];
                
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
                .attr("class", function(d) { return "countries " + d.id; })
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
                    var index = $(this).attr('data-index');
                    console.log(countryArray[index]);
                });
        });
    };
    
    getData();

    $('.income-button').click(function(){
        $(countryIndex).each(function(i){
            var select = '.countries.' + countryIndex[i];
            var income = countryArray[i].income;
            $(select).addClass(income);
        });
    });
    
};