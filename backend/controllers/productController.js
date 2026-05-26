// fucntion for adding restraunts and cafes
const addDates = {products: (req, res) => {
    try{
        const {name, location, description} = req.body;

        const image1 = req.files.image1[0]
        // here image1 is array and from it we have to get the first element and from that we have to get the path of the image which is stored in our server and then we will upload that image to cloudinary and get the url of that image and then we will save that url in our database
        const image2 = req.files.image2[0]
        const image3 = req.files.image3[0]
        const image4 = req.files.image4[0]

        console.log(name, location, description)
        console.log (image1, image2, image3, image4)

        res.json({})
    }
    catch(error) {
        console.log(error);
        res.json({success: false, message: error.message})

    }
}};

//fucntion for listing cafes and restraunts
const listDates ={products: (req, res) =>{

}}

// function for removing restraunts and cafes
const removeDates = {products: (req,res) => {

}}

export {addDates, listDates, removeDates}