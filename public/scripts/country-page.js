var headerHeight = 77;
var footerHeight = 164;

window.onload = function() {    
    var country;
    //var countryName = JSON.parse(localStorage.getItem('country'));
    var countryName = getAllUrlParams().ISO;

    //console.log(countryName);
    var countries;
    var descriptions;
    
    function getCountries() {
        return $.get('/countries');
    }

    $.when(getCountries()).done(function(data){
        countries = data;
        console.log(countries);
        for (var i=0; i < countries.length; i++){
            if (countries[i].ISO == countryName){
                country = countries[i];
                
                break;
            };
        };
        
        loadDescriptions();
        createContext();
    });
    
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
        if ($.isArray(string)){ //if item has page number
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
    
    var loadDescriptions = function(){
        d3.csv('data/theme_descriptions.csv', function(data){
            descriptions = data;
            countryPolicies(country);
        });
    };
    
    var getDescription = function(title){
        var description;
        $(descriptions).each(function(){
            if (this.Metric == title){
                description = this.Definition;
                return false;
            };
        });
        return description;
    };
    
    var countryPolicies = function(country){
        clearCountry();
        
        $('.small-header h1').html('<span class="flag-icon flag-icon-'+country.ISO_2.toLowerCase()+'"></span>' + country.name);
        $('nav .country').html('<span class="flag-icon flag-icon-'+country.ISO_2.toLowerCase()+'"></span> ' + country.name);
        $('.country-profile h1').html('<span class="flag-icon flag-icon-'+country.ISO_2.toLowerCase()+'"></span> ' + country.name);
        $('.country-profile .continent').text(country.continent);
        $('.country-profile .gdp .figure').text('$'+country.GDPtext);
        $('.country-profile .income-group .figure').text(country.income);
        $('.country-profile .unemployment .figure').text(country.unemployment + '%');
        $('.strategies h2').html(country.policies.length+' National Drug Strategies')

        // loop through each policy of country
        $(country.policies).each(function(i){
            $('.strategies').append('<article class="last"></article>');
            var policy = country.policies[i];
            var article = $('.last'); //target last created article
            
            $(article).append('<p class="strategy-title"><a href="http://google.com">'+policy.NDS_Name+'</a> <i class="fa fa-external-link" aria-hidden="true"></i></p>');
            
            if (policy.NDS_StartDate) { //if policy has start and end dates
                $(article).append('<p class="strategy-date">'+policy.NDS_StartDate+'—'+policy.NDS_EndDate+'</p>');
            } else { //else append policy year
                $(article).append('<p class="strategy-date">'+policy.NDS_Year+'</p>');
            }


            
            $(article).append('<p class="lead-agency"></p>');
            $(policy.Lead_Agency_Name).each(function(i){
                $(article).find('.lead-agency').append('<p>'+policy.Lead_Agency_Name[i]+'</p>');
            });
            
            $(article).append('<details><summary>Supporting Agencies</summary><ul class="supporting-agencies"></ul></details>');
            $(policy.Supporting_Agencies).each(function(i){
                $(article).find('.supporting-agencies').append('<li>'+policy.Supporting_Agencies[i]+'</li>');
            });
            
            $(article).append('<details><summary>Budget Information</summary><ul class="budget-information"></ul></details>');
            $(policy.Total_Budget).each(function(i){
                $(article).find('.budget-information').append('<li>'+policy.Total_Budget[i]+'</li>');
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
            
            $(article).removeClass('last');
        });
        
        if (country.domains){

            $('#domains-summary').css('display', 'block');
            $('#domains-summary .collects').html('<i class="fa fa-bar-chart" aria-hidden="true"></i> '+country.domains.total_metric_count+' indicators across 57 metrics');
            $('#domains-summary .metrics').html('<li><a href="#demand"><span>Demand Reduction</span><span class="metrics-count">'+country.domains.demand.metric_count+'</span></a></li><li><a href="#supply"><span>Supply Reduction</span><span class="metrics-count">'+country.domains.supply.metric_count+'</span></a></li><li><a href="#health"><span>Health</span><span class="metrics-count">'+country.domains.health.metric_count+'</span></a></li><li><a href="#rights"><span>Human Rights</span><span class="metrics-count">'+country.domains.rights.metric_count+'</span></a></li><li><a href="#peace"><span>Peace & Security</span><span class="metrics-count">'+country.domains.peace.metric_count+'</span></a></li><li><a href="#international"><span>International Cooperation</span><span class="metrics-count">'+country.domains.international.metric_count+'</span></a></li><li><a href="#development"><span>Development</span><span class="metrics-count">'+country.domains.development.metric_count+'</span></a></li>');
            
            $('#health .collects').text(country.domains.health.metric_count+' indicators across '+country.domains.health.themes.length+' metrics');
            $(country.domains.health.themes).each(function(){
                console.log($(this))
                var theme = $(this)[0];

                $('#health .themes').append('<li class="theme last"></li>');
                var last = $('.last'); 
                console.log(theme)
                if (theme.metrics.length > 0){ //if theme has metrics
                    $(last).append('<h4><i class="fa fa-check-circle yes" aria-hidden="true"></i>'+theme.theme+'</h4>');
                    $(last).append('<details><summary>'+theme.metrics.length+' indicators</summary><ol></ol></details>');
                    $(theme.metrics).each(function(){
                        

                        //ADD NDS link to each theme (this is a bit hacky)
                        for (i=0;i<country.policies.length;i++) {                            
                            if (country.policies[i].NDS_Name.substring(0, 25) == $(this)[1].substring(0,25)) {
                                $(last).find('ol').append('<li><a target="_blank" href="'+country.policies[i].NDS_Link+'">'+$(this)[0]+'<small>'+$(this)[1]+'</a></small></li>');
                            }
                        }

                        

                    });
                } else { //if theme does not have metrics
                    $(last).append('<h4><i class="fa fa-times-circle no" aria-hidden="true"></i>'+theme.theme+'</h4>');
                    $(last).append('<p class="grey">No indicators</p>');
                }
                
                
                $(last).on('mouseenter', function(){
                    $(this).addClass('active');
                    $('.bubble').addClass('inactive');
                    var descriptionDiv = $('.alternate-description');
                    $(descriptionDiv).css({'opacity':'1', 'pointer-events':'auto'});
                    
                    var metricTitle = $(this).children('h4').text();
                    var metricDescription = getDescription(metricTitle);
                    
                    $(descriptionDiv).children('header').text(metricTitle);
                    $(descriptionDiv).children('main').text(metricDescription);
                }).on('mouseleave', function(){
                    $(this).removeClass('active');
                    $('.bubble').removeClass('inactive');
                    $('.alternate-description').css({'opacity':'0', 'pointer-events':'none'});
                });
                
                $(last).removeClass('last');
            });
            
            $('#peace .collects').text(country.domains.peace.metric_count+' indicators across '+country.domains.peace.themes.length+' metrics');
            $(country.domains.peace.themes).each(function(){
                var theme = $(this)[0];
                $('#peace .themes').append('<li class="theme last"></li>');
                var last = $('.last');
                
                if (theme.metrics.length > 0){ //if theme has metrics
                    $(last).append('<h4><i class="fa fa-check-circle yes" aria-hidden="true"></i>'+theme.theme+'</h4>');
                    $(last).append('<details><summary>'+theme.metrics.length+' indicators</summary><ol></ol></details>');
                    $(theme.metrics).each(function(){
                        $(last).find('ol').append('<li>'+$(this)[0]+'<small>'+$(this)[1]+'</small></li>');
                    });
                } else { //if theme does not have metrics
                    $(last).append('<h4><i class="fa fa-times-circle no" aria-hidden="true"></i>'+theme.theme+'</h4>');
                    $(last).append('<p class="grey">No indicators</p>');
                }
                
                $(last).on('mouseenter', function(){
                    $(this).addClass('active');
                    $('.bubble').addClass('inactive');
                    var descriptionDiv = $('.alternate-description');
                    $(descriptionDiv).css({'opacity':'1', 'pointer-events':'auto'});
                    
                    var metricTitle = $(this).children('h4').text();
                    var metricDescription = getDescription(metricTitle);
                    
                    $(descriptionDiv).children('header').text(metricTitle);
                    $(descriptionDiv).children('main').text(metricDescription);
                }).on('mouseleave', function(){
                    $(this).removeClass('active');
                    $('.bubble').removeClass('inactive');
                    $('.alternate-description').css({'opacity':'0', 'pointer-events':'none'});
                });
                
                $(last).removeClass('last');
            });
            
            $('#development .collects').text(country.domains.development.metric_count+' indicators across '+country.domains.development.themes.length+' metrics');
            $(country.domains.development.themes).each(function(){
                var theme = $(this)[0];
                $('#development .themes').append('<li class="theme last"></li>');
                var last = $('.last');
                
                if (theme.metrics.length > 0){ //if theme has metrics
                    $(last).append('<h4><i class="fa fa-check-circle yes" aria-hidden="true"></i>'+theme.theme+'</h4>');
                    $(last).append('<details><summary>'+theme.metrics.length+' indicators</summary><ol></ol></details>');
                    $(theme.metrics).each(function(){
                        $(last).find('ol').append('<li>'+$(this)[0]+'<small>'+$(this)[1]+'</small></li>');
                    });
                } else { //if theme does not have metrics
                    $(last).append('<h4><i class="fa fa-times-circle no" aria-hidden="true"></i>'+theme.theme+'</h4>');
                    $(last).append('<p class="grey">No indicators</p>');
                }
                
                $(last).on('mouseenter', function(){
                    $(this).addClass('active');
                    $('.bubble').addClass('inactive');
                    var descriptionDiv = $('.alternate-description');
                    $(descriptionDiv).css({'opacity':'1', 'pointer-events':'auto'});
                    
                    var metricTitle = $(this).children('h4').text();
                    var metricDescription = getDescription(metricTitle);
                    
                    $(descriptionDiv).children('header').text(metricTitle);
                    $(descriptionDiv).children('main').text(metricDescription);
                }).on('mouseleave', function(){
                    $(this).removeClass('active');
                    $('.bubble').removeClass('inactive');
                    $('.alternate-description').css({'opacity':'0', 'pointer-events':'none'});
                });
                
                $(last).removeClass('last');
            });
            
            $('#rights .collects').text(country.domains.rights.metric_count+' indicators across '+country.domains.rights.themes.length+' metrics');
            $(country.domains.rights.themes).each(function(){
                var theme = $(this)[0];
                $('#rights .themes').append('<li class="theme last"></li>');
                var last = $('.last');
                
                if (theme.metrics.length > 0){ //if theme has metrics
                    $(last).append('<h4><i class="fa fa-check-circle yes" aria-hidden="true"></i>'+theme.theme+'</h4>');
                    $(last).append('<details><summary>'+theme.metrics.length+' indicators</summary><ol></ol></details>');
                    $(theme.metrics).each(function(){
                        $(last).find('ol').append('<li>'+$(this)[0]+'<small>'+$(this)[1]+'</small></li>');
                    });
                } else { //if theme does not have metrics
                    $(last).append('<h4><i class="fa fa-times-circle no" aria-hidden="true"></i>'+theme.theme+'</h4>');
                    $(last).append('<p class="grey">No indicators</p>');
                }
                
                $(last).on('mouseenter', function(){
                    $(this).addClass('active');
                    $('.bubble').addClass('inactive');
                    var descriptionDiv = $('.alternate-description');
                    $(descriptionDiv).css({'opacity':'1', 'pointer-events':'auto'});
                    
                    var metricTitle = $(this).children('h4').text();
                    var metricDescription = getDescription(metricTitle);
                    
                    $(descriptionDiv).children('header').text(metricTitle);
                    $(descriptionDiv).children('main').text(metricDescription);
                }).on('mouseleave', function(){
                    $(this).removeClass('active');
                    $('.bubble').removeClass('inactive');
                    $('.alternate-description').css({'opacity':'0', 'pointer-events':'none'});
                });
                
                $(last).removeClass('last');
            });
            
            $('#demand .collects').text(country.domains.demand.metric_count+' indicators across '+country.domains.demand.themes.length+' metrics');
            $(country.domains.demand.themes).each(function(){
                var theme = $(this)[0];
                $('#demand .themes').append('<li class="theme last"></li>');
                var last = $('.last');
                
                if (theme.metrics.length > 0){ //if theme has metrics
                    $(last).append('<h4><i class="fa fa-check-circle yes" aria-hidden="true"></i>'+theme.theme+'</h4>');
                    $(last).append('<details><summary>'+theme.metrics.length+' indicators</summary><ol></ol></details>');
                    $(theme.metrics).each(function(){
                        $(last).find('ol').append('<li>'+$(this)[0]+'<small>'+$(this)[1]+'</small></li>');
                    });
                } else { //if theme does not have metrics
                    $(last).append('<h4><i class="fa fa-times-circle no" aria-hidden="true"></i>'+theme.theme+'</h4>');
                    $(last).append('<p class="grey">No indicators</p>');
                }
                
                $(last).on('mouseenter', function(){
                    $(this).addClass('active');
                    $('.bubble').addClass('inactive');
                    var descriptionDiv = $('.alternate-description');
                    $(descriptionDiv).css({'opacity':'1', 'pointer-events':'auto'});
                    
                    var metricTitle = $(this).children('h4').text();
                    var metricDescription = getDescription(metricTitle);
                    
                    $(descriptionDiv).children('header').text(metricTitle);
                    $(descriptionDiv).children('main').text(metricDescription);
                }).on('mouseleave', function(){
                    $(this).removeClass('active');
                    $('.bubble').removeClass('inactive');
                    $('.alternate-description').css({'opacity':'0', 'pointer-events':'none'});
                });
                
                $(last).removeClass('last');
            });
            
            $('#supply .collects').text(country.domains.supply.metric_count+' indicators across '+country.domains.supply.themes.length+' metrics');
            $(country.domains.supply.themes).each(function(){
                var theme = $(this)[0];
                $('#supply .themes').append('<li class="theme last"></li>');
                var last = $('.last');
                
                if (theme.metrics.length > 0){ //if theme has metrics
                    $(last).append('<h4><i class="fa fa-check-circle yes" aria-hidden="true"></i>'+theme.theme+'</h4>');
                    $(last).append('<details><summary>'+theme.metrics.length+' indicators</summary><ol></ol></details>');
                    $(theme.metrics).each(function(){
                        $(last).find('ol').append('<li>'+$(this)[0]+'<small>'+$(this)[1]+'</small></li>');
                    });
                } else { //if theme does not have metrics
                    $(last).append('<h4><i class="fa fa-times-circle no" aria-hidden="true"></i>'+theme.theme+'</h4>');
                    $(last).append('<p class="grey">No indicators</p>');
                }
                
                $(last).on('mouseenter', function(){
                    $(this).addClass('active');
                    $('.bubble').addClass('inactive');
                    var descriptionDiv = $('.alternate-description');
                    $(descriptionDiv).css({'opacity':'1', 'pointer-events':'auto'});
                    
                    var metricTitle = $(this).children('h4').text();
                    var metricDescription = getDescription(metricTitle);
                    
                    $(descriptionDiv).children('header').text(metricTitle);
                    $(descriptionDiv).children('main').text(metricDescription);
                }).on('mouseleave', function(){
                    $(this).removeClass('active');
                    $('.bubble').removeClass('inactive');
                    $('.alternate-description').css({'opacity':'0', 'pointer-events':'none'});
                });
                
                $(last).removeClass('last');
            });
            
            $('#international .collects').text(country.domains.international.metric_count+' indicators across '+country.domains.international.themes.length+' metrics');
            $(country.domains.international.themes).each(function(){
                var theme = $(this)[0];
                $('#international .themes').append('<li class="theme last"></li>');
                var last = $('.last');
                
                if (theme.metrics.length > 0){ //if theme has metrics
                    $(last).append('<h4><i class="fa fa-check-circle yes" aria-hidden="true"></i>'+theme.theme+'</h4>');
                    $(last).append('<details><summary>'+theme.metrics.length+' indicators</summary><ol></ol></details>');
                    $(theme.metrics).each(function(){
                        $(last).find('ol').append('<li>'+$(this)[0]+'<small>'+$(this)[1]+'</small></li>');
                    });
                } else { //if theme does not have metrics
                    $(last).append('<h4><i class="fa fa-times-circle no" aria-hidden="true"></i>'+theme.theme+'</h4>');
                    $(last).append('<p class="grey">No indicators</p>');
                }
                
                $(last).on('mouseenter', function(){
                    $(this).addClass('active');
                    $('.bubble').addClass('inactive');
                    var descriptionDiv = $('.alternate-description');
                    $(descriptionDiv).css({'opacity':'1', 'pointer-events':'auto'});
                    
                    var metricTitle = $(this).children('h4').text();
                    var metricDescription = getDescription(metricTitle);
                    
                    $(descriptionDiv).children('header').text(metricTitle);
                    $(descriptionDiv).children('main').text(metricDescription);
                }).on('mouseleave', function(){
                    $(this).removeClass('active');
                    $('.bubble').removeClass('inactive');
                    $('.alternate-description').css({'opacity':'0', 'pointer-events':'none'});
                });
                
                $(last).removeClass('last');
            });
        };
    };
    
    var createContext = function(){
        comparableMetrics();
        sameRegion();
        sameIncome();
    };
    
    var comparableMetrics = function(){
        var countryMetrics = country.domains.total_metric_count;
        var comparableArray = [];
        $(countries).each(function(){
            if (this.domains){
                var upperRange = country.domains.total_metric_count - this.domains.total_metric_count;
                if (this.name != country.name && (upperRange <= 10 && upperRange >= -10)){
                    comparableArray.push(this);
                }
            }
        });
        
        comparableArray.sort(function(a, b) {
            return b.domains.total_metric_count - a.domains.total_metric_count;
        });
        
        if (comparableArray.length > 0){
            $('.comparable-metrics').css('display', 'block');
            $(comparableArray).each(function(){
                $('.comparable-metrics main').append('<p><a class="last"><span class="flag-icon flag-icon-'+this.ISO_2+'"></span><span class="country-name">'+this.name+'</span> — '+this.domains.total_metric_count+'</a></p>');
                var contextCountryName = this.name;
                var ISO = this.ISO;
                $('a.last').on('click', function(){
                    localStorage.setItem('country', JSON.stringify(contextCountryName));
                    window.location = 'country-page.html?ISO='+ISO;
                }).removeClass('last');
            });
        };
    }
    
    var sameRegion = function(){
        var countryRegion = country.region;
        var regionArray = [];
        var regionString = '';
        
        $(countries).each(function(){
            if (this.region){
                for (var i=0; i < countryRegion.length; i++){
                    if (this.name != country.name && this.region.indexOf(countryRegion[i]) > -1){
                        regionArray.push(this);
                    }
                }
            }
        });
        
        if (regionArray.length > 0){
            for (var i=0; i < countryRegion.length; i++){
                if (i < countryRegion.length - 1){
                    regionString += countryRegion[i] + ', ';
                } else {
                    regionString += countryRegion[i];
                }
            }
            
            $('.comparable-region').css('display', 'block');
            $('.comparable-region header').text('Other Countries in ' + regionString);
            $(regionArray).each(function(){
                $('.comparable-region main').append('<p><a class="last"><span class="flag-icon flag-icon-'+this.ISO_2+'"></span><span class="country-name">'+this.name+'</span></a></p>');
                var contextCountryName = this.name;
                var ISO = this.ISO;
                $('a.last').on('click', function(){
                    localStorage.setItem('country', JSON.stringify(contextCountryName));
                    window.location = 'country-page.html?ISO='+ISO;
                }).removeClass('last');
            });
        };
    }
    
    var sameIncome = function(){
        var countryIncome = country.income;
        var incomeArray = [];
        
        $(countries).each(function(){
            if (this.income){
                if (this.name != country.name && this.income == countryIncome){
                    incomeArray.push(this);
                }
            }
        });
        
        if (incomeArray.length > 0){
            $('.comparable-income').css('display', 'block');
            $('.comparable-income header').text('Other '+ countryIncome +' Income Countries');
            $(incomeArray).each(function(){
                $('.comparable-income main').append('<p><a class="last"><span class="flag-icon flag-icon-'+this.ISO_2+'"></span><span class="country-name">'+this.name+'</span></a></p>');
                var contextCountryName = this.name;
                var ISO = this.ISO;
                $('a.last').on('click', function(){
                    localStorage.setItem('country', JSON.stringify(contextCountryName));
                    window.location = 'country-page.html?ISO='+ISO;
                }).removeClass('last');
            });
        }
    }
}

window.onscroll = function(){
    var scrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();
    var documentHeight = $(document).height();
    var contextHeight = $('.country-in-context').height();
    
    if ((scrollTop > headerHeight) && (scrollTop < documentHeight - windowHeight - footerHeight)){
        $('.country-in-context').css({position: 'fixed', 'top': '0', 'height': windowHeight + 'px'});
        $('.alternate-description').css('top', '0');
    } else if (scrollTop <= headerHeight){
        var countryContextHeight = $('.country-in-context').outerHeight();
        $('.country-in-context').css({position: 'absolute', 'top': headerHeight + 'px', 'height': (windowHeight - (headerHeight - scrollTop)) + 'px'});
        $('.alternate-description').css('top', headerHeight + 'px');
    } else if (scrollTop >= documentHeight - windowHeight - footerHeight){
        $('.country-in-context').css({position: 'fixed', 'top': '0', 'height': windowHeight - (footerHeight - (documentHeight - (scrollTop + windowHeight))) + 'px'});
    }
    
    if (scrollTop > 149){
        $('.small-header').addClass('show');
    } else if (scrollTop <= 149){
        $('.small-header').removeClass('show');
    }

}





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

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName;
      if (typeof paramValue === 'string') paramValue = paramValue;

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}