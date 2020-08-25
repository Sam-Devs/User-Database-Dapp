import Web3 from 'web3';
import UserDB from '../build/contracts/UserDB.json';

let web3;
let userDB;

const initWeb3 = () => {
	return new Promise((resolve, reject) => {
		if (typeof window.ethereum !== 'undefined') {
			const web3 = new Web3(window.ethereum);
			window.ethereum
				.enable()
				.then(() => {
					resolve(new Web3(window.ethereum));
				})
				.catch((err) => {
					reject(err.message);
                });
                return;
        }
        
        if(typeof window.web3 !== "undefined") {
            return resolve(new Web3(window.web3.currentProvider));
        }
        resolve(new Web3("http://localhost:7545"));
	});
};

const initContract = () => {
    const deployementKey = Object.keys(UserDB.networks)[0];
    return new web3.eth.Contract(
        UserDB.abi,
        UserDB.networks[deployementKey].address
    );
}

const initApp = () => {
    const $create = document.getElementById("create");
    const $createResult = document.getElementById("create-result");
    const $read = document.getElementById("read");
    const $readResult = document.getElementById("read-result");

    const $edit = document.getElementById("edit");
    const $editResult = document.getElementById("edit-result");

    const $delete = document.getElementById("delete");
    const $deleteResult = document.getElementById("delete-result");


    let accounts = [];

    web3.eth.getAccounts()
    .then((_accounts) => {
        accounts = _accounts;
    })

    $delete.addEventListener('submit', e => {
        e.preventDefault();
        const id = e.target.elements[0].value;
        userDB.methods
        .deleteUser(id)
        .send({from: accounts[0]})
        .then((result) => {
            $deleteResult.innerHTML = `Deleted user ${id}`;
        }).catch(() => {
            $deleteResult.innerHTML = `There was an error while deleting user ${id}`;
        });
    })


    $read.addEventListener('submit', e => {
        e.preventDefault();
        const id = e.target.elements[0].value;
        userDB.methods
        .readUserInfo(id)
        .call()
        .then((result) => {
            $readResult.innerHTML = `id: ${result[0]} Name: ${result[1]}`;
        }).catch(() => {
            $readResult.innerHTML = `There was a problem while trying to read user ${id}`;
        });
    })

    $edit.addEventListener("submit", e => {
        e.preventDefault();
        const id = e.target.elements[0].value;
        const name = e.target.elements[1].value;
        userDB.methods
        .update(id, name)
        .send({from: accounts[0]})
        .then((result) => {
            $editResult.innerHTML = `Change user ${id} ${name}`
        }).catch((err) => {
            $editResult.innerHTML = `Error while updating user ${id} ${name}`
        });
    });

    $create.addEventListener("submit", e => {
        e.preventDefault();
        const name = e.target.elements[0].value;
        userDB.methods
        .create(name)
        .send{from: accounts[0]}
        .then(() => {
            $createResult.innerHTML = `New user ${name} was successfully created`;
        }).catch(() => {
            $createResult.innerHTML = `Ooopss... there was an error while trying to create a new user....`;
        });
    });

}

document.addEventListener("DOMContentLoaded", () => {
    initWeb3()
    .then(_web3 => {
        web3 = _web3;
        userDB = initContract();
        initApp();
    }).catch((err) => {
        console.log(err.message);
    });
})