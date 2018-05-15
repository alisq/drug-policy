window.onload = function(){
    var outcomeArray = [];
    var countryArray;
    var linkedArray = [];
    
    var outCrimeArray = [
        ['Assault at the national level, number of police-recorded offences', 'assault'],
        ['Kidnapping at the national level, number of police-recorded offences', 'kidnapping'],
        ['Theft at the national level, number of police-recorded offences', 'theft'],
        ['Robbery at the national level, number of police-recorded offences', 'robbery']
    ];
    
    function getCountries(){
        return $.get('/countries');
    };

    $.when(getCountries()).done(function(data){
        countryArray = data;
    });
    
    var windowWidth = $(window).width();
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
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .attr("overflow", "visible");
    
    function plotData(x, y, xText, yText){
        var xData = x.split('.');
        var yData = y.split('.');
        var xText = xText;
        var yText = yText;
        
        var dataArray = [];
        var countryNameArray = [];
        
        $(linkedArray).each(function(){
            var dataElement = [];
            dataElement[0] = Number(getValue(this, xData));
            dataElement[1] = Number(getValue(this, yData));
            
            if (dataElement[0] && dataElement[1]){
                dataArray.push(dataElement);
                countryNameArray.push(this.country.name);
            } else {
                console.log('No X and/or Y data avalible for country');
            };
        });
        
        var lr = ss.linearRegression(dataArray);
        var lrLine = ss.linearRegressionLine(lr);
        var xMax = d3.max(dataArray, function(d){return d[0]});
           
        var padding = {top:20, right:20, bottom:20, left:30};
            
        var xScale = d3.scaleLinear()
            .domain([0, xMax])
            .range([padding.left, svgWidth - padding.right]);
        
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataArray, function(d){return d[1]})])
            .range([svgHeight - padding.bottom, padding.top]);
        
        var xAxis = d3.axisBottom(xScale).ticks(10);
        var yAxis = d3.axisLeft(yScale);
        
        var plot = svg.append('g')
            .attr('class', 'plot');
        
        plot.append("line")
	        .attr("class", "regression")
	        .attr("x1", xScale(0))
	        .attr("y1", yScale(lrLine(0)))
	        .attr("x2", xScale(xMax))
	        .attr("y2", yScale(lrLine(xMax)));
                        
        plot.selectAll("circle")
            .data(dataArray)
            .enter()
            .append("circle")
            .attr('class', 'point')
            .attr("cx", function(d) {return xScale(d[0])})
            .attr("cy", function(d) {return yScale(d[1])})
            .attr("r", 5)
            .on('mouseenter', function(d, i){
                $(this).addClass('point-hover');
                var countryName = countryNameArray[i];
                hoverPoint(d, countryName)
            }).on('mousemove', function(d, i){
                $(this).addClass('point-hover');
                var countryName = countryNameArray[i];
                hoverPoint(d, countryName)
            }).on('mouseleave', function(d){
                $('.chart-hover').removeClass('show')
                $(this).removeClass('point-hover');
            });
        
        function hoverPoint(data, countryName){
            var mouseX = event.clientX + 14;
            var mouseY = $(window).scrollTop() + event.clientY - 3;
            
            $('.chart-hover .country-name').text(countryName);
            $('.chart-hover .country-data-x').html(xText + ' <span class="amount">' + data[0] + '</span>');
            $('.chart-hover .country-data-y').html(yText + ' <span class="amount">' + data[1] + '</span>');
            
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
            .attr("transform", "translate(" + padding.left + ",0)")
            .attr("class", "axis");
        
        $('.dimension-title.x-axis .dimension-text').text(xText);
        $('.dimension-title.y-axis .dimension-text').text(yText);
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
    
    function getOutcome(dataset){
        outcomeArray = [];
        d3.csv('data/outcomes/'+dataset+'.csv', function(data){
            data.forEach(function(d){
                var country = new Object;
                country.name = d.Country;
                country.outcome = Number(d.Data);
                
                if (country.name.indexOf('*') > -1){
                    country.name = country.name.replace('*','');
                }
                outcomeArray.push(country);
            });
            joinData();
        });
    };
    
    function joinData(){
        linkedArray = [];
        $(countryArray).each(function(){
            var country = this;
            $(outcomeArray).each(function(){
                if (country.name == this.name){
                    var linkedData = new Object;
                    linkedData.country = country;
                    linkedData.outcome = this.outcome;
                    linkedArray.push(linkedData);
                };
            });
        });
        console.log(linkedArray);
    };
    
    $('.plot-button.enabled').on('click', function(){
        svg.selectAll('.plot').remove();
        
        var xPath = $('#x .data-button.selected').attr('data-path');
        var yPath = $('#y .data-button.selected').attr('data-path');
        
        var xText;
        var yText;
        
        if ($('#x .data-button.selected').children('.selected-value').length > 0){
            xText = $('#x .data-button.selected .selected-value').text();
        } else {
            xText = $('#x .data-button.selected').text();
        };
        
        if ($('#y .data-button.selected').children('.selected-value').length > 0){
            yText = $('#y .data-button.selected .selected-value').text();
        } else if ($('#y .data-button.selected').children('.picked-data-point').length > 0){
            var dataTitle = $('#y .data-button.selected .nest-title').text();
            console.log(dataTitle);
            var dataSubTitle = $('#y .data-button.selected .picked-data-point').text();
            yText = dataTitle + ': ' + dataSubTitle;
        } else {
            yText = $('#y .data-button.selected').text();
        };
        
        console.log('X: ' + xText,'Y: ' + yText);
        console.log('X: ' + xPath,'Y: ' + yPath);
        
        plotData(xPath, yPath, xText, yText);
    });
    
    $('.outcome-nest').on('click', function(){
        var dataNest = $(this).attr('data-nest');
        var dataTitle = $(this).children('.nest-title').text();
        var dataButton = this;
        var dataNestArray;
        
        if (dataNest == 'crime'){
            dataNestArray = outCrimeArray;
        };
        
        $('.data-modal-list').html('');
        
        $(dataNestArray).each(function(){
            $('.data-modal-list').append("<div class='data-point last' data-set='"+this[1]+"' data-path='outcome'>"+this[0]+"</div>");
            
            $('.data-point.last').on('click', function(){
                var dataPointTitle = $(this).text();
                var dataSet = $(this).attr('data-set');
                var dataPath = $(this).attr('data-path');
                
                $('.data-window').removeClass('show');
                
                $(dataButton).attr('data-path', dataPath)
                    .children('.picked-data-point').text(dataPointTitle).addClass('selected');
                getOutcome(dataSet);
            }).removeClass('last');
        });
        
        $('.data-modal header').text('Select '+dataTitle+' Data to Plot on Y Axis');
        $('.data-window').addClass('show');
    });
    
    $('.data-button').on('click', function(){
        var dimension = $(this).closest('.dimension').attr('id');
        $('.data-list.open').removeClass('open right');
        $('#' + dimension + ' .data-button.selected').removeClass('selected');
        $('#' + dimension + ' .picked-data-point.selected').text('+').removeClass('selected');
        $(this).addClass('selected');
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
        
        $(this).parent().siblings('.selected-value').text(newText);
        $(dataButton).attr('data-path', newPath);
        
        if ($(dataButton).hasClass('level-two')){ //if this is the level two list
            var levelTwo = $(this).attr('data-value');
            $('#' + dimension + ' .level-three .data-list').empty()
                .append('<div class="data-list-item">Specific Metrics</div>');
            
            if (levelTwo != 'all'){
                var levelTwoMetrics = countryArray[0].domains[levelTwo].themes;
                $(levelTwoMetrics).each(function(i){
                    $('#' + dimension + ' .level-three .data-list').append('<div class="data-list-item" data-path="country.domains.'+levelTwo+'.themes.'+i+'.metric_count" data-index="'+i+'">' + this.theme + '</div>');
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
            
            $(this).parent().siblings('.selected-value').text(newText);
            $(dataButton).attr('data-path', newPath);
            
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
    
};