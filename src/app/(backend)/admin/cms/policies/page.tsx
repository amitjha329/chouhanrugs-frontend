import getPoliciesData from "@/lib/actions/getPoliciesData";
import PolicyContentForm from "@/ui/backend/Forms/PolicyContentForm";
import PolicyTitleForm from "@/ui/backend/Forms/PolicyTitleForm";

const PoliciesPage = async () => {
    const policiesData = await getPoliciesData()
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white mt-4'>
            <div className='card-body'>
                <div className='card-title'>Policies</div>
                <div className='card-body'>
                    <div className='card-title'>Title:</div>
                    <PolicyTitleForm title={policiesData?.title ?? ""} />
                </div>
                <div className='card-body'>
                    <div className='card-title'>Content</div>
                    <PolicyContentForm content={policiesData?.content ?? ""} />
                </div>
            </div>
        </div>
    );
}

export default PoliciesPage;