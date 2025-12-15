type PopUpDataModel = {
    data: {
        title: string,
        description: string,
        button: {
            url: string,
            text: string
        },
        isSubscribeEnabled: boolean,
        isCustomSizeRequestEnabled: boolean,
        isPersistent: boolean,
        image: string
    }
    isActive: boolean
}

export default PopUpDataModel