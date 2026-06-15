import { type LocalizedField } from "@/lib/resolveLocalized";

export type OrderProcessStepsDataModel = {
    _id: string;
    title: LocalizedField<string>;
    type: string;
    steps: {
        stepOne: Steps;
        stepTwo: Steps;
        stepThree: Steps;
        stepFour: Steps;
    };
    headingTag?: string;
};

export type Steps = {
    title: LocalizedField<string>;
    description: LocalizedField<string>;
    icon: string;
};
