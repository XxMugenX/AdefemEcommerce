const Booking = require('../models/bookings.model');
const Staff = require('../models/staff.model');
const Service = require('../models/service.model');
const User = require('../models/user.model');
const bookingMail = require('../utils/sendemail')

//creates booking and handles booking and staff availability conflicts
const createBooking = async (req, res) => {
    const { staffId, bookingDate, userId, serviceId, notes } = req.body;
    let duration;
    //console.log(req.body)

    try {
        //checks if selected staff exists in database
        const staff = await Staff.findById(staffId);
        if (!staff) return res.status(404).json({ message: 'Staff not found' });
        const service = await Service.findById(serviceId);
        // console.log(await service.isActive)
        if (!service.isActive) return res.status(404).json({ message: 'Service not available now' });

        //formats date value selected as actual data 
        const date = new Date(bookingDate);

        if (staff.name == 'Morning') {
            date.setHours(date.getHours() + 8);
            duration = 300;
        }
        if (staff.name == 'Afternoon/Evening') {
            date.setHours(date.getHours() + 14);
            duration = 360;
        }
        
        //converts formatted date to string
        const day = date.toLocaleString('en-US', { weekday: 'long' });
        //gets time from selected date value
        const time = date.toTimeString().substring(0, 5); // e.g., '14:00'

        //compares selected booking date with staff's availability time and date
        const notAvailable = await Staff.findOne({ name: staff.name })
        const bookedStaff = await Booking.findOne({ bookingDate: date, staffId: staff._id }).populate('staffId', 'name')
        //const bookedDate = await Booking.findOne({ bookingDate: date.setHours(date.getHours() + 9)|| date.setHours(date.getHours() + 15) })
        // const name = bookedStaff.staffId || false
        // const booked = bookedDate.bookingDate.toDateString || false
        //console.log(bookedStaff.staffId.name === staff.name)
        //console.log(bookedStaff)
        
        //console.log(bookedDate.bookingDate.toDateString === date.toDateString)
        //console.log(bookedStaff.staffId)
        //console.log(bookedDate.bookingDate)
        //console.log(bookedDate)
        // console.log(bookedStaff)

        if (bookedStaff) {
            const unAvailableSlot = () => {
                
                return (bookedStaff.staffId.name == staff.name) && (bookedStaff.bookingDate.toDateString == date.toDateString)
            }
                
            // return (bookedStaff.staffId.name == staff.name) && (bookedDate.bookingDate.toDateString == date.toDateString) 
        //console.log(bookedStaff)
        if (unAvailableSlot() == true) {
            return res.status(400).json({ message: 'Session already booked on this day, please choose another session or day' })
        }
    }          

        //checks if selected booking date clashes with staff's working schedule
        // const overlappingBooking = await Booking.findOne({
        // staffId,
        // bookingDate: { $eq: new Date(bookingDate) }
        // });

        // if (overlappingBooking) {
        // return res.status(400).json({ message: 'Staff already booked at this time' });
        // }
        
        
        //creates booking if no conflicts
        const booking = await Booking.create({
            userId: userId,
            serviceId: serviceId,
            staffId: staffId,
            bookingDate: date,
            duration: duration,
            notes: notes
        });
        await booking.save();
        const user = await User.findById(userId)
        bookingMail.userMail(process.env.EMAIL, user.email, service.name, user.fullName, date)
        bookingMail.adminMail(process.env.EMAIL, process.env.EMAIL, service.name, user.fullName, date)

        res.status(200).json(booking);

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }
};

//gets all bookings for all staffs
const getBookings = async (req, res) => {
    try{
    let bookings = await Booking.find().populate('userId','fullName').populate('staffId','name').populate('serviceId','name').sort({ bookingDate: 1 });
        res.json(bookings);
        
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to fetch bookings'
        })
    }
}

const getBookingForUser = async (req, res) => {
    const { _id } = req.user;
    const userBookings = await Booking.find({
        userId: _id
    }).populate('userId', 'fullName').populate('staffId', 'name').populate('serviceId', 'name').sort({ bookingDate: 1 });
    //console.log(userBookings)
    res.json(userBookings);
}

const deleteBooking = async (req, res) => {
    // const {bookingId} = req.params;
    // console.log(bookingId)
    const booking = await Booking.findById(req.params.id );
    if (!booking) {
        return res.status(400).json({message : 'Booking not found'})
    }

    await Booking.findByIdAndDelete( req.params.id  );

    res.status(200).json({ message: 'Booking successfullty deleted' });
}

const updateBooking = async (req, res) => {
    // const {bookingId} = req.params;
    // console.log(bookingId)
    const booking = await Booking.findById(req.params.id);
    //console.log(booking);
    if (!booking) {
        return res.status(400).json({message : 'Booking not found'})
    }

    await Booking.findByIdAndUpdate(req.params.id,{status : 'completed'})

    res.status(200).json({ message: 'Booking successfullty deleted' });
}



module.exports ={ createBooking, getBookings, getBookingForUser, deleteBooking, updateBooking}
