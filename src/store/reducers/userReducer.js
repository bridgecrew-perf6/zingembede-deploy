import actionTypes from "../actions/actionTypes"

let initState = {
    dataHomePage: null,
    dataHomePage2: null,
    dataHomePage3: null,
    isPlaying: null,
    dataChartHome: null,
    keyword: null,
    isLoggedIn: false,
    updateRecent: false,
    refreshPlay: '-1',
    refresh: false
}

let userReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_HOME_SUCCESS:
            return {
                ...state,
                dataHomePage: action.data
            }
        case actionTypes.GET_HOME_FAIL:
            return {
                ...state,
                dataHomePage: action.data
            }
        case actionTypes.GET_HOME2_SUCCESS:
            return {
                ...state,
                dataHomePage2: action.data
            }
        case actionTypes.GET_HOME2_FAIL:
            return {
                ...state,
                dataHomePage2: action.data
            }
        case actionTypes.GET_HOME3_SUCCESS:
            return {
                ...state,
                dataHomePage3: action.data
            }
        case actionTypes.GET_HOME3_FAIL:
            return {
                ...state,
                dataHomePage3: action.data
            }
        case actionTypes.PAUSE_PLAYER:
            return {
                ...state,
                isPlaying: false
            }
        case actionTypes.PLAY_PLAYER:
            return {
                ...state,
                isPlaying: true
            }
        case actionTypes.GET_CHART_HOME_SUCCESS:
            return {
                ...state,
                dataChartHome: action.data
            }
        case actionTypes.GET_CHART_HOME_FAIL:
            return {
                ...state,
                dataChartHome: action.data
            }
        case actionTypes.CHANGE_KEYWORD:
            return {
                ...state,
                keyword: action.data
            }
        case actionTypes.LOGIN:
            return {
                ...state,
                isLoggedIn: action.data
            }
        case actionTypes.UPDATE_RECENT:
            return {
                ...state,
                updateRecent: !state.updateRecent
            }
        case actionTypes.REFRESH_PLAY:
            return {
                ...state,
                refreshPlay: action.id
            }
        case actionTypes.REFRESH:
            return {
                ...state,
                refresh: !state.refresh
            }

        default:
            return state
    }
}
export default userReducer
