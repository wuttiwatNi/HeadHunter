import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { objectUtil } from "../../../utils/object.util";
// api
import { candidateApi } from "../../../api";
// action
import { modalErrorAction } from "../../../actions";
// components
import { Topic, Box, Tables } from "../../../components";
import { Row, Spinner } from "react-bootstrap";

function CandidateAll() {
    let history = useHistory();
    const dispatch = useDispatch();
    const { getCandidateList } = candidateApi;
    const [candidateList, setCandidateList] = useState();

    useEffect(() => {
        getCandidateList().then(({ data }) => {
            let { success, result } = data
            if (success) {
                setCandidateList(objectUtil.sortArray(objectUtil.mapDataCandidate(result), "fullName"))
            } else {
                dispatch(modalErrorAction.show())
            }
        }).catch(error => { console.log(error) })
    }, [getCandidateList, dispatch]);

    let handleClickRow = (data) => {
        history.push(`/candidate/${data.id}`)
    }

    return (
        <>
            {!candidateList ? (
                <div className={"spinner"}>
                    <Spinner animation="grow" variant="primary" />
                </div>) :
                (<>
                    <Topic title={"Candidate"} subTitle={"list"} />
                    <Row>
                        <Box body={() => (
                            <>
                                <Tables
                                    columnLabel={["Full Name", "Email", "Phone"]}
                                    column={["fullName", "email", "phoneNumber"]}
                                    row={candidateList}
                                    onClickRow={handleClickRow}
                                    pathCreate={"/candidate/create"} />
                            </>
                        )} />
                    </Row>
                </>)}
        </>
    );
}

export default CandidateAll;
