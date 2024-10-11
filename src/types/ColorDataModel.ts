export type ColorDataModel = {
    _id: string
    name: string
    colorCode: ColorCode
    sampleImg: string
}

export type ColorCode = {
    hsl: Hsl
    hex: string
    rgb: Rgb
    hsv: Hsv
    oldHue: number
    source: string
}

export type Hsl = {
    h: number
    s: number
    l: number
    a: number
}

export type Rgb = {
    r: number
    g: number
    b: number
    a: number
}

export type Hsv = {
    h: number
    s: number
    v: number
    a: number
}

export default ColorDataModel