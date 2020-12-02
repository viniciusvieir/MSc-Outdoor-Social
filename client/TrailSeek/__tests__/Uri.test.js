import MockAdapter from 'axios-mock-adapter';
import Faker from 'faker'
import UserSlice from '../src/app/userSlice';
import UserSlice from '../src/app/trailSlice';
import userDetails from 'jest/mockResponseObjects/user-objects';

let mockApi = new MockAdapter(UserSlice.getAxiosInstance());
let validAuthentication = {
    email: Faker.internet.email(),
    password: Faker.internet.password()
}
mockApi.onPost('http://api.trailseek.eu/v1/user/signIn').reply = (config) => {
    if (config.data ===  validAuthentication) {
        return [200, userDetails];
      }
    return [400, 'Incorrect username and password'];
}


describe('Testing the sign in authentication', () => {
    const store = mockStore();

    it('user attempts with correct password and succeeds', async () => {
        await store.dispatch(authenticateUser('abc@test.com', '123456'));
        expect(store.getActions()).toMatchSnapshot();
    });
});


mockApi.onPost('http://api.trailseek.eu/v1/user/signUp').reply = (config) => {
    if (config.data ===  validAuthentication) {
        return [200, userDetails];
      }
    return [400, 'Incorrect username and password'];
}


describe('Testing the sign up authentication', () => {
    const store = mockStore();

    it('user attempts with correct password and succeeds', async () => {
        await store.dispatch(authenticateUser('abc@test.com', '123456','testuser', '10-10-1995', 'M'));
        expect(store.getActions()).toMatchSnapshot();
    });
});

mockApi.onPost('http://api.trailseek.eu/v1/trails/fetchTrailsByQuery').reply = (config) => {

}


describe('Testing the search trail api', () => {
    const store = mockStore();

    it('user attempts with correct query string succeeds', async () => {
        await store.dispatch(authenticateUser('name'));
        expect(store.getActions()).toMatchSnapshot();
    });
});