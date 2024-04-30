// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PhoneRegistry {
    struct Phone {
        string username;
        string password;
        bool lost;
    }
   struct location{
        string latitude;
        string longitude;
    }
    mapping(uint256 => Phone) public phones;
    uint256[] registered_imei;
    mapping(uint256 => bool) public isRegistered;
    mapping(uint256 => location) public getlocation;

    event PhoneRegistered(uint256 imei, string username, string password);
    event PhoneLost(uint256 imei);
    event PhoneFound(uint256 imei);

    constructor() {
        // Add initial data in the constructor
        registerPhone(123456789012345, "Alice", "alice123");
        registerPhone(987654321098765, "Bob", "bob456");
    }

    function registerPhone(uint256 imei, string memory username, string memory password) public {
        require(!isRegistered[imei], "IMEI already registered");
        phones[imei] = Phone(username, password, false);
        registered_imei.push(imei);
        isRegistered[imei] = true;
        emit PhoneRegistered(imei, username, password);
    }

    function reportLost(uint256 imei) public {
        require(isRegistered[imei], "IMEI not registered");
        require(!phones[imei].lost, "Phone already reported lost");
        phones[imei].lost = true;
        emit PhoneLost(imei);
    }

    function reportFound(uint256 imei) public {
        require(isRegistered[imei], "IMEI not registered");
        require(phones[imei].lost, "Phone is not reported lost");
        phones[imei].lost = false;
        emit PhoneFound(imei);
    }

    function changePassword(uint256 imei, string memory newPassword) public {
        require(isRegistered[imei], "IMEI not registered");
        phones[imei].password = newPassword;
    }
    
   function login(string memory username, string memory password) public view returns (uint256, bool) {
    uint256 temp_imei=0; bool temp_state = false;
        for(uint256 i=0;i<registered_imei.length; i++){
            temp_imei = registered_imei[i];
            temp_state = phones[temp_imei].lost;
            if(keccak256(abi.encodePacked(phones[temp_imei].username)) == keccak256(abi.encodePacked(username)) && keccak256(abi.encodePacked(phones[temp_imei].password)) == keccak256(abi.encodePacked(password))){
                return (temp_imei,temp_state);
            }
        }
        return (temp_imei,false);
    }

    function getAllRegisteredPhones() public view returns (uint256[] memory, bool[] memory, string[] memory, string[] memory) {
        require(registered_imei.length > 0, "No IMEI's registered yet");
        bool[] memory loststatus = new bool[](registered_imei.length);
        string[] memory latitudes = new string[](registered_imei.length);
        string[] memory longitudes = new string[](registered_imei.length);

        for(uint256 i=0;i<registered_imei.length; i++){
            loststatus[i] = phones[registered_imei[i]].lost;
            latitudes[i] = getlocation[registered_imei[i]].latitude;
            longitudes[i] = getlocation[registered_imei[i]].longitude;
        }

        return (registered_imei,loststatus,latitudes, longitudes);
    }
     function updateLocation(uint256 imei, string memory latitude, string memory longitude) public {
        getlocation[imei].latitude = latitude;
        getlocation[imei].longitude = longitude;
    }

    function getLocation(uint256 imei) public view returns (string memory, string memory) {
        require(isRegistered[imei], "IMEI not registered");
        return (getlocation[imei].latitude, getlocation[imei].longitude);
    }
}
