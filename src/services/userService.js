import axios from "axios"

export const getSongByIdService = id => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/get-song?id=${id}`,
                method: "get"
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const getDetailPlaylistByIdService = id => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/get-detail-playlist?id=${id}`,
                method: "get"
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const getHomepageService = page => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/get-home?page=${page}`,
                method: "get"
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const getInfoSong = id => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/get-song-info?id=${id}`,
                method: "get"
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const getChartHome = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/get-chart-home`,
                method: "get"
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const getDetailSinger = name => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/get-artist/?name=${name}`,
                method: "get"
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const getNewRelease = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/get-new-release`,
                method: "get"
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const getSearch = keyword => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/search/?keyword=${keyword}`,
                method: "get"
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handleSignUpService = data => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/sign-up`,
                method: "post",
                data: data
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handleLoginService = data => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/login`,
                method: "post",
                data: data
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handleGetUser = email => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/get-user?email=${email}`,
                method: "get",
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handleUpdateUser = payload => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/update-user`,
                method: "put",
                data: payload
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handleAddFavoriteSong = payload => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/add-favorite-singer`,
                method: "post",
                data: payload
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handlePersonal = idUser => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios.all([
                axios({
                    url: `${process.env.REACT_APP_API_URL}/api/get-personal?idUser=${idUser}&type=singer`,
                    method: "get",
                }),
                axios({
                    url: `${process.env.REACT_APP_API_URL}/api/get-personal?idUser=${idUser}&type=album`,
                    method: "get",
                }),
            ])
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handleAddAlbum = data => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/add-favorite-album`,
                method: "post",
                data
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handleAddRecent = data => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/add-recent`,
                method: "post",
                data
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handleGetRecent = idUser => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/get-recent?idUser=${idUser}`,
                method: "get",
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handleDeleteRecent = idUser => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/delete-recent?idUser=${idUser}`,
                method: "delete",
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handleDeleteLike = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/delete-like?idUser=${payload.idUser}&idSinger=${payload.idSinger}&type=${payload.type}&idAlbum=${payload.idAlbum}`,
                method: "delete",
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handleCreateNewPlaylist = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/create-playlist`,
                method: "post",
                data: payload
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handleGetNewPlaylist = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/get-playlist?idUser=${idUser}`,
                method: "get",
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handleGetNewPlaylistById = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/get-playlist-by-id?idUser=${payload.idUser}&idPlaylist=${payload.idPlaylist}`,
                method: "get",
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const updatePlaylistById = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/update-playlist-by-id`,
                method: "put",
                data: payload
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const deleteSongPlaylist = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/delete-song-from-playlist?idUser=${payload.idUser}&idPlaylist=${payload.idPlaylist}&idSong=${payload.idSong}`,
                method: "delete",
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const handleLikedSong = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/add-favorite-song`,
                method: "post",
                data: payload
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const getLikedSong = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/get-favorite-song?idUser=${payload.idUser}&idSong=${payload.idSong}&type=${payload.type}`,
                method: "get",
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const deleteLikedSong = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/delete-favorite-song?idUser=${payload.idUser}&idSong=${payload.idSong}`,
                method: "delete",
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
export const changePassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/update-password-user`,
                method: "put",
                data
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}
