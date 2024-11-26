("use strict");

// Khởi tạo Web3 và accountManager toàn cục
let accountManager;
let web3;

// Hàm khởi tạo contract và Web3
// ABI của hợp đồng UserManager

// Kiểm tra MetaMask và kết nối hợp đồng
const contractAddress = "0x6eabaf988c089cee787b773d03b55f5c47e38d4e";  // Địa chỉ hợp đồng
      const abi = [
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_Id",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_userName",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_age",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_addressLocation",
              "type": "string"
            }
          ],
          "name": "addUser",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_userId",
              "type": "string"
            }
          ],
          "name": "deleteUser",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_userId",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_userName",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_age",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_addressLocation",
              "type": "string"
            }
          ],
          "name": "updateUser",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllUsers",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "Id",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "userName",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "age",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "addressLocation",
                  "type": "string"
                }
              ],
              "internalType": "struct UserManager.User[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getSortedUsersByAge",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "Id",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "userName",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "age",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "addressLocation",
                  "type": "string"
                }
              ],
              "internalType": "struct UserManager.User[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_userId",
              "type": "string"
            }
          ],
          "name": "getUserById",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "index",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ];
      async function initContract() {
        try {
          // Ensure web3 is initialized
          if (typeof window.ethereum === "undefined") {
            alert("MetaMask is not installed. Please install it to use this feature.");
            return;
          }
      
          // Initialize web3
          const web3 = new Web3(window.ethereum);
      
          // Define the contract
          contract = new web3.eth.Contract(abi, contractAddress);
      
          // Check for connected accounts
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            console.log("Account connected:", accounts[0]);
          } else {
            alert("No account connected. Please connect to MetaMask.");
            return;
          }
      
          // If the contract and account are connected successfully
          console.log("Contract initialized successfully.");
        } catch (error) {
          console.error("Error while initializing contract:", error);
          alert("Error while connecting to the contract.");
        }
      }
      
      

// Hiển thị danh sách người dùng
function displayUsers(users) {
  let userHtml = '<ul>';
  users.forEach(user => {
    userHtml += `<li>${user.userName} - Age: ${user.age}, Address: ${user.addressLocation}</li>`;
  });
  userHtml += '</ul>';
  document.getElementById("userList").innerHTML = userHtml;
}


async function checkContractConnection() {
  if (!accountManager) {
    console.error("Contract not initialized.");
    alert("Contract not initialized. Please check the connection.");
    return;
  }

  try {
    // Kiểm tra xem có thể gọi một phương thức hợp đồng hay không
    const accountCount = await accountManager.methods.index().call();
    console.log("Contract connected. Account count:", accountCount);
    alert("Contract connected successfully!");

    // Kiểm tra số lượng người dùng hoặc thông tin khác nếu cần
    const users = await accountManager.methods.getAllUsers().call();
    console.log("Users:", users);

  } catch (error) {
    console.error("Error connecting to contract:", error);
    alert("Failed to connect to contract. Please check the console for more details.");
  }
}


async function connectMetaMask() {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Request the user's accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts", // Request accounts permission
      });
      const account = accounts[0]; // Get the first account
      document.getElementById("walletStatus").textContent = `Connected: ${account}`;

      // Display the account information
      document.getElementById("walletInfo").textContent = account;

      // Optionally return the account if needed elsewhere
      return account;
    } catch (error) {
      // Handle the case where the user denies the connection or other errors
      console.error("Error connecting to MetaMask:", error);
      if (error.code === 4001) {
        alert("Connection request was denied. Please allow MetaMask to connect.");
      } else {
        alert("Failed to connect to MetaMask. Please try again.");
      }
      return null;
    }
  } else {
    // MetaMask is not installed
    alert("MetaMask is not installed. Please install it to use this feature.");
    return null;
  }
}



async function ensureContractInitialized() {
  if (!accountManager) {
    await initContract();
  }
}
async function getCurrentAccount() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        return accounts[0];
      } else {
        alert("No account found. Please connect your MetaMask.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching account:", error);
      alert("Error fetching account");
      return null;
    }
  } else {
    alert("Please install MetaMask!");
    return null;
  }
}
//tao moi
async function createAccount() {
  await ensureContractInitialized();
  const account = await connectMetaMask();
  if (!account) {
    alert("You must connect to MetaMask before creating an account.");
    return;
  }

  const name = document.getElementById("name").value;
  const age = parseInt(document.getElementById("age").value, 10);
  const address = document.getElementById("address").value;

  if (name && !isNaN(age) && address) {
    try {
      await accountManager.methods
        .createAccount(name, age, address)
        .send({ from: account });
      console.log("Account created successfully");
      getAllAccounts();
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Error creating account");
    }
  } else {
    alert("Please provide valid name, age, and address.");
  }
}

window.onload = async function () {
  const account = await connectMetaMask();
  if (account) {
    displayConnectedAccount();
    await initContract();
    await getAllAccounts();
  }
};


