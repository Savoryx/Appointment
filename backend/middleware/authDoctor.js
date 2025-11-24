// import jwt from 'jsonwebtoken'



// // user authentication middleware
// const authUser =async(req,res,next)=>{
//     try{
//         const {token} = req.headers

        
//         if(!token){
//             return res.json({success:false,message:"Unauthorized login again"})

//         }
//         const token_decode = jwt.verify(token,process.env.JWT_SECRET)
        

//         // req.body.userId = token_decode.id 
//         req.userId = token_decode.id 

//         next()

//     }catch(err){
//         console.log(err)
//         res.json({success:false,message:"Something Went Wrong erroe catch",message:err.message})
//     }
// }

// export default authUser;





import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ attach user ID directly to req (not req.body)
    req.docId = decoded.id;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authDoctor;









