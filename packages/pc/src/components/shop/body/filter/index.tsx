import React from "react";
import {Accordion, AccordionDetails, AccordionSummary, Paper, Typography} from "@mui/material";
import {ExpandMore} from '@mui/icons-material'
import {Radio} from "@lib/react-component";
import {EFilter} from "@/pc/constant/enum";

import {useFilter} from "../context/filter-context";

const sortList = [{
    label:'类型',
    value:'1',
    labelPlacement:'start',
},{
    label:'tokenId',
    value:'2',
    labelPlacement:'start',
},{
    label:'售价',
    value:'3',
    labelPlacement:'start',
},{
    label:'星级',
    value:'4',
    labelPlacement:'start',
}]
const filterList = [{
    label:'市场',
    value:EFilter.市场,
    labelPlacement:'start',
},{
    label:'我的',
    value:EFilter.我的,
    labelPlacement:'start',
},{
    label:'空投',
    value:EFilter.空投,
    labelPlacement:'start',
},{
    label:'兑换',
    value:EFilter.兑换,
    labelPlacement:'start',
}]
const  Home:React.FC = ()=>{
    const [filter,setFilter,loading] = useFilter();

    return <Paper elevation={3} >
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>筛选</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Radio  list={filterList}  value={filter} disabled={loading} onChange={setFilter}/>
            </AccordionDetails>
        </Accordion>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>排序</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Radio list={sortList}/>
            </AccordionDetails>
        </Accordion>
        {/*<div>*/}
        {/*    筛选*/}
        {/*</div>*/}
        {/*<Divider/>*/}

        {/*<div>排序</div>*/}
        {/*<Divider/>*/}

    </Paper>
}
export default Home


