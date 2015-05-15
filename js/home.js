////////////////////////////////////////
// Edge of Space
// Author: Luke Ellison
// Date: 27/4/2015
////////////////////////////////////////

// Closes the sidebar menu
$(document).ready(function() {
    $("#menu-close").click(function(e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("active");
        $("#menu-toggle").toggleClass("hide-menu-btn");
    });
});

$(document).ready(function() {
    // Opens the sidebar menu
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("active");
        $("#menu-toggle").toggleClass("hide-menu-btn");
    });
});
