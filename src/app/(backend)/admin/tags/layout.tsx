import React from 'react'

const layout = ({ children, newTagModal }: { children: React.ReactNode, newTagModal: React.ReactNode }) => {
    return (
        <>
            {children}
            {newTagModal}
        </>
    )
}

export default layout