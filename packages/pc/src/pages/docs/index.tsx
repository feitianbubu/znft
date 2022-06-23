import React from "react";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css"
const SwaggerUI = dynamic(
    () => import("swagger-ui-react"),
    { ssr: false ,loading: () => (<p>loading...</p>)}
);

const Docs:React.FC = ()=>{
    let url = `${process.env.NEXT_PUBLIC_STATIC_URL}/oas/chain/chain.swagger.json`
    return <SwaggerUI url={url} />
}
export  default  Docs;
