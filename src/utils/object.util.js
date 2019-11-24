export const objectUtil = {
    formValidate,
    clearData,
    formForInputSelect
};

function formValidate(formData) {
    let isValid = true;
    let i = 0;
    for (let property in formData) {
        if (formData.hasOwnProperty(property)) {
            if (!formData[property]) {
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

function clearData(_formData) {
    let formData = { ..._formData }
    for (let property in formData) {
        if (formData.hasOwnProperty(property)) {
            formData[property] = "";
        }
    }
    return formData
}

function formForInputSelect(data, keyValue, keyLabel) {
    let result = [];
    data.forEach(element => {
        let object = {};
        for (let property in element) {
            if (property === keyValue) {
                object["value"] = element[property]
            }
            if (property === keyLabel) {
                object["label"] = element[property]
            }
        }
        result.push(object)
    });
    return result;
}
