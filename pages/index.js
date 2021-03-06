import { useState, useEffect } from 'react';
import PrimaryButton from './../components/primary-button';
import abi from '../utils/Keyboards.json';
import { ethers } from 'ethers';
import Keyboard from './../components/keyboard';
import { UserCircleIcon } from "@heroicons/react/solid"
import addressesEqual from './../utils/addressesEqual';
import TipButton from './../components/tip-button';


export default function Home() {
  const [ethereum, setEthereum] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [keyboards, setKeyboards] = useState([]);
  const [keyboardsLoading, setKeyboardsLoading] = useState(false);

  const contractAddress = '0xE4bFbC65fcE483de9825b9de9bDa332c7E51a119';
  const contractABI = abi.abi;

  async function handleAccounts(accounts) {
    if (accounts.length > 0) {
      setConnectedAccount(accounts[0]);
      console.log('Connected account: ', accounts[0]);
    } else {
      console.log('No connected account');
    }
  }

  async function getConnectedAccounts() {
    if (window.ethereum) {
      setEthereum(window.ethereum);
    }

    if (ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      handleAccounts(accounts);
    }
  }

  useEffect(() => {
    getConnectedAccounts();
  }, []);

  async function connectAccount() {
    if (!ethereum) {
      alert('Metamask is not installed');
      return;
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    handleAccounts(accounts);
  }

  const getKeyboards = async () => {
    if (ethereum && connectedAccount) {
      setKeyboardsLoading(true);
      try {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const keyboardsContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const keyboards = await keyboardsContract.getKeyboards();
        console.log('Retrieved keyboards...', keyboards);

        setKeyboards(keyboards);
      } finally {
        setKeyboardsLoading(false);
      }
    }
  };

  useEffect(() => getKeyboards(), [connectedAccount]);

  if (!ethereum) {
    return <p>Please install metamask to connect to this site.</p>;
  }

  if (!connectedAccount) {
    return (
      <PrimaryButton onClick={connectAccount}>
        Connect Metamask Wallet
      </PrimaryButton>
    );
  }

  if (keyboards.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        <PrimaryButton type="link" href="/create">
          Create a Keyboard!
        </PrimaryButton>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
          {keyboards.map(
              ([kind, isPBT, filter, owner], i) => (
                <div key={i} className="relative">
                  <Keyboard kind={kind} isPBT={isPBT} filter={filter} />
                  <span className="absolute top-1 right-6">
                    {addressesEqual(owner, connectedAccount) ?
                      <UserCircleIcon className="h-5 w-5 text-indigo-100" /> :
                      <TipButton ethereum={ethereum} index={i} />
                    }
                  </span>
                </div>
              )
            )}
        </div>
      </div>
    );
  }

  if (keyboardsLoading) {
    return (
      <div className="flex flex-col gap-4">
        <PrimaryButton type="link" href="/create">
          Create a Keyboard!
        </PrimaryButton>
        <p>Loading Keyboards...</p>
      </div>
    );
  }

  // No keyboards yet
  return (
    <div className="flex flex-col gap-4">
      <PrimaryButton type="link" href="/create">
        Create a Keyboard!
      </PrimaryButton>
      <p>No keyboards yet!</p>
    </div>
  );
}
