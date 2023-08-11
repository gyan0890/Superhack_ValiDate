// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/interfaces/IERC721.sol";

/** 
 * @title ValiDate
 * @dev Implements creating, updating, deleting and retrieving user profiles on
 * ValiDate
 */
contract Validate {

    struct User {
        bool isActive;
        address safeId; //Safe ID for Account Abstraction
        string gender;  // gender of the user
        bool isGenderVerified; //Was a proof created for the gender
        uint age; // age of the user
        bool isAgeVerified;   //Was a proof created for the age
        string interests;
        uint timeOfCreation;
        bool isMember;
    }

    address owner;
    address constant DUMMY_ADDRESS = 0x8090E825C6FEED75A2aB5bbBF098f01083B98090;
    address nftMembershipAddress;
    mapping(address => address[]) public onGoingChats;
    mapping(address => User) public userMapping;
    address[] public users;

    /** 
     * @dev Assign an owner to the contract.
     * @param _owner: Owner of the contract
     */
    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Sender is not owner");
        _;
    }

    function setMembershipNftAddress(address nftAddress) onlyOwner public {
        nftMembershipAddress = nftAddress;
    } 

    // function checkUserOwnsNft(address _user) view internal 
    // returns(bool){
    //     return IERC721(nftMembershipAddress).balanceOf(_user) > 0;
    // }

    /** 
     * @dev Create a user profile on chain.
     * @param _safeId: Safe ID, _gender: Gender, _isGenderVerified: If user has verified this parameter,
     * _age: Age, _isAgeVerified: Whether age was verified or no, _interests: User interests.
     */
    function createProfile(address _safeId, string memory _gender, 
        bool _isGenderVerified, uint _age, bool _isAgeVerified,  string memory _interests) public 
        returns(uint) {

        address userAddress = msg.sender;
        require(
            userMapping[userAddress].timeOfCreation == 0, 
            "User already created a profile"
        );

        User memory newUser = User(true, _safeId, _gender, _isGenderVerified, 
            _age, _isAgeVerified, _interests, block.timestamp, false);

        userMapping[userAddress] = newUser;
        users.push(userAddress);
        
        return userMapping[userAddress].timeOfCreation;

    }

    /** 
     * @dev Update the user profile on chain.
     * @param _safeId: Safe ID, _gender: Gender, _isGenderVerified: If user has verified this parameter,
     * _age: Age, _isAgeVerified: Whether age was verified or no, _interests: User interests.
     */
    function updateProfile(address _safeId, string memory _gender, 
        bool _isGenderVerified, uint _age, bool _isAgeVerified,  string memory _interests) public {
        
        address userAddress = msg.sender;
        
        require(
            userMapping[userAddress].isActive, 
            "User does not have an active profile"
        );

        userMapping[userAddress].safeId = _safeId;
        userMapping[userAddress].gender = _gender;
        userMapping[userAddress].isGenderVerified = _isGenderVerified;
        userMapping[userAddress].age = _age;
        userMapping[userAddress].isAgeVerified = _isAgeVerified;
        userMapping[userAddress].interests = _interests;

    }

    /** 
     * @dev Update the membership status based on the user's ownership of the NFT.
     * @param _userAddress: User Address.
     */
    function updateMembership(address _userAddress) public {
        //Based on the updated NFT check, we can update the membership status
        if (IERC721(nftMembershipAddress).balanceOf(_userAddress) > 0) {
            userMapping[_userAddress].isMember = true;
        }
        else {
            userMapping[_userAddress].isMember = false;
        }

    }

    /** 
     * @dev Deactivate the profile of a user
     * @param _userAddress: User Address.
     */
    function deActivateProfile(address _userAddress) public {

        //Deactivating a user's profile

        userMapping[_userAddress].isActive = false;
        userMapping[_userAddress].safeId = DUMMY_ADDRESS;
        userMapping[_userAddress].gender = "NA";
        userMapping[_userAddress].isGenderVerified = false;
        userMapping[_userAddress].age = 0;
        userMapping[_userAddress].isAgeVerified = false;
        userMapping[_userAddress].interests = "NA";

    }

    function userChatMapping(address _user1, address _user2) public {
        onGoingChats[_user1].push(_user2);
    }

    /**
     * @dev Send a user address and get all the data belonging to a user
     * @param _userAddress : Address of the user
     */
    function getProfilePerUser(address _userAddress) public view
    returns(User memory){
        return userMapping[_userAddress];
    }

    /** 
     * @dev Returns all users addresses.
     * @return address of all users on the platform 
    */ 
    function getAllProfiles() public view
            returns (address[] memory)
    {
        return users;
    }

    /** 
     * @dev Returns all user's chats.
     * @return address of all users who are connected to current user on chat 
    */

    function getUserChats(address _userAddress) public view
        returns(address[] memory) {
            return onGoingChats[_userAddress];
    }


}