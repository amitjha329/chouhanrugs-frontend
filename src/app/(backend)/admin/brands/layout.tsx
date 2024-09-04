import React from 'react'

const layout = ({ children, newBrandModal }: { children: React.ReactNode, newBrandModal: React.ReactNode }) => {
    return (
        <>
            {children}
            {newBrandModal}
        </>
    )
}

export default layout