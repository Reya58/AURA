import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'; // For accessing email

const ProfileSection = () => {
  const { email } = useAuth(); // Get email from global context
  const [profileData, setProfileData] = useState({
    name: '',
    gender: '',
    age: '',
    photo: '', // Default placeholder
  });
  const [originalData, setOriginalData] = useState({}); // To track original data for change detection
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [editingField, setEditingField] = useState(null); // Track which field is being edited (e.g., 'name', 'gender', etc.)
  const [hasChanges, setHasChanges] = useState(false); // Track if any changes have been made

  // Fetch user data from API
  useEffect(() => {
    if (!email) {
      setError('Email not found. Please log in again.');
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://aura-git-main-shreyas-projects-f842d25f.vercel.app/api/user/diseases?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // If using token
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        console.log('Fetched profile data:', data.photo);

        const fetchedData = {
          name: data.name || '',
          gender: data.gender || '',
          age: data.age || '',
          photo: data.photo || 'https://www.pngmart.com/files/23/Profile-PNG-Photo.png', // Fallback
        };
        setProfileData(fetchedData);
        setOriginalData(fetchedData); // Store original data for comparison
      } catch (err) {
        setError('Error loading profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [email]); // Added email as dependency

  // Check for changes whenever profileData updates
  useEffect(() => {
    const isChanged = JSON.stringify(profileData) !== JSON.stringify(originalData);
    setHasChanges(isChanged);
  }, [profileData, originalData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileData({ ...profileData, photo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (field) => {
    setEditingField(field); // Enable editing for the specific field
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submit
    setSaveLoading(true);
    setSaveMessage('');
    try {
      const response = await fetch('https://aura-git-main-shreyas-projects-f842d25f.vercel.app/api/user/update', { // Replace with your update endpoint
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          gender: profileData.gender,
          age: profileData.age,
          // Add photo if uploading to server
        }),
      });
      if (!response.ok) throw new Error('Failed to save changes');
      setSaveMessage('Profile updated successfully!');
      setOriginalData(profileData); // Update original data after save
      setHasChanges(false); // Reset changes
      setEditingField(null); // Exit edit mode
    } catch (err) {
      setSaveMessage('Error saving changes. Please try again.');
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };
  const Changes = async() => {
     try{
        const response = await fetch('https://aura-git-main-shreyas-projects-f842d25f.vercel.app/api/user/update', { // Replace with your update endpoint
        method: 'PUT',

        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({email,name:profileData.name,age:profileData.age,gender:profileData.gender, photo:profileData.photo}),
      });
     
      if (!response.ok) throw new Error('Failed to save changes');
      setSaveMessage('Profile updated successfully!');
      setOriginalData(profileData);
     }
      catch(err){
        console.error(err);
      }

  }

if (loading) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading your profile</p>

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          text-align: center;
          color: #555;
          font-size: 18px;
        }

        .spinner {
          width: 45px;
          height: 45px;
          border: 4px solid #d0d7e2;
          border-top-color: #007bff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

  

 if (error) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p>{error}</p>

      <style jsx>{`
        .error-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 60vh;
          text-align: center;
          color: #d9534f;
          font-size: 18px;
          padding: 0 20px;
        }

        .error-icon {
          font-size: 45px;
          margin-bottom: 10px;
          animation: pulse 1.5s infinite ease-in-out;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

    console.log('Rendering profile with data:', profileData.photo);
  return (
    <div className="profile-content">
      <h3>Your Profile</h3>
      <form onSubmit={handleSave}>
        <div className="profile-card">
          <div className="profile-photo-section">
            <img src="https://www.pngmart.com/files/23/Profile-PNG-Photo.png" alt="Profile" className="profile-photo" />
            
          </div>
          <div className="profile-fields">
            <div className="field-group">
              <label>Name</label>
              <div className="input-container">
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  readOnly={editingField !== 'name'} // Editable only when editing this field
                  className={editingField === 'name' ? '' : 'readonly'}
                />
                <span className="edit-icon" onClick={() => handleEditClick('name')}>✏️</span> {/* Edit icon inside the box */}
              </div>
            </div>
            <div className="field-group">
              <label>Gender</label>
              <div className="input-container">
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                  disabled={editingField !== 'gender'} // Editable only when editing this field
                  className={editingField === 'gender' ? '' : 'readonly'}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <span className="edit-icon" onClick={() => handleEditClick('gender')}>✏️</span> {/* Edit icon inside the box */}
              </div>
            </div>
            <div className="field-group">
              <label>Age</label>
              <div className="input-container">
                <input
                  type="number"
                  name="age"
                  value={profileData.age}
                  onChange={handleInputChange}
                  readOnly={editingField !== 'age'} // Editable only when editing this field
                  className={editingField === 'age' ? '' : 'readonly'}
                />
                <span className="edit-icon" onClick={() => handleEditClick('age')}>✏️</span> {/* Edit icon inside the box */}
              </div>
            </div>
            <div className="field-group">
              <label>Email</label>
              <div className="input-container">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  readOnly={editingField !== 'email'} // Editable only when editing this field (though email might not be updatable)
                  className={editingField === 'email' ? '' : 'readonly'}
                />
                <span className="edit-icon" onClick={() => handleEditClick('email')}>✏️</span> {/* Edit icon inside the box */}
              </div>
            </div>
            {hasChanges && ( // Show save button only if there are changes
              <button onClick={Changes} type="submit" className="save-btn" disabled={saveLoading}>
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
            {saveMessage && <p className={`save-message ${saveMessage.includes('Error') ? 'error' : 'success'}`}>{saveMessage}</p>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;