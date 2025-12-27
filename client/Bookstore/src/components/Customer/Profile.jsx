import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, changePassword } from '../../services/authService';
import { validateEmail, validatePhone, validatePassword, validateRequired } from '../../utils/validators';
import { useNotification } from '../../context/NotificationContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    shippingAddress: user?.shipping_address || '',
  });

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        shippingAddress: user.shipping_address || '',
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    const firstNameValidation = validateRequired(profileData.firstName, 'First name');
    if (!firstNameValidation.isValid) {
      newErrors.firstName = firstNameValidation.message;
    }

    const lastNameValidation = validateRequired(profileData.lastName, 'Last name');
    if (!lastNameValidation.isValid) {
      newErrors.lastName = lastNameValidation.message;
    }

    if (!validateEmail(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (profileData.phone && !validatePhone(profileData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    const passwordValidation = validatePassword(passwordData.newPassword);
    if (!passwordValidation.isValid) {
      newErrors.newPassword = passwordValidation.message;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfile()) {
      return;
    }

    // Show confirmation modal
    setShowProfileModal(true);
  };

  const confirmProfileUpdate = async () => {
    setShowProfileModal(false);
    setSaving(true);

    try {
      const userData = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        shipping_address: profileData.shippingAddress,
      };

      const response = await updateProfile(userData);
      // Response structure: { success: true, data: { user: {...} } }
      const updatedUserData = response.data?.user || response.user || {};
      const updatedUser = { ...user, ...updatedUserData, ...userData };
      updateUser(updatedUser);
      showSuccess('Profile updated successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    // Show confirmation modal
    setShowPasswordModal(true);
  };

  const confirmPasswordChange = async () => {
    setShowPasswordModal(false);
    setChangingPassword(true);

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      showSuccess('Password changed successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">My Profile</h2>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Profile Information</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleProfileSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        isInvalid={!!errors.firstName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        isInvalid={!!errors.lastName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Shipping Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="shippingAddress"
                    value={profileData.shippingAddress}
                    onChange={handleProfileChange}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Change Password</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    isInvalid={!!passwordErrors.currentPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {passwordErrors.currentPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    isInvalid={!!passwordErrors.newPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {passwordErrors.newPassword}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    isInvalid={!!passwordErrors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {passwordErrors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={changingPassword}>
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Profile Update Confirmation Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Profile Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to update your profile information?</p>
          {(() => {
            const changes = [];
            if (profileData.firstName !== (user?.first_name || '')) {
              changes.push({ field: 'First Name', old: user?.first_name || 'N/A', new: profileData.firstName });
            }
            if (profileData.lastName !== (user?.last_name || '')) {
              changes.push({ field: 'Last Name', old: user?.last_name || 'N/A', new: profileData.lastName });
            }
            if (profileData.email !== (user?.email || '')) {
              changes.push({ field: 'Email', old: user?.email || 'N/A', new: profileData.email });
            }
            if (profileData.phone !== (user?.phone || '')) {
              changes.push({ field: 'Phone', old: user?.phone || 'N/A', new: profileData.phone || 'N/A' });
            }
            if (profileData.shippingAddress !== (user?.shipping_address || '')) {
              changes.push({ field: 'Shipping Address', old: user?.shipping_address || 'N/A', new: profileData.shippingAddress || 'N/A' });
            }
            
            return changes.length > 0 ? (
              <div className="mt-3">
                <strong>Changes:</strong>
                <ul className="mt-2">
                  {changes.map((change, index) => (
                    <li key={index}>
                      <strong>{change.field}:</strong> {change.old} → {change.new}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Alert variant="info" className="mt-3">
                No changes detected. All fields match your current profile.
              </Alert>
            );
          })()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmProfileUpdate} disabled={saving}>
            {saving ? 'Saving...' : 'Confirm Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Password Change Confirmation Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Password Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to change your password?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmPasswordChange} disabled={changingPassword}>
            {changingPassword ? 'Changing...' : 'Confirm Change'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;

