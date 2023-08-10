import { faker } from "@faker-js/faker"

// GENERATING DEAL DUMMY DATA

const generateDealInfo = () => {

    const deal_info = {

        price: faker.commerce.price({ min: 100, max: 200, dec: 0, symbol: '$' }),
        city: faker.location.city(),
    }
    return deal_info
}

const generatedeals = () => {


    const deal_details = {
        deal_id: faker.string.uuid(),
        car_id: faker.string.uuid(),
        deal_info: generateDealInfo(),
    }
    return deal_details
}

export const dealsOperation = () => {
    const numDeal = 2;
    const allData = [];
    for (let i = 0; i < numDeal; i++) {
        const deals = generatedeals();
        allData.push(deals);
    }
    return allData
}
// console.log(dealsOperation())