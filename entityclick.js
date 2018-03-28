(function () { 
    var Play = function(){

    };

    Play.prototype = {
        clickDownOnEntity: function () { 
            this.a = !this.a; 
            if (this.a) {
                Messages.sendMessage("Messages_Control_Channel", JSON.stringify({type: "Start"}));
            } else {
                Messages.sendMessage("Messages_Control_Channel", JSON.stringify({type: "Stop"}));
            }
        },
        unload: function(entityID) {
            
        }
    };

    return new Play();
});