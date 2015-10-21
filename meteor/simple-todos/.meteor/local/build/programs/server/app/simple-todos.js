(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// simple-todos.js                                                     //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
if (Meteor.isClient) {                                                 // 1
  // This code only runs on the client                                 //
  Template.body.helpers({                                              // 3
    tasks: [{ text: "This is task 1" }, { text: "This is task 2" }, { text: "This is task 3" }]
  });                                                                  //
}                                                                      //
                                                                       //
if (Meteor.isServer) {                                                 // 12
  Meteor.startup(function () {                                         // 13
    // code to run on server at startup                                //
  });                                                                  //
}                                                                      //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=simple-todos.js.map
