type ThemeDataModel = {
    _id: string;
    theme: string;
    data_type: string;
    festive: null | "christmas"|"newyear",
    options: string[]
}

export default ThemeDataModel