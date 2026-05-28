// fucntion for adding restraunts and cafes
 const addDates = {products: (req, res) => {
    try{
        // helpful logs
        console.log('content-type:', req.headers['content-type']);
        console.log('body:', req.body);
        console.log('files:', req.files);

        const {name, location, description} = req.body;

        // use optional chaining to avoid throwing when req.files is undefined
        const image1 = req.files?.image1?.[0] ?? null;
        const image2 = req.files?.image2?.[0] ?? null;

        if (!image1 || !image2) {
            // respond showing received data so you can test without uploading files
            return res.status(200).json({ success: true, message: 'No files uploaded', data: { name, location, description }, files: req.files || null });
        }

        console.log(name, location, description)
        console.log (image1, image2)

        res.json({ success: true })
    }
    catch(error) {
        console.log(error);
        res.json({success: false, message: error.message})

    }
}}; 

// functions for product endpoints
/*const addDates = {
    products: (req, res) => {
        try {
            // helpful logs for debugging requests (content-type, body, files)
            console.log('content-type:', req.headers['content-type']);
            console.log('body:', req.body);
            console.log('files:', req.files);

            const { name, location, description } = req.body;

            // safe access so the handler doesn't crash when files are not provided
            const image1 = req.files?.image1?.[0] ?? null;
            const image2 = req.files?.image2?.[0] ?? null;

            // If files are not provided, return a JSON response showing received data
            if (!image1 || !image2) {
                return res.status(200).json({
                    success: true,
                    message: 'Received request (no files uploaded) — endpoint reachable',
                    data: { name, location, description },
                    files: req.files || null,
                });
            }

            console.log(name, location, description);
            console.log(image1, image2);

            res.json({ success: true, message: 'Files received' });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    },
}; */

// function for listing cafes and restaurants
const listDates = {
    products: (req, res) => {
        res.json({ success: true, data: [] });
    },
};

// function for removing restaurants and cafes
const removeDates = {
    products: (req, res) => {
        res.json({ success: true, message: 'remove endpoint' });
    },
};

export { addDates, listDates, removeDates };