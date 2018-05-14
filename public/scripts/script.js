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
        console.log(countryArray);
        drawCountries();
    });
        
    var svgWidth = $('.map').width();
    var svgHeight = $('.map').height();
    
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
                    var country = countryArray[index].name;
                
                    localStorage.setItem('country', JSON.stringify(country));
                    window.location = 'country-page.html';
                }).mousemove(function(e){
                    var index = $(this).attr('data-index');
                    var country = countryArray[index];
                    $('#hero-text').addClass('min');
                    
                    var mouseMargin = 4;
                    var top = e.pageY;
                    var left = e.pageX;
                    if (left > windowWidth - 375) {
                        $('.country-card').css({'top': top + mouseMargin + 'px', 'left':left - 10 - 375 - mouseMargin + 'px'})
                            .addClass('show');
                    } else {
                        $('.country-card').css({'top': top + mouseMargin + 'px', 'left':left + 10 + mouseMargin + 'px'})
                            .addClass('show');
                    };
                    
                    countryCard(country);
                }).mouseout(function(){
                    $('.country-card').removeClass('show');
                });
        });
        createIntro();
    };
    
    var createIntro = function(){
        $('.review').html('Review detailed profiles<br>for '+countryArray.length+' countries');
        
        var randomArray = [];
        while (randomArray.length < 3){
            var randomNum = getRandom(0, countryArray.length);
            console.log(randomNum);
            if (randomArray.indexOf(randomNum) < 0){
                randomArray.push(randomNum);
            };
        };
    
        $(randomArray).each(function(){
            var randomCountry = countryArray[this];
            $('.countries-list').prepend('<div class="country-item last"><h1>'+randomCountry.name+' <span class="collection">'+randomCountry.domains.total_metric_count+' metrics, '+randomCountry.policies.length+' strategies</span></h1></div>');
            $('.country-item.last').on('click', function(){
                localStorage.setItem('country', JSON.stringify(randomCountry.name));
                window.location = 'country-page.html';
            }).removeClass('last');
        });
    };
    
    var countryCard = function(country){
        $('.country-card h1').html('<span class="flag-icon flag-icon-'+country.ISO_2+'"></span>' + country.name);
        $('.country-card .income').text(country.income + ' Income');
        $('.country-card .gdp').text('$' + country.GDPtext + ' GDP');
        
        if (country.domains){ //if country has domains data
            $('.country-card .collection').css({'display':'block'})
                .text('Collects data on '+country.domains.total_metric_count+' metrics across ' + country.policies.length + ' Drug Strategies');
        } else {
            $('.country-card .collection').css({'display':'none'});
        }
    };
    
    var getRandom = function(min, max){
        var random = Math.floor((Math.random() * max) + min);
        return random;
    }
    
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