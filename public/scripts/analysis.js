window.onload = function(){
    var windowWidth = $(window).width();
    var outcomeArray = [];
    var countryArray;
    var linkedArray = [];
    
    var outcomeCrime = [];
    var outcomeCriminalJustice = [];
    var outcomeCrimeVictimization = [];
    var outcomeTraffickingPerson = [];
    var outcomeDrugUse = [];
    
    var outcomeDatasets = [];
    
    function getCountries(){
        return $.get('/countries');
    };

    $.when(getCountries()).done(function(data){
        countryArray = data;
        getOutcomeList();
    });
    
    function getOutcomeList(){
        d3.csv('data/outcome_list.csv', function(data){
            $(data).each(function(){
                if (this['CSV Name']){ ///if data is implimented
                    var outcome = new Object();
                    outcome.title = this['Dataset Title'].trim();
                    outcome.category = this['Category'].trim();
                    outcome.subcategory = this['Subcategory'].trim();
                    outcome.subcategoryTwo = this['Subcategory 2'].trim();
                    outcome.csv = this['CSV Name'].trim();
                    outcome.type = this['Type'].trim();

                    if (outcome.type == 'Rate/100,000'){
                        outcome.unit = 'Rate per 100,000 population';
                    } else if (outcome.type == 'Count'){
                        outcome.unit = 'Rate per 100,000 population';
                    } else if (outcome.type == 'Number'){
                        outcome.unit = 'Rate per 100,000 population';
                    } else if (outcome.type == '% Prevalence'){
                        outcome.unit = '%'
                    }
                    
                    outcomeDatasets.push(outcome);
                }
            });
        });
    };
    
    var svgMaxWidth = 500;
    var svgWidth;
    var svgHeight;
    
    if (windowWidth/2 > svgMaxWidth){
        svgWidth = svgMaxWidth;
        svgHeight = svgWidth;
    } else {
        svgWidth = windowWidth/2 - 40;
        svgHeight = svgWidth;
    };
        
    var svg = d3.select(".chart-svg")
            .append("svg")
            .attr("id","chart")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .attr("overflow", "visible")
            .attr("xmlns", "http://www.w3.org/2000/svg");
    
    function plotData(plotGuide){
        var xData = plotGuide.x.path.split('.');
        var yData = plotGuide.y.path.split('.');
        console.log(plotGuide);
        
        var dataArray = [];
        var countryNameArray = [];
        var yAltValueArray = [];
        
        console.log(linkedArray);
        
        $(linkedArray).each(function(){
            var dataElement = [];
            dataElement[0] = Number(getValue(this, xData));
            dataElement[1] = Number(getValue(this, yData));
            
            if (dataElement[0] && dataElement[1]){
                dataArray.push(dataElement);
                countryNameArray.push(this.country.name);
                
                if (plotGuide.y.altValue){
                    var yValue = plotGuide.y.altValue.split('.');
                    yValue = getValue(this, yValue);
                    yAltValueArray.push(yValue); 
                }
                
            } else {
                console.log('No X and/or Y data avalible for country');
            };
        });
        
        var xMax = d3.max(dataArray, function(d){return d[0]});
           
        var padding = {top:20, right:20, bottom:60, left:88};
            
        var xScale = d3.scaleLinear()
            .domain([0, xMax])
            .range([padding.left, svgWidth - padding.right]);
        
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataArray, function(d){return d[1]})])
            .range([svgHeight - padding.bottom, padding.top]);
        
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale).tickFormat(d3.format("0.2s"));
        
        var plot = svg.append('g')
            .attr('class', 'plot');
                        
        plot.selectAll("circle")
            .data(dataArray)
            .enter()
            .append("circle")
            .attr('class', 'point')
            .attr('fill','#0084ff')
            .attr("cx", function(d) {return xScale(d[0])})
            .attr("cy", function(d) {return yScale(d[1])})
            .attr("r", 5)
            .on('mouseenter', function(d, i){
                $(this).addClass('point-hover');
                var countryName = countryNameArray[i];
                hoverPoint(d, countryName, yAltValueArray[i]);
            }).on('mousemove', function(d, i){
                $(this).addClass('point-hover');
                var countryName = countryNameArray[i];
                hoverPoint(d, countryName, yAltValueArray[i]);
            }).on('mouseleave', function(d){
                $('.chart-hover').removeClass('show')
                $(this).removeClass('point-hover');
            });
        
        function hoverPoint(data, countryName, yAltValue){
            var mouseX = event.clientX + 14;
            var mouseY = $(window).scrollTop() + event.clientY - 3;
            
            $('.chart-hover .country-name').text(countryName);
            $('.chart-hover .country-data-x').html(plotGuide.x.text + ' <span class="amount">' + data[0] + '</span>');
            
            if (plotGuide.y.altValue){
                $('.chart-hover .country-data-y').html(plotGuide.y.text + ' <span class="amount">' + yAltValue + '</span>'); 
            } else {
               $('.chart-hover .country-data-y').html(plotGuide.y.text + ' <span class="amount">' + data[1] + '</span>'); 
            }
            
            if (plotGuide.y.unit) {
                $('.chart-hover .country-data-y').append('<span class="unit">' + plotGuide.y.unit + '</span>');
            }
            
            if (plotGuide.x.unit) {
                $('.chart-hover .country-data-x').append('<span class="unit">' + plotGuide.x.unit + '</span>');
            }
            
            var chartHoverWidth = $('.chart-hover').innerHeight();
            $('.chart-hover').addClass('show')
                .css({'top': mouseY - chartHoverWidth - 5 + 'px', 'left': mouseX - 5 + 'px'});
        };
        
        plot.append("g")
            .call(xAxis)
            .attr("transform", "translate(0," + (svgHeight - padding.bottom) + ")")
            .attr("class", "axis");
        
        plot.append("g")
            .call(yAxis)
            .attr("transform", "translate(" + padding.left + ", 0)")
            .attr("class", "axis");
        
        plot.append("foreignObject")
            .attr('width', svgWidth - padding.left - padding.right + 'px')
            .attr('height', '32px')
            .attr('x', padding.left + 'px')
            .attr('y', svgHeight - 32 + 'px')
            .append('xhtml:div')
            .append('p')
            .attr('class', 'axis-title')
            .text(function(){
                if (plotGuide.x.unit){
                    return plotGuide.x.text + ' (' + plotGuide.x.unit + ')';
                } else {
                   return plotGuide.x.text; 
                }
            });
        
        plot.append("foreignObject")
            .attr('width', svgWidth - padding.top - padding.bottom + 'px')
            .attr('height', '48px')
            .attr('x', (svgHeight - padding.bottom) * '-1')
            .attr('y', 0)
            .attr('transform', 'rotate(-90)')
            .append('xhtml:div')
            .append('p')
            .attr('class', 'axis-title')
            .text(function(){
                if (plotGuide.y.unit){
                    return plotGuide.y.text + ' (' + plotGuide.y.unit + ')';
                } else {
                   return plotGuide.y.text; 
                }
            });
        
        /// CHART TEXT ///
        
        // generate chart title
        
        var chartTitle;
        
        if (plotGuide.x.level == 'level one'){
            chartTitle = 'Number of metrics used to evaluate national drug policies and the '+plotGuide.y.text+' across '+dataArray.length+' countries';
        } else if (plotGuide.x.level == 'level two'){
            chartTitle = 'Number of '+plotGuide.x.text+' used to evaluate national drug policies and the '+plotGuide.y.text+' across '+dataArray.length+' countries';
        } else if (plotGuide.x.level == 'level three'){
            chartTitle = 'Use of metrics to assess the '+plotGuide.x.text+' and the '+plotGuide.y.text+' across '+dataArray.length+' countries';
        };
        
        $('.chart-title').text(chartTitle);
        
        // add list of countries
        
        $('.country-list').html("<span class='chart-header'>Countries Plotted: </span>");
        for (var i=0; i < countryNameArray.length; i++){
            if (i == countryNameArray.length-1){
                $('.country-list').append(countryNameArray[i]);
            } else {
                $('.country-list').append(countryNameArray[i] + ', ');
            }
        };
        
        // generate chart notes and sources
        
        $('.chart-notes .x-notes').html('');
        $('.chart-notes .y-notes').html('');
        $('.chart-sources').html('<span class="chart-header">Sources: </span>');
        
        $('.chart-notes .x-notes').html('<span class="chart-header">X Axis Notes: </span>');
        $('.chart-notes .x-notes').append('Notes from St.Micheals Team about metric data go here.');
        
        // notes + sources for outcome data
        if (linkedArray[0].outcome){
            $('.chart-notes .y-notes').html('<span class="chart-header">Y Axis Notes: </span>');
            
            if (linkedArray[0].outcome.years){
                var yearString = '';
                for (var i=0; i<linkedArray[0].outcome.years.length; i++){
                    if (i == linkedArray[0].outcome.years.length - 1){
                        yearString = yearString + linkedArray[0].outcome.years[i] + '. ';
                    } else {
                        yearString = yearString + linkedArray[0].outcome.years[i] + ', ';
                    }
                };
                $('.chart-notes .y-notes').append('Average of available data from the years ' + yearString);
            };
            
            if (linkedArray[0].outcome.notes){
                $('.chart-notes .y-notes').append(linkedArray[0].outcome.notes);
            };
            
            $('.chart-sources').append('<a target="_blank" href="https://data.unodc.org/">UNODC</a>');
        };
        
        if (plotGuide.y.text == 'GDP'){
            $('.chart-sources').append('<a target="_blank" href="https://data.worldbank.org/">World Bank</a>');
        };
        
        if (plotGuide.y.text == 'Rate of Unemployment'){
            $('.chart-sources').append('<a target="_blank" href="https://www.google.ca/">Unemployment Source</a>');
        };
        
        $('.chart-guide').css('opacity', '0');
        $('.chart-text').css('opacity', '1');
        $('.chart').css('opacity', '1');
    };
    
    function getValue(data, array){
        var value;
        
        if (array.length == 1){
            value = getter(data, array[0]);
        } else if (array.length == 2){
            value = getter(data, array[0], array[1]);
        } else if (array.length == 3){
            value = getter(data, array[0], array[1], array[2]);
        } else if (array.length == 4){
            value = getter(data, array[0], array[1], array[2], array[3]);
        } else if (array.length == 5){
            value = getter(data, array[0], array[1], array[2], array[3], array[4]);
        } else if (array.length == 6){
            value = getter(data, array[0], array[1], array[2], array[3], array[4], array[5]);
        }

        return value;
    };
    
    function getter() {
        var current = arguments[0];
        for(var i = 1; i < arguments.length; i++) {
            if(current[arguments[i]]) {
                current = current[arguments[i]];
            } else {
                return null;
            };
        };
        return current;
    };
    
    function getOutcome(dataset, datatype){
        outcomeArray = [];
        d3.csv('data/outcomes/'+dataset+'.csv', function(data){
            data.forEach(function(d){
                var outcome = new Object;
                outcome.name = d.Country;
                
                if (datatype == 'Rate/100,000'){
                    var rate = averageRate(d);
                    outcome.value = rate[0];
                    outcome.years = rate[1];
                } else if (datatype == 'Count'){
                    var count = averageCount(d);
                    outcome.value = count[0];
                    outcome.years = count[1];
                } else if (datatype == 'Number'){
                    var countryCheck = $.grep(outcomeArray, function(obj){return obj.name === d.Country;});
                    if (countryCheck.length <= 0){
                        var number = averageNumber(d, data);
                        outcome.value = number[0];
                        outcome.years = number[1];
                    } else {
                        return;
                    }
                } else if (datatype == '% Prevalence'){
                    var percent = percentagePrev(d);
                    outcome.value = percent[0];
                    outcome.years = percent[1];
                }
                
                if (outcome.name.indexOf('*') > -1){
                    outcome.name = outcome.name.replace('*','');
                };
                
                outcome.notes = data[0]['Interpretation'];
                outcome.link = data[0]['Link'];
                
                outcomeArray.push(outcome);
            });
            joinData();
        });
    };
    
    function averageRate(d){
        var objectKeys = Object.keys(d);
        var numericKeys = [];
        var countryAverage = 0;
        var countryCount = 0;
        
        $(objectKeys).each(function(){
            if (!isNaN(this)){
                numericKeys.push(this);
            };
        });
        
        $(numericKeys).each(function(){
            if (d[this]){
                countryAverage = countryAverage + parseFloat(d[this].replace(',',''));
                countryCount++;
            };
        });
        
        countryAverage = countryAverage/countryCount;
        countryAverage = countryAverage.toFixed(2);
        
        return [countryAverage, numericKeys];
    }
    
    function averageCount(d){
        var objectKeys = Object.keys(d);
        var numericKeys = [];
        var countryAverage = 0;
        var countryCount = 0;
        var popAverage;
        
        $(objectKeys).each(function(){
            if (!isNaN(this)){
                numericKeys.push(this);
            };
        });
        
        $(numericKeys).each(function(){
            if (d[this]){
                countryAverage = countryAverage + parseFloat(d[this].replace(',',''));
                countryCount++;
            };
        });
        
        $(countryArray).each(function(){
            if (d.Country == this.UNODCName){
                popAverage = this.population.averagePop;
            };
        });
                
        if (countryAverage && popAverage){
            var perCapita = ((countryAverage/popAverage) * 100000).toFixed(2);
            return [perCapita, numericKeys];
        } else {
            return [null, null];
        }
    }
    
    function averageNumber(country, data){
        var dataArray = [];
        var yearCount = 0;
        var yearAverage = 0;
        var popAverage;
        
        $(data).each(function(){
           if (this.Country == country.Country){
               dataArray.push(this);
           }
        });
                
        $(dataArray).each(function(){
            if (this.Total != 'na' && this.Total != 'NA' && this.Total != undefined){
                yearCount++;
                yearAverage = yearAverage + parseFloat(this.Total.replace(',',''));
            }
        });
        
        $(countryArray).each(function(){
            if (country.Country == this.UNODCName){
                popAverage = this.population.averagePop;
            };
        });
        
        yearAverage = yearAverage/yearCount;
        
        if (yearAverage && popAverage){
            var perCapita = ((yearAverage/popAverage) * 100000).toFixed(2);
            return [perCapita, [2011, 2012, 2013, 2014, 2015]];
        } else {
            return [null, null];
        }
    }
    
    function percentagePrev(d){
        var percent = d.Number.replace('%', '');
        return [percent, [2011, 2012, 2013, 2014, 2015]];
    }
    
    function linkArray(){
        linkedArray = [];
        $(countryArray).each(function(){
            var country = this;
            var linkedData = new Object;
            linkedData.country = country;
            linkedArray.push(linkedData);
        });
    };
    
    function joinData(){
        linkedArray = [];
        $(countryArray).each(function(){
            var country = this;
            $(outcomeArray).each(function(){
                if (country.UNODCName == this.name){
                    var linkedData = new Object;
                    linkedData.country = country;
                    linkedData.outcome = this;
                    linkedArray.push(linkedData);
                };
            });
        });
    };
    
    function enablePlotButton(){
        $('.plot-button.enabled').on('click', function(){
            svg.selectAll('.plot').remove();

            var xText;
            var yText;
            var xLevel;

            var xPath = $('#x .data-button.selected').attr('data-path');
            var yPath = $('#y .data-button.selected').attr('data-path');

            var xUnit = $('#x .data-button.selected').attr('data-unit');
            var yUnit = $('#y .data-button.selected').attr('data-unit');

            var yAltValue = $('#y .data-button.selected').attr('data-alt-value');

            if ($('#x .data-button.selected').hasClass('level-one')){
                xLevel = 'level one';
            } else if ($('#x .data-button.selected').hasClass('level-two')){
                xLevel = 'level two';
            } else if ($('#x .data-button.selected').hasClass('level-three')){
                xLevel = 'level three';
            };

            if ($('#x .data-button.selected').children('.selected-value').length > 0){
                xText = $('#x .data-button.selected .selected-value').text();
            } else {
                xText = $('#x .data-button.selected').text();
            };

            if ($('#y .data-button.selected').children('.selected-value').length > 0){
                yText = $('#y .data-button.selected .selected-value').text();
            } else if ($('#y .data-button.selected').children('.picked-data-point').length > 0){
                yText = $('#y .data-button.selected .picked-data-point').text();
            } else {
                yText = $('#y .data-button.selected').text();
            };

            if (yText == 'Unemployment'){
                yText = 'Rate of Unemployment';
            };

            if (yText == 'GDP'){
                yText = 'GDP';
            };

            console.log('X: ' + xText,'Y: ' + yText);
            console.log('X: ' + xPath,'Y: ' + yPath);

            var x = new Object;
            x.path = xPath;
            x.text = xText;
            x.unit = xUnit;
            x.level = xLevel;

            var y = new Object;
            y.path = yPath;
            y.text = yText;
            y.unit = yUnit;
            y.altValue = yAltValue;

            var plotGuide = {'x': x, 'y': y};

            plotData(plotGuide);

            $(".pdf-button").addClass("enabled");
        });
    };
    
    $('.outcome-nest').on('click', function(){
        var dataTitle = $(this).children('.nest-title').text();
        var dataButton = this;
        var dataNestArray;
        
        dataNestArray = $.grep(outcomeDatasets, function(obj){return obj.category === dataTitle});
        console.log(dataNestArray);
        
        $('.data-modal-list').html('');
        
        $(dataNestArray).each(function(){
            if (this.subcategory == 'n/a' || this.subcategory == 'N/A' || this.subcategory == undefined){
                $('.data-modal-list').append("<div class='data-point last' data-type='"+this.type+"' data-set='"+this.csv+"' data-unit='"+this.unit+"' data-path='outcome.value'>"+this.title+"</div>");
            } else if (this.subcategoryTwo == 'n/a' || this.subcategoryTwo == 'N/A' || this.subcategoryTwo == undefined) {
                var detailElements = $('.data-modal-list details');
                var existingCategory = false;
                var subCategory = this.subcategory;
                
                if (detailElements.length == 0){
                    newCategory = true;
                } else {
                    $(detailElements).each(function(){
                        if ($(this).children('summary').text() == subCategory){
                            existingCategory = true;
                            return false;
                        };
                    });
                }
                
                if (existingCategory){
                    for (var i=0; i < detailElements.length; i++){
                        if ($(detailElements[i]).children('summary').text() == subCategory){
                            $(detailElements[i]).append("<div class='data-point last' data-type='"+this.type+"' data-set='"+this.csv+"' data-unit='"+this.unit+"' data-path='outcome.value'>"+this.title+"</div>");
                            break;
                        }
                    }
                } else {
                    $('.data-modal-list').append("<details><summary>"+this.subcategory+"</summary><div class='data-point last' data-type='"+this.type+"' data-set='"+this.csv+"' data-unit='"+this.unit+"' data-path='outcome.value'>"+this.title+"</div></details>");
                }
            } else {
                console.log('has second subcategory');            
            }

            $('.data-point.last').on('click', function(){
                var dataPointTitle = $(this).text();
                var dataSet = $(this).attr('data-set');
                var dataPath = $(this).attr('data-path');
                var dataUnit = $(this).attr('data-unit');
                var dataType = $(this).attr('data-type');

                $('.data-window').removeClass('show');

                $(dataButton).attr('data-path', dataPath)
                    .attr('data-unit', dataUnit)
                    .children('.picked-data-point').text(dataPointTitle).addClass('selected');
                getOutcome(dataSet, dataType);
            }).removeClass('last');
        });
        
        $('.data-modal .modal-title').text('Select '+dataTitle+' Data to Plot on Y Axis');
        $('.data-window').addClass('show');
    });
    
    $('.country-nest').on('click', function(){
        linkArray();
    });
    
    $('.data-modal .close-button').on('click', function(){
        $('.data-window').removeClass('show');
    });
    
    $('.data-button').on('click', function(){
        var dimension = $(this).closest('.dimension').attr('id');
        $('.data-list.open').removeClass('open right');
        $('#' + dimension + ' .data-button.selected').removeClass('selected');
        $('#' + dimension + ' .picked-data-point.selected').text('+').removeClass('selected');
        $(this).addClass('selected');
        
        if ($('#x .data-button').hasClass('selected') && $('#y .data-button').hasClass('selected')){
            $('.plot-button').addClass('enabled');
            enablePlotButton();
        };
    });
    
    $('.level-one').on('click', function(){
        var dimension = $(this).closest('.dimension').attr('id');
        $('#' + dimension + ' .level-two').removeClass('hidden')
            .children('.selected-value').text('Themes');
        $('#' + dimension + ' .level-three').addClass('hidden')
            .children('.selected-value').text('Specific Metrics');
    });
    
    $('.level-two').on('click', function(){
        var dataList = $(this).children('.data-list');
        var dataListWidth = dataList.innerWidth();
        var buttonCoor = this.getBoundingClientRect();
        
        if ($(dataList).hasClass('open')){
            $(dataList).removeClass('open right');
        } else {
            $(dataList).addClass('open');
            if (buttonCoor.left + dataListWidth > windowWidth){
                $(dataList).addClass('right');
            }
        }
    });
    
    $('.level-three').on('click', function(){
        var dataList = $(this).children('.data-list');
        var dataListWidth = dataList.innerWidth();
        var buttonCoor = this.getBoundingClientRect();
        
        if ($(dataList).hasClass('open')){
            $(dataList).removeClass('open right');
        } else {
            $(dataList).addClass('open');
            if (buttonCoor.left + dataListWidth > windowWidth){
                $(dataList).addClass('right');
            }
        }
    });
    
    $('.data-list-item').on('click', function(event){
        event.stopPropagation();
        var dimension = $(this).closest('.dimension').attr('id');
        var dataButton = $(this).parent().parent();
        var newText = $(this).text();
        var newPath = $(this).attr('data-path');
        var newUnit = $(this).attr('data-unit');
        
        $(this).parent().siblings('.selected-value').text(newText);
        $(dataButton).attr('data-path', newPath);
        $(dataButton).attr('data-unit', newUnit);
        
        if ($(dataButton).hasClass('level-two')){ //if this is the level two list
            var levelTwo = $(this).attr('data-value');
            $('#' + dimension + ' .level-three .data-list').empty()
                .append('<div class="data-list-item">Specific Metrics</div>');
            
            if (levelTwo != 'all'){
                var levelTwoMetrics = countryArray[0].domains[levelTwo].themes;
                $(levelTwoMetrics).each(function(i){
                    $('#' + dimension + ' .level-three .data-list').append('<div class="data-list-item" data-path="country.domains.'+levelTwo+'.themes.'+i+'.metric_count" data-unit="Number of Metrics">' + this.theme + '</div>');
                });
                activateLevelThreeList();
                
                $('#' + dimension + ' .data-button.selected').removeClass('selected');
                $('#' + dimension + ' .level-two').addClass('selected');
                $('#' + dimension + ' .level-three').removeClass('hidden')
                    .children('.selected-value').text('Specific Metrics');
            } else {
                $('#' + dimension + ' .data-button.selected').removeClass('selected');
                $('#' + dimension + ' .level-one').addClass('selected');
                $('#' + dimension + ' .level-three').addClass('hidden');
            };
        };
        
        $(this).parent().removeClass('open right');
    });
    
    var activateLevelThreeList = function(){
        $('.data-list-item').on('click', function(){
            event.stopPropagation();
            var dimension = $(this).closest('.dimension').attr('id');
            var dataButton = $(this).parent().parent();
            var newText = $(this).text();
            var newPath = $(this).attr('data-path');
            var newUnit = $(this).attr('data-unit');
            
            $(this).parent().siblings('.selected-value').text(newText);
            $(dataButton).attr('data-path', newPath)
                .attr('data-unit', newUnit);
            
            if ($(dataButton).hasClass('level-three')){ //if this is the level three list
                var levelThree = $(this).text();
                if (levelThree != 'Specific Metrics'){
                    $('#' + dimension + ' .data-button.selected').removeClass('selected');
                    $('#' + dimension + ' .level-three').addClass('selected');
                } else {
                    $('#' + dimension + ' .data-button.selected').removeClass('selected');
                    $('#' + dimension + ' .level-two').addClass('selected');
                };
            };
            
            $(this).parent().removeClass('open right');
        });
    };
    
    $(window).on('click', function(event){
        if(!event.target.closest('.data-list') && !event.target.closest('.data-button')){
            $('.data-list.open').removeClass('open right');
        };
    });

        d3.select(".pdf-button").on("click", function(){

            if ($(this).hasClass("enabled")) {
                var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();

                d3.select(this)
                    .attr("href", 'data:application/octet-stream;base64,' + btoa(d3.select(".chart-svg").html()))
                    .attr("download", "plot-"+timeStampInMs+".svg") 
            }
      
    })
    
};