const UserDB = artifacts.require("UserDB");

contract("User Database", () => {
    let userDB;
    before(async () => {
        userDB = await UserDB.deployed();
    });

    it("Should create a new user", async () => {
        await userDB.create("Sam");
        const user = await userDB.readUserInfo(1);
        assert(user[0].toNumber() === 1);
        assert(user[1] === "Sam");
    });

    it("Should update user info", async () => {
        await userDB.update(1, "Joy");
        const user = await userDB.readUserInfo(1);
        assert(user[0].toNumber() === 1);
        assert(user[1] === "Joy");
    });

    it("Should not update non-existing user", async () => {
        try {
            await userDB.update(2, "Tom");
        } catch (error) {
            assert(error.message.includes("User does not exist!"));
            return;
        }
        assert(false);
    });

    it("Should delete a user", async () => {
        await userDB.deleteUser(1);
        try {
            await userDB.readUserInfo(1);
        } catch (error) {
            assert(error.message.includes("User does not exist!"));
            return;
        }
        assert(false);
    });

    it("Should not delete non existing userInfo", async() => {
        try {
            await userDB.deleteUser(13);
        } catch (error) {
            assert(error.message.includes("User does not exist!"));
            return;
        }
        assert(false);
    })
})
