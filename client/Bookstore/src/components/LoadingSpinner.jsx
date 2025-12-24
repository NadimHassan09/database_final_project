import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  return (
    <div className={`d-flex justify-content-center align-items-center p-4 ${className}`}>
      <Spinner animation="border" role="status" size={size}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;

