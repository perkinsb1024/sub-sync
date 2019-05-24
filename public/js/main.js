$(function() {
    $(".syncTypeOffset").on("click", function(event) {
       $(".scaleOnly").hide();
    });    
    $(".syncTypeScale").on("click", function(event) {
       $(".scaleOnly").show();
    });    
})