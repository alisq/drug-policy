window.onload = function() {
    console.log('script.js loaded');
    
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();    
    var countryArray;
    
    function getCountries(){
        return $.get('/countries');
    };

    $.when(getCountries()).done(function(data){
        countryArray = data;
        drawCountries();
    });
        
    var svgWidth = $('.map').width();
    var svgHeight = svgWidth/2;
    
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
                .attr("d", path);
            
            linkData();
        });
    };
    
    var linkData = function() {
        $(countryArray).each(function(i){
            var select = '.countries.' + $(this)[0].ISO;
            $(select).addClass('active')
                .attr('data-index', i)
                .on('click', function(){
                    var index = $(this).attr('data-index');
                    var country = countryArray[index];
                
                    localStorage.setItem('country', JSON.stringify(country));
                    window.location = 'country-page.html';
                }).mousemove(function(e){
                    var index = $(this).attr('data-index');
                    var country = countryArray[index];
                    
                    var mouseMargin = 4;
                    var top = e.pageY;
                    var left = e.pageX;
                    if (left > windowWidth - 410) {
                        $('.country-card').css({'position': 'absolute', 'top': top + mouseMargin + 'px', 'left':left - 410 - mouseMargin + 'px', 'display':'block'});
                    } else {
                        $('.country-card').css({'position': 'absolute', 'top': top + mouseMargin + 'px', 'left':left + mouseMargin + 'px', 'display':'block'});
                    };
                    
                    countryCard(country);
                }).mouseout(function(){
                    $('.country-card').css({'display':'none'});
                });
        });
    };
    
    var countryCard = function(country){
        $('.country-card h1').html('<span class="flag-icon flag-icon-'+country.ISO_2+'"></span>' + country.name);
        $('.country-card .income').text(country.income + ' Income');
        $('.country-card .gdp').text('$466.4B GDP');
        $('.country-card .strategies').text(country.policies.length + ' Strategies');
        
        if (country.domains){ //if country has domains data
            $('.country-card .collection').css({'display':'block'})
                .text('Collects data on '+country.domains.total_metric_count+' metrics across 45 themes');
            $('.country-card .domain-cards').css({'display':'flex'});
            
            var domainRange = d3.scaleLinear()
                .domain([1, 50])
                .range(['rgb(255,255,255)', 'rgb(255,245,150)']);
            
            $('.country-card .demand').css('background', domainRange(country.domains.demand.metric_count));
            $('.country-card .supply').css('background', domainRange(country.domains.supply.metric_count));
            $('.country-card .health').css('background', domainRange(country.domains.health.metric_count));
            $('.country-card .rights').css('background', domainRange(country.domains.rights.metric_count));
            $('.country-card .peace').css('background', domainRange(country.domains.peace.metric_count));
            $('.country-card .international').css('background', domainRange(country.domains.international.metric_count));
            $('.country-card .development').css('background', domainRange(country.domains.development.metric_count));
            
            $('.country-card .demand .domain-count').text(country.domains.demand.metric_count);
            $('.country-card .supply .domain-count').text(country.domains.supply.metric_count);
            $('.country-card .health .domain-count').text(country.domains.health.metric_count);
            $('.country-card .rights .domain-count').text(country.domains.rights.metric_count);
            $('.country-card .peace .domain-count').text(country.domains.peace.metric_count);
            $('.country-card .international .domain-count').text(country.domains.international.metric_count);
            $('.country-card .development .domain-count').text(country.domains.development.metric_count);
        } else {
            $('.country-card .collection').css({'display':'none'});
            $('.country-card .domain-cards').css({'display':'none'});
        }
    };
    
    $('.nav-countries').click(function(){
        window.location = 'countries.html';
    });

    $('.nav-themes').click(function(){
        window.location = 'themes.html';
    });

    $('.nav-analysis').click(function(){
        window.location = 'analysis.html';
    });
};