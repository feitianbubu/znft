import React from "react";
import dynamic from "next/dynamic";
const SwaggerUI = dynamic(
    () => import("swagger-ui-react"),
    { ssr: false ,loading: () => (<p>loading...</p>)}
);

const Docs:React.FC = ()=>{
    let url = `/static/oas/chain/chain.swagger.json`
    return <SwaggerUI url={url} tryItOutEnabled={true} requestSnippetsEnabled={true} />
}
export  default  Docs;
