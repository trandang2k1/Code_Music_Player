const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const audio = $('#audio');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Ai rồi cũng sẽ khác",
            singer: "Hà Nhi",
            path: "../music/AiRoiCungSeKhac.mp3",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
            name: "Muốn Được Cùng Em",
            singer: "Freak",
            path: "../music/MuonDuocCungEm.mp3",
            image:
              "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
            name: "Muốn Nói Với Em",
            singer: "T Team",
            path:
              "../music/MuonNoiVoiEm.mp3",
            image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
            name: "Mầu Thị",
            singer: "Hoà Minzy",
            path: "../music/ThiMau.mp3",
            image:
              "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
            name: "Yêu Anh Đi Mẹ Anh Bán Bánh Mì",
            singer: "Phúc Du",
            path: "../music/YeuAnhDiMeAnhBanBanhMi.mp3",
            image:
              "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
    ],
    render: function () {
        let htmls = this.songs.map(function (song, index) {
            return `
            <div class = "song">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        // Khi Song được Play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
                cdThumbAnimate.pause();
            }
            else {
                audio.play();
                cdThumbAnimate.play();
            }
        }
        // Khi Song được pause
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
        }
        audio.onpause = function () {  
            _this.isPlaying = false;
            player.classList.remove('playing');
        }
        // Xử lí thanh phát nhạc
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercents = Math.floor(audio.currentTime * 100 / audio.duration);
                progress.value = progressPercents;
            }
        }
        // Xử lí khi tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }
        // Xử lí CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();
        // Xử lí Next bài hát
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * _this.songs.length);
                } while (newIndex === _this.currentIndex);
                _this.currentIndex = newIndex;
            }
            else {
                if (_this.currentIndex >= _this.songs.length - 1) {
                    _this.currentIndex = 0;
               }
               else {
                   _this.currentIndex++;
               }
            }
            _this.loadCurrentSong();
            audio.play();
        }
        // Xử lí Previous bài hát
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * _this.songs.length);
                } while (newIndex === _this.currentIndex);
                _this.currentIndex = newIndex;
            }
            else {
                if (_this.currentIndex <= 0) {
                    _this.currentIndex = _this.songs.length - 1;
                }
                else {
                    _this.currentIndex--;
                }
            }
            _this.loadCurrentSong();
            audio.play();
        }
        // Xử lí random cho MusicPlayer
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        // Xử lí next Song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            }
            else {
                nextBtn.click();
            }
        }
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);

        }
    },
    // playRandomSong: function () {
    //     let newIndex;
    //         do {
    //             newIndex = Math.floor(Math.random() * this.songs.length);
    //         } while (newIndex === this.currentIndex);
    //         this.currentIndex = newIndex;
    //         this.loadCurrentSong();
    // },
    start: function () {
        // Render playlist
        this.render();
        // Định nghĩa các thuộc tính trong object
        this.defineProperties();
        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
    }
}
app.start();