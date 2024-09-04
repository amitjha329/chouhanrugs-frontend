import React from 'react'

const layout = ({ children, newPatternModal }: { children: React.ReactNode, newPatternModal: React.ReactNode }) => {
    return (
        <>
            {children}
            {newPatternModal}
        </>
    )
}

export default layout