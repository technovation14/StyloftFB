var app = require('../app.js')
var io = require('socket.io')();
var cmd = require('node-cmd');
var str2ab=require('string-to-arraybuffer');

var fs=require('fs');
var clients=[];
var client;
var userId=0;

io.on('connection', function(socket) {
  console.log("connected");
socket.userId = userId ++;

  socket.on("join",function(person){
console.log(person);
if(person.name){
console.log(person.name);
     client=person.name;
     socket.person=person.name;
    //socket.users.push(person);
    console.log("After adding client "+socket.person);
    socket.broadcast.emit("addMember",socket.person);

}
else{
 client=person;
    socket.person=person;
    //socket.users.push(person);
    console.log("After adding client "+socket.person);
    socket.broadcast.emit("addMember",socket.person);
}
   
  })
  var i=0;

  socket.on('stream',function(img){

    console.log("data received is "+img);
    socket.broadcast.emit('stream',img);
    // if(i==0){
    //
    //   var PythonShell = require('python-shell');
    //   PythonShell.run('Sample.py', function (err, results) {
    //     if (err) throw err;
    //     console.log('result: %j', results);
    //   });
    //   i++;
    // }



  });
  socket.on('showVid',function(video){
    socket.broadcast.emit('showVid',video);
  });
  socket.on('share',function(msg){
    console.log("gotr from unity");
    socket.broadcast.emit('share',msg);
  })
  socket.on('like',function(msg){
    console.log("gotr from unity");
    socket.broadcast.emit('like',msg);
  })
  socket.on('login',function(msg){
    console.log(msg);
    //socket.broadcast.emit("addMember",msg);
  })
  socket.on("delMember",function(name){
    console.log("emittong del of member");
    socket.broadcast.emit("delName",name);
  });
  socket.on("addPost",function(content){
    console.log("adding post");
    socket.broadcast.emit("updatePost",content);
  });
 
    socket.on("like",function(msg){
    console.log("liking the  post");
     console.log(msg);
    socket.broadcast.emit("incLike",msg);
  });

  socket.on("addComment",function(msg){
    console.log("commenting on  post");
     console.log(msg);
    socket.broadcast.emit("addingComment",msg);
  });

  socket.on("addImage",function(msg){
    console.log("adding img");
    // console.log(msg);

if(msg.file){
   var myBuffer = [];
   var str = msg.file;
   var buffer = new Buffer(str, 'utf16le');
  for (var i = 0; i < buffer.length; i++) {
      myBuffer.push(buffer[i]);
  }    
  // console.log(str2ab(msg.file));
   socket.broadcast.emit("addingImage",str2ab(msg.file));
}
else{
  // console.log(msg);
 console.log(typeof(msg));

   socket.broadcast.emit("addingImage",msg);
}

  });




socket.on("addVideoStream",function(msg){
  console.log("adding stream from unity");
 // console.log(msg);

  if(msg.file){
    var myBuffer = [];
    var str = msg.file;
    var buffer = new Buffer(str, 'utf16le');
    for (var i = 0; i < buffer.length; i++) {
      myBuffer.push(buffer[i]);
    }
    socket.broadcast.emit("addingStreamFromUnity",{photo:str2ab(msg.file),id:msg.id});
  }
});


  socket.on('disconnect', function (msg) {

       console.log('user disconnected');
   });

});


module.exports = io;
