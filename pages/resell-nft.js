/* pages/resell-nft.js */
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import Web3Modal from "web3modal";
import Image from "next/image";

import { nftaddress, nftMarketaddress } from "../config";

import KBMarket from "../artifacts/contracts/KBMarket.sol/KBMarket.json";

export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({ price: "", image: "" });
  const router = useRouter();
  const { id, tokenURI } = router.query;
  const { image, price } = formInput;

  useEffect(() => {
    if (router.isReady) fetchNFT();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchNFT() {
    if (!tokenURI) return;
    const tokenUri = await tokenContract.tokenURI(i.tokenId);
    const meta = await axios.get(tokenUri);
    const dataKey = Object.keys(meta.data);
    const dataObject = JSON.parse(dataKey);
    updateFormInput((state) => ({ ...state, image: dataObject.image }));
  }

  async function listNFTForSale() {
    if (!price) return;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const priceFormatted = ethers.utils.parseUnits(formInput.price, "ether");
    let contract = new ethers.Contract(nftMarketaddress, KBMarket.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    let transaction = await contract.resellToken(
      nftaddress,
      id,
      priceFormatted,
      {
        value: listingPrice,
      }
    );
    await transaction.wait();

    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        {image && (
          <Image
            className="rounded mt-4"
            width="350"
            src={image}
            alt="NFT Image"
          />
        )}
        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          List NFT
        </button>
      </div>
    </div>
  );
}
