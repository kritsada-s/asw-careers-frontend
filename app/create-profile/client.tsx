"use client";

function Client() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <form className="space-y-8">
        {/* Basic Information Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400">Profile Image</span>
                </div>
                <input 
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profile-image"
                />
                <label 
                  htmlFor="profile-image"
                  className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Upload Photo
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Work Experience (Years)</label>
                <input 
                  type="number" 
                  min="0"
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1">Expected Salary</label>
                <input 
                  type="number"
                  className="w-full border rounded p-2" 
                />
              </div>
              <div>
                <label className="block mb-1">CV/Resume</label>
                <input 
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Personal Information Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">First Name</label>
              <input type="text" className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block mb-1">Last Name</label>
              <input type="text" className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block mb-1">Nickname</label>
              <input type="text" className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block mb-1">Date of Birth</label>
              <input type="date" className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block mb-1">Phone Number</label>
              <input type="tel" className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input type="email" className="w-full border rounded p-2" />
            </div>
          </div>
        </section>

        {/* Address Information Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Address Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Address Details</label>
              <textarea className="w-full border rounded p-2" rows={3}></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1">Province</label>
                <select className="w-full border rounded p-2">
                  <option>Select Province</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">District</label>
                <select className="w-full border rounded p-2">
                  <option>Select District</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Sub-district</label>
                <select className="w-full border rounded p-2">
                  <option>Select Sub-district</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Other Information Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Other Information</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Education</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Degree Level</label>
                    <select className="w-full border rounded p-2">
                      <option>Select Level</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Major</label>
                    <input type="text" className="w-full border rounded p-2" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Language Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Language</label>
                  <select className="w-full border rounded p-2">
                    <option>Select Language</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Proficiency Level</label>
                  <select className="w-full border rounded p-2">
                    <option>Select Level</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end space-x-4">
          <button 
            type="button"
            className="px-6 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Client;