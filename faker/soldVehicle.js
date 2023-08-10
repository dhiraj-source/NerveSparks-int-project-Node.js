import { faker } from "@faker-js/faker"

// GENERATING SOLD_VEHICLE DUMMY DATA

const generateVehicleInfo = () => {

    const vehicle_info = {

        type: faker.vehicle.type(),
        fuel: faker.vehicle.fuel(),
    }
    return vehicle_info
}

const generateSoldVehicles = () => {

    const cars_details = {
        vehicle_id: faker.string.uuid(),
        car_id: faker.string.uuid(),
        vehicle_info: generateVehicleInfo(),
    }
    return cars_details
}

export const soldVehiclesOperation = () => {
    const numSold = 6;
    const allData = [];
    for (let i = 0; i < numSold; i++) {
        const soldVehicles = generateSoldVehicles();
        allData.push(soldVehicles);
    }
    return allData
}



