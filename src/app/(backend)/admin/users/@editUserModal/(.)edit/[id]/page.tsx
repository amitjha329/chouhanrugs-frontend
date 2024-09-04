import getUserInfo from '@/lib/actions/getUserInfo'
import UserRolesForm from '@/ui/backend/Forms/UserRolesForm'
import RouteModal from '@/ui/frontend/RouteModal'
import React from 'react'

const NewColorModal = async ({ params }: { params: { id: string } }) => {
    const shapeData = await getUserInfo(params.id)
    return (
        <RouteModal>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
                Role Selection
            </h3>
            <UserRolesForm userData={shapeData} />
        </RouteModal>
    )
}

export default NewColorModal