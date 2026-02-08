// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

// =============================================================
//            FLARE DATA CONNECTOR (FDC) INTERFACES
// =============================================================

// 1. The Proof Structure (Standard Flare Proof)
struct FDCProof {
    bytes32[] merkleProof;
    bytes32 data;
}

// 2. The Request/Response Bodies for "JSON API" Verification
struct JsonApiRequestBody {
    string url;
    string postprocessJq; 
    string abi_signature; 
}

struct JsonApiResponseBody {
    bytes abi_encoded_data; 
}

struct FdcResponse {
    bytes32 attestationType;
    bytes32 sourceId;
    uint64 votingRound;
    uint64 lowestUsedTimestamp;
    JsonApiRequestBody requestBody;
    JsonApiResponseBody responseBody;
}

// 3. The Flare Hub Interface
interface IFdcHub {
    function verify(FDCProof calldata proof) external view returns (bool);
}

// 4. Contract Registry (To find the Hub on any network)
interface IFlareContractRegistry {
    function getContractAddressByName(string calldata _name) external view returns (address);
}

// =============================================================
//                  HELIX MARKET CONTRACT (Production)
// =============================================================
contract HelixMarket {
    
    // --- CONFIGURATION ---
    address public admin; 
    uint256 public constant EXIT_TAX_PERCENT = 5; 
    uint256 public constant SUCCESS_GRANT_PERCENT = 10; 
    uint256 public constant FUNDING_THRESHOLD_TOKENS = 1000; 
    uint256 public constant STABILITY_DURATION = 60; 

    // Coston2 Contract Registry (Fixed Address)
    address constant REGISTRY_ADDR = 0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019;
    
    // Attestation Type ID for "JsonApi" (Keccak hash of the type)
    bytes32 constant JSON_API_TYPE = keccak256("JsonApi");
    bytes32 constant SOURCE_WEB2 = keccak256("WEB2");

    struct Proposal {
        string name;
        address researcher;
        
        // Bonding Curve Supplies
        uint256 yesSupply;
        uint256 noSupply;
        
        // Financials
        uint256 ethInMarket;    
        
        // TWAP / Stability Tracking
        uint256 stabilityStartTime; 
        bool fundingUnlocked;       
        
        // Resolution
        bool isResolved;
        bool outcome;
        
        // --- DESCI FEATURES ---
        string dataHash;     // IPFS Hash
        bool ipNftMinted;    // IP Patent Status
        string auditUrl;     // The URL Flare will check (e.g. "https://api.lab.com/results")
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    mapping(address => mapping(uint256 => mapping(bool => uint256))) public balances;

    event MarketCreated(uint256 indexed id, string name, address researcher);
    event Trade(uint256 indexed id, address indexed trader, bool isYes, bool isBuy, uint256 tokenAmount, uint256 ethCost);
    event FundingUnlocked(uint256 indexed id, uint256 grantAmount);
    event MarketResolved(uint256 indexed id, bool outcome);
    
    // New Events
    event DataUploaded(uint256 indexed id, string dataHash);
    event IPMinted(uint256 indexed id, address owner, string metadata);

    constructor() {
        admin = msg.sender;
    }

    // UPDATED: Now accepts _auditUrl
    function createProposal(string memory _name, address _researcher, string memory _auditUrl) public {
        proposals[proposalCount] = Proposal({
            name: _name,
            researcher: _researcher,
            yesSupply: 0,
            noSupply: 0,
            ethInMarket: 0,
            stabilityStartTime: 0, 
            fundingUnlocked: false,
            isResolved: false,
            outcome: false,
            dataHash: "",     
            ipNftMinted: false,
            auditUrl: _auditUrl
        });
        emit MarketCreated(proposalCount, _name, _researcher);
        proposalCount++;
    }

    // =============================================================
    //        DESCI FUNCTIONS (Data & IP)
    // =============================================================

    function uploadResearchData(uint256 _id, string memory _ipfsHash) public {
        Proposal storage p = proposals[_id];
        require(msg.sender == p.researcher, "Only Researcher can upload data");
        p.dataHash = _ipfsHash;
        emit DataUploaded(_id, _ipfsHash);
    }

    function mintIPNFT(uint256 _id) public {
        Proposal storage p = proposals[_id];
        require(msg.sender == p.researcher, "Only Researcher can mint IP");
        require(!p.ipNftMinted, "IP already minted");
        p.ipNftMinted = true;
        emit IPMinted(_id, msg.sender, string(abi.encodePacked("IP-NFT for Proposal #", _id)));
    }

    // =============================================================
    //        AMM & TRADING LOGIC
    // =============================================================

    function getPrice(uint256 _id, bool _isYes) public view returns (uint256) {
        Proposal storage p = proposals[_id];
        uint256 supply = _isYes ? p.yesSupply : p.noSupply;
        return 0.001 ether + (supply * 0.0001 ether);
    }

    function buy(uint256 _id, bool _isYes) public payable {
        Proposal storage p = proposals[_id];
        require(!p.isResolved, "Market resolved");
        require(msg.value > 0, "Send ETH");

        uint256 currentPrice = getPrice(_id, _isYes);
        uint256 tokensToMint = (msg.value * 1 ether) / currentPrice;

        if (_isYes) p.yesSupply += tokensToMint;
        else p.noSupply += tokensToMint;

        balances[msg.sender][_id][_isYes] += tokensToMint;
        p.ethInMarket += msg.value;

        if (_isYes && p.yesSupply > FUNDING_THRESHOLD_TOKENS) {
            if (p.stabilityStartTime == 0) {
                p.stabilityStartTime = block.timestamp; 
            }
        }

        emit Trade(_id, msg.sender, _isYes, true, tokensToMint, msg.value);
    }

    function sell(uint256 _id, bool _isYes, uint256 _tokenAmount) public {
        Proposal storage p = proposals[_id];
        require(!p.isResolved, "Market resolved");
        
        if (msg.sender == p.researcher) {
            revert("Researcher Locked until Resolution");
        }

        require(balances[msg.sender][_id][_isYes] >= _tokenAmount, "Not enough tokens");

        uint256 currentPrice = getPrice(_id, _isYes);
        uint256 rawEthValue = (_tokenAmount * currentPrice) / 1 ether;
        if(rawEthValue > p.ethInMarket) rawEthValue = p.ethInMarket; 

        uint256 tax = (rawEthValue * EXIT_TAX_PERCENT) / 100;
        uint256 payout = rawEthValue - tax;

        balances[msg.sender][_id][_isYes] -= _tokenAmount;
        if (_isYes) p.yesSupply -= _tokenAmount;
        else p.noSupply -= _tokenAmount;
        p.ethInMarket -= rawEthValue;

        payable(p.researcher).transfer(tax);     
        payable(msg.sender).transfer(payout);    

        emit Trade(_id, msg.sender, _isYes, false, _tokenAmount, payout);
    }

    function checkFundingTrigger(uint256 _id) public {
        Proposal storage p = proposals[_id];
        require(!p.fundingUnlocked, "Already funded");
        require(p.stabilityStartTime != 0, "Threshold not met");

        if (block.timestamp >= p.stabilityStartTime + STABILITY_DURATION) {
            p.fundingUnlocked = true;
            uint256 grantAmount = (p.ethInMarket * SUCCESS_GRANT_PERCENT) / 100;
            p.ethInMarket -= grantAmount;
            payable(p.researcher).transfer(grantAmount);
            emit FundingUnlocked(_id, grantAmount);
        }
    }

    // =============================================================
    //        FLARE FDC & SETTLEMENT
    // =============================================================

    /**
     * @notice SETTLE WITH REAL FDC PROOF
     * @dev Checks Merkle Proof and matches URL
     */
    function settleWithFlare(uint256 _id, FDCProof calldata _proof) public {
        // 1. Get FdcHub Address dynamically
        address fdcHubAddr = IFlareContractRegistry(REGISTRY_ADDR).getContractAddressByName("FdcHub");
        require(fdcHubAddr != address(0), "FdcHub not found");

        // 2. Verify the Merkle Proof
        bool isValid = IFdcHub(fdcHubAddr).verify(_proof);
        require(isValid, "Invalid Flare Proof");

        // 3. Decode Response
        FdcResponse memory response = abi.decode(abi.encode(_proof.data), (FdcResponse));

        Proposal storage p = proposals[_id];
        require(!p.isResolved, "Market already resolved");

        // 4. Verify URL Match (Anti-Fraud)
        // We compare the URL in the proof to the URL in the proposal
        require(keccak256(bytes(response.requestBody.url)) == keccak256(bytes(p.auditUrl)), "URL mismatch");

        // 5. Read Result
        bool trialSuccess = abi.decode(response.responseBody.abi_encoded_data, (bool));

        p.isResolved = true;
        p.outcome = trialSuccess;
        emit MarketResolved(_id, trialSuccess);
    }

    // Keep this for Demo Speed!
    function simulateOracleDecision(uint256 _id, bool _didSucceed) public {
        Proposal storage p = proposals[_id];
        p.isResolved = true;
        p.outcome = _didSucceed;
        emit MarketResolved(_id, _didSucceed);
    }

    function claimWinnings(uint256 _id) public {
        Proposal storage p = proposals[_id];
        require(p.isResolved, "Market not resolved");

        uint256 userBal;
        uint256 totalWinnerSupply;

        if (p.outcome == true) {
             userBal = balances[msg.sender][_id][true];
             totalWinnerSupply = p.yesSupply;
             balances[msg.sender][_id][true] = 0;
        } else {
             userBal = balances[msg.sender][_id][false];
             totalWinnerSupply = p.noSupply;
             balances[msg.sender][_id][false] = 0;
        }

        require(userBal > 0, "No winning tokens");
        uint256 payout = (p.ethInMarket * userBal) / totalWinnerSupply;
        payable(msg.sender).transfer(payout);
    }

    receive() external payable {}
}