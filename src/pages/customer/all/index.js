import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"
import { objectUtil } from "../../../utils/object.util"
// api
import { customerApi } from "../../../api"
// action
import { modalErrorAction } from "../../../actions"
// components
import { Topic, Box, Tables } from "../../../components"
import { Row, Spinner } from "react-bootstrap"

function CustomerAll() {
    let history = useHistory()
    const dispatch = useDispatch()
    const { getCustomerList } = customerApi
    const [customerList, setCustomerList] = useState()

    useEffect(() => {
        getCustomerList().then(({ data }) => {
            let { success, result } = data
            if (success) {
                setCustomerList(objectUtil.sortArray(result, "companyName"))
            } else {
                dispatch(modalErrorAction.show())
            }
        }).catch(error => { console.log(error) })
    }, [getCustomerList, dispatch])

    let handleClickRow = (data) => {
        history.push(`/customer/${data.id}`)
    }

    return (
        <>
            {!customerList ? (
                <div className={"spinner"}>
                    <Spinner animation="grow" variant="primary" />
                </div>) :
                (<>
                    <Topic title={"Customer"} subTitle={"list"} />
                    <Row>
                        <Box body={() => (
                            <>
                                <Tables
                                    columnLabel={["Company", "Tax.", "Phone"]}
                                    column={["companyName", "taxNumber", "phoneNumber"]}
                                    row={customerList}
                                    onClickRow={handleClickRow}
                                    pathCreate={"/customer/create"} />
                            </>
                        )} />
                    </Row>
                </>)}
        </>
    )
}

export default CustomerAll
