    (function () {
        var mgr;
        var bus;
        var castReceiverManager_;
        var castMessageBus_;
        var mediaManager;
        var count = 0;
        var currentCount = 0;
        var contentIds=[];
        var songs=[];
        var senderId;

        window.onload = function () {
            var namespace = 'urn:x-cast:com.sample.hello';
            
            // receiver manager for creating the message bus between sender and receiver.
            this.castReceiverManager_ = cast.receiver.CastReceiverManager.getInstance();
            
            this.castMessageBus_  = this.castReceiverManager_.getCastMessageBus(namespace, 
                                                                                cast.receiver.CastMessageBus.MessageType.JSON);

            this.castMessageBus_.onMessage = function(event) {

                var action = event.data.action;
                var data = event.data;
                data.senderId = event.senderId;
                senderId = event.senderId;

                // reference to the audio element
                var audioElement = document.getElementById("song");
                if (action=="pause") {
                    audioElement.pause();
                    return;
                }

                if (action=="play") {
                    playsong();
                    return;
                }

                if (action=="next") {
                    nextSong();
                    return;
                }

                if (action=="previous") {
                    previousSong();
                    return;
                }          

                if (action=="getQueue") {
                    getQueue(senderId);
                    return;
                }  

                if (action=="addSong") {
                	document.getElementById("song").src = data.songUrl;

            		document.getElementById("song").load();
            		document.getElementById("song").play();
            		return;
                }

                 console.log('Message received :' + action);

                 $("#messages").append("<li>Song added : " + ":" + data.contentId + "</li>");
                 contentIds[count] = data;
                 count = count + 1;
             
                 audioElement.addEventListener("ended", onEvent, false);
           }
     
           this.castReceiverManager_.start();
        }

        var getQueue = function(senderId) {
           this.castMessageBus_.send(senderId, songs.toString());
        };


        // currently using to change to next song once an ended event is triggered.
        var onEvent = function(e) {
            currentCount = currentCount + 1;
            if (currentCount <= count && currentCount >= 0) {
               startPlaying(contentIds[currentCount]);
            }
        };


        var currentSongUrl;

        var startPlaying = function(data) {
        	document.getElementById("curSong").innerHTML = "playing   " + currentCount;
        	this.castMessageBus_.send(data.senderId, data.contentId);
        }


        var playsong = function() {  

           // document.getElementById("curSong").innerHTML = "playing   " + currentCount ;
            currentCount = 0;
            startPlaying(contentIds[currentCount]); 


            //document.getElementById("song").src = songs[currentCount];

            //"http://www.w3schools.com/html/horse.mp3" ;//"http://www.w3schools.com/html/horse.mp3";//"http://play.wynk.in/srch_hungama/music/original/srch_hungama_2537377.mp3?token=1415018605_6e0dc7de851a145e762c506d24140839";
            //document.getElementById("song").load();
            //document.getElementById("song").play();
        }

        var nextSong = function() {
            currentCount = currentCount + 1;
            startPlaying(contentIds[currentCount])
        }

        var previousSong = function() {
            currentCount = currentCount  - 1;
            startPlaying(contentIds[currentCount])
        }

    })();
