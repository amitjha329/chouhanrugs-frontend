import React from 'react'

const layout = ({ children, newShapeModal }: { children: React.ReactNode, newShapeModal: React.ReactNode }) => {
    return (
        <>
            {children}
            {newShapeModal}
        </>
    )
}

export default layout