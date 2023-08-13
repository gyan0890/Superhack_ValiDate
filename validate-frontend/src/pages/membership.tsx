import React from "react";
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
// You can get the signer from a wallet using web3modal/rainbowkit etc.
// See: https://docs.ethers.io/v5/api/signer/ and https://www.apollographql.com/docs/react/get-started/

import { useAccountAbstraction } from "@/components/store/accountAbstractionContext";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import axios from "axios";
import Web3 from "web3";

import { CheckIcon } from "@heroicons/react/20/solid";

const tiers = [
  {
    name: "Personal",
    id: "tier-personal",
    href: "#",
    priceMonthly: "$39",
    description:
      "The perfect plan if you're just getting started with our product.",
    features: [
      "25 products",
      "Up to 10,000 subscribers",
      "Audience segmentation",
      "Advanced analytics",
      "Email support",
      "Marketing automations",
    ],
    featured: true,
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Membership() {
  const { web3Provider, ownerAddress }: any = useAccountAbstraction();
  const networkInfo = {
    network: ZDKNetwork.Optimism,
    chain: ZDKChain.OptimismGoerli,
  };

  const API_ENDPOINT = "https://api.zora.co/graphql";
  const args = {
    endPoint: API_ENDPOINT,
    networks: [networkInfo],
  };

  const zdk = new ZDK(args); // All arguments are optional

  const handlezora = async () => {
    const DAtaargs: any = {
      where: {
        collectionAddresses: ["0xdaecee79d3d470594ec1c9d25c9759996707fe97"],
        ownerAddresses: [ownerAddress],
      },
      // sort: { // Optional, sorts the response by ascending tokenIds
      //   direct: "ASC",
      //   sortKey: "TokenId"
      // },
      pagination: { limit: 3 }, // Optional, limits the response size to 3 NFTs
      includeFullDetails: false, // Optional, provides more data on the NFTs such as events
      includeSalesHistory: false, // Optional, provides sales data on the NFTs
    };

    const response = await zdk.tokens(DAtaargs);
    console.log("response", response);

    const request = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query JacobsNFTs {
                tokens(networks: [{network: OPTIMISM, chain: OPTIMISM_GOERLI}], 
                      pagination: {limit: 3}, 
                      where: {ownerAddresses: "0xbCa680b7957D53A4f3AB27dfd5278C9e20f3Ee58"}) {
                  nodes {
                    token {
                      collectionAddress
                      tokenId
                      name
                      owner
                      image {
                        url
                      }
                      metadata
                    }
                  }
                }
              }`,
      }),
    });
    const json = await request.json();
    console.log("zdk", json);
  };

  return (
    <div className="mx-auto mt-20 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-32 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
      {tiers.map((tier, tierIdx) => (
        <div
          key={tier.id}
          className={classNames(
            tier.featured
              ? "relative bg-white shadow-2xl"
              : "bg-white/60 sm:mx-8 lg:mx-0",
            tier.featured
              ? ""
              : tierIdx === 0
              ? "rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl"
              : "sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none",
            "rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10"
          )}
        >
          <img src="memebership.png"/>
          <a
            href="https://testnet.zora.co/collect/ogor:0xdaecee79d3d470594ec1c9d25c9759996707fe97"
            target="_blank"
            aria-describedby={tier.id}
            className={classNames(
              tier.featured
                ? "bg-indigo-600 text-white shadow hover:bg-indigo-500"
                : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
              "mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:mt-10"
            )}
          >
            Buy ValiDate Membership
          </a>
        </div>
      ))}
    </div>
  );
}
