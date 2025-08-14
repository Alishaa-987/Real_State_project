import mongoose from "mongoose";


// userSchema : it is a blueprint of our mongodb data collections  matlab ke jab hmm koi aik user create kare gee
// us me ye jo charaactertics define ke he in ke according data fill ho gaa
const userSchema = new mongoose.Schema({
    username:{
        type : String,
        required : true ,
        unique : true,

    },

       email:{
        type : String,
        required : true ,
        unique : true,

    },

       password:{
        type : String,
        required : true ,

    }


},{timestamps:true});
// time stamp is liye banate hee take jab databse bane ye phir jab us me updat ho wo time store rhae

const User = mongoose.model('User' , userSchema);  // Ye schema ka use karke ek object banata hai jisse tum MongoDB me data add, read, update, delete kar sakte ho. 
export default User;