// Lấy thông tin tài khoản
async function getAccount() {
  await ensureContractInitialized();
  const account = await connectMetaMask();
  const address = document.getElementById("address").value;

  if (account && address) {
    try {
      const result = await accountManager.methods.getAccount(address).call();
      console.log("Account Info:", result);
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  } else {
    alert("Invalid account or address");
  }
}

// Cập nhật tài khoản
async function updateAccount() {
  await ensureContractInitialized();
  const account = await connectMetaMask();
  const name = document.getElementById("name").value;
  const age = parseInt(document.getElementById("age").value, 10);
  const address = document.getElementById("address").value;

  if (account && name && !isNaN(age) && address) {
    try {
      await accountManager.methods
        .updateAccount(name, age, address)
        .send({ from: account });
      console.log("Account updated");
    } catch (error) {
      console.error("Error updating account:", error);
      alert("Error updating account");
    }
  } else {
    alert("Invalid account, name, age, or address");
  }
}

// Xóa tài khoản
async function deleteAccount() {
  await ensureContractInitialized();
  const account = await connectMetaMask();
  const address = document.getElementById("address").value;

  if (account && address) {
    try {
      await accountManager.methods.deleteAccount(address).send({ from: account });
      console.log("Account deleted");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account");
    }
  } else {
    alert("Invalid account or address");
  }
}

  // Lấy tất cả các tài khoản
  // async function getAllAccounts() {
  //   await ensureContractInitialized();

  //   try {
  //     const accounts = await accountManager.methods.getAllAccounts().call();
  //     console.log("All Accounts:", accounts);

  //     // Kiểm tra sự tồn tại của phần tử bảng
  //     const accountsListContainer = document.getElementById(
  //       "accountsListContainer"
  //     );
  //     if (!accountsListContainer) {
  //       console.error("Không tìm thấy phần tử accountsListContainer.");
  //       return;
  //     }

  //     // Xóa dữ liệu cũ trong bảng
  //     accountsListContainer.innerHTML = "";

  //     // Duyệt qua các tài khoản và thêm vào bảng
  //     accounts.forEach((account, index) => {
  //       const row = document.createElement("tr");

  //       // Tạo nội dung cho mỗi dòng
  //       row.innerHTML = `
  //         <td>${account.name}</td>
  //         <td class="text-center">${account.age}</td>
  //         <td class="text-center">${account.walletAddress}</td>
  //         <td><button id="editButton${index}">Edit</button></td>
  //       `;

  //       // Thêm dòng vào bảng
  //       accountsListContainer.appendChild(row);

  //       // Kiểm tra sự tồn tại của nút Edit và gán sự kiện onclick
  //       const editButton = document.getElementById(`editButton${index}`);
  //       if (editButton) {
  //         editButton.onclick = function () {
  //           editAccount(index);
  //         };
  //       } else {
  //         console.error(`Không tìm thấy nút Edit cho tài khoản ${index}`);
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error fetching all accounts:", error);
  //   }
  // }
//}
// async function getAllAccounts() {
//   await ensureContractInitialized();
//   console.log(accountManager.methods.getAllAccounts().call());
//   try {
//     const accounts = await accountManager.methods.getAllAccounts().call();
//     const accountsListContainer = document.getElementById(
//       "accountsListContainer"
//     );
//     if (!accountsListContainer) {
//       console.error("Không tìm thấy phần tử accountsListContainer.");
//       return;
//     }

//     if (accounts.length === 0) {
//       accountsListContainer.innerHTML = "No accounts found.";
//       return;
//     }

//     accountsListContainer.innerHTML = "";

//     const tableBody = document.createElement("tbody");
//     accounts.forEach((account, index) => {
//       const row = document.createElement("tr");
//       account.id = index; // Assign unique ID to each account object
//       row.innerHTML = `
//         <td>${account.name}</td>
//         <td class="text-center">${account.age}</td>
//         <td class="text-center">${account.walletAddress}</td>
//       `;
//       tableBody.appendChild(row);
//     });
//     accountsListContainer.appendChild(tableBody);

//     accountsListContainer.addEventListener("click", function (event) {
//       if (event.target.id.startsWith("editButton")) {
//         const index = parseInt(event.target.id.slice(10), 10);
//         editAccount(index);
//       } else if (event.target.id.startsWith("deleteButton")) {
//         const index = parseInt(event.target.id.slice(12), 10);
//         deleteAccountAtIndex(index);
//       }
//     });
//   } catch (error) {
//     console.error("Error fetching all accounts:", error);
//     // Display user-friendly error message based on error type (optional)
//   }
// }
async function getAllUsers() {
  try {
    if (!contract) {
      throw new Error("Contract not initialized.");
    }

    const users = await contract.methods.getAllUsers().call();
    console.log("Users:", users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}


window.onload = async function () {
  await initContract();
  await getAllUsers(); // Call the function to fetch and display all accounts
  await checkContractConnection();
};
