import { faker } from "@faker-js/faker"

// GENERATING DEALERSHIP DUMMY DATA

const generateCarsId = () => {
    const numId = 2;
    const vehicle_info = [];
    for (let i = 0; i < numId; i++) {
        const vehicleId = faker.string.uuid()
        vehicle_info.push(vehicleId)
    }
    return vehicle_info

}
const generateDealsId = () => {
    const numId = 2;
    const vehicle_info = [];
    for (let i = 0; i < numId; i++) {
        const vehicleId = faker.string.uuid()
        vehicle_info.push(vehicleId)
    }
    return vehicle_info

}
const generateSoldVehiclesId = () => {
    const numId = 2;
    const vehicle_info = [];
    for (let i = 0; i < numId; i++) {
        const vehicleId = faker.string.uuid()
        vehicle_info.push(vehicleId)
    }
    return vehicle_info

}

const generateDealerInfo = () => {

    const dealer_info = {
        sex: faker.person.sex(),
        dealsIn: faker.vehicle.manufacturer()
    }
    return dealer_info
}

const generateDealers = () => {

    const user_details = {
        // user_id: faker.database.mongodbObjectId(),

        dealership_email: faker.internet.email(),
        dealership_name: faker.person.firstName(),
        dealership_location: faker.location.street(),
        dealership_info: generateDealerInfo(),
        password: faker.internet.password(),
        cars: generateCarsId(),
        deals: generateDealsId(),
        sold_vehicles: generateSoldVehiclesId()
    }
    return user_details
}

export const dealerOperation = () => {
    const numUsers = 2;
    const allData = [];
    for (let i = 0; i < numUsers; i++) {
        const dealers = generateDealers();
        allData.push(dealers);
    }
    return allData
}

// console.log(dealerOperation())


