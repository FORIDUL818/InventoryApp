const app=require("./app")
const Port=process.env.PORT || 4000;
app.listen(Port,()=>{
    console.log(`server is running  http://localhost:${Port}`)
})