'use client'
import deleteCoupon from "@/lib/actions/deleteCoupon";
import CouponDataModel from "@/lib/types/CouponDataModel";
import capitalize from "@/lib/utilities/capitalize";
import { customStyles } from "@/styles/dataTable";
import { format } from "date-fns";
import DataTable from "react-data-table-component";
import { MdDeleteOutline } from "react-icons/md";
import { CircleLoader } from "react-spinners";

const columns = [
    {
        id: "coupon_name",
        name: "Coupon Name",
        selector: (row: CouponDataModel) => row.name,
        sortable: true,
        format: (row: CouponDataModel) => (
            <span className='font-semibold'>{capitalize(row.name)}</span>
        )
    }, {
        id: "coupon_code",
        name: "Code",
        selector: (row: CouponDataModel) => row.code,
        sortable: true,
    },
    {
        id: "description",
        name: "Description",
        selector: (row: CouponDataModel) => row.description,
        sortable: false
    },
    {
        id: "value",
        name: "Value",
        sortable: true,
        selector: (row: CouponDataModel) => row.value,
    },
    {
        id: "type",
        name: "Type",
        selector: (row: CouponDataModel) => row.type,
        sortable: true,
    },
    {
        id: "min_order",
        name: "Min Order",
        selector: (row: CouponDataModel) => row.minOrder
    },
    {
        id: "max_value",
        name: "Max Value",
        selector: (row: CouponDataModel) => row.maxValue
    },
    {
        id: "expiration",
        name: "Validity",
        selector: (row: CouponDataModel) => row.expiration,
        minWidth: "200px",
        format: (row: CouponDataModel) => (
            <span>{format(new Date(row.expiration), "do MMMM, yy")}</span>
        )
    },
    {
        id: "action",
        name: "Action",
        button: true,
        minWidth: "150px",
        cell: (row: CouponDataModel) => (
            <div className="flex flex-row gap-x-2 items-center">
                <button className='btn btn-outline btn-error btn-sm' onClick={e => {
                    row._id && deleteCoupon(row._id).then(()=>{
                        window.location.reload()
                    })
                }}>
                    <MdDeleteOutline className='h-4 w-4' />
                </button>
            </div>
        )
    }
]

const CouponListTable = ({ couponsList }: { couponsList: CouponDataModel[] }) => {
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
            <div className='card-body'>
                <DataTable
                    title="Coupons List"
                    columns={columns}
                    data={couponsList}
                    customStyles={customStyles}
                    responsive
                    progressComponent={<CircleLoader />}
                    highlightOnHover
                    pointerOnHover
                />
            </div>
        </div>
    );
}

export default CouponListTable;