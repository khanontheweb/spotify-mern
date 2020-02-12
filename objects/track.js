module.exports = class Track {
    constructor(name, artists, album, genres) {
        this.name = name;
        this.artists = artists;
        this.album = album;
        this.genres = genres;
    }

    get name() {
        return this._name;
    }

    get artist() {
        return this._artist;
    }

    get album() {
        return this._artist;
    }

    get genres() {
        return this._genres;
    }

    set name(name) {
        this._name = name;
    }

    set artists(artists) {
        this._artists = artists;
    }

    set album(album) {
        this._album = album;
    }

    set genres(genres) {
        this._genres = genres;
    }
}

