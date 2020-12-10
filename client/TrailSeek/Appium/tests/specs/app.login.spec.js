// import TabBar from '../screenobjects/components/tab.bar';
// import LoginScreen from '../screenobjects/login.screen';

// describe('WebdriverIO and Appium, when interacting with a login form,', () => {
//     beforeEach(() => {
//         TabBar.waitForTabBarShown(true);
//         TabBar.openLogin();
//         LoginScreen.waitForIsShown(true);
//     });

//     it('should be able login successfully', () => {
//         LoginScreen.loginContainerButon.click();
//         LoginScreen.email.setValue('test@webdriver.io');
//         LoginScreen.password.setValue('Test1234!');

//         if (driver.isKeyboardShown()) {
//             driver.hideKeyboard();
//         }
//         LoginScreen.loginButton.click();
//         LoginScreen.alert.waitForIsShown();
//         expect(LoginScreen.alert.text()).toEqual('Success\nYou are logged in!');

//         LoginScreen.alert.pressButton('OK');
//         LoginScreen.alert.waitForIsShown(false);
//     });

//     // Try to implement this yourself
//     xit('should be able sign up successfully', () => {

//     });
// });

describe("Open App,", () => {
    it("Should open app succeffully", () => {
        driver.url("exp://exp.host/@neels198/trailseek/");
        const searchBar = $("~HomeSearchBar");
        expect(searchBar).toBeDisplayed();
    });
});
describe("Open Profile Tab,", () => {
    it("Should open profile tab succeffully", () => {
        const profileTab = $("~ProfileTab");
        profileTab.click();
    });
});
describe("Login,", () => {
    beforeAll(() => {
        const emailInput = $("~EmailInput");
        if (!emailInput.isExisting()) {
            const logoutButton = $("~LogoutButton");
            logoutButton.click();
        }
    });
    const email = "neel.salvi@gmail.com";
    const pass = "test";
    // it("Should logout succeffully (Logged in User)", () => {});

    it("Should login succeffully", () => {
        const emailInput = $("~EmailInput");
        const passwordInput = $("~PasswordInput");
        const loginButton = $("~LoginButton");
        emailInput.setValue(email);
        passwordInput.setValue(pass);
        loginButton.click();
        const searchBar = $("~HomeSearchBar");
        const profileTab = $("~ProfileTab");
        expect(searchBar).toBeDisplayed();
        expect(profileTab).toBeDisplayed();
        profileTab.click();
    });
    it("Should match email", () => {
        const emailProperty = $("~EmailProperty");
        expect(emailProperty).toHaveText(email);
    });
});
