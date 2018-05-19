console.log('Updating Drug Policies');

var countryArray = [];
var countryDomainArray = [];

var getPolicies = function() {
    d3.csv('data/nds_policies.csv', function(data){

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
                // if new policy is from same country as previous policy
                var policy = newPolicy(d);
                policies.push(policy);
                country.policies = policies;

            } else {
                // last country is complete, push it to array;
                if (i > 0) {
                    countryArray.push(country);
                };

                // create new country and policies;
                country = new Object;
                policies = [];

                country.name = d['Country'];
                country.longName = d['Long Name'];
                country.continent = d.Continent;
                country.region = d.Region;
                country.ISO = d.ISO;
                country.ISO_2 = d['ISO 2'];
                country.unemployment = d['Unemployment Rate (%  - World Bank)']
                country.GDP = d['GDP (World Bank)'];
                country.income = d['Income Group (World Bank)'];

                country.unemployment = country.unemployment.substring(0, country.unemployment.length - 1);

                country.GDP = country.GDP.replace(/,/g , "");
                country.GDP = country.GDP.split(' USD');
                country.GDP = Number(country.GDP[0]);
                
                country.GDPtext = GDPparse(country.GDP);

                var policy = newPolicy(d);
                policies.push(policy);
                country.policies = policies;
            };
        });

        // push last remaining country to array
        countryArray.push(country);
        console.log("All Policies Loaded");
        getThemes();
    });
};

var GDPparse = function(labelValue){
    // Twelve Zeroes for Trillions
    return Math.abs(Number(labelValue)) >= 1.0e+12
    ? (Math.abs(Number(labelValue)) / 1.0e+12).toFixed(2) + " Trillion"

    // Nine Zeroes for Billions
    : Math.abs(Number(labelValue)) >= 1.0e+9
    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + " Billion"
   
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6
    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + " Million"
    
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3
    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + " Thousand"

    : Math.abs(Number(labelValue));
}

var getThemes = function(){
    d3.csv('data/nds_themes.csv', function(data){
        var country;
        var domains;
        var currentCountry;
        var lastCountry;

        data.forEach(function(d, i){
            var currentCountry = d.Country;

            if (i > 0) {
                var lastCountry = data[i-1].Country;
            };

            if (currentCountry === lastCountry) {
                // if new policy is from same country as previous policy
                if (d.Domain == 'Health'){
                    var theme = newTheme(d);
                    domains.health.themes.push(theme);
                    domains.health.metric_count = domains.health.metric_count + theme.metrics.length;
                } else if (d.Domain == 'Peace and Security'){
                    var theme = newTheme(d);
                    domains.peace.themes.push(theme);
                    domains.peace.metric_count = domains.peace.metric_count + theme.metrics.length;
                } else if (d.Domain == 'Development'){
                    var theme = newTheme(d);
                    domains.development.themes.push(theme);
                    domains.development.metric_count = domains.development.metric_count + theme.metrics.length;
                } else if (d.Domain == 'Human Rights'){
                    var theme = newTheme(d);
                    domains.rights.themes.push(theme);
                    domains.rights.metric_count = domains.rights.metric_count + theme.metrics.length;
                } else if (d.Domain == 'Demand'){
                    var theme = newTheme(d);
                    domains.demand.themes.push(theme);
                    domains.demand.metric_count = domains.demand.metric_count + theme.metrics.length;
                } else if (d.Domain == 'Supply'){
                    var theme = newTheme(d);
                    domains.supply.themes.push(theme);
                    domains.supply.metric_count = domains.supply.metric_count + theme.metrics.length;
                } else if (d.Domain == 'International Cooperation'){
                    var theme = newTheme(d);
                    domains.international.themes.push(theme);
                    domains.international.metric_count = domains.international.metric_count + theme.metrics.length;
                };

                country.domains = domains

            } else {
                // last country is complete, push it to array;
                if (i > 0) {
                    countryDomainArray.push(country);
                };

                // create new country, domains and themes;
                country = new Object;
                domains = new Object;

                country.name = d.Country;
                country.ISO = d.ISO;

                domains.health = new Object;
                domains.peace = new Object;
                domains.development = new Object;
                domains.rights = new Object;
                domains.demand = new Object;
                domains.supply = new Object;
                domains.international = new Object;

                domains.health.themes = [];
                domains.peace.themes = [];
                domains.development.themes = [];
                domains.rights.themes = [];
                domains.demand.themes = [];
                domains.supply.themes = [];
                domains.international.themes = [];

                if (d.Domain == 'Health'){
                    var theme = newTheme(d);
                    domains.health.themes.push(theme);

                    domains.health.metric_count = theme.metrics.length;
                    domains.peace.metric_count = 0;
                    domains.development.metric_count = 0;
                    domains.rights.metric_count = 0;
                    domains.demand.metric_count = 0;
                    domains.supply.metric_count = 0;
                    domains.international.metric_count = 0;
                } else {
                    console.log('Different Domain Order, Health is not First');
                };
                country.domains = domains;
            };
        });

        // push last remaining country to array
        countryDomainArray.push(country);
        console.log("All Themes Loaded");
        countData();
    });
};

