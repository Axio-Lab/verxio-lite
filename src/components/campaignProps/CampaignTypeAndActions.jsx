import React, { useState } from 'react';
import Modal from 'react-modal';
import { Repeat, Droplet, Coins, Flame, ShoppingCart, Share, MessageCircle, UserPlus, ClipboardList, Minimize, Maximize } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

// Import your existing action components
import SwapTokenAction from '../campaignActions/SwapTokenAction';
// import ProvideLiquidityAction from '../campaignActions/ProvideLiquidityAction';
import StakeTokenAction from '../campaignActions/StakeTokenAction';
import BurnTokenAction from '../campaignActions/BurnTokenAction';
import SellDigitalProductAction from '../campaignActions/SellDigitalProductAction';
import CompressTokenAction from '../campaignActions/CompressTokenAction';
import DecompressTokenAction from '../campaignActions/DecompressTokenAction';

const campaignTypes = [
  { name: 'Onchain'},
  { name: 'Offchain' }
];

const actions = {
  Onchain: [
    { name: 'Burn token', icon: <Flame className="text-red-500" />, component: BurnTokenAction },
    { name: 'Sell digital product', icon: <ShoppingCart className="text-purple-500" />, component: SellDigitalProductAction },
    { name: 'Compress token', icon: <Minimize className="text-indigo-500" />, component: CompressTokenAction },
    { name: 'Decompress token', icon: <Maximize className="text-pink-500" />, component: DecompressTokenAction },
    { name: 'Swap token', icon: <Repeat className="text-blue-500" />, component: SwapTokenAction },
    // { name: 'Provide liquidity', icon: <Droplet className="text-green-500" />, component: ProvideLiquidityAction },
    // { name: 'Stake token', icon: <Coins className="text-yellow-500" />, component: StakeTokenAction }
    { name: 'Submit Url', icon: <Share className="text-yellow-400" />},
  ],
  Offchain: [
    { name: 'Share on Twitter', icon: <Share className="text-blue-400" />},
    { name: 'Join Discord', icon: <MessageCircle className="text-indigo-500" /> },
    { name: 'Refer a friend', icon: <UserPlus className="text-green-500" /> },
    { name: 'Complete a survey', icon: <ClipboardList className="text-orange-500" /> }
  ]
};

const CampaignTypeAndActions = ({ 
  campaignType, 
  setCampaignType, 
  selectedActions, 
  toggleAction, 
  updateActionData, 
  actionData 
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);

  const handleActionToggle = (action) => {
    if (selectedActions.includes(action.name)) {
      toggleAction(action.name);
      toast.success(`${action.name} deselected`);
    } 
    else if (action.name === 'Swap token') {
      toast.error('Swap token action is not yet live!');
      setCurrentAction(null)
    }
    else if (action.name === 'Stake token') {
      toast.error('Stake tokens action is yet live!');
      setCurrentAction(null)
    }
    else if (selectedActions.length > 0) {
      toast.error('An action is already selected. Please deselect it first.');
    } else {
      toggleAction(action.name);
      toast.success(`${action.name} selected`);
      if (campaignType === 'Onchain') {
        openModal(action);
      }
    }
  };

  const openModal = (action) => {
    setCurrentAction(action);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentAction(null);
  };

  const handleSave = (data) => {
    console.log('Saving action data:', data);
    updateActionData(currentAction.name, data); // Update this line
    closeModal();
    toast.success('Action data saved successfully!');
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Campaign Type</h3>
        <div className="grid grid-cols-2 gap-4">
          {campaignTypes.map(type => (
            <button
              key={type.name}
              type="button"
              // onClick={() => {
              //   setCampaignType(type.name);
              //   selectedActions.forEach(action => toggleAction(action));
              // }}
              className={`p-4 text-center rounded-lg flex items-center justify-center ${
                campaignType === type.name ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Campaign Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          {actions[campaignType].map((action) => (
            <div 
              key={action.name}
              onClick={() => handleActionToggle(action)}
              className={`flex items-center p-4 rounded-lg cursor-pointer ${
                selectedActions.includes(action.name) ? 'bg-green-200' : 'bg-gray-200'
              }`}
            >
              {action.icon}
              <span className="ml-2">{action.name}</span>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Action Modal"
        className="Modal"
        overlayClassName="Overlay"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            border: 'none',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
          },
        }}
      >
        {currentAction && (
          <div className="p-4">
            {/* <h2 className="text-2xl font-bold mb-4">{currentAction.name}</h2> */}
            {currentAction.component && React.createElement(currentAction.component, { 
              onSave: handleSave,
              initialData: actionData[currentAction.name] // Add this line
            })}
            <button 
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default CampaignTypeAndActions;