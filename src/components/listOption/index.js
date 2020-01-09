import React from "react"
import * as PropTypes from "prop-types"
import { Col, Card, Accordion } from "react-bootstrap"
import "./index.scss"

function ListOption({ title, data, onClickCreate, onClickDelete, onClickEdit, xs = 12, sm = 6, lg = 3 }) {
    let x = true
    let xParent = {}

    let handleOpen = (_title) => {
        var arrow = document.getElementById(`${_title ? _title : title}-arrow`).classList
        var boxTitle = document.getElementById(`${_title ? _title : title}-title`).classList
        if (!_title) {
            if (x) {
                arrow.add("up")
                boxTitle.add("up")
            } else {
                arrow.remove("up")
                boxTitle.remove("up")
            }
            x = !x
        } else {
            if (xParent[_title]) {
                arrow.add("up")
                boxTitle.add("up")
            } else {
                arrow.remove("up")
                boxTitle.remove("up")
            }
            xParent[_title] = !xParent[_title]
        }
    }

    let handleCreate = (e, parent, id) => {
        e.stopPropagation();
        onClickCreate(title, parent, id)
    }

    let handleEdit = (e, data) => {
        e.stopPropagation();
        onClickEdit(title, data)
    }

    let handleDelete = (e, data) => {
        e.stopPropagation();
        onClickDelete(title, data)
    }

    return (
        <Col xs={xs} sm={sm} lg={lg} className="list-option">
            <Accordion defaultActiveKey="1">
                <Card>
                    <Card.Header>
                        <Accordion.Toggle id={`${title}-title`} className="title" eventKey="0" onClick={() => { handleOpen("") }}>
                            {title}
                            <i className={"fa fa-plus"} onClick={(e) => { handleCreate(e, '', '') }} />
                            <i id={`${title}-arrow`} className={"fa fa-angle-down"} />
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0" id={title}>
                        <Card.Body>
                            {data.map((element, index) => {
                                if (element.parent === undefined) {
                                    return (
                                        <div key={element.id} className="box-parent">
                                            {element.name}
                                            <i className={"fa fa-trash"} onClick={() => onClickDelete(title, element)} />
                                            <i className={"fa fa-pencil"} onClick={() => onClickEdit(title, element)} />
                                        </div>
                                    )
                                } else {
                                    let _data = element.parent
                                    xParent[element.name] = true
                                    return (
                                        <Accordion defaultActiveKey="1" key={element.id} >
                                            <Card>
                                                <Card.Header>
                                                    <Accordion.Toggle id={`${element.name}-title`} className="title parent" eventKey="0" onClick={() => { handleOpen(element.name) }} style={{ marginTop: index === 0 ? 2 : 0 }}>
                                                        {element.name}
                                                        <i className={"fa fa-trash"} onClick={(e) => handleDelete(e, element)} />
                                                        <i className={"fa fa-plus"} onClick={(e) => handleCreate(e, element.name, element.id)} />
                                                        <i className={"fa fa-pencil"} onClick={(e) => handleEdit(e, element)} />
                                                        <i id={`${element.name}-arrow`} className={"fa fa-angle-down"} />
                                                    </Accordion.Toggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey="0" id={_data.name}>
                                                    <Card.Body>
                                                        {_data.map((_element) => (
                                                            <div key={_element.id} className="box-parent">
                                                                {_element.name}
                                                                <i className={"fa fa-trash"} onClick={() => onClickDelete(title, _element)} />
                                                                <i className={"fa fa-pencil"} onClick={() => onClickEdit(title, _element)} />
                                                            </div>
                                                        ))}
                                                        {
                                                            _data.length === 0 &&
                                                            <div className="no-data">
                                                                <span>No Item.</span>
                                                            </div>
                                                        }
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        </Accordion>
                                    )
                                }
                            })}
                            {
                                data.length === 0 &&
                                <div className="no-data">
                                    <span>No Item.</span>
                                </div>
                            }
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </Col>
    )
}

ListOption.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.array,
    onClickDelete: PropTypes.func
}

ListOption.defaultProps = {
    data: []
}

export default ListOption
