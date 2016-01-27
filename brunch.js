Restaurants = new Mongo.Collection("restaurants");

if (Meteor.isClient) {

    Template.body.helpers({
        restaurants: function () {
            return Restaurants.find({}, {sort: {createdAt: -1}});
        },
        restaurantCount: function () {
            return Restaurants.find().count();
        }
    });

    Template.body.events({
        "submit .new-restaurant": function (event) {
            // Prevent default browser form submit
            event.preventDefault();

            // get some output
            console.log(event);

            // Get value from form element
            var name = event.target.name.value;
            var timeReady = event.target.timeReady.value;

            // Insert a task into the collection
            Restaurants.insert({
                name: name,
                timeReady: timeReady,
                createdAt: new Date(), // current time
                owner: Meteor.userId(),           // _id of logged in user
                username: Meteor.user().username  // username of logged in user
            });

            // Clear form
            event.target.name.value = "";
            event.target.timeReady.value = "";
        }
    });

    Template.restaurant.events({
        "click .delete": function () {
            Restaurants.remove(this._id);
        }
    });

    Meteor.startup(function () {
        setInterval(function () {
            Meteor.call("getServerTime", function (error, result) {
                var time = result;
                var hours   = result.getHours();
                var minutes = result.getMinutes();
                var seconds = result.getSeconds();
                var timeString = "" + ((hours > 12) ? hours - 12 : hours);
                timeString  += ((minutes < 10) ? ":0" : ":") + minutes;
                timeString  += ((seconds < 10) ? ":0" : ":") + seconds;
                timeString  += (hours >= 12) ? " pm" : " am";

                Session.set("timeString", timeString);
                Session.set("time", time);
            });
        }, 500);
    });

    Template.time.timeString = function () {
        return Session.get("timeString");
    };


}

if (Meteor.isServer) {
    Meteor.methods({
        getServerTime: function () {
            return new Date();
        }
  });
}
