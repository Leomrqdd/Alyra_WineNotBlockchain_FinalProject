// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/// @author Léo MARQUAND, Alyra, Promo SATOSHI
/// @title The Alyra Final Project which is named the WineNotBlockhain Marketplace
 
contract WineNotBlockchain is ERC721URIStorage, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenId; 
 
      struct WineBottle{
        address producer;
        string producerName;
        string designationOfOrigin;
        uint vintage;
        uint serialNumber;
      }

    struct SaleInfo {
      uint256 price;
      bool onSale;
}

    struct Sale {
      address seller;
      address buyer;
      uint256 price;
      uint256 timestamp;
  }

  enum bottleStatus {minted, askedForShipping, shipped, received, contested, lost } //rajouter lost et gérer la partie contested ? 

    WineBottle[] idToWineBottle;
    SaleInfo[] idToSaleInfo;

    mapping(address => bool) private producerWhitelist;
    mapping(uint256 => Sale[]) private idToSales;
    mapping(uint256 => uint256) private idToCollateral;
    mapping(uint256 => uint256) private shipmentConfirmedTimestamps;
    mapping(uint256 => bottleStatus) private idToBottleStatus;


    event WhitelistedProducer(address _address, bool whitelist);
    event BottleCreation(address _owner, uint id);
    event BottleForSale(uint id, uint price);
    event BottleTransfer(address from, address to, uint id, uint price);
    
    
    
    constructor() ERC721 ("WineNotBlockchain", "WBB") {
      idToWineBottle.push(WineBottle(msg.sender,'GENESIS', 'GENESIS', 0, 0));
      idToSaleInfo.push(SaleInfo(0,false));
    }


// ::::::::::::: GETTERS ::::::::::::: //
 
    /// Return true if the Owner called the function
    /// @dev return a boolean to say if this is the Owner that called the function
  function isCallerOwner() public view returns (bool) {
    return (msg.sender == owner());
  }

    /// Return the number of NFT created
    /// @dev return the current value of the tokenId
  function getTotalSupply() public view onlyOwner returns (uint256) {
    return _tokenId.current();
  }

    /// Return the number of NFT owned by the sender
    /// @dev return the balance of the sender
  function getBottlesBalance() public view returns (uint) {
    return balanceOf(msg.sender);
  }

    /// Return info about a Bottle
    /// @param _id the Id of a existing Bottle
    /// @dev return the Bottle struct information 
  function getBottleInfo(uint256 _id) public view returns (WineBottle memory) {
    require (_id<=_tokenId.current(), "this id does not exist");
    return (idToWineBottle[_id]);
 }

     /// Return the Status of the Bottle
    /// @param _id the Id of a existing Bottle
    /// @dev return the enum value associated to the Id
  function getBottleStatus(uint256 _id) public view returns (bottleStatus) {
    require (_id<=_tokenId.current(), "this id does not exist");
    return (idToBottleStatus[_id]);
 }

    /// Return info about a Bottle Image
    /// @param _id the Id of a existing Bottle
    /// @dev return the token URI uploaded on IPFS
   function getBottleURI(uint256 _id) public view returns (string memory) {
    require (_id<=_tokenId.current(), "this id does not exist");
    return tokenURI(_id);
    }

    /// Return the Owner of a Bottle
    /// @param _id the Id of a existing Bottle
    /// @dev return the address of the Owner of a Bottle
  function getBottleOwner(uint256 _id) public view returns (address) {
    return ownerOf(_id);
  }

    /// Return the current sale status of a Bottle
    /// @param _id the Id of a existing Bottle
    /// @dev return the price and the bool OnSale on a struct
  function getBottleSaleInfo(uint256 _id) public view returns (SaleInfo memory) {
    require (_id<=_tokenId.current(), "this id does not exist");
    return (idToSaleInfo[_id]);
 }

    /// Return all the Sales of a Bottle
    /// @param _id the Id of a existing Bottle
    /// @dev return an array of a struct Sales
  function getSalesHistory(uint256 _id) public view returns (Sale[] memory) {
    require(_id <= _tokenId.current(), "this id does not exist");
    return idToSales[_id];
}


    /// Return all the Sales of a Bottle
    /// @param _id the Id of a existing Bottle
    /// @dev return an array of a struct Sales
  function getCollateralInfo(uint256 _id) public view returns (uint) {
    require(_id <= _tokenId.current(), "this id does not exist");
    return(idToCollateral[_id]);
}



