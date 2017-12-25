window.onload = function(){
    console.log('country-page.js loaded');
    
    var country = JSON.parse(localStorage.getItem('country'));
    console.log(country);
    
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
    
    var countryPolicies = function(country){
        clearCountry();
        
        $('nav .country').html('<span class="flag-icon flag-icon-'+country.ISO_2+'"></span> ' + country.name);
        $('.country-profile h1').html('<span class="flag-icon flag-icon-'+country.ISO_2+'"></span> ' + country.name);
        $('.country-profile .continent').text(country.continent);
        $('.country-profile .gdp').text('GDP: $'+country.GDP);
        $('.country-profile .income-group').text(country.income + ' Income');
        $('.strategies h2').html(country.policies.length+' National Drug Strategies')

        // loop through each policy of country
        $(country.policies).each(function(i){
            $('.strategies').append('<article class="last"></article>');
            var policy = country.policies[i];
            var article = $('.last'); //target last created article
            
            $(article).append('<p class="strategy-title">'+policy.NDS_Name+' <i class="fa fa-external-link" aria-hidden="true"></i></p>');
            
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
            $('#domains-summary .collects').html('<i class="fa fa-bar-chart" aria-hidden="true"></i> '+country.domains.total_metric_count+' metrics across 45 themes');
            $('#domains-summary .metrics').html('<li><a href="#demand"><span>Demand</span><span class="metrics-count">'+country.domains.demand.metric_count+'</span></a></li><li><a href="#supply"><span>Supply</span><span class="metrics-count">'+country.domains.supply.metric_count+'</span></a></li><li><a href="#health"><span>Health</span><span class="metrics-count">'+country.domains.health.metric_count+'</span></a></li><li><a href="#rights"><span>Human Rights</span><span class="metrics-count">'+country.domains.rights.metric_count+'</span></a></li><li><a href="#peace"><span>Peace & Security</span><span class="metrics-count">'+country.domains.peace.metric_count+'</span></a></li><li><a href="#international"><span>International Cooperation</span><span class="metrics-count">'+country.domains.international.metric_count+'</span></a></li><li><a href="#development"><span>Development</span><span class="metrics-count">'+country.domains.development.metric_count+'</span></a></li>');
            
            $('#health .collects').text(country.domains.health.metric_count+' metrics across '+country.domains.health.themes.length+' themes');
            $(country.domains.health.themes).each(function(){
                var theme = $(this)[0];
                $('#health .themes').append('<li class="theme last"></li>');
                var last = $('.last');
                
                if (theme.metrics.length > 0){ //if theme has metrics
                    $(last).append('<h4><i class="fa fa-check-circle yes" aria-hidden="true"></i> '+theme.theme+'</h4>');
                    $(last).append('<details><summary>'+theme.metrics.length+' metrics</summary><ol></ol></details>');
                    $(theme.metrics).each(function(){
                        $(last).find('ol').append('<li>'+$(this)[0]+'<small>'+$(this)[1]+'</small></li>');
                    });
                } else { //if theme does not have metrics
                    $(last).append('<h4><i class="fa fa-times-circle no" aria-hidden="true"></i> '+theme.theme+'</h4>');
                    $(last).append('<p class="grey">No metrics</p>');
                }
                
                $(last).removeClass('last');
            });
            
            $('#peace .collects').text(country.domains.peace.metric_count+' metrics across '+country.domains.peace.themes.length+' themes');
            $(country.domains.peace.themes).each(function(){
                var theme = $(this)[0];
                $('#peace .themes').append('<li class="theme last"></li>');
                var last = $('.last');
                
                if (theme.metrics.length > 0){ //if theme has metrics
                    $(last).append('<h4><i class="fa fa-check-circle yes" aria-hidden="true"></i> '+theme.theme+'</h4>');
                    $(last).append('<details><summary>'+theme.metrics.length+' metrics</summary><ol></ol></details>');
                    $(theme.metrics).each(function(){
                        $(last).find('ol').append('<li>'+$(this)[0]+'<small>'+$(this)[1]+'</small></li>');
                    });
                } else { //if theme does not have metrics
                    $(last).append('<h4><i class="fa fa-times-circle no" aria-hidden="true"></i> '+theme.theme+'</h4>');
                    $(last).append('<p class="grey">No metrics</p>');
                }
                
                $(last).removeClass('last');
            });
            
            $('#development .collects').text(country.domains.development.metric_count+' metrics across '+country.domains.development.themes.length+' themes');
            $(country.domains.development.themes).each(function(){
                var theme = $(this)[0];
                $('#development .themes').append('<li class="theme last"></li>');
                var last = $('.last');
                
                if (theme.metrics.length > 0){ //if theme has metrics
                    $(last).append('<h4><i class="fa fa-check-circle yes" aria-hidden="true"></i> '+theme.theme+'</h4>');
                    $(last).append('<details><summary>'+theme.metrics.length+' metrics</summary><ol></ol></details>');
                    $(theme.metrics).each(function(){
                        $(last).find('ol').append('<li>'+$(this)[0]+'<small>'+$(this)[1]+'</small></li>');
                    });
                } else { //if theme does not have metrics
                    $(last).append('<h4><i class="fa fa-times-circle no" aria-hidden="true"></i> '+theme.theme+'</h4>');
                    $(last).append('<p class="grey">No metrics</p>');
                }
                
                $(last).removeClass('last');
            });
            
            $('#rights .collects').text(country.domains.rights.metric_count+' metrics across '+country.domains.rights.themes.length+' themes');
            $(country.domains.rights.themes).each(function(){
                var theme = $(this)[0];
                $('#rights .themes').append('<li class="theme last"></li>');
                var last = $('.last');
                
                if (theme.metrics.length > 0){ //if theme has metrics
                    $(last).append('<h4><i class="fa fa-check-circle yes" aria-hidden="true"></i> '+theme.theme+'</h4>');
                    $(last).append('<details><summary>'+theme.metrics.length+' metrics</summary><ol></ol></details>');
                    $(theme.metrics).each(function(){
                        $(last).find('ol').append('<li>'+$(this)[0]+'<small>'+$(this)[1]+'</small></li>');
                    });
                } else { //if theme does not have metrics
                    $(last).append('<h4><i class="fa fa-times-circle no" aria-hidden="true"></i> '+theme.theme+'</h4>');
                    $(last).append('<p class="grey">No metrics</p>');
                }
                
                $(last).removeClass('last');
            });
            
            $('#demand .collects').text(country.domains.demand.metric_count+' metrics across '+country.domains.demand.themes.length+' themes');
            $(country.domains.demand.themes).each(function(){
                var theme = $(this)[0];
                $('#demand .themes').append('<li class="theme last"></li>');
                var last = $('.last');
                
                if (theme.metrics.length > 0){ //if theme has metrics
                    $(last).append('<h4><i class="fa fa-check-circle yes" aria-hidden="true"></i> '+theme.theme+'</h4>');
                    $(last).append('<details><summary>'+theme.metrics.length+' metrics</summary><ol></ol></details>');
                    $(theme.metrics).each(function(){
                        $(last).find('ol').append('<li>'+$(this)[0]+'<small>'+$(this)[1]+'</small></li>');
                    });
                } else { //if theme does not have metrics
                    $(last).append('<h4><i class="fa fa-times-circle no" aria-hidden="true"></i> '+theme.theme+'</h4>');
                    $(last).append('<p class="grey">No metrics</p>');
                }
                
                $(last).removeClass('last');
            });
            
            $('#supply .collects').text(country.domains.supply.metric_count+' metrics across '+country.domains.supply.themes.length+' themes');
            $(country.domains.supply.themes).each(function(){
                var theme = $(this)[0];
                $('#supply .themes').append('<li class="theme last"></li>');
                var last = $('.last');
                
                if (theme.metrics.length > 0){ //if theme has metrics
                    $(last).append('<h4><i class="fa fa-check-circle yes" aria-hidden="true"></i> '+theme.theme+'</h4>');
                    $(last).append('<details><summary>'+theme.metrics.length+' metrics</summary><ol></ol></details>');
                    $(theme.metrics).each(function(){
                        $(last).find('ol').append('<li>'+$(this)[0]+'<small>'+$(this)[1]+'</small></li>');
                    });
                } else { //if theme does not have metrics
                    $(last).append('<h4><i class="fa fa-times-circle no" aria-hidden="true"></i> '+theme.theme+'</h4>');
                    $(last).append('<p class="grey">No metrics</p>');
                }
                
                $(last).removeClass('last');
            });
            
            $('#international .collects').text(country.domains.international.metric_count+' metrics across '+country.domains.international.themes.length+' theme');
            $(country.domains.international.themes).each(function(){
                var theme = $(this)[0];
                $('#international .themes').append('<li class="theme last"></li>');
                var last = $('.last');
                
                if (theme.metrics.length > 0){ //if theme has metrics
                    $(last).append('<h4><i class="fa fa-check-circle yes" aria-hidden="true"></i> '+theme.theme+'</h4>');
                    $(last).append('<details><summary>'+theme.metrics.length+' metrics</summary><ol></ol></details>');
                    $(theme.metrics).each(function(){
                        $(last).find('ol').append('<li>'+$(this)[0]+'<small>'+$(this)[1]+'</small></li>');
                    });
                } else { //if theme does not have metrics
                    $(last).append('<h4><i class="fa fa-times-circle no" aria-hidden="true"></i> '+theme.theme+'</h4>');
                    $(last).append('<p class="grey">No metrics</p>');
                }
                
                $(last).removeClass('last');
            });
        };
    };
    
    countryPolicies(country);
    
    /// NAV ///
    
    $('.nav-countries').click(function(){
        localStorage.setItem('countryArray', JSON.stringify(countryArray));
        window.location = 'countries.html';
    });

    $('.nav-themes').click(function(){
        localStorage.setItem('countryArray', JSON.stringify(countryArray));
        window.location = 'themes.html';
    });
}