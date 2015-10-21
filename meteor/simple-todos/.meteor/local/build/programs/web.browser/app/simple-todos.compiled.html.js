(function(){
Template.body.addContent((function() {
  var view = this;
  return HTML.DIV({
    "class": "container"
  }, HTML.Raw("\n    <header>\n      <h1>Todo List</h1>\n    </header>\n \n    "), HTML.UL("\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("tasks"));
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("task")), "\n      " ];
  }), "\n    "), "\n  ");
}));
Meteor.startup(Template.body.renderToDocument);

Template.__checkName("task");
Template["task"] = new Template("Template.task", (function() {
  var view = this;
  return HTML.LI(Blaze.View("lookup:text", function() {
    return Spacebars.mustache(view.lookup("text"));
  }));
}));

}).call(this);
