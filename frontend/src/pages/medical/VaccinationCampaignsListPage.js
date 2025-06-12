import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const VaccinationCampaignsListPage = () => {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Flu Vaccination 2025',
      vaccine: 'Influenza Vaccine',
      targetGrades: [9, 10, 11, 12],
      status: 'In Progress',
      startDate: '2025-05-01',
      endDate: '2025-06-30',
      totalStudents: 450,
      consentsReceived: 320,
      consentsApproved: 285,
      consentsDeclined: 35,
      vaccinationsCompleted: 150,
      createdDate: '2025-04-15'
    },
    {
      id: 2,
      name: 'HPV Vaccination - Grade 11',
      vaccine: 'HPV Vaccine (Gardasil 9)',
      targetGrades: [11],
      status: 'Consent Collection',
      startDate: '2025-07-01',
      endDate: '2025-08-31',
      totalStudents: 125,
      consentsReceived: 85,
      consentsApproved: 70,
      consentsDeclined: 15,
      vaccinationsCompleted: 0,
      createdDate: '2025-06-01'
    },
    {
      id: 3,
      name: 'COVID-19 Booster',
      vaccine: 'COVID-19 mRNA Vaccine',
      targetGrades: [9, 10, 11, 12],
      status: 'Completed',
      startDate: '2025-03-01',
      endDate: '2025-04-15',
      totalStudents: 450,
      consentsReceived: 450,
      consentsApproved: 420,
      consentsDeclined: 30,
      vaccinationsCompleted: 420,
      createdDate: '2025-02-15'
    }
  ]);

  const [showNewCampaignForm, setShowNewCampaignForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    vaccine: '',
    targetGrades: [],
    startDate: '',
    endDate: '',
    description: ''
  });

  const statusColors = {
    'Planning': 'bg-gray-100 text-gray-800',
    'Consent Collection': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  const handleNewCampaignSubmit = (e) => {
    e.preventDefault();
    const campaign = {
      ...newCampaign,
      id: Date.now(),
      status: 'Planning',
      totalStudents: 0,
      consentsReceived: 0,
      consentsApproved: 0,
      consentsDeclined: 0,
      vaccinationsCompleted: 0,
      createdDate: new Date().toISOString().slice(0, 10)
    };
    setCampaigns(prev => [campaign, ...prev]);
    setNewCampaign({
      name: '',
      vaccine: '',
      targetGrades: [],
      startDate: '',
      endDate: '',
      description: ''
    });
    setShowNewCampaignForm(false);
    alert('New vaccination campaign created successfully!');
  };

  const handleGradeSelection = (grade) => {
    setNewCampaign(prev => ({
      ...prev,
      targetGrades: prev.targetGrades.includes(grade) 
        ? prev.targetGrades.filter(g => g !== grade)
        : [...prev.targetGrades, grade]
    }));
  };

  const getProgressPercentage = (completed, total) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const sendConsentForms = (campaignId) => {
    // In real app, this would trigger API call
    alert(`Consent forms sent for campaign ID: ${campaignId}`);
  };

  const CampaignCard = ({ campaign }) => (
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{campaign.name}</h3>
          <p className="text-gray-600">{campaign.vaccine}</p>
          <p className="text-sm text-gray-500">
            Target Grades: {campaign.targetGrades.join(', ')} | 
            Period: {campaign.startDate} to {campaign.endDate}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[campaign.status]}`}>
          {campaign.status}
        </span>
      </div>

      {/* Progress Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{campaign.totalStudents}</p>
          <p className="text-xs text-gray-500">Total Students</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">{campaign.consentsReceived}</p>
          <p className="text-xs text-gray-500">Consents Received</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{campaign.consentsApproved}</p>
          <p className="text-xs text-gray-500">Approved</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{campaign.vaccinationsCompleted}</p>
          <p className="text-xs text-gray-500">Vaccinated</p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-2 mb-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Consent Collection</span>
            <span>{getProgressPercentage(campaign.consentsReceived, campaign.totalStudents)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{width: `${getProgressPercentage(campaign.consentsReceived, campaign.totalStudents)}%`}}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Vaccination Progress</span>
            <span>{getProgressPercentage(campaign.vaccinationsCompleted, campaign.consentsApproved)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{width: `${getProgressPercentage(campaign.vaccinationsCompleted, campaign.consentsApproved)}%`}}
            ></div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Link 
          to={`/medical/vaccination-campaigns/${campaign.id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          View Details
        </Link>
        {campaign.status === 'Planning' && (
          <button 
            onClick={() => sendConsentForms(campaign.id)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Send Consent Forms
          </button>
        )}
        {campaign.status === 'Consent Collection' && (
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
            Start Vaccinations
          </button>
        )}
        {campaign.status === 'In Progress' && (
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm">
            Record Vaccinations
          </button>
        )}
      </div>
    </div>
  );

  const NewCampaignForm = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleNewCampaignSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">New Vaccination Campaign</h2>
            <button
              type="button"
              onClick={() => setShowNewCampaignForm(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Campaign Name *</label>
              <input
                type="text"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign(prev => ({...prev, name: e.target.value}))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Flu Vaccination 2025"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Vaccine Type *</label>
              <input
                type="text"
                value={newCampaign.vaccine}
                onChange={(e) => setNewCampaign(prev => ({...prev, vaccine: e.target.value}))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Influenza Vaccine, HPV Vaccine"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Target Grades *</label>
              <div className="grid grid-cols-4 gap-2">
                {[9, 10, 11, 12].map(grade => (
                  <label key={grade} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newCampaign.targetGrades.includes(grade)}
                      onChange={() => handleGradeSelection(grade)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">Grade {grade}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Start Date *</label>
                <input
                  type="date"
                  value={newCampaign.startDate}
                  onChange={(e) => setNewCampaign(prev => ({...prev, startDate: e.target.value}))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">End Date *</label>
                <input
                  type="date"
                  value={newCampaign.endDate}
                  onChange={(e) => setNewCampaign(prev => ({...prev, endDate: e.target.value}))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={newCampaign.description}
                onChange={(e) => setNewCampaign(prev => ({...prev, description: e.target.value}))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Additional information about the vaccination campaign..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setShowNewCampaignForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Vaccination Campaigns</h1>
        <button
          onClick={() => setShowNewCampaignForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center"
        >
          <span className="mr-2">+</span> New Campaign
        </button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-blue-600 font-semibold">Total Campaigns</p>
          <p className="text-2xl font-bold text-blue-800">{campaigns.length}</p>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-yellow-600 font-semibold">In Progress</p>
          <p className="text-2xl font-bold text-yellow-800">
            {campaigns.filter(c => c.status === 'In Progress').length}
          </p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <p className="text-green-600 font-semibold">Completed</p>
          <p className="text-2xl font-bold text-green-800">
            {campaigns.filter(c => c.status === 'Completed').length}
          </p>
        </div>
        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
          <p className="text-purple-600 font-semibold">Total Vaccinated</p>
          <p className="text-2xl font-bold text-purple-800">
            {campaigns.reduce((total, c) => total + c.vaccinationsCompleted, 0)}
          </p>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-6">
        {campaigns.length > 0 ? (
          campaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))
        ) : (
          <div className="bg-white border rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg">No vaccination campaigns found.</p>
            <p className="text-gray-400 text-sm mt-2">Create your first campaign to get started.</p>
          </div>
        )}
      </div>

      {showNewCampaignForm && <NewCampaignForm />}
    </div>
  );
};

export default VaccinationCampaignsListPage;
