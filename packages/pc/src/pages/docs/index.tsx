import React from "react";
import dynamic from "next/dynamic";
const SwaggerUI = dynamic(
    () => import("swagger-ui-react"),
    { ssr: false ,loading: () => (<p>loading...</p>)}
);

const Docs:React.FC = ()=>{
    let url = `http://192.168.246.62:3080/static/oas/chain/chain.swagger.json`
    return <SwaggerUI url={url} tryItOutEnabled={true} requestSnippetsEnabled={true} />
}
export  default  Docs;
