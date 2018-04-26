window.onload = function(){
    console.log('countries.js loaded');
    var mainWidth = $('main').width();
    
    var allCountryArray = JSON.parse(localStorage.getItem('countryArray'));
    var countryArray = [];
    console.log(allCountryArray);
    var metricsSort = 'most';
    var view = 'card';
    
    /// FILTER & SORT ///
    
    var filterCountries = function(){
        var filterContinent = $('select.continent').val();
        var filterRegion = $('select.region').val();
        var filterIncome = $('select.income').val();
        var filteredArray = countryArray.slice(); //create new filteredArray by duplicating countryArray
        
        if (filterContinent != null && filterContinent != 'all'){ //if filter is not null or all
            for (var i=filteredArray.length-1; i >= 0; i--){
                if (filteredArray[i].continent != filterContinent){
                    filteredArray.splice(i, 1);
                };
            };
        };
        
        if (filterRegion != null && filterRegion != 'all'){ //if filter is not null or all
            for (var i=filteredArray.length-1; i >= 0; i--){
                if (filteredArray[i].region != filterRegion){
                    filteredArray.splice(i, 1);
                };
            };
        };
        
        if (filterIncome != null && filterIncome != 'all'){ //if filter is not null or all
            for (var i=filteredArray.length-1; i >= 0; i--){
                if (filteredArray[i].income != filterIncome){
                    filteredArray.splice(i, 1);
                };
            };
        };
        
        sortArray(filteredArray);
    };
    
    var sortArray = function(filteredArray){
        if (metricsSort == 'least'){
            filteredArray.sort(function(a, b) {
                return a.domains.total_metric_count - b.domains.total_metric_count;
            });
        } else if (metricsSort == 'most'){
            filteredArray.sort(function(a, b) {
                return  b.domains.total_metric_count - a.domains.total_metric_count;
            });
        };
        
        if (view == 'card'){
            $('main section').html(''); //remove all exisiting cards
            updateCards(filteredArray);
        } else if (view == 'chart'){
            $('main section').html(''); //remove all exisiting cards
            makeChart(filteredArray);
        }
    };
    
        
    /// FILTER AND SORT MENU ///
    
    $('select').on('change', function(){
        filterCountries();
    });
    
    $('.most').on('click', function(){
        metricsSort = 'most';
        filterCountries();
        $('.least').removeClass('selected');
        $(this).addClass('selected');
    });
    
    $('.least').on('click', function(){
        metricsSort = 'least';
        filterCountries();
        $('.most').removeClass('selected');
        $(this).addClass('selected');
    });
    
    $('.card-view').on('click', function(){
        view = 'card';
        filterCountries();
        $('.bar-view').removeClass('selected');
        $(this).addClass('selected');
    });
    
    $('.bar-view').on('click', function(){
        view = 'chart';
        filterCountries();
        $('.card-view').removeClass('selected');
        $(this).addClass('selected');
    });
    
    /// CARDS ///
    
    var countryCard = function(country){
        var lastCard = '.country-card.last';
        $(lastCard).css('display','block');
        $(lastCard +' .income').text(country.income + ' Income');
        $(lastCard + ' .gdp').text('2.6 Trillion GDP');
        $(lastCard + ' .strategies').text(country.policies.length + ' Strategies');
        
        if (country.domains){ //if country has domains data
            $(lastCard + ' h1').html('<span class="flag-icon flag-icon-'+country.ISO_2+'"></span>' + country.name + " <span class='collection'>"+country.domains.total_metric_count+" metrics, 45 themes");
        
            var domainRange = d3.scaleLinear()
                .domain([1, 50])
                .range(['rgb(255,255,255)', 'rgb(255,245,150)']);
            
            $(lastCard + ' .demand').css('background', domainRange(country.domains.demand.metric_count));
            $(lastCard + ' .supply').css('background', domainRange(country.domains.supply.metric_count));
            $(lastCard + ' .health').css('background', domainRange(country.domains.health.metric_count));
            $(lastCard + ' .rights').css('background', domainRange(country.domains.rights.metric_count));
            $(lastCard + ' .peace').css('background', domainRange(country.domains.peace.metric_count));
            $(lastCard + ' .international').css('background', domainRange(country.domains.international.metric_count));
            $(lastCard + ' .development').css('background', domainRange(country.domains.development.metric_count));
            
            $(lastCard + ' .demand .domain-count').text(country.domains.demand.metric_count);
            $(lastCard + ' .supply .domain-count').text(country.domains.supply.metric_count);
            $(lastCard + ' .health .domain-count').text(country.domains.health.metric_count);
            $(lastCard + ' .rights .domain-count').text(country.domains.rights.metric_count);
            $(lastCard + ' .peace .domain-count').text(country.domains.peace.metric_count);
            $(lastCard + ' .international .domain-count').text(country.domains.international.metric_count);
            $(lastCard + ' .development .domain-count').text(country.domains.development.metric_count);
        } else {
            $(lastCard + ' h1').html('<span class="flag-icon flag-icon-'+country.ISO_2+'"></span>' + country.name);
            $(lastCard + ' .domain-cards').css({'display':'none'});
        };
        
        $(lastCard).attr('data-name', country.name);
    };
    
    var updateCards = function(filteredArray){
        $('main section').css('display', 'flex');
        for (var i=0; i < filteredArray.length; i++){
            $('main section').append("<div class='country-card last'><h1><span class='flag-icon'></span><span class='collection'>Collects data on 277 metrics across 45 themes</span></h1><div class='country-details'><div class='income'></div><div class='gdp'></div><div class='strategies'></div></div><div class='domain-cards'><div class='domain-card demand'><div class='domain-name'>Demand</div><div class='domain-count'></div></div><div class='domain-card supply'><div class='domain-name'>Supply</div><div class='domain-count'></div></div><div class='domain-card health'><div class='domain-name'>Health</div><div class='domain-count'></div></div><div class='domain-card rights'><div class='domain-name'>Human Rights</div><div class='domain-count'></div></div><div class='domain-card peace'><div class='domain-name'>Peace &amp; Security</div><div class='domain-count'></div></div><div class='domain-card international'><div class='domain-name'>International Cooperation</div><div class='domain-count'></div></div><div class='domain-card development'><div class='domain-name'>Development</div><div class='domain-count'></div></div></div></div>");

            countryCard(filteredArray[i]);
            $('.last').on('click',function(){
                var countryName = $(this).attr('data-name');
                for (var i=0; i < filteredArray.length; i++){
                    if (filteredArray[i].name == countryName){
                        localStorage.setItem('country', JSON.stringify(filteredArray[i]));
                        window.location = 'country-page.html';
                    };
                };
            }).removeClass('last');
        };
    };
    
    /// BAR CHART ///
    
    var makeChart = function(filteredArray){
        $('main section').css('display', 'block');        
        var barScaleWidth = mainWidth - (400);
        var barScale = d3.scaleLinear()
            .domain([0, d3.max(filteredArray, function(d){return d.domains.total_metric_count})])
            .range([0, barScaleWidth]);
        
        d3.select('main section')
            .selectAll('.country-bar')
            .data(filteredArray)
            .enter().append('div')
            .attr('class', 'country-bar');
        
        d3.selectAll('.country-bar')
            .append('p')
            .attr('class', 'country-name')
            .html(function(d){return '<span class="flag-icon flag-icon-'+d.ISO_2+'"></span>' + d.name});
            
        d3.selectAll('.country-bar')
            .append('div')
            .attr('class', 'country-chart')
            .style('width', function(d) { return barScale(d.domains.total_metric_count) + 'px'; })
            .on('mouseenter', function(d){
                $(this).addClass('chart-hover');
                
                var chart = d3.select(this);
                chart.append('div')
                    .attr('class', 'country-domain demand')
                    .style('width', function(d){return barScale(d.domains.demand.metric_count) + 'px'})
                    .on('mousemove', function(){
                        var mouseX = d3.event.pageX;
                        var mouseY = d3.event.pageY;
                        var metric = d.domains.demand.metric_count;
                        
                        d3.select('.tool-tip').style('display','inline-block')
                            .style('top', mouseY - 28 + 'px')
                            .style('left', mouseX + 'px')
                            .html(function(d){return '<span>Demand</span><span class="count">' + metric + '</span>'});
                    }).on('mouseleave', function(){
                        d3.select('.tool-tip').style('display','none')
                            .text('');
                    });
                
                chart.append('div')
                    .attr('class', 'country-domain development')
                    .style('width', function(d){return barScale(d.domains.development.metric_count) + 'px'})
                    .on('mousemove', function(){
                        var mouseX = d3.event.pageX;
                        var mouseY = d3.event.pageY;
                        var metric = d.domains.development.metric_count;
                        
                        d3.select('.tool-tip').style('display','inline-block')
                            .style('top', mouseY - 28 + 'px')
                            .style('left', mouseX + 'px')
                            .html(function(d){return '<span>Development</span><span class="count">' + metric + '</span>'});
                    }).on('mouseleave', function(){
                        d3.select('.tool-tip').style('display','none')
                            .text('');
                    });
            
                chart.append('div')
                    .attr('class', 'country-domain health')
                    .style('width', function(d){return barScale(d.domains.health.metric_count) + 'px'})
                    .on('mousemove', function(){
                        var mouseX = d3.event.pageX;
                        var mouseY = d3.event.pageY;
                        var metric = d.domains.health.metric_count;
                        
                        d3.select('.tool-tip').style('display','inline-block')
                            .style('top', mouseY - 28 + 'px')
                            .style('left', mouseX + 'px')
                            .html(function(d){return '<span>Health</span><span class="count">' + metric + '</span>'});
                    }).on('mouseleave', function(){
                        d3.select('.tool-tip').style('display','none')
                            .text('');
                    });
            
                chart.append('div')
                    .attr('class', 'country-domain international')
                    .style('width', function(d){return barScale(d.domains.international.metric_count) + 'px'})
                    .on('mousemove', function(d){
                        var mouseX = d3.event.pageX;
                        var mouseY = d3.event.pageY;
                        var metric = d.domains.international.metric_count;
                        
                        d3.select('.tool-tip').style('display','inline-block')
                            .style('top', mouseY - 28 + 'px')
                            .style('left', mouseX + 'px')
                            .html(function(d){return '<span>International Cooperation</span><span class="count">' + metric + '</span>'});
                    }).on('mouseleave', function(){
                        d3.select('.tool-tip').style('display','none')
                            .text('');
                    });
            
                chart.append('div')
                    .attr('class', 'country-domain peace')
                    .style('width', function(d){return barScale(d.domains.peace.metric_count) + 'px'})
                    .on('mousemove', function(){
                        var mouseX = d3.event.pageX;
                        var mouseY = d3.event.pageY;
                        var metric = d.domains.peace.metric_count;
                        
                        d3.select('.tool-tip').style('display','inline-block')
                            .style('top', mouseY - 28 + 'px')
                            .style('left', mouseX + 'px')
                            .html(function(d){return '<span>Peace & Security</span><span class="count">' + metric + '</span>'});
                    }).on('mouseleave', function(){
                        d3.select('.tool-tip').style('display','none')
                            .text('');
                    });
            
                chart.append('div')
                    .attr('class', 'country-domain rights')
                    .style('width', function(d){return barScale(d.domains.rights.metric_count) + 'px'})
                    .on('mousemove', function(){
                        var mouseX = d3.event.pageX;
                        var mouseY = d3.event.pageY;
                        var metric = d.domains.rights.metric_count;
                        
                        d3.select('.tool-tip').style('display','inline-block')
                            .style('top', mouseY - 28 + 'px')
                            .style('left', mouseX + 'px')
                            .html(function(d){return '<span>Human Rights</span><span class="count">' + metric + '</span>'});
                    }).on('mouseleave', function(){
                        d3.select('.tool-tip').style('display','none')
                            .text('');
                    });
            
                chart.append('div')
                    .attr('class', 'country-domain supply')
                    .style('width', function(d){return barScale(d.domains.supply.metric_count) + 'px'})
                    .on('mousemove', function(){
                        var mouseX = d3.event.pageX;
                        var mouseY = d3.event.pageY;
                        var metric = d.domains.supply.metric_count;
                        
                        d3.select('.tool-tip').style('display','inline-block')
                            .style('top', mouseY - 28 + 'px')
                            .style('left', mouseX + 'px')
                            .html(function(d){return '<span>Supply</span><span class="count">' + metric + '</span>'});
                    }).on('mouseleave', function(){
                        d3.select('.tool-tip').style('display','none')
                            .text('');
                    });
            
            }).on('mouseleave', function(d){
               /* d3.select(this)
                    .style('background', 'rgb(125,125,125)'); */
                d3.selectAll('.country-domain').remove();
                $(this).removeClass('chart-hover');
            });
        
        d3.selectAll('.country-bar')
            .append('p')
            .attr('class', 'country-metrics')
            .text(function(d) { return d.domains.total_metric_count + " metrics"; });
    };

    
    /// STARTING FUNCTIONS ///
    
    var startVisual = function(){
        for (var i=0; i < allCountryArray.length; i++){ //add all countries without domains
            if (allCountryArray[i].domains){
                countryArray.push(allCountryArray[i]);
            };
        };
        sortArray(countryArray);
        console.log(countryArray);
    };
    
    startVisual();
};