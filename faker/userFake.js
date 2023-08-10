import { faker } from "@faker-js/faker"

// GENERATING USER DUMMY DATA

const generateVehicleInfo = () => {
    const numId = 5;
    const vehicle_info = [];
    for (let i = 0; i < numId; i++) {
        const vehicleId = faker.string.uuid()
        vehicle_info.push(vehicleId)
    }
    return vehicle_info

}

const generateUserInfo = () => {

    const user_info = {
        sex: faker.person.sex(),
        fullName: faker.person.fullName(),
    }
    return user_info
}

const generateUser = () => {

    const user_details = {
        user_id: faker.string.uuid(),
        user_email: faker.internet.email(),
        user_location: faker.location.street(),
        user_info: generateUserInfo(),
        password: faker.internet.password(),
        vehicle_info: generateVehicleInfo(),
    }
    return user_details
}

export const operationValue = () => {
    const numUsers = 2;
    const allData = [];
    for (let i = 0; i < numUsers; i++) {
        const user = generateUser();
        allData.push(user);
    }
    return allData
}

// operationValue()


