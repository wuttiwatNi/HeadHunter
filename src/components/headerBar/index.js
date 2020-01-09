import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sideBarAction } from "../../actions";
import "./index.scss";

function HeaderBar() {
    const dispatch = useDispatch();
    const [isPopupProfile, setIsPopupProfile] = useState(false)

    let handleLogout = () => {
        console.log("logout")
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
                        <img src={`${window.location.origin}/user-avatar.png`} className="head-bar" alt="..." />
                        Nickname
                    </div>
                </div>

                <div className="popup-profile-triangle" style={{ display: isPopupProfile ? "block" : "none" }} onMouseOver={() => setIsPopupProfile(true)} onMouseOut={() => setIsPopupProfile(false)}></div>
                <div className="popup-profile" style={{ display: isPopupProfile ? "block" : "none" }} onMouseOver={() => setIsPopupProfile(true)} onMouseOut={() => setIsPopupProfile(false)}>
                    <img src={`${window.location.origin}/user-avatar.png`} alt="..." />
                    <span>FirstName LastName</span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default HeaderBar;
