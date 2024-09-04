import getTermsConditionData from "@/lib/actions/getTermsConditionData";
import TandCContentForm from "@/ui/backend/Forms/TandCContentForm";
import TandCTitleForm from "@/ui/backend/Forms/TandCTitleForm";

const AdminTermsandPrivacy = async () => {
    const policiesdata = await getTermsConditionData()
    return (
        <div>
            <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white mt-4'>
                <div className='card-body'>
                    <div className='card-title'>Terms</div>
                    <div className='card-body'>
                        <div className='card-title'>Title:</div>
                        <TandCTitleForm title={policiesdata?.title ?? ""} />
                    </div>
                    <div className='card-body'>
                        <div className='card-title'>Content</div>
                        <TandCContentForm content={policiesdata?.content ?? ""} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminTermsandPrivacy;