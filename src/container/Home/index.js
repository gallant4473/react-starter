import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const Home = (props) => {
  const [active, setActive] = useState(false);
  return (
    <div className="hello">
      its my home
      <button type="button" onClick={() => props.history.push('/about')}>go to about</button>
      <button type="button" onClick={() => props.history.push('/contact')}>go to contact</button>
      <button type="button" onClick={() => setActive(!active)}>{active ? 'Active' : 'In Active'}</button>
    </div>
  );
};

Home.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};
Home.defaultProps = {
  history: {
    push: () => '',
  },
};

export default withRouter(Home);
