const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

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
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
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
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        let htmls = this.songs.map((song, index) => {
            return `
            <div class = "song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
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
            _this.render();
            _this.loadCurrentSong();
            audio.play();
            _this.scrollToActiveSong();
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
            _this.render();
            _this.loadCurrentSong();
            audio.play();
            _this.scrollToActiveSong();
        }
        // Xử lí random cho MusicPlayer
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
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
        // Xử lí lặp lại Song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);

        }
        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                // Xử lí khi click vào Song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                // Xử lí khi click vào Song Option
                if (e.target.closest('.option')) {

                }
            }
        }
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
               behavior: 'smooth',
               block: 'center' 
            });
        }, 300);
    },
    loadConfig: function () {
      this.isRandom = this.config.isRandom;
      this.isRepeat = this.config.isRepeat;  
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
        // Gán cấu hình thì config vào ứng dụng
        this.loadConfig();
        // Render playlist
        this.render();
        // Định nghĩa các thuộc tính trong object
        this.defineProperties();
        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        // Hiển thị trạng thái ban đầu của button random / repeat
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}
app.start();