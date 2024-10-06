import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";
import { useRouter } from "next/router";
import { JWT } from "./JWT";

//INTERNAL IMPORT
import {
  VotingAddress,
  VotingAddressABI,
  handleNetworkSwitch,
  CONTRACT_OWNER,
} from "./constants";

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState("");
  const [loader, setLoader] = useState(false);
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateArray, setCandidateArray] = useState();

  const [error, setError] = useState("");
  const higestVote = [];

  const pushVoter = [];
  const [voterArray, setVoterArray] = useState();
  const [voterLength, setVoterLength] = useState("");
  const [voterAddress, setVoterAddress] = useState([]);

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setError("Please Install MetaMask");
    const network = await handleNetworkSwitch();
    const account = await window.ethereum.request({ method: "eth_accounts" });

    if (account.length) {
      setCurrentAccount(account[0]);
      return account[0];
    } else {
      setError("Please Install MetaMask & Connect, Reload");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    const network = await handleNetworkSwitch();
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setCurrentAccount(accounts[0]);
    setError("");
  };

  const uploadToIPFS = async (file) => {
    if (file) {
      try {
        const address = await checkIfWalletIsConnected();
        if (address) {
          setLoader(true);
          const formData = new FormData();
          formData.append("file", file);

          const response = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
            data: formData,
            headers: {
              "Authorization": `Bearer ${JWT}`,
              "Content-Type": "multipart/form-data",
            },
          });
          const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
          setLoader(false);
          return ImgHash;
        } else {
          setLoader(false);
          console.log("Kindly connect to your wallet");
        }
      } catch (error) {
        console.log("Unable to upload image to Pinata");
        setLoader(false);
      }
    }
  };

  const uploadToIPFSCandidate = async (file) => {
    if (file) {
      try {
        setLoader(true);
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            "Authorization": `Bearer ${JWT}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response, "response");
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        setLoader(false);
        return ImgHash;
      } catch (error) {
        setLoader(false);
        console.log("Unable to upload image to Pinata");
      }
    }
  };

  const createVoter = async (formInput, fileUrl) => {
    try {
      const { name, address, position } = formInput;
      const connectAddress = await checkIfWalletIsConnected();
      if (connectAddress == CONTRACT_OWNER)
        return setError("Only Ower Of Contract Can Create Voter");

      if (!name || !address || !position)
        return setError("Input Data is missing");
      setLoader(true);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const data = JSON.stringify({ name, address, position, image: fileUrl });

      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          "Authorization": `Bearer ${JWT}`,
          "Content-Type": "application/json",
        },
      });

      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

      const voter = await contract.voterRight(address, name, url, fileUrl, {
        gasLimit: ethers.utils.hexlify(8000000),
      });
      await voter.wait();
      setLoader(false);
      window.location.href = "/voterList";
    } catch (error) {
      setLoader(false);
      setError("error: Check your API key and data");
    }
  };

  const getAllVoterData = async () => {
    try {
      const address = await checkIfWalletIsConnected();
      if (address) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);
        //VOTR LIST
        const voterListData = await contract.getVoterList();
        setVoterAddress(voterListData);

        const items = await Promise.all(
          voterListData.map(async (el) => {
            const singleVoterData = await contract.getVoterData(el);
            // console.log(singleVoterData);
            return {
              voterID: singleVoterData[0]?.toNumber(),
              name: singleVoterData[1],
              image: singleVoterData[4],
              voterVote: singleVoterData[5]?.toNumber(),
              ipfs: singleVoterData[2],
              address: singleVoterData[3],
              votingStatus: singleVoterData[6],
            };
          })
        );
        setVoterArray(items);

        //VOTER LENGHT
        const voterList = await contract.getVoterLength();
        setVoterLength(voterList.toNumber());
      } else {
        setError("Connect to wallet");
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  const giveVote = async (id) => {
    try {
      const connectAddress = await checkIfWalletIsConnected();
      if (connectAddress == CONTRACT_OWNER)
        return setError("Owner Can not give vote");
      setLoader(true);
      const voterAddress = id.address;
      const voterId = id.id;
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const voteredList = await contract.vote(voterAddress, voterId, {
        gasLimit: ethers.utils.hexlify(8000000),
      });

      await voteredList.wait();
      setLoader(false);
      window.location.reload();
    } catch (error) {
      setError("Sorry!, You have already voted, Reload Browser");
      setLoader(false);
    }
  };

  const setCandidate = async (candidateForm, fileUrl, router) => {
    const { name, address, age } = candidateForm;
    const connectAddress = await checkIfWalletIsConnected();
    if (connectAddress == CONTRACT_OWNER)
      return setError("Only Ower Of Contract Can Create Candidate");
    try {
      if (!name || !address || !age) return console.log("Data Missing");
      setLoader(true);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const data = JSON.stringify({
        name,
        address,
        image: fileUrl,
        age,
      });

      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          "Authorization": `Bearer ${JWT}`,
          "Content-Type": "application/json",
        },
      });

      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

      const candidate = await contract.setCandidate(
        address,
        age,
        name,
        fileUrl,
        url,
        {
          gasLimit: ethers.utils.hexlify(8000000),
        }
      );
      await candidate.wait();
      setLoader(false);
      window.location.href = "/";
    } catch (error) {
      setLoader(false);
      setError("Something went wrong, check your API Key");
    }
  };

  const getNewCandidate = async () => {
    const address = await checkIfWalletIsConnected();
    if (address) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      //
      const allCandidate = await contract.getCandidate();

      const items = await Promise.all(
        allCandidate.map(async (el) => {
          const singleCandidateData = await contract.getCandidateData(el);

          return {
            age: singleCandidateData[0],
            name: singleCandidateData[1],
            candidateID: singleCandidateData[2].toNumber(),
            image: singleCandidateData[3],
            totalVote: singleCandidateData[4].toNumber(),
            ipfs: singleCandidateData[5],
            address: singleCandidateData[6],
          };
        })
      );
      console.log(items,'items')

      setCandidateArray(items);

      const allCandidateLength = await contract.getCandidateLength();
      setCandidateLength(allCandidateLength.toNumber());
    } else {
      setError("Connect to wallet");
    }
  };

  return (
    <VotingContext.Provider
      value={{
        currentAccount,
        connectWallet,
        uploadToIPFS,
        createVoter,
        setCandidate,
        getNewCandidate,
        giveVote,
        pushCandidate,
        candidateArray,
        uploadToIPFSCandidate,
        getAllVoterData,
        voterArray,
        giveVote,
        checkIfWalletIsConnected,
        error,
        candidateLength,
        voterLength,
        loader,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
