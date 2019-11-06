export const objectUtil = {
    formValidate
};

function formValidate(formData) {
    for (let property in formData) {
        if (formData.hasOwnProperty(property)) {
            if (!formData[property]) {
                return false;
            }
        }
    }
    return true
}
