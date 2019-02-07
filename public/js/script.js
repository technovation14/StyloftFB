var socket = io();


$(document).ready(function() {
  console.log(localStorage.user);
  if(localStorage.user){
    $("#username").html(localStorage.user);
    socket.emit("join",localStorage.user);
  }
  else window.location="http://10.201.92.195:4009/login"
  $('[data-toggle=offcanvas]').click(function() {
    $(this).toggleClass('visible-xs text-center');
    $(this).find('i').toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
    $('.row-offcanvas').toggleClass('active');
    $('#lg-menu').toggleClass('hidden-xs').toggleClass('visible-xs');
    $('#xs-menu').toggleClass('visible-xs').toggleClass('hidden-xs');
    $('#btnShow').toggle();

  });

  socket.on("appendUser",function(users){
    console.log(users);
  })

  socket.on('stream',function(image){
    $('#play').attr('src',image);
    $('#logger').text(image);
  });
  socket.on('share',function(msg){
    $('#logger2').text(msg);
    $("#currPost").css("display","block");
  });

});

socket.on("addMember",function(name){
  console.log("came to add member");
  $(".watching").append('<li id='+name+'><a href="#" class="" style="color:black"><span class="glyphicon glyphicon-globe" style="color:green"></span> '+name+'</a></li>');
});

socket.on("delName",function(name){
  console.log("came to remove member");
  $("#"+name).remove();
});



function logout(){
  console.log("came to logout");
  socket.emit("delMember",localStorage.user);
  localStorage.clear();
  $.get('/login');
  //  window.location.href="http://10.201.92.195:4009/login"
}

function postToFb(){
  var textData=$("#contentForPost").val();
  var id=$.now();
  var postContent=`
  <div class="panel panel-default" id=`+id+`>
  <div class="panel-thumbnail">
  <img id="play" class="img-responsive">
  </div>
  <div class="panel-body">
  <h6 style="color:blue"><a href="#" style="font-weight:bold;color:blue">`+localStorage.user+`</a></h6>
  <p class="lead">`+textData+`</p>
  <p><span class="glyphicon glyphicon-thumbs-up" id=likes`+id+` style="color:blue" onclick="like(this.id)">
  <span class="noOfLikes" style="color:black">2</span> <span style="color:black">people liked this</span>
  </span>
  </p>

  <p>
  <img src="img/dp.jpg" height="28px" width="28px" style="border-radius:15px">
  <input type="text" class="input" id=commentText`+id+` style="padding:1rem;border-radius:5px">
  <button class="btn btn-primary" onclick="addComment(`+id+`)">Add</button>
  </p>
  <div style="margin-left:4rem" id=comments`+id+`>  </div>
  </div>
  </div>
  `;
  $("#allposts").prepend(postContent);
  socket.emit("addPost",postContent);
}

socket.on("updatePost",function(content){
  console.log("adding post");
  $("#allposts").prepend(content);
});

function postImgToFb(photo){
  var id=$.now();
  var textData="from unity";
  var bytes = new Uint8Array(photo);

  var image = document.getElementById('image');
  var src = 'data:image/png;base64,'+encode(bytes);

  var postContent=`
  <div class="panel panel-default" id=`+id+`>
  <div class="panel-thumbnail">
  <img id="play" class="img-responsive" src="`+src+`">
  </div>
  <div class="panel-body">
  <h6 style="color:blue"><a href="#" style="font-weight:bold;color:blue">Unity</a></h6>
  <p class="lead">`+textData+`</p>
  <p><span class="glyphicon glyphicon-thumbs-up" id=likes`+id+` style="color:blue" onclick="like(this.id)">
  <span class="noOfLikes" style="color:black">2</span> <span style="color:black">people liked this</span>
  </span>
  </p>

  <p>
  <img src="img/dp.jpg" height="28px" width="28px" style="border-radius:15px">
  <input type="text" class="input" id=commentText`+id+` style="padding:1rem;border-radius:5px">
  <button class="btn btn-primary" onclick="addComment(`+id+`)">Add</button>
  </p>
  <div style="margin-left:4rem" id=comments`+id+`>  </div>
  </div>
  </div>
  `;
  $("#allposts").prepend(postContent);
}

socket.on("addingImage",function(content){
  console.log("content",content);
  postImgToFb(content);

});

function like(id){
  console.log(id);

  var likes= $('#'+id).find('.noOfLikes').html();
  console.log(likes);
  var num=parseInt(likes);
  num++;
  $('#'+id).find('.noOfLikes').html(num);
  socket.emit('like',{"postId":id});
}
socket.on('incLike',function(lid){
  var likes= $('#'+lid.postId).find('.noOfLikes').html();
  if(likes){
    console.log(likes);
    var num=parseInt(likes);
    num++;
    $('#'+lid.postId).find('.noOfLikes').html(num);
  }
})

function addComment(id){
  console.log(id);
  console.log($("#commentText"+id));
  var commentText=$("#commentText"+id).val();
  console.log(commentText);
  var comment=`
  <h6 style="color:blue">`+localStorage.user+`</h6>
  <p>`+commentText+`</p>
  `;
  $("#comments"+id).prepend(comment);

  socket.emit("addComment",{"id":id,"commentText":commentText,"commentBy":localStorage.user});
  var commentText=$("#commentText"+id).val("");
}

socket.on("addingComment",function(msg){
  var comment=`
  <h6 style="color:blue">`+msg.commentBy+`</h6>
  <p>`+msg.commentText+`</p>
  `;
  $("#comments"+msg.id).prepend(comment);

  // $("#comments"+msg.id).prepend(comment);
})

var unityVideoId;
//testing video stream from unity
function streamVideoFromUnity(data){
  unityVideoId=data.id;
  var textData="from unity";
  var bytes = new Uint8Array(data.photo);

  var image = document.getElementById('imageUnity');
  var src = 'data:image/png;base64,'+encode(bytes);
  //$("#play").attr("src",src);
  var postContent=`

  <img id="play" class="img-responsive" src="`+src+`">

  `;

  $("#unitypost").html(postContent);
}


socket.on("addingStreamFromUnity",function(content){
  console.log("content",content);
  streamVideoFromUnity(content);

});

//testing video stream from unity



function encode (input) {
  var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  var i = 0;

  while (i < input.length) {
    chr1 = input[i++];
    chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
    chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
    keyStr.charAt(enc3) + keyStr.charAt(enc4);
  }
  return output;
}
