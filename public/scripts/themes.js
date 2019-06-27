window.onload = function(){
    var allCountryArray
    var themeArray = [];
    var windowWidth = $(window).width();
    
    function getCountries(){
        return $.get('/countries');
    };

    $.when(getCountries()).done(function(data){
        allCountryArray = data;
        getThemes();
    });
    
    var metricsSort = 'most-metrics'
    
    var getThemes = function(){ //get the themes from first country in array
        for (var property in allCountryArray[1].domains){
            if (allCountryArray[1].domains.hasOwnProperty(property)){
                $(allCountryArray[1].domains[property].themes).each(function(){
                    var theme = new Object();
                    theme.theme = this.theme;
                    theme.domain = property;
                    themeArray.push(theme);
                });
            };
        };
        
        $(themeArray).each(function(){
            var theme = this.theme;
            var domain = this.domain;
            var countries = [];
            
            var metricCount = 0;
            var countryCount = 0;
            
            $(allCountryArray).each(function(i){
                if (this.domains){ //if country has domains
                    $(this.domains[domain].themes).each(function(){
                        if (this.theme == theme && this.metrics.length > 0){ //if country collects metrics on this theme
                            var country = new Object();
                            country.name = allCountryArray[i].name;
                            country.ISO = allCountryArray[i].ISO;
                            country.ISO_2 = allCountryArray[i].ISO_2;
                            country.metrics = this.metrics;
                            
                            countries.push(country);
                            countryCount++;
                            metricCount+= this.metrics.length;
                        };
                    });
                };
            });
            
            this.countries = countries;
            this.metric_count = metricCount;
            this.country_count = countryCount;
        });
        
        sortArray(themeArray);
    };
    
    var sortArray = function(array){
        if (metricsSort == 'least-metrics'){
            array.sort(function(a, b) {
                return a.metric_count - b.metric_count;
            });
        } else if (metricsSort == 'most-metrics'){
            array.sort(function(a, b) {
                return  b.metric_count - a.metric_count;
            });
        } else if (metricsSort == 'least-countries'){
            array.sort(function(a, b) {
                return a.country_count - b.country_count;
            });
        } else if (metricsSort == 'most-countries'){
            array.sort(function(a, b) {
                return  b.country_count - a.country_count;
            });
        }
        
        createThemes(array);
    };
    
    var createThemes = function(array){
        $('.theme').remove();
        
        $(array).each(function(){
            $('.themes').append('<div class="theme last"><p class="theme-title">'+this.theme+'</p><p class="theme-subtitle"></p><div class="country-flags"></div></div>');
            var theme = this.theme;
            $(this.countries).each(function(){
                $('.last .country-flags').append('<span data-name="'+this.name+'" data-theme="'+theme+'" data-iso="'+this.ISO+'" data-metrics="'+this.metrics.length+'" class="last flag-icon flag-icon-'+this.ISO_2.toLowerCase()+'"></span>');
                $('.last.flag-icon').on('mousemove', function(e){
                    var xPos = e.clientX;
                    var yPos = e.clientY;
                    var flagHoverWidth = $('.flag-hover').width();
                    var yScroll = $(window).scrollTop();
                    var country = $(this).attr('data-name');
                    var metrics = $(this).attr('data-metrics');
                    var theme = $(this).attr('data-theme').toLowerCase();
                    if (xPos + flagHoverWidth > windowWidth){
                        $('.flag-hover').css({'top':yPos + yScroll - 24 + 'px', 'left':xPos - flagHoverWidth - 10 + 'px', 'opacity':1});
                    } else {
                        $('.flag-hover').css({'top':yPos + yScroll - 24 + 'px', 'left':xPos + 10 + 'px', 'opacity':1});
                    }
                    $('.flag-hover h1').text(country);
                    $('.flag-hover .metrics').html('Collects <span class="metric-count">'+ metrics +'</span> indicators on ' + theme);
                }).on('mouseleave', function(){
                    $('.flag-hover').css('opacity',0);
                }).on('click', function(){
                    var country = $(this).attr('data-name');
                    
                    localStorage.setItem('country', JSON.stringify(country));
                    window.location = 'country-page.html?ISO='+$(this).data("iso");
                }).removeClass('last');
            });
            
            if (metricsSort == 'least-metrics' || metricsSort == 'most-metrics'){
                $('.last .theme-subtitle').html('<span class="highlight">'+this.metric_count+' Indicators</span> collected under this metric across '+this.country_count+' countries');
            } else if (metricsSort == 'least-countries' || metricsSort == 'most-countries'){
                $('.last .theme-subtitle').html('<span class="highlight">'+this.country_count+' Countries</span> collect a total of '+this.metric_count+' indicators under this metric');
            }
            $('.last.theme').removeClass('last');
        });
    };
    
    /// FILTER AND SORT MENU ///
    
    $('.most-metrics').on('click', function(){
        metricsSort = 'most-metrics';
        sortArray(themeArray);
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        customRoute("order=most");
    });
    
    $('.least-metrics').on('click', function(){
        metricsSort = 'least-metrics';
        sortArray(themeArray);
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        customRoute("order=least");
    });
    
    $('.most-countries').on('click', function(){
        metricsSort = 'most-countries';
        sortArray(themeArray);
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        customRoute("countries=most");
    });
    
    $('.least-countries').on('click', function(){
        metricsSort = 'least-countries';
        sortArray(themeArray);
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        customRoute("countries=least");
    });
    
    $('.tool-tip-icon').on('mouseenter', function(){
        var pos = this.getBoundingClientRect();
        var scrollTop = $(window).scrollTop();
        var toolTipWidth = $('.tool-tip').width();
        var leftPos = pos.x - 12;
        var topPos = 32 + pos.y + scrollTop;
        var tipText = $(this).attr('data-text');
        if (leftPos + toolTipWidth > windowWidth){
            $('.tool-tip').css({'top': topPos + 'px', 'left': leftPos - toolTipWidth + 20 + 'px', 'opacity':'1'})
                .addClass('left')
                .text(tipText)
        } else {
            $('.tool-tip').css({'top': topPos + 'px', 'left': leftPos + 'px', 'opacity':'1'})
                .addClass('right')
                .text(tipText);
        };
       
    }).on('mouseleave', function(){
        $('.tool-tip').css({'opacity':'0'}).removeClass('left right');
    });
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