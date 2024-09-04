import React from 'react'

const layout = ({ children, newColorModal }: { children: React.ReactNode, newColorModal: React.ReactNode }) => {
    return (
        <>
            {children}
            {newColorModal}
        </>
    )
}

export default layout