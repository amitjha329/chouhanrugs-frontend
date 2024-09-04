import { DragEvent } from "react";

/**
 * This Function Drag and drop File Uploads.
 * @param {DragEvent} e DrageEvent To Handle Files
 * @param {(fileList: File[]) => void} callback Callback Function to handle the processed Files.
 */
const fileDrophandler = (e: DragEvent, callback: (fileList: File[]) => void) => {
    e.preventDefault();
    console.log(e.dataTransfer.items)
    const fileList: Array<File> = []
    if (e.dataTransfer.items) {
        Array.from(e.dataTransfer.items).forEach((item, i) => {
            const fileItem = item.getAsFile()
            if (item.kind === 'file' && fileItem != null) {
                fileList.push(fileItem)
            }
        });
        callback(fileList)
    } else {
        callback(Array.from(e.dataTransfer.files))
    }
}

export default fileDrophandler