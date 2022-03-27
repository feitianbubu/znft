let servers = {
  a: {service_id:10},
  b: {service_id:2},
  c: {service_id:3},
  d: {service_id:4},
  e: {service_id:5},
  f: {service_id:6},
  g: {service_id:7},
}
Object.entries(servers).sort((a, b)=>{
  return a[1].service_id<b[1].service_id ? 1 : -1;
}).map(([k,v])=>(
  console.log([k,v])
));