// ::::::::::::: REGISTRATION OF PRODUCERS ::::::::::::: // 

    /// Whistelist a producer
    /// @param _producer the address of a producer
    /// @dev add the producer to a whitelist thanks to a bool value
    function whitelistProducer(address _producer) external onlyOwner {
      producerWhitelist[_producer] = true;
      emit WhitelistedProducer(_producer,true);
}

    /// Delete a producer from the whitelist
    /// @param _producer the address of a producer
    /// @dev delete the producer to a whitelist thanks to a bool value
    function revokeProducer(address _producer) external onlyOwner {
      producerWhitelist[_producer] = false;
      emit WhitelistedProducer(_producer,false);

}

    /// Check if a producer is whitelisted
    /// @param _producer the address of a producer
    /// @dev check the producer address thanks to a bool value
    function isWhitelistedProducer(address _producer) external view returns (bool) {
        return producerWhitelist[_producer];
    }



// ::::::::::::: MINT OF BOTTLES ::::::::::::: // 

 

  /// A producer can mint a Bottle
  /// @param _producerName, _designationOfOrigin,_vintage,_serialNumber,_tokenURI All the info about a Bottle
  /// @dev a producer can mint a ERC721 of one of his Bottles
  function mintWineBottle (
      string calldata _producerName,
      string calldata _designationOfOrigin,
      uint _vintage,
      uint _serialNumber,
      string calldata _tokenURI
    )
      external returns (uint)
    {
      require(producerWhitelist[msg.sender], "You are not a whitelisted producer");

      address _producer = msg.sender;
      _tokenId.increment();
      uint newItemId = _tokenId.current();
      idToWineBottle.push(WineBottle(_producer,_producerName, _designationOfOrigin, _vintage, _serialNumber));
      idToSaleInfo.push(SaleInfo(0,false));
      _safeMint(_producer, newItemId);
      _setTokenURI(newItemId, _tokenURI);
      idToBottleStatus[newItemId] = bottleStatus.minted;
      emit BottleCreation(msg.sender,newItemId);
      return newItemId;
    }



// ::::::::::::: BUY AND SELL BOTTLES ::::::::::::: // 


  /// Record a Sale of a Bottle 
  /// @param _id,_seller,_buyer,_price all the Info about a sale
  /// @dev push a Sale Struct in a array
  function recordSale(uint256 _id, address _seller, address _buyer, uint256 _price) internal {
    Sale memory sale = Sale(_seller, _buyer, _price, block.timestamp);
    idToSales[_id].push(sale);
}

  /// Sell a Bottle
  /// @param _id Id of the Bottle, _priceInEther Price in Ether
  /// @dev The owner of the ERC721 can sell it on the marketplace
  function sellBottle(uint256 _id, uint256 _priceInEther) public {
    require(ownerOf(_id) == msg.sender, "You are not the owner of this WineBottle");
    require(_priceInEther > 0, "Price must be greater than zero");
    require(idToBottleStatus[_id] == bottleStatus.minted, "This bottle has been asked for shipping or is in a different state");


    uint256 _priceInWei = _priceInEther * 1 ether; 
    idToSaleInfo[_id] = SaleInfo(_priceInWei, true);

    emit BottleForSale(_id, _priceInWei);
}

  /// Buy a Bottle that is for sales
  /// @param _id the Id of the Bottle
  /// @dev a Buyer can buy a ERC721 that is for sales
  function buyBottle(uint256 _id) public payable {
    require(idToSaleInfo[_id].onSale, "This bottle is not for sale");
    require(msg.value == idToSaleInfo[_id].price, "The sent amount does not match the bottle price in Wei");

    address _seller = ownerOf(_id);
    address _buyer = msg.sender;
    uint256 _price = idToSaleInfo[_id].price;

    _transfer(_seller, _buyer, _id);
    recordSale(_id,_seller,_buyer,_price);

    idToSaleInfo[_id].onSale = false;    
    idToSaleInfo[_id].price = 0;

    (bool success, ) = _seller.call{value:msg.value}("");
    require(success);

    emit BottleTransfer(_seller,_buyer,_id, _price);
}



