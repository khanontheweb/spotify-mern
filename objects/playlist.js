module.exports = class Playlist {
    constructor(name, playlistLink, tracksAPI, owner) {
        this.name = name;
        this.playlistLink = playlistLink;
        this.tracksAPI = tracksAPI
        this.owner = owner;
        this.tracks = null;
    }

    get name() {
        return this._name;
    }

    get playlistLink() {
        return this._playlistLink;
    }

    get tracksAPI() {
        return this._tracksAPI;
    }
    
    get owner() {
        return this._owner;
    }

    get tracks() {
        return this._tracks;
    }

    set name(name) {
        this._name = name;
    }

    set playlistLink(playlistLink) {
        this._playlistLink = playlistLink;
    }

    set tracksAPI(tracksAPI) {
        this._tracksAPI = tracksAPI;
    }

    set owner(owner) {
        this._owner = owner;
    }

    set tracks(tracks) {
        this._tracks = tracks;
    }
}

