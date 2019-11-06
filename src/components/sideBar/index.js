import React from 'react';
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux"
import {sideBarAction} from "../../actions";
import './index.scss'

function SideBar() {
    const sideBar = useSelector(state => state.sideBar);
    const dispatch = useDispatch();

    let sideBarHide = ({target}) => {
        dispatch(sideBarAction.toggleButton())
    };

    return (
        <>
            <div className={`${sideBar.isShow ? "space-side-bar" : ""}`} onClick={sideBarHide}/>
            <div className={`main-side-bar hide ${sideBar.isShow ? "show" : ""}`}>
                <div className={'user-panel'}>
                    <img src={`${window.location.origin}/user-avatar.png`} alt={'notfound'}/>
                    <div>
                        <span>NickName</span>
                        <span>FirstName LastName</span>
                    </div>
                </div>

                <div className={'navigation'}>
                    MAIN NAVIGATION
                </div>

                <NavLink to={'/customer'} onClick={sideBarHide} replace>
                    <i className={'fa fa-handshake-o'}/>
                    <span>{'Customer'}</span>
                </NavLink>

                <NavLink to={'/Order'} onClick={sideBarHide} replace>
                    <i className={'fa fa-briefcase'}/>
                    <span>{'Order'}</span>
                </NavLink>

                <NavLink to={'/Candidate'} onClick={sideBarHide} replace>
                    <i className={'fa fa-id-card-o'}/>
                    <span>{'Candidate'}</span>
                </NavLink>

                <NavLink to={'/Member'} onClick={sideBarHide} replace>
                    <i className={'fa fa-user-plus'}/>
                    <span>{'Member'}</span>
                </NavLink>

                <NavLink to={'/Option'} onClick={sideBarHide} replace>
                    <i className={'fa fa-cogs'}/>
                    <span>{'Option'}</span>
                </NavLink>
            </div>
        </>
    );
}

export default SideBar;