var countData = function(){
    $(countryDomainArray).each(function(){
        var domains = $(this)[0].domains;
        var total_metric_count = domains.demand.metric_count + domains.development.metric_count + domains.health.metric_count + domains.international.metric_count + domains.peace.metric_count + domains.rights.metric_count + domains.supply.metric_count;
        $(this)[0].domains.total_metric_count = total_metric_count;
    });
    joinData();
};

var newTheme = function(d){
    var theme = new Object;
    theme.theme = d.Theme;
    theme.metrics = d.Metrics;

    theme.metrics = theme.metrics.split('~'); // split by metric delimiter
    theme.metrics.pop(); // last item is a blank space, remove

    $(theme.metrics).each(function(i){
        theme.metrics[i] = theme.metrics[i].split('{');
        if (theme.metrics[i].length == 2) { //if priorty includes page number
            theme.metrics[i][1] = theme.metrics[i][1].substring(0, theme.metrics[i][1].length - 2);
        } else {
            console.log("Formatting Issue");
            console.log(theme.metrics[i]);
        };
    });

    theme.metric_count = theme.metrics.length;
    return theme;
};

var newPolicy = function(d){
    var policy = new Object;
    policy.NDS_Name = d['NDS Name'];
    policy.NDS_Year = d['NDS Year'];
    policy.NDS_StartDate = d['NDS Start Date'];
    policy.NDS_EndDate = d['NDS End Date'];
    policy.NDS_Link = d['NDS Link'];
    policy.Lead_Agency_Name = d['Lead Agency Name'].split(';');
    policy.Lead_Agency_Type = d['Lead Agency Type'];
    policy.Supporting_Agencies = d['Supporting Agencies'].split(';');
    policy.Health_Priorities = cleanData(d['Health Priorities']);
    policy.Health_Metrics = cleanData(d['Health Metrics']);
    policy.Health_Rubric = cleanData(d['Health Rubric']);
    policy.Peace_Security_Priorities = cleanData(d['Peace & Security Priorities']);
    policy.Peace_Security_Metrics = cleanData(d['Peace & Security Metrics']);
    policy.Peace_Security_Rubric = d['Peace & Security Rubric'];
    policy.Development_Priorities = cleanData(d['Development Priorities']);
    policy.Development_Metrics = cleanData(d['Development Metrics']);
    policy.Development_Rubric = d['Development Rubric'];
    policy.Human_Rights_Priorities = cleanData(d['Human Rights Priorities']);
    policy.Human_Rights_Metrics = cleanData(d['Human Rights Metrics']);
    policy.Human_Rights_Rubric = d['Human Rights Rubric'];
    policy.Demand_Reduction_Priorities = cleanData(d['Demand Reduction Priorities']);
    policy.Demand_Reduction_Metrics = cleanData(d['Demand Reduction Metrics']);
    policy.Demand_Reduction_Rubric = d['Demand Reduction Rubric'];
    policy.Supply_Reduction_Priorities = cleanData(d['Supply Reduction Priorities']);
    policy.Supply_Reduction_Metrics = cleanData(d['Supply Reduction Metrics']);
    policy.Supply_Reduction_Rubric = d['Supply Reduction Rubric'];
    policy.International_Cooperation_Priorities = cleanData(d['International Cooperation Priorities']);
    policy.International_Cooperation_Metrics = cleanData(d['International Cooperation Metrics']);
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

    return policy;
};

var cleanData = function(data){
    data = data.split('~'); //split block of text by ~

    $(data).each(function(i){
        data[i] = data[i].split('{'); //split string at { to seperate page numbers
        if (data[i].length > 1){ // if line has page number
            data[i][1] = data[i][1].replace('}','');
        };
    });

    return data;
};

// JOIN DATA //

var joinData = function(){
    $(countryDomainArray).each(function(i){
        var ISO = countryDomainArray[i].ISO;
        $(countryArray).each(function(k){
            if (ISO == countryArray[k].ISO) {
                countryArray[k].domains = countryDomainArray[i].domains;
            };
        });
    });

    console.log('Policies and Themes Joined');
    console.log(countryArray);
    saveData();
};

// SAVE DATA //

var saveData = function(){
    $.post('/update', {'data': JSON.stringify(countryArray)}, function(response){ // add new note to database, on sucess
        console.log(response);
    }); 
};

getPolicies();