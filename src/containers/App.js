import "./App.scss"
import React, { Component } from "react"
import { connect } from "react-redux"
import { Route, BrowserRouter, Switch } from "react-router-dom"
import "sweetalert2/src/sweetalert2.scss"
import { Scrollbars } from "react-custom-scrollbars"


//components
import Home from "./Home/Home"
import DetailAlbum from "./DetailAlbum/DetailAlbum"
import DetailChart from "./DetailChart/DetailChart"
import Search from "./Search/Search"
import DetailWeekTop from "./DetailWeekTop/DetailWeekTop"
import DetailSinger from "./DetailSinger/DetailSinger"
import LeftSidebar from "./LeftSidebar/LeftSidebar"
import DetailSearch from "./DetailSearch/DetailSearch"
import Login from "./Login/Login"
import UseisrAuthenticated from '../routes/UseisrAuthenticated'
import Personal from "./Personal/Personal"
import NewRelease from "./NewRelease/NewRelease"
import DetailTop100 from "./DetailTop100/DetailTop100"
import RightSideBar from "./RightSideBar/RightSideBar"
import DetailRecent from "./DetailRecent/DetailRecent"
import Playlist from "./Playlist/Playlist"

class App extends Component {
    handleOnScroll = event => {
        const searcgEl = document.querySelector(".search-container")
        if (event.target.scrollTop > 50) {
            searcgEl.style.backgroundColor = "rgb(40,40,40)"
        } else {
            searcgEl.style.backgroundColor = "transparent"
        }
    }

    render() {
        return (
            <BrowserRouter>
                <Scrollbars
                    onScroll={event => this.handleOnScroll(event)}
                    style={{ width: "100%", height: "100vh" }}
                >
                    <div className="search"> <Search /></div>
                    <div className="content-main">
                        <div className="left-sidebar">
                            <LeftSidebar />
                        </div>
                        <div className="right-sidebar">
                            <RightSideBar />
                        </div>
                        <Switch>
                            <Route exact path="/"><UseisrAuthenticated /></Route>
                            <Route path="/login"><Login /></Route>
                            <Route path="/home"><Home /></Route>
                            <Route path="/detail-album/:id"><DetailAlbum /></Route>
                            <Route path="/detail-chart"><DetailChart /></Route>
                            <Route path="/detail-week-top/:country"><DetailWeekTop /></Route>
                            <Route path="/detail-singer/:alias"><DetailSinger /></Route>
                            <Route path="/detail-search/:keyword"><DetailSearch /></Route>
                            <Route path="/personal"><Personal /></Route>
                            <Route path="/new-release"><NewRelease /></Route>
                            <Route path="/detail-top-100"><DetailTop100 /></Route>
                            <Route path="/detail-recent"><DetailRecent /></Route>
                            <Route path="/detail-playlist/:id"><Playlist /></Route>
                        </Switch>
                    </div>
                </Scrollbars>
            </BrowserRouter>
        )
    }
}
const mapStateToProps = state => {
    return {
        isLoggedIn: state.isLoggedIn
    }
}

const mapDispatchToProps = dispatch => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
