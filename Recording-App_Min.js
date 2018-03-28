"use strict";

//
//  record.js
//
//  Created by David Rowe on 5 Apr 2017.
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
// http://mpassets.highfidelity.com/f8b8915a-70da-4d50-902a-72e27a9edb4e-v1/record.js

(function () {
    
    var Player,
        APP_NAME = "Recording-App_Min",
        updateHandler,
        scriptStart = null,
        playBackObjectArray = [],
        dateNow,
        dateNowMinusScriptStart,
        varianceCheckResult,
        MESSAGES_CHANNEL = "Messages_Control_Channel",
        variance = 100;
    
    function log(message) {
        print(APP_NAME + ": " + message);
    }

    function error(message, info) {
        print(APP_NAME + ": " + message + (info !== undefined ? " - " + info : ""));
        Window.alert(message);
    }

    function logDetails() {
        return {
            current_domain: location.placename
        };
    }

    Player = (function () {
        var HIFI_RECORDER_CHANNEL = "HiFi-Recorder-Channel",
            RECORDER_COMMAND_ERROR = "error",
            HIFI_PLAYER_CHANNEL = "HiFi-Player-Channel",
            PLAYER_COMMAND_PLAY = "play",
            PLAYER_COMMAND_STOP = "stop",

            playerIDs = [],             // UUIDs of AC player scripts.
            playerIsPlayings = [],      // True if AC player script is playing a recording.
            playerRecordings = [],      // Assignment client mappings of recordings being played.
            playerTimestamps = [],      // Timestamps of last heartbeat update from player script.

            updateTimer,
            UPDATE_INTERVAL = 5000;  // Must be > player's HEARTBEAT_INTERVAL.

        function numberOfPlayers() {
            return playerIDs.length;
        }

        function updatePlayers() {
            var now = Date.now(),
                countBefore = playerIDs.length,
                i;

            // Remove players that haven't sent a heartbeat for a while.
            for (i = playerTimestamps.length - 1; i >= 0; i -= 1) {
                if (now - playerTimestamps[i] > UPDATE_INTERVAL) {
                    playerIDs.splice(i, 1);
                    playerIsPlayings.splice(i, 1);
                    playerRecordings.splice(i, 1);
                    playerTimestamps.splice(i, 1);
                }
            }

            // Update UI.
            if (playerIDs.length !== countBefore) {
                Dialog.updatePlayerDetails(playerIsPlayings, playerRecordings, playerIDs);
            }
        }

        function playRecording(recording, position, orientation) {
            var index;

            // Optional function parameters.
            if (position === undefined) {
                position = MyAvatar.position;
            }
            if (orientation === undefined) {
                orientation = MyAvatar.orientation;
            }

            index = playerIsPlayings.indexOf(false);
            if (index === -1) {
                error("No player instance available to play recording "
                    + recording.slice(4) + "!");  // Remove leading "atp:" from recording.
                return;
            }
			//playerIsPlayings[index] = "Will be filled soon by update message from server";
			log ("Sending message:" + JSON.stringify({
							player: playerIDs[index],
							command: PLAYER_COMMAND_PLAY,
							recording: recording,
							position: position,
							orientation: orientation
						}));

            Messages.sendMessage(HIFI_PLAYER_CHANNEL, JSON.stringify({
                player: playerIDs[index],
                command: PLAYER_COMMAND_PLAY,
                recording: recording,
                position: position,
                orientation: orientation
            }));
        }

        function stopPlayingRecording(playerID) {
            Messages.sendMessage(HIFI_PLAYER_CHANNEL, JSON.stringify({
                player: playerID,
                command: PLAYER_COMMAND_STOP
            }));
        }

        function stopPlayingAllRecordings() {
            playerIDs.forEach(function(playerID) {
                Messages.sendMessage(HIFI_PLAYER_CHANNEL, JSON.stringify({
                    player: playerID,
                    command: PLAYER_COMMAND_STOP
                }));
            })
            reset();
        }

        function onMessageReceived(channel, message, sender) {
            // Heartbeat from AC script.
            var index;
            //log ("Heartbeat_onMessageReceived: channel=" + channel + ",sender=" + JSON.stringify(sender)+ ",message="+JSON.stringify(message) );

            if (channel !== HIFI_RECORDER_CHANNEL) {
                return;
            }

            message = JSON.parse(message);

            if (message.command === RECORDER_COMMAND_ERROR) {
                if (message.user === MyAvatar.sessionUUID) {
                    error(message.message);
                }
            } else {
                index = playerIDs.indexOf(sender);
                if (index === -1) {
                    index = playerIDs.length;
                    playerIDs[index] = sender;
                }
                playerIsPlayings[index] = message.playing;
                playerRecordings[index] = message.recording;
                playerTimestamps[index] = Date.now();
            }
        }

        function reset() {
            playerIDs = [];
            playerIsPlayings = [];
            playerRecordings = [];
            playerTimestamps = [];
        }

        function setUp() {
            // Messaging with AC scripts.
            Messages.messageReceived.connect(onMessageReceived);
            Messages.subscribe(HIFI_RECORDER_CHANNEL);

            updateTimer = Script.setInterval(updatePlayers, UPDATE_INTERVAL);
        }

        function tearDown() {
            Script.clearInterval(updateTimer);

            Messages.messageReceived.disconnect(onMessageReceived);
            Messages.subscribe(HIFI_RECORDER_CHANNEL);
        }

        return {
            playRecording: playRecording,
            stopPlayingRecording: stopPlayingRecording,
            stopPlayingAllRecordings: stopPlayingAllRecordings,
            numberOfPlayers: numberOfPlayers,
            reset: reset,
            setUp: setUp,
            tearDown: tearDown
        };
    }());
    
    playBackObjectArray.push(
        {
            recording: "Robby",
            playbackStart: 0500,
            recordingFile: "atp:" + "/recordings/MIPTV18-Robby-Eng.hfr",
            playbackPosition: null,
            playbackOrientation: null,
            playing: false
        },
        {
            recording: "ParkingPot",
            playbackStart: 7100,
            recordingFile: "atp:" + "/recordings/MIPTV18-ParkingPot-Eng.hfr",
            playbackPosition: null,
            playbackOrientation: null,
            playing: false
        },
        {
            recording: "EggSmell",
            playbackStart: 27600,
            recordingFile: "atp:" + "/recordings/MIPTV18-EggSmell-Eng.hfr",
            playbackPosition: null,
            playbackOrientation: null,
            playing: false
        },
        {
            recording: "LadyJug",
            playbackStart: 53500,
            recordingFile: "atp:" + "/recordings/MIPTV18-LadyJug-Eng.hfr",
            playbackPosition: null,
            playbackOrientation: null,
            playing: false
        },
        {
            recording: "CavePan",
            playbackStart: 75800,
            recordingFile: "atp:" + "/recordings/MIPTV18-CavePan-Eng.hfr",
            playbackPosition: null,
            playbackOrientation: null,
            playing: false
        },
        {
            recording: "NoseBook",
            playbackStart: 101000,
            recordingFile: "atp:" + "/recordings/MIPTV18-NoseBook-Eng.hfr",
            playbackPosition: null,
            playbackOrientation: null,
            playing: false
        },
        {
            recording: "Robby",
            playbackStart: 0500,
            recordingFile: "atp:" + "/recordings/MIPTV18-Robby-Eng.hfr",
            playbackPosition: null,
            playbackOrientation: null,
            playing: false
        },
        {
            recording: "ParkingPot",
            playbackStart: 7100,
            recordingFile: "atp:" + "/recordings/MIPTV18-ParkingPot-Eng.hfr",
            playbackPosition: null,
            playbackOrientation: null,
            playing: false
        },
        {
            recording: "EggSmell",
            playbackStart: 27600,
            recordingFile: "atp:" + "/recordings/MIPTV18-EggSmell-Eng.hfr",
            playbackPosition: null,
            playbackOrientation: null,
            playing: false
        },
        {
            recording: "LadyJug",
            playbackStart: 53500,
            recordingFile: "atp:" + "/recordings/MIPTV18-LadyJug-Eng.hfr",
            playbackPosition: null,
            playbackOrientation: null,
            playing: false
        },
        {
            recording: "CavePan",
            playbackStart: 75800,
            recordingFile: "atp:" + "/recordings/MIPTV18-CavePan-Eng.hfr",
            playbackPosition: null,
            playbackOrientation: null,
            playing: false
        },
        {
            recording: "NoseBook",
            playbackStart: 101000,
            recordingFile: "atp:" + "/recordings/MIPTV18-NoseBook-Eng.hfr",
            playbackPosition: null,
            playbackOrientation: null,
            playing: false
        }
    )

    
    function varianceCheck(number){
        for (var i = 0; i < playBackObjectArray.length; i++){
            var recording = playBackObjectArray[i];
            if (recording.playing) continue;
            //print("Calculation: " +  Math.abs(number - recording.playbackStart));
            if (Math.abs(number - recording.playbackStart) < variance){
                return i;
            }
        }
        return null;
    }

    updateHandler = function(){
        dateNow = Date.now();
        if (!scriptStart) scriptStart = dateNow;
        dateNowMinusScriptStart = dateNow - scriptStart;
        varianceCheckResult = varianceCheck(dateNowMinusScriptStart);
        if (varianceCheckResult !== null) {
            var recObjRef = playBackObjectArray[varianceCheckResult];
            print("not null", JSON.stringify(recObjRef));
            Player.playRecording(recObjRef.recordingFile, recObjRef.playbackPosition, recObjRef.playbackOrientation);
            recObjRef.playing = true;
        }
    };

    Messages.subscribe(MESSAGES_CHANNEL);

    function handleMessages(channel, message, sender) {
        if (channel === MESSAGES_CHANNEL) {
            var data = JSON.parse(message);
            switch(data.type) {
                case "Start":
                    Script.update.connect(updateHandler);
                    break;
                case "Stop":
                    dateNow = null;
                    dateNowMinusScriptStart = null;
                    varianceCheckResult = null;
                    scriptStart = null;
                    Player.stopPlayingAllRecordings();
                    Script.update.disconnect(updateHandler);
                    break;
                default:
            }
        }
    }

    Messages.messageReceived.connect(handleMessages);

    function setUp() {
        Player.setUp();
        UserActivityLogger.logAction("record_run_script", logDetails());
    }

    function tearDown() {
        Script.update.disconnect(updateHandler);
        Player.tearDown();
    }
    setUp();
    Script.scriptEnding.connect(tearDown);
}());
