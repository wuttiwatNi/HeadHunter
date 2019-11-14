import React, {useState} from "react";
import {Topic, Box, Tables} from "../../../components"
import {Row, Spinner} from "react-bootstrap";

function CustomerAll() {
    const [customerList, setCustomerList] = useState(
        [{
            id: 1,
            username: "abcd",
            password: "samsung",
            age: 20
        }, {
            id: 2,
            username: "xyz",
            password: "apple",
            age: 25
        }, {
            id: 3,
            username: "xyz",
            password: "acer",
            age: 25
        }, {
            id: 4,
            username: "lmn",
            password: "asus",
            age: 30
        }, {
            id: 5,
            username: "lmn",
            password: "lenovo",
            age: 32
        }, {
            id: 6,
            username: "lmn",
            password: "google",
            age: 35
        }]
    );

    return (
        <>
            {!customerList ? (
                    <div className={"spinner"}>
                        <Spinner animation="grow" variant="primary"/>
                    </div>) :
                (<>
                    <Topic title={"Customer"} subTitle={"list"}/>
                    < Row>
                        < Box body={() => (
                            <>
                                <Tables
                                    columnLabel={["Username", "Password", "Age"]}
                                    column={["username", "password", "age"]}
                                    row={customerList}
                                    pathCreate={"customer/create"}/>
                            </>
                        )}/>
                    </Row>
                </>)}

        </>
    );
}

export default CustomerAll;
