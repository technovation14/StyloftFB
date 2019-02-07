$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $(this).toggleClass('visible-xs text-center');
    $(this).find('i').toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
    $('.row-offcanvas').toggleClass('active');
    $('#lg-menu').toggleClass('hidden-xs').toggleClass('visible-xs');
    $('#xs-menu').toggleClass('visible-xs').toggleClass('hidden-xs');
    $('#btnShow').toggle();
  });
  var socket = io();
  socket.on('stream',function(image){
    $('#play').attr('src',image);
    $('#logger').text(image);
  });
  socket.on('share',function(msg){
    $('#logger2').text(msg);
    $("#currPost").css("display","block");
  });


function like(){
  var likes=$('.noOfLikes').html();
  var num=parseInt(likes);
  num++;
  $('.noOfLikes').html(num);
  // socket.emit('like',function(msg){
  //
  // });

}

});
