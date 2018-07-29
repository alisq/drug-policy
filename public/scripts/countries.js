window.onload = function(){
    var allCountryArray;
    var countryArray = [];
    
    function getCountries(){
        return $.get('/countries');
    };

    $.when(getCountries()).done(function(data){
        allCountryArray = data;
        startVisual();
    });
    
    var mainWidth = $('main').width();
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
            console.log(filterRegion);
            for (var i=filteredArray.length-1; i >= 0; i--){
                if (filteredArray[i].region != filterRegion){
                    console.log(filteredArray[i]);
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
        
        if ($(this).hasClass('continent')){ // if continent, filter regions
            var selectContinent = $('select.continent').val();
            console.log(selectContinent);
            if (selectContinent == 'all') {
                $('select.region').html("<option selected disabled>Region</option> <option value='all'>All</option> <option>Northern Europe</option> <option>Western Europe</option> <option>Central Europe</option> <option>North America</option> <option>Latin America and Caribbean</option> <option>Eurasia</option> <option>South Asia</option> <option>Middle East</option> <option>Southeast Asia</option> <option>North Africa</option> <option>Central Africa</option> <option>West Africa</option> <option>East Africa</option> <option>Southern Africa</option>");
            } else if (selectContinent == 'Asia'){
                $('select.region').html("<option selected disabled>Region</option> <option value='all'>All</option> <option>Eurasia</option> <option>South Asia</option> <option>Middle East</option> <option>Southeast Asia</option>");
            } else if (selectContinent == 'Africa'){
                $('select.region').html("<option selected disabled>Region</option> <option value='all'>All</option> <option>North Africa</option> <option>Central Africa</option> <option>West Africa</option> <option>East Africa</option> <option>Southern Africa</option>");
            } else if (selectContinent == 'North America'){
                $('select.region').html("<option selected disabled>Region</option>");    
            } else if (selectContinent == 'South America'){
                $('select.region').html("<option selected disabled>Region</option>");
            } else if (selectContinent == 'Europe'){
                $('select.region').html("<option selected disabled>Region</option> <option value='all'>All</option> <option>Northern Europe</option> <option>Western Europe</option> <option>Central Europe</option>");
            } else if (selectContinent == 'Oceania'){
                $('select.region').html("<option selected disabled>Region</option>");
            }
        }
                
        filterCountries();
        customRoute($(this).attr("class")+"="+$(this).val().toLowerCase().replace(" ","-"));
    });
    
    $('.most').on('click', function(){
        metricsSort = 'most';
        filterCountries();
        $('.least').removeClass('selected');
        $(this).addClass('selected');
        customRoute("order=most");
    });
    
    $('.least').on('click', function(){
        metricsSort = 'least';
        filterCountries();
        $('.most').removeClass('selected');
        $(this).addClass('selected');
        customRoute("order=least");
    });
    
    $('.card-view').on('click', function(){    
        view = 'card';
        filterCountries();
        $('.bar-view').removeClass('selected');
        $(this).addClass('selected');
        customRoute("view=card");
    });
    
    $('.bar-view').on('click', function(){
        view = 'chart';
        filterCountries();
        $('.card-view').removeClass('selected');
        $(this).addClass('selected');
        customRoute("view=bar");
    });
    
    /// CARDS ///
    
    var countryCard = function(country){
        var lastCard = '.country-card.last';
        $(lastCard).css('display','block');
        $(lastCard +' .income').text(country.income + ' Income —');
        $(lastCard + ' .gdp').text('$' + country.GDPtext + ' GDP');
        
        if (country.domains){ //if country has domains data
            $(lastCard + ' h1').html('<span class="flag-icon flag-icon-'+country.ISO_2+'"></span>' + country.name + " <span class='collection'>"+country.domains.total_metric_count+" Indicators, "+country.policies.length+" Strategies");
        } else {
            $(lastCard + ' h1').html('<span class="flag-icon flag-icon-'+country.ISO_2+'"></span>' + country.name);
        };
        
        $(lastCard)
            .attr('data-name', country.name)
            .attr('data-ISO', country.ISO);
    };
    
    var updateCards = function(filteredArray){
        $('main section').css('display', 'flex');
        for (var i=0; i < filteredArray.length; i++){
            $('main section').append("<div class='country-card last'><h1><span class='flag-icon'></span><span class='collection'></span></h1><div class='country-details'><div class='income'></div><div class='gdp'></div><div class='strategies'></div></div></div>");
        
            countryCard(filteredArray[i]);
            $('.last').on('click',function(){
                var countryName = $(this).attr('data-name');
                localStorage.setItem('country', JSON.stringify(countryName));
                window.location = 'country-page.html?ISO='+$(this).attr('data-ISO');
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
            .attr('class', 'country-bar')
            .on('click', function(d){
                localStorage.setItem('country', JSON.stringify(d.name));
                window.location = 'country-page.html?ISO='+d.ISO;
            });
        
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
                d3.selectAll('.country-domain').remove();
                $(this).removeClass('chart-hover');
            });
        
        d3.selectAll('.country-bar')
            .append('p')
            .attr('class', 'country-metrics')
            .text(function(d) { return d.domains.total_metric_count + " indicators"; });
    };

    
    /// STARTING FUNCTIONS ///
    
    var startVisual = function(){
        for (var i=0; i < allCountryArray.length; i++){ //add all countries without domains
            if (allCountryArray[i].domains){
                countryArray.push(allCountryArray[i]);
            };
        };
        sortArray(countryArray);
    };
};



//CUSTOM URL PARAM FUNCTION FOR ROUTING BY ASQ
function customRoute(f){

    //empty array will contain all url param
    p = []

    //gets all current URL params
    $.each(getAllUrlParams(),function(index,value){
        p[index] = value
    });

    //this is the current param that should be added to the url, 
    param = f.split("=");   
    
    //place it into the all url params list
    p[param[0]] = param[1];

    //basic string variable to put at the end of the url
    var params = "";
    

    //loops through all the params and puts them into a string 
    for(var k in p) {
        
        if (p[k] != undefined) {
            params += (k+"="+p[k]+"&")
        }
        
    }

    //if there are params add "?" and remove superfluous "&" at the end.
    if (params != "") { 
        params = "?"+params;
        params = params.substring(0, params.length - 1);
    };

    //add to the end of the url
    history.pushState(null, null, params);


}


//THIS IS A FOUND JS URLPARAM FUNCTION
function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // in case params look like: list[]=thing1&list[]=thing2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function(v) {
                paramNum = v.slice(1, -1);
                return '';
            });

            // set parameter value (use 'true' if empty)
            var paramValue = typeof(a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            paramValue = paramValue.toLowerCase();

            // if parameter name already exists
            if (obj[paramName]) {
                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                // if no array index number specified...
                if (typeof paramNum === 'undefined') {
                    // put the value on the end of the array
                    obj[paramName].push(paramValue);
                }
                // if array index number specified...
                else {
                    // put the value at that index number
                    obj[paramName][paramNum] = paramValue;
                }
            }
            // if param name doesn't exist yet, set it
            else {
                obj[paramName] = paramValue;
            }
        }
    }

    return obj;
}