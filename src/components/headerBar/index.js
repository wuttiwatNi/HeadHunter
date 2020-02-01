import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { sideBarAction, accountAction } from "../../actions"
import "./index.scss"

function HeaderBar() {
    const dispatch = useDispatch()
    let history = useHistory()
    const account = useSelector(state => state.account)
    const [isPopupProfile, setIsPopupProfile] = useState(false)

    let handleLogout = () => {
        dispatch(accountAction.logout())
    }

    return (
        <div className={"main-header-bar"}>
            <div className="logo">
                HEAD.HUNTER
            </div>
            <div className="nav-bar">
                <div className="toggle-sidebar" onClick={() => dispatch(sideBarAction.toggleButton())}>
                    <i className="fa fa-bars" />
                </div>
                <div className={`toggle-profile ${isPopupProfile ? "click" : ""}`} onMouseOver={() => setIsPopupProfile(true)} onMouseOut={() => setIsPopupProfile(false)}>
                    <div className={`frame ${isPopupProfile ? "click" : ""}`}>
                        <img src={account.picturePath} className="head-bar" alt="..." />
                        <span>
                            {account.firstName}
                        </span>
                    </div>
                </div>

                <div className="popup-profile-triangle" style={{ display: isPopupProfile ? "block" : "none" }} onMouseOver={() => setIsPopupProfile(true)} onMouseOut={() => setIsPopupProfile(false)}></div>
                <div className="popup-profile" style={{ display: isPopupProfile ? "block" : "none" }} onMouseOver={() => setIsPopupProfile(true)} onMouseOut={() => setIsPopupProfile(false)}>
                    <i onClick={() => { history.replace("/profile") }} className={"fa fa-cog"} />
                    <img src={account.picturePath} alt="..." />
                    <span>{account.firstName} {account.lastName}</span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    )
}

export default HeaderBar
