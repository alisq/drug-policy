window.onload = function(){
    console.log('themes.js loaded');
    
    var allCountryArray = JSON.parse(localStorage.getItem('countryArray'));
    var themeArray = [];
    
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
        
        console.log(themeArray);
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
            $('.themes').append('<div class="theme last"><p class="theme-title">'+this.theme+'</p><p class="theme-subtitle"></p><div class="country-flags"></div><details><summary>See Metrics</summary><div class="theme-metrics"></div></details></div>');
            
            $(this.countries).each(function(){
                $('.last .country-flags').append('<span class="flag-icon flag-icon-'+this.ISO_2+'"></span>');
                $('.last .theme-metrics').append('<div class="theme-country"><div class="theme-country-name"><span class="flag-icon flag-icon-'+this.ISO_2+'"></span>'+this.name+'</div><details><summary>'+this.metrics.length+' metrics</summary><ul class="last-ol"></ul></details></div>');
                
                $(this.metrics).each(function(){
                    $('.last-ol').append('<li>'+this[0]+'<small>'+this[1]+'</small></li>');
                });
                
                $('.last-ol').removeClass('last-ol');
            });
            
//            $('.last .metrics-button').on('click', function(){
//                $(this).siblings('.theme-metrics').css('display', 'block');
//            });
            
            $('.last .theme-subtitle').text(this.metric_count+' metrics collected by '+this.country_count+' countries');
            
            $('.last').removeClass('last');
        });
    };
    
    getThemes();
    
    /// FILTER AND SORT MENU ///
    
    $('.most-metrics').on('click', function(){
        metricsSort = 'most-metrics';
        sortArray(themeArray);
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
    });
    
    $('.least-metrics').on('click', function(){
        metricsSort = 'least-metrics';
        sortArray(themeArray);
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
    });
    
    $('.most-countries').on('click', function(){
        metricsSort = 'most-countries';
        sortArray(themeArray);
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
    });
    
    $('.least-countries').on('click', function(){
        metricsSort = 'least-countries';
        sortArray(themeArray);
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
    });
};