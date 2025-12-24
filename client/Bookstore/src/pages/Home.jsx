import { Container } from 'react-bootstrap';
import HeroHeader from '../components/Common/Header';
import BookBrowser from '../components/Customer/BookBrowser';

const Home = () => {
  return (
    <>
      <HeroHeader />
      <Container>
        <BookBrowser />
      </Container>
    </>
  );
};

export default Home;

