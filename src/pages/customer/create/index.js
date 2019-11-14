import React, {useState} from "react";
import {Topic, Box, Tables} from "../../../components"
import {Row, Spinner} from "react-bootstrap";

function CustomerCreate({mode}) {
    return (
        <>
            <Topic title={"Customer"} subTitle={"create"}/>
            <Row>
                < Box body={() => (
                    <>
                    </>
                )}/>
            </Row>
        </>
    );
}

export default CustomerCreate;
