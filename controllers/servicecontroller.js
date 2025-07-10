const Service = require("../models/service.model");
const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();
const upload = multer({ storage });


//creates a service and handle errors
const createService = async (req, res) => {
    const { name, description, price, duration, isActive, category } = req.body;
    try {
        if (!req.file) return res.status(400).send('No image provided');

        // Resize & convert to JPEG with sharp
        const resizedImageBuffer = await sharp(req.file.buffer)
          .resize({ width: 600 }) // Resize width to 600px, height auto
          .jpeg({ quality: 80 })  // Compress JPEG
          .toBuffer();

        const newService = await Service.create({
            name: name,
            description: description,
            price: price,
            category: category,
            duration: duration,
            isActive: isActive,
            image: {
                data: resizedImageBuffer,
                contentType: 'image/jpeg'
              }
        })
        return res.status(201).json({
            message: "Added successfully"
        })
    }
    catch (error) {
        if (error.code == 11000) {
            return res.status(400).json({
                message: "Service name already exist"
            })
        }
        else{
        return res.status(400).json({
            message: "An error occured", error
        })}
    }
};

//gets all available service
const getServicesByService = async (req, res) => {
    //const { category } = req.body;
    const services = await Service.find({category:'685ce9faf7497a1cf59dbe76'});
    return res.json(services);
};

//gets  service by id
const getServicesById = async (req, res) => {
    //const { category } = req.body;
    const service = await Service.findById(req.params.id);
    if (!service) {
        return res.status(404).send('Product not found');
    }

    return res.json(service);
};

const getServices = async (req, res) => {
    const services = await Service.find({ category: { $ne: '685ce9faf7497a1cf59dbe76' } })
    if (!services) {
        return res.status(404).send('Product not found');
    }
    
    //console.log(services);
    return res.json(services)
}

// GET service image
 const getServiceImage = async (req, res) => {
     const service = await Service.findById(req.params.id);
     //console.log(service)
    if (!service || !service.image || !service.image.data) {
      return res.status(404).send('Image not found');
    }
     res.set('Content-Type', service.image.contentType || 'image/jpeg');
    
    res.send(service.image.data);
  };
  

module.exports = {createService, getServices,getServicesByService, getServiceImage, getServicesById}