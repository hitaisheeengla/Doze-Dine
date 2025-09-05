const wrapAsync=(Fn)=>{
    return (req,res,next)=>{
        Fn(req,res,next).catch(next);
    }
}

module.exports=wrapAsync;