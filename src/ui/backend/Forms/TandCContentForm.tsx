'use client'

import { saveTermsContent } from "@/lib/actions/saveTermsData";
import onPageNotifications from "@/ui/common/onPageNotifications";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import TINY_MCE_KEY from "../../../../tinymce.config";

const TandCContentForm = ({ content }: { content: string }) => {
    const [contentNew, setContent] = useState(content)
    const editorRef = useRef<any>()

    return (
        <div className='form-control gap-4'>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Title</span>
                <Editor
                    apiKey={TINY_MCE_KEY}
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={content}
                    init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist', 'anchor', 'autolink', 'help', 'link', 'lists',
                            'searchreplace', 'table', 'wordcount', 'code'
                        ],
                        toolbar: [
                            'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ',
                            'table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | removeformat | code | help'
                        ],
                        content_style: 'body {font - family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
            </label>
            <div className='card-actions justify-end'>
                <button className='btn btn-primary' type='submit' onClick={e => {
                    saveTermsContent(editorRef.current.getContent()).then((result) => {
                        if (result.ack) {
                            onPageNotifications("success", "Data Updated").then(() => {
                                window.location.reload()
                            }).catch(e => console.log(e))
                        } else {
                            onPageNotifications("error", "Unable to Update Data").catch(e => console.log(e))
                        }
                    }).catch(e => console.log(e))
                }}>Save</button>
            </div>
        </div>
    );
}

export default TandCContentForm;