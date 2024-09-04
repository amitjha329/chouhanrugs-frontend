import React from 'react'

const layout = ({ children, editUserModal }: { children: React.ReactNode, editUserModal: React.ReactNode }) => {
    return (
        <>
            {children}
            {editUserModal}
        </>
    )
}

export default layout