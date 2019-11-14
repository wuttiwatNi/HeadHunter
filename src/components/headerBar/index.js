import React from "react";
import {useDispatch} from "react-redux";
import {sideBarAction} from "../../actions";
import "./index.scss";

function HeaderBar() {
    const dispatch = useDispatch();

    return (
        <div className={"main-header-bar"}>
            <div className="logo">
                HEAD.HUNTER
            </div>
            <div className="nav-bar">
                <div className="toggle-sidebar" onClick={() => dispatch(sideBarAction.toggleButton())}>
                    <i className="fa fa-bars"/>
                </div>
            </div>
        </div>
    );
}

export default HeaderBar;
