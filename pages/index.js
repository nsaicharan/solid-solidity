import { useState, useEffect } from 'react';
import PrimaryButton from './../components/primary-button';
import abi from '../utils/Keyboards.json';
import { ethers } from 'ethers';

export default function Home() {
  const [ethereum, setEthereum] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [keyboards, setKeyboards] = useState([]);
  const [newKeyboard, setNewKeyboard] = useState(null);

  const contactAddress = '0x350EEfc017cf12F76Ac2e8952fA17df63800c340';
  const contactABI = abi.abi;

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

  async function getKeyboards() {
    if (ethereum && connectedAccount) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contactAddress, contactABI, signer);

      const keyboards = await contract.getKeyboards();
      console.log('Retrieved keyboards...', keyboards);
      setKeyboards(keyboards);
    }
  }
  useEffect(() => getKeyboards(), [connectedAccount]);

  async function submitCreate(e) {
    e.preventDefault();

    if (!ethereum || !connectedAccount) {
      alert('Metamask is not installed');
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contactAddress, contactABI, signer);

    const createTxn = await contract.create(newKeyboard);
    console.log('Create transaction started...', createTxn.hash);

    await createTxn.wait();
    console.log('Created keyboard!', createTxn.hash);

    await getKeyboards();
  }

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

  return (
    <div className="flex flex-col gap-y-8">
      <form className="flex flex-col gap-y-2">
        <div>
          <label
            htmlFor="keyboard-description"
            className="block text-sm font-medium text-gray-700"
          >
            Keyboard Description
          </label>
        </div>
        <input
          name="keyboard-type"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={newKeyboard}
          onChange={(e) => {
            setNewKeyboard(e.target.value);
          }}
        />
        <PrimaryButton type="submit" onClick={submitCreate}>
          Create Keyboard!
        </PrimaryButton>
      </form>

      <div>
        {keyboards.map((keyboard, i) => (
          <p key={i}>{keyboard}</p>
        ))}
      </div>
    </div>
  );
}
