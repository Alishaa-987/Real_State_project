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

    },
    avatar:{
        type:String,
        default:"https://th.bing.com/th/id/OIP.NWzDX-AUwWY-dKHu3n54iAHaEJ?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"
    },


},{timestamps:true});
// time stamp is liye banate hee take jab databse bane ye phir jab us me updat ho wo time store rhae

const User = mongoose.model('User' , userSchema);  // Ye schema ka use karke ek object banata hai jisse tum MongoDB me data add, read, update, delete kar sakte ho. 
export default User;