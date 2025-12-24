import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container className="my-5 text-center">
      <h1 className="display-1">404</h1>
      <h2>Page Not Found</h2>
      <p className="text-muted mb-4">
        The page you are looking for does not exist.
      </p>
      <Button variant="primary" onClick={() => navigate('/')}>
        Go Home
      </Button>
    </Container>
  );
};

export default NotFound;

