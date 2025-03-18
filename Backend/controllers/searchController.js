import client from "../utils/redistConnect.js";
import Student from "../models/student.js";
import Supervisor from "../models/supervisor.js";




const search = async (req, res) => {
    console.log("Request is recieved");
    try {
        const { query, type } = req.query;
        console.log(req.query);

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const cacheKey = `search:${type}:${query.toLowerCase()}`;
        

        const cachedData = await client.get(cacheKey);
        if (cachedData) {
            console.log("Serving from Redis Cache");
            console.log(cachedData);
            return res.status(200).json({message:"Success in redis",results:JSON.parse(cachedData)});
        }

        let results = [];
        if (type === "students") {
            results = await Student.find({ name: { $regex: query, $options: "i" } });
        } else if (type === "supervisor") {
            results = await Supervisor.find({ name: { $regex: query, $options: "i" } });
        } else {
            return res.status(400).json({ message: "Invalid search type" });
        }

        console.log("SHOWING BEFORE",results);

        if(results.length===0){
            return res.status(404).json({message:"Not Found ",results:results});
        }

        await client.setEx(cacheKey, 300, JSON.stringify(results));

        console.log("Serving from MongoDB & storing in Redis");
        res.status(200).json({message:"Success",results:results});

    } catch (err) {
        console.error("Search Error: ", err);
        res.status(500).json({ message: "Server error" });
    }
};

export { search };

