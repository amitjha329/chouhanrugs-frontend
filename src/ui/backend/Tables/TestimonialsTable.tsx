'use client'
import generateNewTestimonial from "@/lib/actions/generateNewTestimonial";
import capitalize from "@/lib/utilities/capitalize";
import { customStyles } from "@/styles/dataTable";
import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { MdDeleteOutline } from "react-icons/md";
import { PuffLoader } from "react-spinners";
import { useRouter } from 'next/navigation'
import deleteTestimonials from "@/lib/actions/deleteTestimonials";

const TestimonialsTable = ({ testimonialsList }: { testimonialsList: TestimonialDataModel[] }) => {
    const router = useRouter()


    const columns = useMemo(() => [
        {
            id: "title",
            name: "Title",
            selector: (row: TestimonialDataModel) => row.title,
            sortable: true,
            format: (row: TestimonialDataModel) => (
                <b>{capitalize(row.title)}</b>
            )
        },
        {
            id: "client",
            name: "Client",
            selector: (row: TestimonialDataModel) => row.client,
            sortable: true,
            format: (row: TestimonialDataModel) => (
                <b>{capitalize(row.client)}</b>
            )
        },
        {
            id: "description",
            name: "Description",
            selector: (row: TestimonialDataModel) => row.description,
            sortable: false
        },
        {
            id: "action",
            name: "Action",
            button: true,
            cell: (row: TestimonialDataModel) => (
                <button className='btn btn-outline btn-error btn-sm' onClick={e => {
                    deleteTestimonials(row._id).then(res => {
                        window.location.reload()
                    }).catch(err => console.log(err))
                }} value={row._id}>
                    <MdDeleteOutline className='h-4 w-4' />
                </button>
            )
        }
    ], [])

    const subHeaderComponent = useMemo(() => {
        return (
            <div className='btn btn-outline' onClick={() => {
                generateNewTestimonial().then((value) => {
                    router.push(`/admin/cms/testimonials/edit/${value}`)
                })
            }}>Add Testimonial</div>
        )
    }, [])
    return (
        <>
            <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
                <div className='card-body'>
                    <DataTable
                        columns={columns}
                        data={testimonialsList}
                        customStyles={customStyles}
                        responsive
                        progressComponent={<PuffLoader />}
                        highlightOnHover
                        pointerOnHover
                        subHeader
                        subHeaderComponent={subHeaderComponent}
                    />
                </div>
            </div>
        </>
    );
}

export default TestimonialsTable;