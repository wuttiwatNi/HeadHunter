import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { objectUtil } from "../../../utils/object.util";
// api
import { orderApi } from "../../../api";
// action
import { modalErrorAction } from "../../../actions";
// components
import { Topic, Box, Tables } from "../../../components";
import { Row, Spinner } from "react-bootstrap";

function OrderAll() {
    let history = useHistory();
    const dispatch = useDispatch();
    const { getOrderList } = orderApi;
    const [orderList, setOrderList] = useState();

    useEffect(() => {
        getOrderList().then(({ data }) => {
            let { success, result } = data
            if (success) {
                setOrderList(objectUtil.sortArray(objectUtil.mapDataOrder(result), "positionName"))
            } else {
                dispatch(modalErrorAction.show())
            }
        }).catch(error => { console.log(error) })
    }, [getOrderList, dispatch]);

    let handleClickRow = (data) => {
        history.push(`/order/${data.id}`)
    }

    return (
        <>
            {!orderList ? (
                <div className={"spinner"}>
                    <Spinner animation="grow" variant="primary" />
                </div>) :
                (<>
                    <Topic title={"Order"} subTitle={"list"} />
                    <Row>
                        <Box body={() => (
                            <>
                                <Tables
                                    columnLabel={["Order", "Company", "Budget", "Priority"]}
                                    column={["positionName", "companyName", "budget", "priorityName"]}
                                    row={orderList}
                                    onClickRow={handleClickRow}
                                    pathCreate={"/order/create"} />
                            </>
                        )} />
                    </Row>
                </>)}
        </>
    );
}

export default OrderAll;
