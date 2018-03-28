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
        mousePressOnEntity: function () {
            print("### I just clicked");
            var messageToSend = JSON.stringify({type: message.type});
            print("message to send: ", messageToSend);
            Messages.sendMessage("Messages_Control_Channel", messageToSend);
        },
        unload: function(entityID) {
            
        }
    };

    return new Play();
});