window.onload = function(){
    var homocideArray = [];
    var countryArray = JSON.parse(localStorage.getItem('countryArray'));
    var linkedArray = [];
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
    
    d3.csv('data/homocide_outcomes.csv', function(data){
        data.forEach(function(d, i){
            var country = new Object;
            country.name = d['Country/ territory'];
            country.source = d.Source;
            country.year = d.Year;
            country.males = parseInt(d.Males);
            country.females = parseInt(d.Females);
            country.homocide = d['Any Homicide'];
            
            homocideArray.push(country);
        });
        linkData();
    });
    
    function linkData(){
        $(countryArray).each(function(){
            var country = this;
            $(homocideArray).each(function(){
                if (country.name == this.name){
                    var linkedData = new Object;
                    linkedData.country = country;
                    linkedData.homocide = this;
                    linkedArray.push(linkedData);
                };
            });
        });
        console.log(linkedArray);
    };
    
    function plotData(x, y, xText, yText){
        var xData = x.split('.');
        var yData = y.split('.');
        var xText = xText;
        var yText = yText;
        
        var dataArray = [];
        $(linkedArray).each(function(){
            var dataObj = new Object();
            dataObj.name = this.country.name;
            dataObj.x = getValue(this, xData);
            dataObj.y = getValue(this, yData);
            
            if (dataObj.x && dataObj.y){
                dataArray.push(dataObj);
            } else {
                console.log('null');
            };
        });
        
        console.log(dataArray);
        
        var lg = calcLinear(dataArray, "x", "y", d3.min(dataArray, function(d){return d.x}), d3.min(dataArray, function(d){return d.y}));
        console.log(lg);
           
        var padding = {top:20, right:20, bottom:20, left:30};
            
        var xScale = d3.scaleLinear()
            .domain([0, d3.max(dataArray, function(d){return d.x})])
            .range([padding.left, svgWidth - padding.right]);
        
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataArray, function(d){return d.y})])
            .range([svgHeight - padding.bottom, padding.top]);
        
        var xAxis = d3.axisBottom(xScale).ticks(10);
        var yAxis = d3.axisLeft(yScale);
        
        var plot = svg.append('g')
            .attr('class', 'plot');
        
        plot.append("line")
	        .attr("class", "regression")
	        .attr("x1", xScale(lg.ptA.x))
	        .attr("y1", yScale(lg.ptA.y))
	        .attr("x2", xScale(lg.ptB.x))
	        .attr("y2", yScale(lg.ptB.y));
                        
        plot.selectAll("circle")
            .data(dataArray)
            .enter()
            .append("circle")
            .attr('class', 'point')
            .attr("cx", function(d) {return xScale(d.x)})
            .attr("cy", function(d) {return yScale(d.y)})
            .attr("r", 5)
            .on('mouseenter', function(d){
                $(this).addClass('point-hover');
                hoverPoint(d)
            }).on('mousemove', function(d){
                $(this).addClass('point-hover');
                hoverPoint(d)
            }).on('mouseleave', function(d){
                $('.chart-hover').removeClass('show')
                $(this).removeClass('point-hover');
            });
        
        function hoverPoint(data){
            var mouseX = event.clientX + 14;
            var mouseY = $(window).scrollTop() + event.clientY - 3;
            
            $('.chart-hover .country-name').text(data.name);
            $('.chart-hover .country-data-x').html(xText + ': ' + data.x);
            $('.chart-hover .country-data-y').html(yText + ': ' + data.y);
            
            var chartHoverWidth = $('.chart-hover').innerWidth();
            $('.chart-hover').addClass('show')
                .css({'top': mouseY + 'px', 'left': mouseX - chartHoverWidth - 24 + 'px'});
        };
        
        plot.append("g")
            .call(xAxis)
            .attr("transform", "translate(0," + (svgHeight - padding.bottom) + ")")
            .attr("class", "axis");
        
        plot.append("g")
            .call(yAxis)
            .attr("transform", "translate(" + padding.left + ",0)")
            .attr("class", "axis");
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
    
    // Calculate a linear regression from the data (From: https://bl.ocks.org/HarryStevens/be559bed98d662f69e68fc8a7e0ad097)

    // Takes 5 parameters:
    // (1) Your data
    // (2) The column of data plotted on your x-axis
    // (3) The column of data plotted on your y-axis
    // (4) The minimum value of your x-axis
    // (5) The minimum value of your y-axis

    // Returns an object with two points, where each point is an object with an x and y coordinate

    function calcLinear(data, x, y, minX, minY){
      /////////
      //SLOPE//
      /////////

      // Let n = the number of data points
      var n = data.length;

      // Get just the points
      var pts = [];
      data.forEach(function(d,i){
        var obj = {};
        obj.x = d[x];
        obj.y = d[y];
        obj.mult = obj.x*obj.y;
        pts.push(obj);
      });

      // Let a equal n times the summation of all x-values multiplied by their corresponding y-values
      // Let b equal the sum of all x-values times the sum of all y-values
      // Let c equal n times the sum of all squared x-values
      // Let d equal the squared sum of all x-values
      var sum = 0;
      var xSum = 0;
      var ySum = 0;
      var sumSq = 0;
      pts.forEach(function(pt){
        sum = sum + pt.mult;
        xSum = xSum + pt.x;
        ySum = ySum + pt.y;
        sumSq = sumSq + (pt.x * pt.x);
      });
      var a = sum * n;
      var b = xSum * ySum;
      var c = sumSq * n;
      var d = xSum * xSum;

      // Plug the values that you calculated for a, b, c, and d into the following equation to calculate the slope
      // slope = m = (a - b) / (c - d)
      var m = (a - b) / (c - d);

      /////////////
      //INTERCEPT//
      /////////////

      // Let e equal the sum of all y-values
      var e = ySum;

      // Let f equal the slope times the sum of all x-values
      var f = m * xSum;

      // Plug the values you have calculated for e and f into the following equation for the y-intercept
      // y-intercept = b = (e - f) / n
      var b = (e - f) / n;

//			// Print the equation below the chart
//			document.getElementsByClassName("equation")[0].innerHTML = "y = " + m + "x + " + b;
//			document.getElementsByClassName("equation")[1].innerHTML = "x = ( y - " + b + " ) / " + m;

      // return an object of two points
      // each point is an object with an x and y coordinate
      return {
        ptA : {
          x: minX,
          y: m * minX + b
        },
        ptB : {
          y: minY,
          x: (minY - b) / m
        }
      }

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
        } else {
            yText = $('#y .data-button.selected').text();
        };
        
        console.log(xText, yText);
        console.log(xPath, yPath);
        
        plotData(xPath, yPath, xText, yText);
    });
    
    $('.data-button').on('click', function(){
        var dimension = $(this).closest('.dimension').attr('id');
        $('#' + dimension + ' .data-button.selected').removeClass('selected');
        $(this).addClass('selected');
    });
    
    $('.level-one').on('click', function(){
        var dimension = $(this).closest('.dimension').attr('id');
        $('#' + dimension + ' .level-two').removeClass('hidden')
            .children('.selected-value').text('All Metrics');
        $('#' + dimension + ' .level-three').addClass('hidden')
            .children('.selected-value').text('All Metrics');
    });
    
    $('.level-two').on('click', function(){
        var dataList = $(this).children('.data-list');
        if ($(dataList).hasClass('open')){
            $(dataList).removeClass('open');
        } else {
            $(dataList).addClass('open');
        }
    });
    
    $('.level-three').on('click', function(){
        var dataList = $(this).children('.data-list');
        if ($(dataList).hasClass('open')){
            $(dataList).removeClass('open');
        } else {
            $(dataList).addClass('open');
        }
    });
    
    $('.data-list-item').on('click', function(event){
        var dimension = $(this).closest('.dimension').attr('id');
        var dataButton = $(this).parent().parent();
        var newText = $(this).text();
        var newPath = $(this).attr('data-path');
        
        $(this).parent().siblings('.selected-value').text(newText);
        $(dataButton).attr('data-path', newPath);
        
        if ($(dataButton).hasClass('level-two')){ //if this is the level two list
            var levelTwo = $(this).attr('data-value');
            $('#' + dimension + ' .level-three .data-list').empty()
                .append('<div class="data-list-item">All Metrics</div>');
            
            if (levelTwo != 'all'){
                var levelTwoMetrics = countryArray[0].domains[levelTwo].themes;
                $(levelTwoMetrics).each(function(i){
                    $('#' + dimension + ' .level-three .data-list').append('<div class="data-list-item" data-path="country.domains.'+levelTwo+'.themes.'+i+'.metric_count" data-index="'+i+'">' + this.theme + '</div>');
                });
                activateLevelThreeList();
                
                $('#' + dimension + ' .data-button.selected').removeClass('selected');
                $('#' + dimension + ' .level-two').addClass('selected');
                $('#' + dimension + ' .level-three').removeClass('hidden')
                    .children('.selected-value').text('All Metrics');
            } else {
                $('#' + dimension + ' .data-button.selected').removeClass('selected');
                $('#' + dimension + ' .level-one').addClass('selected');
                $('#' + dimension + ' .level-three').addClass('hidden');
            };
        };
    });
    
    var activateLevelThreeList = function(){
        $('.data-list-item').on('click', function(){
            var dimension = $(this).closest('.dimension').attr('id');
            var dataButton = $(this).parent().parent();
            var newText = $(this).text();
            var newPath = $(this).attr('data-path');
            
            $(this).parent().siblings('.selected-value').text(newText);
            $(dataButton).attr('data-path', newPath);
            
            if ($(dataButton).hasClass('level-three')){ //if this is the level three list
                var levelThree = $(this).text();
                if (levelThree != 'All Metrics'){
                    $('#' + dimension + ' .data-button.selected').removeClass('selected');
                    $('#' + dimension + ' .level-three').addClass('selected');
                } else {
                    $('#' + dimension + ' .data-button.selected').removeClass('selected');
                    $('#' + dimension + ' .level-two').addClass('selected');
                };
            };
        });
    };
    
};