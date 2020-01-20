import React from 'react'

const saveDataSuccess = () => {
  return {
    id: Math.random() * 10,
    insert: "top",
    container: "top-center",
    animationIn: ["animated", "fadeInDown"],
    animationOut: ["animated", "fadeOutUp"],
    dismiss: {
      duration: 2000,
      pauseOnHover: true
    },
    content: (
      <div className={"notification-custom-success"}>
        <div className={"notification-custom-icon"}>
          <i className={"fa fa-check-circle"} />
        </div>
        <div className="notification-custom-content">
          <h4 className="notification-title">Success!</h4>
          <p className="notification-message">save data successfully.</p>
        </div>
      </div>
    )
  }
}

const deleteDataSuccess = () => {
  return {
    id: Math.random() * 10,
    insert: "top",
    container: "top-center",
    animationIn: ["animated", "fadeInDown"],
    animationOut: ["animated", "fadeOutUp"],
    dismiss: {
      duration: 2000,
      pauseOnHover: true
    },
    content: (
      <div className={"notification-custom-success"}>
        <div className={"notification-custom-icon"}>
          <i className={"fa fa-check-circle"} />
        </div>
        <div className="notification-custom-content">
          <h4 className="notification-title">Success!</h4>
          <p className="notification-message">delete data successfully.</p>
        </div>
      </div>
    )
  }
}

export const toatConstant = {
  saveDataSuccess,
  deleteDataSuccess
}
