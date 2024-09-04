type OrderProcessStepsDataModel = {
    _id: string
    title: string,
    type: string
    steps: {
        stepOne: Steps,
        stepTwo: Steps,
        stepThree: Steps,
        stepFour: Steps
    }
}

export type Steps = {
    title: string
    description: string
    icon: string
}

export default OrderProcessStepsDataModel