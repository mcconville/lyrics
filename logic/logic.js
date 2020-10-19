var timelinedata;
var lyricsdata;

var beatles = new Array();

function initialize(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          
            console.log(xhttp.responseText);

            var carousel = document.getElementById('my-keen-slider');

            timelinedata = JSON.parse(xhttp.response);

            timelinedata.forEach(function(item){

                beatles[item.order] = item;

                var slide = document.createElement('div');
                slide.className = 'keen-slider__slide';

                var pic = document.createElement('bandpic-element');
                pic.setAttribute('image', './images/SVG/'+ item.image);
                pic.image = './images/SVG/'+ item.image;

                slide.appendChild(pic);
                carousel.appendChild(slide);
            })

            var slider = new KeenSlider('#my-keen-slider', {
                loop: true,
                autoHeight:true,
                created: function(instance) {
                    var dots_wrapper = document.getElementById("dots");
                    var slides = document.querySelectorAll(".keen-slider__slide");
                    slides.forEach(function(t, idx) {
                      var dot = document.createElement("button");
                      dot.classList.add("dot");
                      dots_wrapper.appendChild(dot);
                      dot.addEventListener("click", function() {
                        instance.moveToSlide(idx);
                      });
                    });
                    updateClasses(instance);

                    var index = instance.details().relativeSlide + 1;
                    updateBars(index);
                },
                slideChanged(instance) {

                    var index = instance.details().relativeSlide +1;

                    timelinedata.forEach(function(item){

                        if(item.order === index){
                            var string = item.era + ' : ' + item.start + ' - ' + item.end;
                            var eralabel = document.getElementById('eralabel');
                            eralabel.innerHTML = string;

                            var moodlabel = document.getElementById('moodlabel');
                            moodlabel.innerHTML = item.mood;

                            var blurb = document.getElementById('blurb');
                            blurb.innerHTML = "";

                            item.albums.forEach(function(album){
                                album.background.forEach(function(info){
                                    var paragraph = document.createElement('div');
                                    paragraph.className = 'snippet';
                                    paragraph.innerHTML = info;
                                    blurb.appendChild(paragraph);
                                })
                            })



                            var container = document.getElementById('blurb');
                            container.className = 'blurb';
                            container.className = container.className + ' ' + item.className;

                            console.log(string)
                        }

                    })

                    updateClasses(instance);
                    updateBars(index);
                    updateAlbums(index);
                }
            })
        }
    };
    xhttp.open("GET", "./data/mac.json", true);
    xhttp.send();
}

function updateBars(index){

    console.log('UPDATE BARS');

    console.log(beatles[index].era);

    beatles[index].analysis.personality.forEach(function(datapoint){

        var point = document.getElementById(datapoint.name);

        var value = Math.round( datapoint.percentile * 100 );
        point.setAttribute('value', value);
    })
}

function updateAlbums(index){
    console.log('UPDATE ALBUMS');

    console.log(beatles[index].albums);

    var tracklist = document.getElementById('tracklist');
    tracklist.innerHTML = "";

    beatles[index].albums.forEach(function(album){
    
        var section = document.createElement("section");
        section.className = "album";

        var sleeve = document.createElement("div");
        sleeve.className = "sleeve";

        var cover = document.createElement("img");
        cover.className = "albumcover";
        cover.src = album.cover;

        console.log(cover.src);
        sleeve.appendChild(cover);

        var title = document.createElement("label");
        title.className = "albumtitle";
        title.innerHTML = album.title;

        var tracks = document.createElement("ul");
        tracks.className = "tracks";

        album.songs.forEach(function(track){
            var song = document.createElement("li");
            song.className = "track";
            song.innerHTML = track;
            tracks.appendChild(song);
        });

        section.appendChild(sleeve);
        section.appendChild(title);
        console.log("ADDING ALBUM INFO FOR: " + album.title);
        section.appendChild(tracks);

        tracklist.appendChild(section);
    })
}


function updateClasses(instance) {
    var slide = instance.details().relativeSlide;
    // var arrowLeft = document.getElementById("arrow-left");
    // var arrowRight = document.getElementById("arrow-right");
    // slide === 0
    //   ? arrowLeft.classList.add("arrow--disabled")
    //   : arrowLeft.classList.remove("arrow--disabled");
    // slide === instance.details().size - 1
    //   ? arrowRight.classList.add("arrow--disabled")
    //   : arrowRight.classList.remove("arrow--disabled");

    var dots = document.querySelectorAll(".dot");
    dots.forEach(function(dot, idx) {
      idx === slide
        ? dot.classList.add("dot--active")
        : dot.classList.remove("dot--active");
    });
  }