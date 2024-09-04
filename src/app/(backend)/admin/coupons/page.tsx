import getCouponsList from "@/lib/actions/getCouponsList";
import CouponForm from "@/ui/backend/Forms/CouponsForm";
import CouponListTable from "@/ui/backend/Tables/CouponListTable";

const CouponsPage = async () => {
    const couponsList = await getCouponsList()
    return (<>
        <CouponForm />
        <CouponListTable couponsList={couponsList} />
    </>);
}

export default CouponsPage;