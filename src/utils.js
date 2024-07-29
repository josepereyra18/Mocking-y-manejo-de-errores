import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user,password) => bcrypt.compareSync(password, user.password);

export const createProductsFaker = () =>{
    let product = {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: faker.string.alphanumeric(15),
        stock: faker.number.int({ max: 100 }),
        category: faker.commerce.productAdjective(),
        status: faker.datatype.boolean()
    }
    return product

}



export default __dirname;