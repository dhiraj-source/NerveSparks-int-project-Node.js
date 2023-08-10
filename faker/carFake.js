import { faker } from "@faker-js/faker"


// GENERATING CAR DUMMY DATA
const generateCarsInfo = () => {

    const car_info = {
        color: faker.vehicle.color(),
        fuel: faker.vehicle.fuel(),
    }
    return car_info
}

const generateCars = () => {

    const cars_details = {
        car_id: faker.string.uuid(),
        type: faker.vehicle.type(),
        name: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        car_info: generateCarsInfo(),
    }
    return cars_details
}

export const carsOperation = () => {
    const numCars = 4;
    const allData = [];
    for (let i = 0; i < numCars; i++) {
        const cars = generateCars();
        allData.push(cars);
    }
    return allData
}

// console.log(carsOperation())


