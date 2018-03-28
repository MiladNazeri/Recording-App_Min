(function () {
    var message;

    var Play = function(){
        
    };

    Play.prototype = {
        preload: function(entityID) {
            var userData = JSON.parse(Entities.getEntityProperties(entityID, 'userData').userData);
            message = userData.message;
        },
        clickDownOnEntity: function () { 
            Messages.sendMessage("Messages_Control_Channel", JSON.stringify({type: message.type}));
        },
        unload: function(entityID) {
            
        }
    };

    return new Play();
});