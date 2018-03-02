window.onload = function(){
    var homocideArray = [];
    var countryArray = JSON.parse(localStorage.getItem('countryArray'));
    var countryHomocides = [];
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
            .attr("height", svgHeight);
    
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
                    var countryHomocide = new Object;
                    countryHomocide.country = country;
                    countryHomocide.homocide = this;
                    countryHomocides.push(countryHomocide);
                };
            });
        });
        console.log(countryHomocides);
        getOptions();
    };
    
    function getOptions(){
        var xVal = $('.x-axis').val();
        var xText = $('.x-axis option:selected').text();
        var yVal = $('.y-axis').val();
        var yText = $('.y-axis option:selected').text();
        
        plotData('homocide.' + xVal, 'country.domains.' + yVal + '.metric_count', xText, yText);
    };
    
    function plotData(x, y, xText, yText){
        var xData = x.split('.');
        var yData = y.split('.');
        var xText = xText;
        var yText = yText;
        
        var padding = {top:20, right:20, bottom:20, left:30};
        
        var xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([padding.left, svgWidth - padding.right]);
        
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(countryHomocides, function(d){return getter(d, yData[0], yData[1], yData[2], yData[3]);})])
            .range([svgHeight - padding.bottom, padding.top]);
        
        var xAxis = d3.axisBottom(xScale).ticks(10);
        var yAxis = d3.axisLeft(yScale);
        
        var plot = svg.append('g')
            .attr('class', 'plot');
                        
        plot.selectAll("circle")
            .data(countryHomocides)
            .enter()
            .append("circle")
            .attr('class', 'point')
            .attr("cx", function(d) {
                return xScale(getter(d, xData[0], xData[1]));
            }).attr("cy", function(d) {
                return yScale(getter(d, yData[0], yData[1], yData[2], yData[3]));
            }).attr("r", 5)
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
            
            $('.chart-hover .country-name').text(data.country.name);
            $('.chart-hover .country-data-x').html(xText + ': ' + getter(data, xData[0], xData[1]));
            $('.chart-hover .country-data-y').html(yText + ': ' + getter(data, yData[0], yData[1], yData[2], yData[3]));
            
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
    
    $('select').on('change', function(){
        svg.selectAll('.plot').remove();
        var xVal = $('.x-axis').val();
        var xText = $('.x-axis option:selected').text();
        var yVal = $('.y-axis').val();
        var yText = $('.y-axis option:selected').text();
        
        plotData('homocide.' + xVal, 'country.domains.' + yVal + '.metric_count', xText, yText);
    });
}