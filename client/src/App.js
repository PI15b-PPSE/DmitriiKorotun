import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import play from './img/play.png';
import stop from './img/stop.png';
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

/**
 * Standart React App class
 *
 * Class describes user-side application,
 * it's look and logic
 *
 * @author      Dmitrii Korotun
 * @version     1.0
 * @copyright   GNU Public License
 * @todo        Improve GUI
 */

class App extends Component {

    /**
     * Class constructor
     * @param  {}
     * @return {}
     */
    constructor() {
        super();

        const params = this.getHashParams();
        const token = params.access_token;
        const intervalId = setInterval(() => {
            this.runDataFlow();
        }, 10000);

        if (token) {
            spotifyApi.setAccessToken(token);
        }

        this.state = {
            loggedIn: !!token,
            nowPlaying: {name: 'Not Checked', albumArt: 'http://www.instance.adityaagencies.com/img/emptyimg.png'},
            dataFlow: null,
            currentPlayingState: false,
            playingImage: play,
            vtoken: ''
        };

        console.log(params);
    }

    /**
     * Receives params from uri string
     *
     * @param  {}
     * @return {array} Decoded uri params
     */
    getHashParams() {
        let hashParams = {};
        let e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);

        e = r.exec(q);

        while (e) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
            e = r.exec(q);
        }

        return hashParams;
    }

    /**
     * Changes vtoken is React State and
     * loggs this
     *
     * @param  {control} e The element that has been changed
     * @return {}
     */
    handleChange(e) {
        console.log('handle change called');
        this.setState({vtoken: e.target.value});
    }

    /**
     * Draws it's html content
     *
     * @param  {}
     * @return {}
     */
    render() {
        return (
            <div className="App">
                <div className={"href-wrapper"}>
                    <a href='http://localhost:8888/slogin'> Login to Spotify </a>
                    <a href='http://oauth.vk.com/authorize?client_id=6652616&display=page&
                redirect_uri=https://oauth.vk.com/blank.html&scope=status,offline&response_type=token&v=5.52'
                       target={'blank'}> Получить токен Вконтакте </a>
                </div>
                <div className={'playback-wrapper'}>
                    <div className={'playback'}>
                        <div className={'now-playing'}>
                            Now Playing: {this.state.nowPlaying.name}
                        </div>
                        <div>
                            <img src={this.state.nowPlaying.albumArt} style={{height: 150}}/>
                        </div>
                        {this.state.loggedIn &&
                        <div>
                            <div className={'playback-img'}>
                                <img src={this.state.playingImage} onClick={(e) => {
                                    this.changeCurrentPlaystate(e)
                                }}/>
                            </div>
                            <div>
                        <span className={'header'}>
                        Токен вконтакте:
                         </span>
                                <input type="text" id="vtoken" onChange={(e) => {
                                    this.handleChange(e)
                                }}/>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Changes playing state (bool) and
     * according to new playing state
     * changes the image of control buttons
     *
     * @param  {control}  e element, that initiated
     *              this function
     * @return {}
     */
    changeCurrentPlaystate(e) {
        this.setState({currentPlayingState: !this.state.currentPlayingState}, () => {
                this.changePlaystateImage();
                this.changeDataFlowState();

                if (this.state.currentPlayingState)
                    this.runDataFlow();
            }
        );
    }

    /**
     * Changes the control button image
     * to opposite
     *
     * @param  {}
     * @return {}
     */
    changePlaystateImage() {
        if (this.state.currentPlayingState)
            this.setState({playingImage: stop});
        else
            this.setState({playingImage: play});
    }

    /**
     * Starts or stops data flow
     *
     * @param  {}
     * @return {}
     */
    changeDataFlowState() {
        if (this.state.currentPlayingState) {
            if (!this.state.dataFlow)
                this.setState({
                    dataFlow: this.intervalId
                });
            else if (this.state.dataFlow) {
                clearInterval(this.state.dataFlow);
            }
        }
    }


    /**
     * Gets current playing song
     * and sets it as vk.com status
     *
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    runDataFlow() {
        if (this.state.currentPlayingState) {
            this.getNowPlaying();

            if (this.state.nowPlaying.name != 'Not Checked') {
                if (this.state.vtoken !== '')
                    this.changeStatus(this.state.nowPlaying.name, this.state.vtoken);
            }
        }
    }

    /**
     * Sets artist's name and album art
     * to the class state
     *
     * @param  {}
     * @return {}
     */
    getNowPlaying() {
        spotifyApi.getMyCurrentPlaybackState()
            .then((response) => {
                this.setState({
                    nowPlaying: {
                        name: this.getAllArtistsString(response.item.artists) + " - " + response.item.name,
                        albumArt: response.item.album.images[0].url
                    }
                });
            });
    }

    /**
     * Generates a random string containing numbers and letters
     *
     * @param  {array}  artists_arr Array of all artists
     *                  performing current song
     * @return {string} String with all artists
     *                  performing current song
     */
    getAllArtistsString(artists_arr) {
        let artists = "";

        for (let i = 0; i < artists_arr.length; ++i) {

            if (artists.length == 0)
                artists += artists_arr[i].name;
            else
                artists += ", " + artists_arr[i].name;
        }

        return artists;
    }

    /**
     * Changes user status on the vk.com
     *
     * @param  {string} status New value for vk.com status
     * @param  {string} vtoken User vk token
     * @return {}
     */
    changeStatus(status, vtoken) {
        if (status === null)
            return;

        let connectionString = "https://api.vk.com/method/status.set?text=" + status
            + "&access_token=" + vtoken + "&v=5.84";
        axios.get(connectionString);
    }
}

export default App;