import React, { useState } from 'react'

export default function ContractPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    phoneNumber: '',
    officeSize: '',
    startDate: '',
    duration: '',
    additionalRequests: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Here you would typically send the form data to your backend
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Office Rental Contract</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Request a Contract</h2>
          <p className="text-gray-600 mb-4">Fill out this form to start the contracting process</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block font-medium">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full border rounded-md p-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block font-medium">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border rounded-md p-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="company" className="block font-medium">Company Name</label>
              <input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                className="w-full border rounded-md p-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="block font-medium">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full border rounded-md p-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="officeSize" className="block font-medium">Desired Office Size</label>
              <select
                name="officeSize"
                onChange={(e) => handleSelectChange('officeSize', e.target.value)}
                className="w-full border rounded-md p-2"
                required
              >
                <option value="">Select office size</option>
                <option value="small">Small (1-5 people)</option>
                <option value="medium">Medium (6-15 people)</option>
                <option value="large">Large (16-30 people)</option>
                <option value="enterprise">Enterprise (31+ people)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="startDate" className="block font-medium">Desired Start Date</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full border rounded-md p-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="duration" className="block font-medium">Contract Duration</label>
              <select
                name="duration"
                onChange={(e) => handleSelectChange('duration', e.target.value)}
                className="w-full border rounded-md p-2"
                required
              >
                <option value="">Select duration</option>
                <option value="3months">3 months</option>
                <option value="6months">6 months</option>
                <option value="1year">1 year</option>
                <option value="2years">2 years</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="additionalRequests" className="block font-medium">Additional Requests</label>
              <textarea
                id="additionalRequests"
                name="additionalRequests"
                value={formData.additionalRequests}
                onChange={handleInputChange}
                placeholder="Any specific requirements or questions?"
                className="w-full border rounded-md p-2"
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">
              Submit Contract Request
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Contracting Process</h2>
            <p className="text-gray-600 mb-4">What to expect when requesting a contract</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Submit your contract request form</li>
              <li>Our team reviews your request (1-2 business days)</li>
              <li>We send you a draft contract for review</li>
              <li>Negotiate and finalize terms</li>
              <li>Sign the contract and secure your office space</li>
            </ol>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
            <p className="text-gray-600 mb-4">If you have any questions about the contracting process, please don't hesitate to contact our support team.</p>
            <button className="w-full bg-gray-300 text-gray-700 p-2 rounded-md">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
