$('.nav-countries').click(function(){
    localStorage.setItem('countryArray', JSON.stringify(countryArray));
    window.location = 'countries.html';
});

$('.nav-themes').click(function(){
    localStorage.setItem('countryArray', JSON.stringify(countryArray));
    window.location = 'themes.html';
});

$('.nav-analysis').click(function(){
    localStorage.setItem('countryArray', JSON.stringify(countryArray));
    window.location = 'themes.html';
});