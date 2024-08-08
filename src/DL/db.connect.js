import mongoose from "mongoose";
import 'dotenv/config' 

export async function connect() {
    
    try {
        mongoose
            .connect(process.env.URL_MONGO)
            .then((res) => console.log("**** connect success ****"));
    } catch (arr) {
        console.log("DB - Error : ", err);
    }
}


