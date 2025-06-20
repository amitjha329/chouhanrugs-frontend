import React from 'react'
import SectionTitle from '../SectionTitle'

const ShopByRoom = () => {
    return (
        <div className="py-16 px-4 bg-secondary/50">
            <div className='fluid_container'>
                <SectionTitle title='Shop By Room' className='text-center mb-12' />
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-12">
                    <div className="flex items-start">
                        <div className="text-9xl text-secondary font-bold">1</div>
                        <div className="ml-6">
                            <div className="~text-lg/xl">Area Rugs</div>
                            <p className="mt-2 text-neutral-700 font-light text-sm">
                                This area has the heavy traffic foots so you have to choose a long runner with darker shade whose material have good durability which tolerate traffic foot prints. Darker shade is best choice for the entrance which hides the dirt and stains easily.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="text-9xl text-secondary font-bold">2</div>
                        <div className="ml-6">
                            <div className="~text-lg/xl">Bed Room Rugs</div>
                            <p className="mt-2 text-neutral-700 font-light text-sm">
                                Bedroom is relaxing area of the home so you have to choose cohesive color scheme with relaxing design style of rug or runner at the bottom of the bed aside foot side of the bed. You can choose textured rug or runner for bedroom.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="text-9xl text-secondary font-bold">3</div>
                        <div className="ml-6">
                            <div className="~text-lg/xl">Dining Room Rugs</div>
                            <p className="mt-2 text-neutral-700 font-light text-sm">
                                Dining room is area where all the family members eats together so you have to choose a rectangular or square shape rug which align well with the dining table and all the space around it. The rug must be durable with stain and spills free along with the washable material.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="text-9xl text-secondary font-bold">4</div>
                        <div className="ml-6">
                            <div className="~text-lg/xl">Living Room Rugs</div>
                            <p className="mt-2 text-neutral-700 font-light text-sm">
                                To choose rug for the living area you have three things in mind which is size, style and texture. Rug size is so accurate which looks living room space looks bigger with coordinating color scheme and style of the couch and, wall color and décor items in living room.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShopByRoom