
type ImageDimensions = {
    height: number,
    width: number
}

/**
 * This function returns the height and width dimension of the imae pased in the provider.
 * @param {string | File | Blob} src Image Source to find dimension of.
 * @returns {Promise<ImageDimensions>} A promise containing the Image Dimensions object.
 */
const findImageDimension = (src: string | File | Blob): Promise<ImageDimensions> => {
    const img = document.createElement("img")
    const promise = new Promise<ImageDimensions>((resolve, reject) => {
        img.onload = () => {
            resolve({ height: img.height, width: img.width })
        }
        img.onerror = reject
    })
    if (src instanceof File || src instanceof Blob) {
        img.src = URL.createObjectURL(src)
    } else {
        img.src = src
    }
    return promise
}

export default findImageDimension