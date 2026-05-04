"use client";

import puckConfig from "@/ui/DynamicPages/Puck/config";
import type { Config, Data } from "@measured/puck";
import { Render } from "@measured/puck";

const DynamicPageRenderer = ({ data }: { data: Data }) => {
    return (
        <main className="bg-[#fbfaf8] text-stone-900">
            <Render config={puckConfig as Config} data={data} />
        </main>
    );
};

export default DynamicPageRenderer;
