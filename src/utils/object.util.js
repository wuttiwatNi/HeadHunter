// constants
import { generalConstant } from "../constants/index"

export const objectUtil = {
    formValidate,
    formValidateItem,
    clearData,
    formForInputSelect,
    formForInputSelect2,
    sortArray,
    mapDataOrder,
    mapDataCandidate,
    mapDataLanguage,
    mapPriority,
    mapNidTypeList,
    mapGendarList,
    mapMaritalList,
    mapLevelEducationList
};

function mapNidTypeList(data) {
    return data === 1 ? "ID Card" : "Passport"
}

function mapGendarList(data) {
    return data === "M" ? "Male" : "Fenale"
}

function mapMaritalList(data) {
    return data === 1 ? "Single" : "Married"
}

function mapLevelEducationList(data) {
    let result = ""
    generalConstant.levelEducationList.forEach((element) => {
        if (element.value === data) {
            result = element.label
        }
    })
    return result
}

function formValidate(formData) {
    let isValid = true;
    let i = 0;
    for (let property in formData) {
        if (formData.hasOwnProperty(property)) {
            if (!formData[property] && typeof formData[property] !== "boolean") {
                if (i === 0) {
                    document.getElementById(property).scrollIntoView({ behavior: "smooth", block: "center" });
                }
                i = 1;
                document.getElementById(property).classList.add("invalid")
                isValid = false;
            }
        }
    }
    return isValid
}

function formValidateItem(_formData, id) {
    let isValid = true;
    let i = 0;
    _formData.forEach((formData) => {
        for (let property in formData) {
            if (formData.hasOwnProperty(property)) {
                if (!formData[property]) {
                    if (i === 0) {
                        document.getElementById(`${property}-${formData[id]}`).scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                    i = 1;
                    document.getElementById(`${property}-${formData[id]}`).classList.add("invalid")
                    isValid = false;
                }
            }
        }
    })
    return isValid
}

function clearData(_formData) {
    let formData = { ..._formData }
    for (let property in formData) {
        if (formData.hasOwnProperty(property)) {
            formData[property] = "";
        }
    }
    return formData
}

function sortArray(_array, key) {
    let data = JSON.parse(JSON.stringify(_array))
    data.sort((a, b) => {
        return a[key].toString().toLowerCase() < b[key].toString().toLowerCase() ? -1 : 1
    })
    return data
}

function formForInputSelect(data, keyValue, keyLabel) {
    let result = [];
    data.forEach(element => {
        let object = {};
        for (let property in element) {
            if (property === keyValue) {
                object["value"] = element[keyValue]
            }
            if (property === keyLabel) {
                object["label"] = element[keyLabel]
            }
        }
        result.push(object)
    });
    return result;
}

function formForInputSelect2(data, keyValue, keyLabel1, keyLabel2) {
    let result = [];
    data.forEach(element => {
        let object = {};
        for (let property in element) {
            if (property === keyValue) {
                object["value"] = element[keyValue]
            }
            if (property === keyLabel1) {
                object["label"] = element[keyLabel1] + " " + element[keyLabel2]
            }
        }
        result.push(object)
    });
    return result;
}

function mapDataOrder(_array) {
    let data = JSON.parse(JSON.stringify(_array))
    data.map(element => {
        switch (element.priority) {
            case 1:
                element.priorityName = "Low"
                break
            case 2:
                element.priorityName = "Normal"
                break
            case 3:
                element.priorityName = "Hight"
                break
            default:
                break
        }
        return element
    })
    return data
}

function mapDataCandidate(_array) {
    let data = JSON.parse(JSON.stringify(_array))
    data = data.map(element => ({
        ...element,
        fullName: `${element["firstName"]} ${element["lastName"]}`
    }))
    return data
}

function mapPriority(data) {
    switch (data) {
        case 1:
            return "Low"
        case 2:
            return "Normal"
        case 3:
            return "Hight"
        default:
            return ""
    }
}

function mapDataLanguage(_array) {
    let data = JSON.parse(JSON.stringify(_array))
    data.map(element => {
        switch (element.listening) {
            case 1:
                element.listeningName = "Good"
                break
            case 2:
                element.listeningName = "Excellent"
                break
            case 3:
                element.listeningName = "Expert"
                break
            default:
                break
        }
        switch (element.speaking) {
            case 1:
                element.speakingName = "Good"
                break
            case 2:
                element.speakingName = "Excellent"
                break
            case 3:
                element.speakingName = "Expert"
                break
            default:
                break
        }
        switch (element.reading) {
            case 1:
                element.readingName = "Good"
                break
            case 2:
                element.readingName = "Excellent"
                break
            case 3:
                element.readingName = "Expert"
                break
            default:
                break
        }
        switch (element.writing) {
            case 1:
                element.writingName = "Good"
                break
            case 2:
                element.writingName = "Excellent"
                break
            case 3:
                element.writingName = "Expert"
                break
            default:
                break
        }
        return element
    })
    return data
}