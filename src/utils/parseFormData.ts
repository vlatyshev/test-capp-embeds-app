/**
 * avoid Object.fromEntries
 */
export const formDataToObject = (formData: FormData) => {
    const formEntries = formData.entries();

    const data = Array.from(formEntries).reduce((memo, pair) => ({
        ...memo,
        [pair[0]]: pair[1],
    }), {});

    return data;
};

export const formValuesToObject = (target: HTMLFormElement) => {
    const formData = new FormData(target);

    return formDataToObject(formData);
};
