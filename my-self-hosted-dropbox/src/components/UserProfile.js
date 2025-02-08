import React, { useEffect, useState } from 'react';
import { fetchUserAttributes } from '@aws-amplify/auth';
import styles from './UserProfile.module.css'; // Import the CSS module

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    name: 'Not available',
    email: 'Not available',
    phone_number: 'Not available',
    address: 'Not available',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const attributes = await fetchUserAttributes();
        console.log("User attributes:", attributes); // Debugging
        
        // Directly access attributes from the object
        setUserInfo({
          name: attributes.name || 'Not available',
          email: attributes.email || 'Not available',
          phone_number: attributes.phone_number || 'Not available',
          address: attributes.address || 'Not available'
        });
      } catch (error) {
        console.error("Failed to fetch user information:", error);
        setUserInfo({
          name: 'Error loading data',
          email: 'Error loading data',
          phone_number: 'Error loading data',
          address: 'Error loading data'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>User Profile</h2>
      {loading ? (
        <p className={styles.loadingText}>Loading user information...</p>
      ) : (
        <div className={styles.profileInfo}>          
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Phone:</strong> {userInfo.phone_number}</p>
          <p><strong>Address:</strong> {userInfo.address}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;