// ::::::::::::: SHIPMENT ::::::::::::: // 

  /// The owner of a WineBottle would like to drink or receive his bottle and he indicates the producer to ship his bottle
  /// We suppose that there is a way to communicate with the producer through a dedicated message app (to send him his shipping address for example)
  /// @param _id the Id of the Bottle
  /// @dev change the status of the Bottle to follow the shipment and indicates the timestamp of the transaction
  function indicateShipmentToProducer(uint256 _id) external {
      require(ownerOf(_id) == msg.sender, "You are not the owner of this WineBottle");
      require(idToBottleStatus[_id] == bottleStatus.minted, "This bottle has already been asked for shipping or is in a different state");

    
      idToBottleStatus[_id] = bottleStatus.askedForShipping;
      shipmentConfirmedTimestamps[_id] = block.timestamp;

  }


  /// The producer has to add a Collateral when the owner of one of his bottles would like to receive the bottle. It is a safety measure to protect the buyer.
  /// @param _id the Id of the Bottle
  /// @dev change the status of the Bottle to follow the shipment
  function addCollateral(uint256 _id) external payable {
    require(idToWineBottle[_id].producer == msg.sender, "You are not the producer of this WineBottle");
    require(idToBottleStatus[_id] == bottleStatus.askedForShipping, "This bottle has already been shipped or is in a different state");
    require(idToCollateral[_id] == 0, "Collateral already added");

    //the collateral has to be equal to minimum 1/3 of the initial price of the bottle 
    uint  amount = idToSales[_id][0].price;
    uint minCollateral = amount / 3 ;

    require(msg.value >= minCollateral, "Collateral amount not sufficient");

    idToCollateral[_id] = msg.value;
    idToBottleStatus[_id] = bottleStatus.shipped;

}


  /// The owner of a WineBottle confirms that he has received the Bottle at his home. It will release the collateral
  /// @param _id the Id of the Bottle
  /// @dev change the status of the Bottle to follow the shipment 
  function confirmDelivery(uint256 _id) external {
    require(ownerOf(_id) == msg.sender, "You are not the owner of this WineBottle");
    require(idToCollateral[_id] > 0, "Collateral has not been added by the producer");
    require(idToBottleStatus[_id] == bottleStatus.shipped || idToBottleStatus[_id] == bottleStatus.contested, "The shipment has already been confirmed or is in a different state");

    address payable producer = payable(idToWineBottle[_id].producer);
    uint256 collateral = idToCollateral[_id];
    idToCollateral[_id] = 0;
    (bool success, ) = producer.call{value: collateral}("");
    require(success, "Failed to send back the collateral to producer");

    idToBottleStatus[_id] = bottleStatus.received;


}


  /// The owner of a WineBottle can contest the Shipment if he did not receive the Bottle. WineNotBlockchain will handle the issue with the producer.
  /// Once the issue is solved, the owner can confirm the delivery.
  /// @param _id the Id of the Bottle
  /// @dev change the status of the Bottle to follow the shipment 
  function contestShipment(uint256 _id) public {
    require(ownerOf(_id) == msg.sender, "You are not the owner of this WineBottle");
    require(idToBottleStatus[_id] != bottleStatus.contested, "This bottle has already been contested");
    require(idToBottleStatus[_id] != bottleStatus.received, "This bottle has already been received");

    idToBottleStatus[_id] = bottleStatus.contested;

}


}