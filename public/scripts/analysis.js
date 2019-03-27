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
        console.log(data);
        getOutcomeList();
    });
    
    function round(value, decimals) {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }
    
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

                    if (outcome.type == 'Rate/100,000' || outcome.type == 'Count' || outcome.type == 'Number'){
                        outcome.unit = 'Rate per 100,000 population';
                    } else if (outcome.type == '% Prevalence' || outcome.type == 'Prevalence Rate' || outcome.type == 'Percent'){
                        outcome.unit = '%';
                    } else if (outcome.type == '$USD'){
                        outcome.unit = 'USD';
                    } else if (outcome.type == 'Amount'){
//                        console.log(outcome);
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
        
        var dataArray = [];
        var xArray = [];
        var yArray = [];
        var countryNameArray = [];
        var yAltValueArray = [];
                
        $(linkedArray).each(function(){
            var dataElement = [];
            dataElement[0] = getValue(this, xData);
            dataElement[1] = getValue(this, yData);
            
            if (dataElement[0] != null){
                dataElement[0] = Number(dataElement[0]);
            }
            if (dataElement[1] != null){
                dataElement[1] = Number(dataElement[1]);
            }
                        
            if ((dataElement[0] || (dataElement[0] == 0)) && (dataElement[1] || dataElement[1]==0)){
                
                if (plotGuide.y.path == 'country.GDP'){
                    dataElement[1] = Math.log10(dataElement[1]);
                };
                
                dataArray.push(dataElement);
                xArray.push(dataElement[0]);
                yArray.push(dataElement[1]);
                countryNameArray.push(this.country.name);
                                
                if (plotGuide.y.altValue){
                    var yValue = plotGuide.y.altValue.split('.');
                    yValue = getValue(this, yValue);
                    yAltValueArray.push(yValue); 
                }
                
            } else {
                console.log('No X and/or Y data available for a country');
            };
        });
        
        // check if x and y arrays are equal
        if (xArray.length != yArray.length){
            console.log('x and y data arrays are not equal')
        }
        
        // if x array is not empty
        if (xArray.length != 0){
            var spearmanCor = computeSpearmans(xArray, yArray);
            var pearsonCor = computePearsons(xArray, yArray);

            var xMax = d3.max(dataArray, function(d){return d[0]});
            var yMax = d3.max(dataArray, function(d){return d[1]});

            var padding = {top:20, right:20, bottom:60, left:88};

            var xScale = d3.scaleLinear()
                .domain([0, xMax])
                .range([padding.left, svgWidth - padding.right]);

            var yScale = d3.scaleLinear()
                .domain([0, yMax])
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
                    hoverPoint(d, countryName, yAltValueArray[i], d3.event);
                }).on('mousemove', function(d, i){
                    $(this).addClass('point-hover');
                    var countryName = countryNameArray[i];
                    hoverPoint(d, countryName, yAltValueArray[i], d3.event);
                }).on('mouseleave', function(d){
                    $('.chart-hover').removeClass('show')
                    $(this).removeClass('point-hover');
                });

            function hoverPoint(data, countryName, yAltValue, event){
                var mouseX = event.clientX + 14;
                var mouseY = $(window).scrollTop() + event.clientY - 3;

                $('.chart-hover .country-name').text(countryName);
                $('.chart-hover .country-data-x').html(plotGuide.x.text + ' <span class="amount">' + data[0] + '</span>');

                if (plotGuide.y.altValue){
                    if (plotGuide.y.path == 'country.GDP'){
                        $('.chart-hover .country-data-y').html(plotGuide.y.text + ' <span class="amount">' + yAltValue + '</span> <span class="amount"> Log10: ' + round(data[1], 4) + '</span>'); 
                    } else {
                        $('.chart-hover .country-data-y').html(plotGuide.y.text + ' <span class="amount">' + yAltValue + '</span>'); 
                    }
                } else {
                   $('.chart-hover .country-data-y').html(plotGuide.y.text + ' <span class="amount">' + round(data[1], 4) + '</span>'); 
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
                chartTitle = 'Number of indicators used to evaluate national drug policies and the '+plotGuide.y.text+' across '+dataArray.length+' countries';
            } else if (plotGuide.x.level == 'level two'){
                chartTitle = 'Number of '+plotGuide.x.text+' used to evaluate national drug policies and the '+plotGuide.y.text+' across '+dataArray.length+' countries';
            } else if (plotGuide.x.level == 'level three'){
                chartTitle = 'Use of indicators to assess the '+plotGuide.x.text+' and the '+plotGuide.y.text+' across '+dataArray.length+' countries';
            };

            $('.chart-title').text(toTitleCase(chartTitle));

            // add list of countries

            var countryNameAlpha = countryNameArray.slice();
            countryNameAlpha.sort();

            $('.country-list').html("<span class='chart-header'>Countries Plotted: </span>");
            for (var i=0; i < countryNameAlpha.length; i++){
                if (i == countryNameAlpha.length-1){
                    $('.country-list').append(countryNameAlpha[i]);
                } else {
                    $('.country-list').append(countryNameAlpha[i] + ', ');
                }
            };

            // add statististical analysis

            $('.statistics').html("<span class='chart-header'>Analysis: <br></span>Spearman's Correlation<span class='stat'>"+round(spearmanCor, 4)+"</span><br>Pearson's Correlation<span class='stat'>"+round(pearsonCor, 4)+"</span>")

            // generate chart notes and sources

            $('.chart-notes .x-notes').html('');
            $('.chart-notes .y-notes').html('');
            $('.chart-sources').html('<span class="chart-header">Sources: </span>');

            $('.chart-notes .x-notes').html('<span class="chart-header">X Axis Notes: </span>');
            $('.chart-notes .x-notes').append('Notes from St.Micheals Team about metric data go here.');

            // notes + sources for outcome data
            if (linkedArray[0].outcome){
                $('.chart-notes .y-notes').html('<span class="chart-header">Notes: </span>');

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

            if (plotGuide.y.text == 'Gross Domestic Product'){
                $('.chart-sources').append('<a target="_blank" href="https://data.worldbank.org/">World Bank</a>');
            };

            if (plotGuide.y.text == 'Rate of Unemployment'){
                $('.chart-sources').append('<a target="_blank" href="https://data.worldbank.org/">World Bank</a>');
            };

            $('.chart-guide').css('opacity', '0');
            $('.chart-text').css('opacity', '1');
            $('.guide-text').text('Select data to plot on the X and Y axis, then click “Generate Scatterplot”. A plot will be generated here.');
            $('.chart').css('opacity', '1');
        } else { //if no countries can be plotted
            $('.chart-guide').css('opacity', '1');
            $('.guide-text').text('Analyses could not be generated for the following reason: The countries included do not collect the metric or outcome you requested, however, we have not assessed all countries at this point.');
            $('.chart-text').css('opacity', '0');
            $('.chart').css('opacity', '0');
        }
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
            if(current[arguments[i]] || current[arguments[i]] == 0) {
                current = current[arguments[i]];
            } else {
                return null;
            };
        };
        return current;
    };
    
    function getOutcome(dataset, datatype, dataButton){
        outcomeArray = [];
        d3.csv('data/outcomes/'+dataset+'.csv', function(data){
            
            if (datatype == 'Amount'){ //unit needs to be added if data type is amount
                var amountUnit = getAmountUnit(data[0]);
                $(dataButton).attr('data-unit', amountUnit);
            };
            
            data.forEach(function(d){
                d.Country = cleanCountryName(d.Country);
                
                var outcome = new Object;
                outcome.name = cleanCountryName(d.Country);
                outcome.notes = data[0]['Interpretation'];
                outcome.link = data[0]['Link'];
                
                if (datatype == 'Rate/100,000' || datatype == 'Prevalence Rate' || datatype == 'Percent'){
                    var rate = getHorizontalAverage(d);
                    outcome.value = rate[0];
                    outcome.years = rate[1];
                } else if (datatype == 'Count'){
                    var count = getHorizontalRate(d);
                    outcome.value = count[0];
                    outcome.years = count[1];
                } else if (datatype == 'Number'){
                    var countryName = cleanCountryName(d.Country);
                    var countryCheck = $.grep(outcomeArray, function(obj){return obj.name === countryName;});
                    if (countryCheck.length <= 0){
                        var number = getVerticalRate(d, data);
                        outcome.value = number[0];
                        outcome.years = number[1];
                    } else {
                        return;
                    }
                } else if (datatype == '% Prevalence' || datatype == '$USD'){
                    var countryName = cleanCountryName(d.Country);
                    var countryCheck = $.grep(outcomeArray, function(obj){return obj.name === countryName;});
                    if (countryCheck.length <= 0){
                        var number = getVerticalAverage(d, data);
                        outcome.value = number[0];
                        outcome.years = number[1];
                    } else {
                        return;
                    }
                } else if (datatype == 'Amount'){
                    var countryName = cleanCountryName(d.Country);
                    var countryCheck = $.grep(outcomeArray, function(obj){return obj.name === countryName;});
                    if (countryCheck.length <= 0){
                        var number = getVerticalAverageAmount(d, data);
                        outcome.value = number[0];
                        outcome.years = number[1];
                    } else {
                        return;
                    }
                }
                
                outcomeArray.push(outcome);
            });
            joinData();
        });
    };
    
    function getHorizontalAverage(d){
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
            if (d[this] != 'na' && d[this] != 'NA' && d[this] != undefined && d[this] != null && d[this] != ''){
                countryAverage = countryAverage + parseFloat(d[this].replace(',',''));
                countryCount++;
            };
        });
        
        countryAverage = countryAverage/countryCount;
        countryAverage = countryAverage.toFixed(2);
        
        return [countryAverage, [2011, 2012, 2013, 2014, 2015]];
    }
    
    function getHorizontalRate(d){
        var objectKeys = Object.keys(d);
        var numericKeys = [];
        var countryAverage = 0;
        var countryCount = 0;
        var popAverage;
        var dataCountry = d.Country;
        
        $(objectKeys).each(function(){
            if (!isNaN(this)){
                numericKeys.push(this);
            };
        });
        
        $(numericKeys).each(function(){
            if (d[this] != 'na' && d[this] != 'NA' && d[this] != undefined && d[this] != null && d[this] != ''){
                countryAverage = countryAverage + parseFloat(d[this].replace(',',''));
                countryCount++;
            };
        });
        
        $(countryArray).each(function(){
            if (dataCountry == this.UNODCName){
                popAverage = this.population.averagePop;
            };
        });
        
        countryAverage = countryAverage/countryCount;   
        
        if ((countryAverage || countryAverage == 0) && popAverage){
            var perCapita = ((countryAverage/popAverage) * 100000).toFixed(2);
            return [perCapita, [2011, 2012, 2013, 2014, 2015]];
        } else {
            return [null, null];
        }
    }
    
    function getVerticalRate(country, data){
        var dataArray = [];
        var yearCount = 0;
        var yearAverage = 0;
        var popAverage;
        
        $(data).each(function(){
            var countryName = cleanCountryName(this.Country);
            if (countryName == country.Country){
                dataArray.push(this);
            } else if (countryName == country.Country){
                dataArray.push(this);
            };
        });
                                
        $(dataArray).each(function(){
            if (this.Total){
                if (this.Total != 'na' && this.Total != 'NA' && this.Total != undefined && this.Total != null && this.Total != ''){
                    yearCount++;
                    yearAverage = yearAverage + parseFloat(this.Total.replace(',',''));
                }
            } else if (this.Number){
                if (this.Number != 'na' && this.Number != 'NA' && this.Number != undefined && this.Number != null && this.Number != ''){
                    yearCount++;
                    yearAverage = yearAverage + parseFloat(this.Number.replace(',',''));
                }
            }
        });
        
        $(countryArray).each(function(){
            if (country.Country == this.UNODCName){
                popAverage = this.population.averagePop;
            };
        });
        
        yearAverage = yearAverage/yearCount;
        
        if ((yearAverage || yearAverage == 0)  && popAverage){
            var perCapita = ((yearAverage/popAverage) * 100000).toFixed(2);
            return [perCapita, [2011, 2012, 2013, 2014, 2015]];
        } else {
            return [null, null];
        }
    }
    
    function getVerticalAverage(country, data){
        var dataArray = [];
        var yearCount = 0;
        var yearAverage = 0;
        var popAverage;
        
        $(data).each(function(){
           var countryName = cleanCountryName(this.Country);
           if (countryName == country.Country){
               dataArray.push(this);
           } else if (countryName == country.Country){
               dataArray.push(this);
           } else if (countryName == country.Country){
               dataArray.push(this);
           };
        });
                        
        $(dataArray).each(function(){
            if (this.Total){
                if (this.Total != 'na' && this.Total != 'NA' && this.Total != undefined && this.Total != null && this.Total != ''){
                    yearCount++;
                    yearAverage = yearAverage + parseFloat(this.Total.replace(',',''));
                }
            } else if (this.Number){
                if (this.Number != 'na' && this.Number != 'NA' && this.Number != undefined && this.Number != null && this.Number != ''){
                    yearCount++;
                    yearAverage = yearAverage + parseFloat(this.Number.replace(',',''));
                }
            } else if (this.Best){
                if (this.Best != 'na' && this.Best != 'NA' && this.Best != undefined && this.Best != null && this.Best != ''){
                    yearCount++;
                    yearAverage = yearAverage + parseFloat(this.Best.replace(',',''));
                }
            } else if (this['Retail Level Price Typical']){
                if (this['Retail Level Price Typical'] != 'na' && this['Retail Level Price Typical'] != 'NA' && this['Retail Level Price Typical'] != undefined && this['Retail Level Price Typical'] != null && this['Retail Level Price Typical'] != ''){
                    yearCount++;
                    yearAverage = yearAverage + parseFloat(this['Retail Level Price Typical'].replace(',',''));
                }
            }
        });
        
        yearAverage = yearAverage/yearCount;
        return [yearAverage, [2011, 2012, 2013, 2014, 2015]];
    }
    
    function getVerticalAverageAmount(country, data){
        var dataArray = [];
        var yearCount = 0;
        var yearAverage = 0;
        var popAverage;
        
        $(data).each(function(){
           var countryName = cleanCountryName(this.Country);
           if (countryName == country.Country){
               dataArray.push(this);
           } else if (countryName == country.Country){
               dataArray.push(this);
           } else if (countryName == country.Country){
               dataArray.push(this);
           };
        });
                        
        $(dataArray).each(function(){
            if (this['Quantity Seized']){
                if (this['Quantity Seized'] != 'na' && this['Quantity Seized'] != 'NA' && this['Quantity Seized'] != undefined && this['Quantity Seized'] != null && this['Quantity Seized'] != ''){
                    var unit = this['Unit of Measurement'];
                    var quantitySeized = parseFloat(this['Quantity Seized'].replace(',',''));
                    quantitySeized = convertUnit(unit, quantitySeized);
                    yearCount++;
                    yearAverage = yearAverage + quantitySeized;
                }
            }
        });
        
        yearAverage = yearAverage/yearCount;
        return [yearAverage, [2011, 2012, 2013, 2014, 2015]];
    }
    
    function getAmountUnit(data){
        if (data['Unit of Measurement'] == 'Kilogram' || data['Unit of Measurement'] == 'Gram'){
            return 'Grams';
        } else if (data['Unit of Measurement'] == 'Millilitre' || data['Unit of Measurement'] == 'Litre'){
            return 'Litres';
        } else if (data['Unit of Measurement'] == 'Tablet'){
            return 'Tablets';
        } else if (data['Unit of Measurement'] == 'Unit'){
            return 'Units';
        } else if (data['Unit of Measurement'] == 'Plants'){
            return 'Plants';
        } else if (data['Unit of Measurement'] == 'Pill'){
            return 'Pills';
        } else if (data['Unit of Measurement'] == 'Seeds'){
            return 'Seeds'
        } else if (data['Unit of Measurement'] == 'Dose'){
            return 'Doses';
        } else {
            console.log('Uncategorized unit type: ' + data['Unit of Measurement']);
        }
    }
    
    function convertUnit(unit, amount){
        if (unit == 'Gram' || unit == 'Litre' || unit == 'Tablet' || unit == 'Unit' || unit == 'Plants' || unit == 'Pill' || unit == 'Seeds' || unit == 'Dose'){
            return amount;
        } else if (unit == 'Kilogram'){ // convert to grams
            var newAmount = amount * 1000;
            return newAmount;
        } else if (unit == 'Millilitre'){ // convert to litre
            var newAmount = amount / 1000;
            return newAmount;
        };
    }
    
    function cleanCountryName(name){
        var countryName = name;
        if (countryName.indexOf('*') > -1){
            countryName = countryName.replace('*','');
        };
        countryName = countryName.trim();
        return countryName;
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
                yText = 'Gross Domestic Product';
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
        
        $('.data-modal-list').html('');
        
        $(dataNestArray).each(function(){
            // if no subcategories
            if (this.subcategory == 'n/a' || this.subcategory == 'N/A' || this.subcategory == undefined || this.subcategory == ''){
                $('.data-modal-list').append("<div class='data-point last' data-type='"+this.type+"' data-set='"+this.csv+"' data-unit='"+this.unit+"' data-path='outcome.value'>"+this.title+"</div>");
            // if one subcategory
            } else if (this.subcategoryTwo == 'n/a' || this.subcategoryTwo == 'N/A' || this.subcategoryTwo == undefined || this.subcategory == '') {
                var detailElements = $('.data-modal-list details');
                var existingCategory = false;
                var subCategory = this.subcategory;
                
                if (detailElements.length == 0){
                    existingCategory = false;
                } else {
                    $(detailElements).each(function(){
                        if ($(this).children('summary').text() == subCategory){
                            existingCategory = true;
                            return false;
                        };
                    });
                }
                
                // if category already exists
                if (existingCategory){
                    for (var i=0; i < detailElements.length; i++){
                        if ($(detailElements[i]).children('summary').text() == subCategory){
                            $(detailElements[i]).append("<div class='data-point last' data-type='"+this.type+"' data-set='"+this.csv+"' data-unit='"+this.unit+"' data-path='outcome.value'>"+this.title+"</div>");
                            break;
                        }
                    }
                // if new category
                } else {
                    $('.data-modal-list').append("<details class='subcategory'><summary>"+this.subcategory+"</summary><div class='data-point last' data-type='"+this.type+"' data-set='"+this.csv+"' data-unit='"+this.unit+"' data-path='outcome.value'>"+this.title+"</div></details>");
                }
            // if two subcategories
            } else {
                var detailElements = $('.data-modal-list details');
                var existingCategory = false;
                var existingSubcategory = false;
                var subCategory = this.subcategory;
                var subCategoryTwo = this.subcategoryTwo;
                
                if (detailElements.length == 0){
                    existingCategory = false;
                    existingSubcategory = false;
                } else {
                    $(detailElements).each(function(){
                        if ($(this).children('summary').text() == subCategory){
                            existingCategory = true;
                        };
                        
                        if ($(this).children('summary').text() == subCategoryTwo){
                            existingSubcategory = true;
                        };
                    });
                }
                
                // if category does not already exist
                if (!existingCategory){
                    $('.data-modal-list').append("<details class='subcategory'><summary>"+this.subcategory+"</summary></details>");
                }
                
                if (existingSubcategory){
                    for (var i=0; i < detailElements.length; i++){
                        if ($(detailElements[i]).children('summary').text() == subCategoryTwo){
                            $(detailElements[i]).append("<div class='data-point last' data-type='"+this.type+"' data-set='"+this.csv+"' data-unit='"+this.unit+"' data-path='outcome.value'>"+this.title+"</div>");
                            break;
                        }
                    }
                } else {
                    for (var i=0; i < detailElements.length; i++){
                        if ($(detailElements[i]).children('summary').text() == subCategory){
                            $(detailElements[i]).append("<details class='subcategory-two'><summary>"+this.subcategoryTwo+"</summary><div class='data-point last' data-type='"+this.type+"' data-set='"+this.csv+"' data-unit='"+this.unit+"' data-path='outcome.value'>"+this.title+"</div></details>");
                            break;
                        }
                    }
                }
                
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
                getOutcome(dataSet, dataType, dataButton);
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
        $('#y .data-button.selected').removeClass('selected');
        $('#y .picked-data-point.selected').text('+').removeClass('selected');
        $('.plot-button').removeClass('enabled');
    });
    
    $('.data-button').on('click', function(){
        var dimension = $(this).closest('.dimension').attr('id');
        $('.data-list.open').removeClass('open right');
        $('#' + dimension + ' .data-button.selected').removeClass('selected');
        $('#' + dimension + ' .picked-data-point.selected').text('+').removeClass('selected');
        $(this).addClass('selected');
        
        if ($('#x .data-button').hasClass('selected') && $('#y .data-button').hasClass('selected') && !$('.plot-button').hasClass('enabled')){
            $('.plot-button').addClass('enabled');
            enablePlotButton();
        };
        
        //hide existing chart
        $('.chart-guide').css('opacity', '1');
        $('.guide-text').text('Select data to plot on the X and Y axis, then click “Generate Scatterplot”. A plot will be generated here.');
        $('.chart-text').css('opacity', '0');
        $('.chart').css('opacity', '0');
    });
    
    $('.level-one').on('click', function(){
        var dimension = $(this).closest('.dimension').attr('id');
        $('#' + dimension + ' .level-two').removeClass('hidden')
            .children('.selected-value').text('Domains');
        $('#' + dimension + ' .level-three').addClass('hidden')
            .children('.selected-value').text('Specific Indicators');
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
                .append('<div class="data-list-item">Specific Indicators</div>');
            
            if (levelTwo != 'all'){
                var levelTwoMetrics = countryArray[0].domains[levelTwo].themes;
                $(levelTwoMetrics).each(function(i){
                    $('#' + dimension + ' .level-three .data-list').append('<div class="data-list-item" data-path="country.domains.'+levelTwo+'.themes.'+i+'.metric_count" data-unit="Number of Indicators">' + this.theme + '</div>');
                });
                activateLevelThreeList();
                
                $('#' + dimension + ' .data-button.selected').removeClass('selected');
                $('#' + dimension + ' .level-two').addClass('selected');
                $('#' + dimension + ' .level-three').removeClass('hidden')
                    .children('.selected-value').text('Specific Indicators');
            } else {
                $('#' + dimension + ' .data-button.selected').removeClass('selected');
                $('#' + dimension + ' .level-one').addClass('selected');
                $('#' + dimension + ' .level-three').addClass('hidden');
            };
        };
        
        $(this).parent().removeClass('open right');
    });
    
    var activateLevelThreeList = function(){
        $('.data-list-item').on('click', function(event){
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
                if (levelThree != 'Specific Indicators'){
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
    
    /// Statistical Analysis
    
    /** Computes Spearman's rho, adjusted for ties, by Nick Kullman (https://bl.ocks.org/nkullman/f65d5619843dc22e061d957249121408) */
    var computeSpearmans = function (arrX, arrY) {

        // simple error handling for input arrays of nonequal lengths
        if (arrX.length !== arrY.length) { return null; }

        // number of observations
        var n = arrX.length;

        // rank datasets
        var xRanked = rankArray(arrX),
            yRanked = rankArray(arrY);

        // sum of distances between ranks
        var dsq = 0;
        for (var i = 0; i < n; i++) {
            dsq += Math.pow(xRanked[i] - yRanked[i], 2);
        }

        // compute correction for ties
        var xTies = countTies(arrX),
            yTies = countTies(arrY);
        var xCorrection = 0,
            yCorrection = 0;
        for (var tieLength in xTies) {
            xCorrection += xTies[tieLength] * tieLength * (Math.pow(tieLength, 2) - 1)
        }
        xCorrection /= 12.0;
        for (var tieLength in yTies) {
            yCorrection += yTies[tieLength] * tieLength * (Math.pow(tieLength, 2) - 1)
        }
        yCorrection /= 12.0;

        // denominator
        var denominator = n * (Math.pow(n, 2) - 1) / 6.0;

        // compute rho
        var rho = denominator - dsq - xCorrection - yCorrection;
        rho /= Math.sqrt((denominator - 2 * xCorrection) * (denominator - 2 * yCorrection))

        return rho;
    }

    /** Computes the rank array for arr, where each entry in arr is 
     * assigned a value 1 thru n, where n is arr.length.
     * 
     * Tied entries in arr are each given the average rank of the ties.
     * Lower ranks are not increased
     */
    var rankArray = function (arr) {

        // ranking without averaging
        var sorted = arr.slice().sort(function (a, b) { return b - a });
        var ranks = arr.slice().map(function (v) { return sorted.indexOf(v) + 1 });

        // counts of each rank
        var counts = {};
        ranks.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

        // average duplicates
        ranks = ranks.map(function (x) { return x + 0.5 * ((counts[x] || 0) - 1); });

        return ranks;
    }

    /** Counts the number of ties in arr, and returns
     * an object with
     * a key for each tie length (an entry n for each n-way tie) and 
     * a value corresponding to the number of key-way (n-way) ties
     */
    var countTies = function (arr) {
        var ties = {},
            arrSorted = arr.slice().sort(),
            currValue = arrSorted[0],
            tieLength = 1;

        for (var i = 1; i < arrSorted.length; i++) {
            if (arrSorted[i] === currValue) {
                tieLength++;
            } else {
                if (tieLength > 1) {
                    if (ties[tieLength] === undefined) ties[tieLength] = 0;
                    ties[tieLength]++;
                }
                currValue = arrSorted[i];
                tieLength = 1;
            }
        }
        if (tieLength > 1) {
            if (ties[tieLength] === undefined) ties[tieLength] = 0;
            ties[tieLength]++;
        }
        return ties;
    }
    
    /** Compute Pearson's correlation coefficient */
    var computePearsons = function (arrX, arrY) {
        var num = covar(arrX, arrY);
        var denom = d3.deviation(arrX) * d3.deviation(arrY);
        return num / denom;
    }
    
    /** Computes the covariance between random variable observations
     * arrX and arrY
     */
    var covar = function (arrX, arrY) {
        var u = d3.mean(arrX);
        var v = d3.mean(arrY);
        var arrXLen = arrX.length;
        var sq_dev = new Array(arrXLen);
        var i;
        for (i = 0; i < arrXLen; i++)
            sq_dev[i] = (arrX[i] - u) * (arrY[i] - v);
        return d3.sum(sq_dev) / (arrXLen - 1);
    }
    
    var toTitleCase = function(str) {
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }
    
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
      
    });
    
};