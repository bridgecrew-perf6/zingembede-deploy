import actionTypes from "./actionTypes"
import * as userServices from "../../services/userService"

export const getHomepage = page => {
    return async dispatch => {
        try {
            let response = await userServices.getHomepageService(page)
            if (page === "1") {
                if (response) {
                    dispatch(getHomepageSuccess(response.data))
                } else {
                    dispatch(getHomepageFail(response.data))
                }
            }
            if (page === "2") {
                if (response) {
                    dispatch(getHomepage2Success(response.data))
                } else {
                    dispatch(getHomepage2Fail(response.data))
                }
            }
            if (page === "3") {
                if (response) {
                    dispatch(getHomepage3Success(response.data))
                } else {
                    dispatch(getHomepage3Fail(response.data))
                }
            }
        } catch (error) {
            dispatch(getChartHomeFail({ err: -1, msg: error }))
        }
    }
}
export const getHomepageSuccess = data => {
    return {
        type: actionTypes.GET_HOME_SUCCESS,
        data
    }
}
export const getHomepageFail = data => {
    return {
        type: actionTypes.GET_HOME_FAIL,
        data
    }
}
export const getHomepage2Success = data => {
    return {
        type: actionTypes.GET_HOME2_SUCCESS,
        data
    }
}
export const getHomepage2Fail = data => {
    return {
        type: actionTypes.GET_HOME2_FAIL,
        data
    }
}
export const getHomepage3Success = data => {
    return {
        type: actionTypes.GET_HOME3_SUCCESS,
        data
    }
}
export const getHomepage3Fail = data => {
    return {
        type: actionTypes.GET_HOME3_FAIL,
        data
    }
}
export const pausePlayer = () => {
    return {
        type: actionTypes.PAUSE_PLAYER
    }
}
export const playPlayer = () => {
    return {
        type: actionTypes.PLAY_PLAYER
    }
}

export const getChartHome = () => {
    return async dispatch => {
        try {
            let response = await userServices.getChartHome()
            if (response) {
                dispatch(getChartHomeSuccess(response.data))
            } else {
                dispatch(getChartHomeFail(response.data))
            }
        } catch (error) {
            dispatch(
                getChartHomeFail({
                    err: -1,
                    msg: "fail to fetch api"
                })
            )
        }
    }
}
export const saveKeyword = data => ({
    type: actionTypes.CHANGE_KEYWORD,
    data
})
export const getChartHomeSuccess = data => ({
    type: actionTypes.GET_CHART_HOME_SUCCESS,
    data
})
export const getChartHomeFail = data => ({
    type: actionTypes.GET_CHART_HOME_FAIL,
    data
})
export const login = status => ({
    type: actionTypes.LOGIN,
    data: status
})
export const getPersonal = (idUser) => {
    return async dispatch => {
        try {
            let response = await userServices.getChartHome()
            if (response) {
                dispatch(getChartHomeSuccess(response.data))
            } else {
                dispatch(getChartHomeFail(response.data))
            }
        } catch (error) {
            dispatch(
                getChartHomeFail({
                    err: -1,
                    msg: "fail to fetch api"
                })
            )
        }
    }
}
export const updateRecent = () => ({
    type: actionTypes.UPDATE_RECENT,
})
export const refreshPlay = (id) => ({
    type: actionTypes.REFRESH_PLAY,
    id
})
export const refresh = () => ({
    type: actionTypes.REFRESH,
})
export const toggleModal = (data) => ({
    type: actionTypes.TOGGLE_MODAL,
    data
})

