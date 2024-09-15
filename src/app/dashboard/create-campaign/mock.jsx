import React, { useState, useMemo } from 'react';
import MarkdownIt from 'markdown-it';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import CampaignDetails from '../components/campaignProps/CampaignDetails';  
import CampaignTypeAndActions from '../components/campaignProps/CampaignTypeAndActions';
import RewardsAndWinners from '../components/campaignProps/RewardsAndWinners';
import CampaignPreview from '../components/campaignProps/CampaignPreview';

const mdParser = new MarkdownIt();

const CreateCampaign = () => {
  const [step, setStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: '',
    type: 'Onchain',
    description: '# New Campaign\n\nDescribe your campaign here...',
    selectedActions: [],
    selectedRewards: [],
    numWinners: 1,
    actionData: {},
    startDate: new Date().toISOString().split('T')[0], // Set default to today
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], // Set default to 30 days from today
  });
  const [showDescriptionPreview, setShowDescriptionPreview] = useState(false);

  const updateCampaignData = (field, value) => {
    setCampaignData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAction = (action) => {
    setCampaignData(prev => ({
      ...prev,
      selectedActions: prev.selectedActions.includes(action)
        ? prev.selectedActions.filter(a => a !== action)
        : [...prev.selectedActions, action]
    }));
  };

  const toggleReward = (reward) => {
    setCampaignData(prev => ({
      ...prev,
      selectedRewards: prev.selectedRewards.includes(reward)
        ? prev.selectedRewards.filter(r => r !== reward)
        : [...prev.selectedRewards, reward]
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const setNumWinners = (value) => {
    setCampaignData(prev => ({ ...prev, numWinners: value }));
  };

  const updateActionData = (actionName, data) => {
    setCampaignData(prev => ({
      ...prev,
      actionData: {
        ...prev.actionData,
        [actionName]: data
      }
    }));
  };

  const renderedDescription = useMemo(() => 
    mdParser.render(campaignData.description),
    [campaignData.description]
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <CampaignDetails 
            campaignName={campaignData.name}
            setCampaignName={(name) => updateCampaignData('name', name)}
            description={campaignData.description}
            setDescription={(description) => updateCampaignData('description', description)}
            showDescriptionPreview={showDescriptionPreview}
            setShowDescriptionPreview={setShowDescriptionPreview}
            renderedDescription={renderedDescription}
            mdParser={mdParser}
          />
        );
      case 2:
        return (
          <CampaignTypeAndActions 
            campaignType={campaignData.type}
            setCampaignType={(type) => updateCampaignData('type', type)}
            selectedActions={campaignData.selectedActions}
            toggleAction={toggleAction}
            updateActionData={updateActionData} // Add this line
            actionData={campaignData.actionData} // Add this line
          />
        );
      case 3:
        return (
          <RewardsAndWinners 
            selectedRewards={campaignData.selectedRewards}
            toggleReward={toggleReward}
            numWinners={campaignData.numWinners}
            setNumWinners={setNumWinners}
          />
        );
      case 4:
        return (
          <CampaignPreview 
            campaignData={campaignData}
            renderedDescription={renderedDescription}
          />
        );
      default:
        return null;
    }
  };

  const renderProgressBar = () => {
    const steps = ['Details', 'Type & Actions', 'Rewards', 'Preview'];
    return (
      <div className="mb-8 px-2">
        <div className="flex justify-between relative">
          {steps.map((stepName, index) => (
            <div key={stepName} className="flex flex-col items-center w-1/4">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mb-1 z-10 ${
                step > index + 1 ? 'bg-indigo-600 text-white' : 
                step === index + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {step > index + 1 ? <Check size={12} /> : <span className="text-[10px]">{index + 1}</span>}
              </div>
              <div className={`text-[10px] text-center ${step >= index + 1 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                {stepName}
              </div>
            </div>
          ))}
          <div className="absolute top-[9px] left-0 w-full h-0.5 bg-gray-300">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300 ease-in-out"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-4 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-indigo-900">Create Your Campaign</h2>
        {renderProgressBar()}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-8">
            {renderStepContent()}
          </div>
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button 
                type="button" 
                onClick={prevStep}
                className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                <ChevronLeft size={20} className="mr-2" />
                Previous
              </button>
            )}
            {step < 4 && (
              <button 
                type="button" 
                onClick={nextStep}
                className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 ml-auto"
              >
                Next
                <ChevronRight size={20} className="ml-2" />
              </button>
            )}
            {step === 4 && (
              <button 
                type="submit" 
                className="flex items-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 ml-auto"
              >
                Create Campaign
                <Check size={20} className="ml-2" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;