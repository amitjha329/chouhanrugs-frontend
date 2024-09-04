import getCurrencyList from "@/lib/actions/getCurrencyList";
import CurrencyListTable from "@/ui/backend/Tables/CurrencyListTable";

const CurrenciesPage = async () => {
    const currencies = await getCurrencyList()
    return (
        <>
            <CurrencyListTable currencyList={currencies} />
        </>
    );
}

export default CurrenciesPage;