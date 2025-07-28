import React, { useState } from "react";
import styles from "./AcademySettings.module.css";
import {
  FaUser,
  FaBell,
  FaShieldAlt,
  FaDatabase,
  FaGlobe,
  FaSave,
  FaEdit,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const AcademySettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@academy.com",
    phone: "+1 (555) 123-4567",
    academyName: "Elite Sports Academy",
    address: "123 Sports Avenue, Athletic District, New York, NY 10001",
    position: "Academy Owner & Director",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    browserNotifications: true,
  });

  const [preferences, setPreferences] = useState({
    language: "English",
    timezone: "Eastern Time (ET)",
    currency: "USD ($)",
    dateFormat: "MM/DD/YYYY",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: "30",
  });

  const handleInputChange = (section, field, value) => {
    switch (section) {
      case "profile":
        setProfileData((prev) => ({ ...prev, [field]: value }));
        break;
      case "notifications":
        setNotificationSettings((prev) => ({ ...prev, [field]: value }));
        break;
      case "preferences":
        setPreferences((prev) => ({ ...prev, [field]: value }));
        break;
      case "security":
        setSecuritySettings((prev) => ({ ...prev, [field]: value }));
        break;
    }
  };

  const handleSave = () => {
    console.log("Settings saved");
    alert("Settings saved successfully!");
  };

  const tabs = [
    { id: "profile", label: "Profile Information", icon: FaUser },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "preferences", label: "Preferences", icon: FaGlobe },
    { id: "security", label: "Security Settings", icon: FaShieldAlt },
    { id: "data", label: "Privacy & Data", icon: FaDatabase },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.description}>
          Manage your academy profile, account settings and preferences.
        </p>
      </div>

      <div className={styles.settingsLayout}>
        {/* Sidebar Navigation */}
        <div className={styles.sidebar}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${
                  activeTab === tab.id ? styles.active : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent className={styles.tabIcon} />
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {activeTab === "profile" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <FaUser className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Profile Information</h2>
              </div>

              <div className={styles.profileSection}>
                <div className={styles.avatarSection}>
                  <img
                    src="https://api.dicebear.com/9.x/micah/svg?seed=Destiny"
                    alt="Profile"
                    className={styles.profileAvatar}
                  />
                  <button className={styles.changePhotoBtn}>
                    <FaEdit className={styles.btnIcon} />
                    Change Photo
                  </button>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>First Name</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) =>
                        handleInputChange(
                          "profile",
                          "firstName",
                          e.target.value
                        )
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Last Name</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) =>
                        handleInputChange("profile", "lastName", e.target.value)
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        handleInputChange("profile", "email", e.target.value)
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        handleInputChange("profile", "phone", e.target.value)
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Academy Name</label>
                    <input
                      type="text"
                      value={profileData.academyName}
                      onChange={(e) =>
                        handleInputChange(
                          "profile",
                          "academyName",
                          e.target.value
                        )
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Position/Title</label>
                    <input
                      type="text"
                      value={profileData.position}
                      onChange={(e) =>
                        handleInputChange("profile", "position", e.target.value)
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>Address</label>
                    <textarea
                      value={profileData.address}
                      onChange={(e) =>
                        handleInputChange("profile", "address", e.target.value)
                      }
                      className={styles.textarea}
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <FaBell className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Notifications</h2>
              </div>

              <div className={styles.notificationGroups}>
                <div className={styles.notificationGroup}>
                  <h3 className={styles.groupTitle}>Email Notifications</h3>
                  <p className={styles.groupDesc}>Receive updates via email</p>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) =>
                        handleInputChange(
                          "notifications",
                          "emailNotifications",
                          e.target.checked
                        )
                      }
                      className={styles.toggleInput}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.notificationGroup}>
                  <h3 className={styles.groupTitle}>SMS Notifications</h3>
                  <p className={styles.groupDesc}>Receive text messages</p>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) =>
                        handleInputChange(
                          "notifications",
                          "smsNotifications",
                          e.target.checked
                        )
                      }
                      className={styles.toggleInput}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.notificationGroup}>
                  <h3 className={styles.groupTitle}>Push Notifications</h3>
                  <p className={styles.groupDesc}>Browser notifications</p>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) =>
                        handleInputChange(
                          "notifications",
                          "pushNotifications",
                          e.target.checked
                        )
                      }
                      className={styles.toggleInput}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.notificationGroup}>
                  <h3 className={styles.groupTitle}>Browser Notifications</h3>
                  <p className={styles.groupDesc}>Browser notifications</p>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={notificationSettings.browserNotifications}
                      onChange={(e) =>
                        handleInputChange(
                          "notifications",
                          "browserNotifications",
                          e.target.checked
                        )
                      }
                      className={styles.toggleInput}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <FaGlobe className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Preferences</h2>
              </div>

              <div className={styles.preferencesGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) =>
                      handleInputChange(
                        "preferences",
                        "language",
                        e.target.value
                      )
                    }
                    className={styles.select}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Time Zone</label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) =>
                      handleInputChange(
                        "preferences",
                        "timezone",
                        e.target.value
                      )
                    }
                    className={styles.select}
                  >
                    <option value="Eastern Time (ET)">Eastern Time (ET)</option>
                    <option value="Central Time (CT)">Central Time (CT)</option>
                    <option value="Mountain Time (MT)">
                      Mountain Time (MT)
                    </option>
                    <option value="Pacific Time (PT)">Pacific Time (PT)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Currency</label>
                  <select
                    value={preferences.currency}
                    onChange={(e) =>
                      handleInputChange(
                        "preferences",
                        "currency",
                        e.target.value
                      )
                    }
                    className={styles.select}
                  >
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Date Format</label>
                  <select
                    value={preferences.dateFormat}
                    onChange={(e) =>
                      handleInputChange(
                        "preferences",
                        "dateFormat",
                        e.target.value
                      )
                    }
                    className={styles.select}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <FaShieldAlt className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Security Settings</h2>
              </div>

              <div className={styles.securityOptions}>
                <div className={styles.securityGroup}>
                  <h3 className={styles.groupTitle}>
                    Two-Factor Authentication
                  </h3>
                  <p className={styles.groupDesc}>
                    Add an extra layer of security
                  </p>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) =>
                        handleInputChange(
                          "security",
                          "twoFactorAuth",
                          e.target.checked
                        )
                      }
                      className={styles.toggleInput}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.securityGroup}>
                  <h3 className={styles.groupTitle}>Login Alerts</h3>
                  <p className={styles.groupDesc}>
                    Get notified of new login attempts
                  </p>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={securitySettings.loginAlerts}
                      onChange={(e) =>
                        handleInputChange(
                          "security",
                          "loginAlerts",
                          e.target.checked
                        )
                      }
                      className={styles.toggleInput}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.passwordSection}>
                  <h3 className={styles.groupTitle}>Change Password</h3>
                  <div className={styles.passwordForm}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Current Password</label>
                      <div className={styles.passwordInput}>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          className={styles.input}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={styles.passwordToggle}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className={styles.input}
                      />
                    </div>

                    <button className={styles.changePasswordBtn}>
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <FaDatabase className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Privacy & Data</h2>
              </div>

              <div className={styles.dataOptions}>
                <div className={styles.dataGroup}>
                  <h3 className={styles.groupTitle}>Data Export</h3>
                  <p className={styles.groupDesc}>
                    Download a copy of your academy data
                  </p>
                  <button className={styles.actionBtn}>Export Data</button>
                </div>

                <div className={styles.dataGroup}>
                  <h3 className={styles.groupTitle}>Data Backup</h3>
                  <p className={styles.groupDesc}>
                    Create a backup of your academy information
                  </p>
                  <button className={styles.actionBtn}>Create Backup</button>
                </div>

                <div className={styles.dataGroup}>
                  <h3 className={styles.groupTitle}>Account Deletion</h3>
                  <p className={styles.groupDesc}>
                    Permanently delete your account and all data
                  </p>
                  <button className={styles.dangerBtn}>Delete Account</button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className={styles.saveSection}>
            <button onClick={handleSave} className={styles.saveBtn}>
              <FaSave className={styles.saveIcon} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademySettings;
