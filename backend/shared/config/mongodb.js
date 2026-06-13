import mongoose from "mongoose";
import dns from "node:dns";

const connectDB = async () => {
    mongoose.connection.on('connected', ()=>{
        console.log("DB connected");
    } )

    const connectionUrl = `${process.env.MONGODB_URL}/DAYate`;

    try {
        await mongoose.connect(connectionUrl);
    } catch (error) {
        const isSrvDnsRefused =
            error.code === "ECONNREFUSED" && error.syscall === "querySrv";

        if (!isSrvDnsRefused) {
            throw error;
        }

        // Node's resolver can reject some local IPv6 DNS servers even when
        // the operating system can resolve the same MongoDB Atlas SRV record.
        dns.setServers(["1.1.1.1", "8.8.8.8"]);
        await mongoose.connect(connectionUrl);
    }
};
export default connectDB;
