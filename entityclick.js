(function () {
    var message;

    var Play = function(){
        
    };

    Play.prototype = {
        preload: function(entityID) {
            var userData = JSON.parse(Entities.getEntityProperties(entityID, 'userData').userData);
            print("userData=", JSON.stringify(userData));
            message = userData.message;
        },
        clickDownOnEntity: function () {
            print("### I just clicked");
            Messages.sendMessage("Messages_Control_Channel", JSON.stringify({type: message.type}));
        },
        unload: function(entityID) {
            
        }
    };

    return new Play();
});