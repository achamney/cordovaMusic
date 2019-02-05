/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    playing: false,
    // Application Constructor
    initialize: function () {
        var container = document.getElementById('media');
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        this.songControllers = [];
        var songs = [{
            title: "blabla", artist: "Bob Acri", img: "img.jpg"
        }, {
            title: "Kalimba", artist: "Mr. Scruff", img: "img.jpg"
        }, {
            title: "Maid", artist: "Richard Stoltzman; Slovak Radio Symphony", img: "img.jpg"
        }, {
            title: "Sleep Away", artist: "Bob Acri", img: "img.jpg"
        }];
        for (var i = 0; i < songs.length; i++) {
            var song = songs[i];
            var songController = new Song(song.title, song.artist, song.img, container, this.onStopAll.bind(this), i);
            songController.append();
            this.songControllers.push(songController);
        }
    },
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    onStopAll: function (i) {
        for (var song of this.songControllers) {
            song.onStop();
        }
        if (i != null) {
            if (i >= this.songControllers.length) {
                i = 0;
            } else if (i == -1) {
                i = this.songControllers.length - 1;
            }
            this.songControllers[i].onPlayPause();
        }
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    }
};

var Song = function (title, artist, img, parent, stopAllSongs, i) {
    this.seek = 0;
    this.song = new Audio("audio/" + title + ".mp3");

    this.append = function () {
        var body = document.createElement('div');
        this.body = body;
        body.setAttribute("class", "song");
        parent.appendChild(body);
        this.addText(title, body, "bold");
        this.addText(artist, body);
        this.addButton("&#9665;", body, this.onLeft);
        this.addButton("&#9632;", body, this.onStop);
        this.addButton("&#9658;", body, this.onPlayPause, "play");
        this.addButton("&#9655;", body, this.onRight);
        this.addTimeBar(body);
        this.song.addEventListener('ended', this.onEndSong.bind(this));
    }

    this.addText = function (text, parent, bold) {
        var body = document.createElement('p');
        body.setAttribute("class", "text " + bold);
        body.innerHTML = text;
        parent.appendChild(body);
    }

    this.addButton = function (name, parent, click, clazz) {
        var button = document.createElement('div');
        button.setAttribute("class", "button " + clazz);
        button.addEventListener('click', click.bind(this), false);
        parent.appendChild(button);
        button.innerHTML = name;
    }

    this.addTimeBar = function (parent) {
        var breakEl = document.createElement('div');
        breakEl.setAttribute("class", "break");
        parent.appendChild(breakEl);

        var body = document.createElement('div');
        body.setAttribute("class", "barContainer");
        parent.appendChild(body);
        var bar = document.createElement('div');
        bar.setAttribute("class", "timeBar");
        var wideBar = document.createElement('div');
        wideBar.setAttribute("class", "wideBar");
        wideBar.addEventListener('click', this.onSeek.bind(this));
        body.appendChild(wideBar);
        body.appendChild(bar);
        window.setInterval(this.updateTimeBar.bind(this), 1000);
    }

    this.onSeek = function (e) {
        var timeBar = this.body.querySelector('.wideBar');
        var percent = e.layerX / timeBar.offsetWidth;
        this.song.currentTime = this.song.duration * percent;
        this.updateTimeBar();
    }

    this.updateTimeBar = function () {
        var timeBar = this.body.querySelector('.timeBar');
        var width = 100 * this.song.currentTime / this.song.duration;
        width = Math.max(width, 1);
        timeBar.setAttribute('style', 'width:' + width + '%');
    }

    this.onStop = function () {
        this.song.load();
        this.pause();
    }

    this.onEndSong = function () {
        stopAllSongs(i+1);
    }

    this.onLeft = function() {
        stopAllSongs(i-1);
    }

    this.onRight = function() {
        stopAllSongs(i+1);
    }

    this.onPlayPause = function () {
        var playButton = this.body.querySelector('.play');

        this.playing = !this.playing;
        if (this.playing) {
            stopAllSongs();
            this.playing = true;
            this.song.play();
            playButton.innerHTML = "=";
        } else {
            this.pause();
        }
    }

    this.pause = function () {
        this.playing = false;
        var playButton = this.body.querySelector('.play');
        this.song.pause();
        playButton.innerHTML = "&#9658;";
    }

}

app.initialize();